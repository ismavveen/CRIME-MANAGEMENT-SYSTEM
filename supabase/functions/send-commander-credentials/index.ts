import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { encode as b64encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { GoogleAuth, JWTInput } from "https://esm.sh/google-auth-library@9.0.0";

// --- CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse form
    const { email, fullName, serviceNumber, rank, unit, category } = await req.json();

    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Build password setup/reset link (1-hour expiration)
    const resetToken = crypto.randomUUID();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const resetLink = `${Deno.env.get("SITE_URL") || "http://localhost:5173"}/commander-password-setup?email=${encodeURIComponent(email)}&token=${resetToken}&expires=${expirationTime.getTime()}`;

    // --- Compose Email HTML: NO password shown, just congratulatory message
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Defense Headquarters - Unit Commander Account Setup</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background: #f5f7fa; line-height: 1.6; color: #222; }
          .container { background: #fff; max-width: 600px; margin: 24px auto; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px 0 rgba(0, 43, 92, .1); }
          .header { background: #002b5c; color: #fff; padding: 30px 20px 16px 20px; text-align: center; }
          .header img { max-width: 65px; margin-bottom: 6px; }
          .header h1 { margin: 0; font-size: 1.5rem; font-weight: bold; letter-spacing: 1px; }
          .header h2 { margin: 0; font-size: 1rem; font-weight: 400; opacity: 0.92; }
          .branding-message { margin: 16px 0 8px 0; color: #e0eaff; font-weight: 500; }
          .content { padding: 28px 24px 28px 24px; }
          .important { background: #eaf3ff; border-left: 5px solid #002b5c; padding: 14px 16px; margin: 16px 0; border-radius: 3px; }
          .credentials { margin: 16px 0; background: #fbfcfe; border: 1px solid #ebebeb; padding: 13px 18px; border-radius: 7px; }
          .reset-link-box { background: #f5f5fc; border-left: 5px solid #0f72e5; padding: 22px 20px; margin: 20px 0 30px 0; border-radius: 6px; }
          .reset-link-box a { display: block; background: #002b5c; color: #fff !important; text-decoration: none; font-size: 1.13rem; font-weight: 600; margin: 18px 0 13px 0; padding: 13px 20px; border-radius: 6px; letter-spacing: 0.5px;}
          .reset-link-box .expires { font-size: 0.97rem; color: #d64f31; margin-top: 6px;}
          .warning, .security-reminders { font-size: 0.99rem; color: #9a5001; background: #fff3cd; border-left: 5px solid #ffbb33; margin: 16px 0; padding: 11px 14px; border-radius: 3px; }
          .footer { background: #f8fafd; text-align: center; padding: 22px 14px; font-size: 13px; color: #828282; margin-top: 20px; border-top: 1px solid #e3e3e3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://ihcrdzkmjbpfsgipphxa.supabase.co/storage/v1/object/public/protected/lovable-uploads/ba3282a6-18f0-407f-baa2-bbdab0014f65.png" alt="Defense HQ Logo" />
            <h1>DEFENSE HEADQUARTERS</h1>
            <h2>Crime Reporting & Intelligence Portal</h2>
            <div class="branding-message">🇳🇬 Welcome to the United Command of National Security</div>
          </div>
          <div class="content">
            <div class="important">
              <strong>Congratulations ${rank} ${fullName}!</strong><br/>
              <span>
                Your Commander account for <b>${unit ? `${unit}, ` : ""}${category}</b> has been successfully created.<br/>
                Please activate your account by setting your secure password below.
              </span>
            </div>
            <!-- Password Setup Link (NO password is sent) -->
            <div class="reset-link-box">
              <span style="font-size:1.07rem"><b>🔒 Securely Set Your Password</b></span><br/>
              To activate your account and access the portal, please click the setup link below:<br/>
              <a href="${resetLink}">Set Up Password (Expires in 1 Hour)</a>
              <span class="expires">This link will expire at: <b>${expirationTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: true })}, ${expirationTime.toLocaleDateString()}</b></span>
            </div>
            <div class="security-reminders">
              - Set a strong password and do NOT share it.<br/>
              - This link is for you only and expires in 1 hour.<br/>
              - If expired, request a new setup link from DHQ IT Support.
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Defense Headquarters &bullet; Federal Republic of Nigeria<br>
              This is an AUTOMATED security notification.<br>
              <b>DEFENSE INTELLIGENCE OFFICE</b> &bullet; Do not reply directly to this email.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // --- Load and parse service account credentials from Supabase Secrets
    const credsRaw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
    if (!credsRaw) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");
    }
    const creds: JWTInput = JSON.parse(credsRaw);

    // Authenticate and get Gmail API access token
    const googleAuth = new GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
    });

    const client = await googleAuth.getClient();
    const accessToken = await client.getAccessToken();

    // --- Build RFC822 Email with HTML body
    const message =
      `From: "Defense HQ" <${creds.client_email}>\r\n` +
      `To: ${email}\r\n` +
      'Subject: URGENT: Your Unit Commander Portal Credentials (Action Required)\r\n' +
      "MIME-Version: 1.0\r\n" +
      "Content-Type: text/html; charset=UTF-8\r\n" +
      "\r\n" +
      emailHTML;

    // Gmail API expects RFC822 message, base64url (not standard base64).
    const raw = b64encode(message);

    // --- Send email via Gmail API
    const gmailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw }),
      },
    );

    if (!gmailRes.ok) {
      const errMsg = await gmailRes.text();
      console.error("Gmail API error", gmailRes.status, errMsg);
      throw new Error(`Failed to send branded DHQ email: ${gmailRes.status} ${errMsg}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account creation email sent with secure password setup link.",
        resetLink,
        expiresAt: expirationTime.toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-commander-credentials function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
