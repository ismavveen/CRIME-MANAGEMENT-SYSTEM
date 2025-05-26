
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendCredentialsRequest {
  email: string;
  fullName: string;
  password: string;
  rank: string;
  unit: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, password, rank, unit }: SendCredentialsRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "DHQ Portal <noreply@dhq.gov.ng>",
      to: [email],
      subject: "Your DHQ Commander Portal Access Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Defense Headquarters</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Commander Portal Access</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Welcome, ${rank} ${fullName}</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #334155;">
              Your commander account has been successfully created for the DHQ Intelligence Portal. 
              Below are your login credentials:
            </p>
            
            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e3a8a; margin-top: 0;">Login Credentials</h3>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
              <p><strong>Unit:</strong> ${unit}</p>
            </div>
            
            <div style="background: #fef3cd; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">Security Notice</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                For security reasons, please change your password immediately after your first login. 
                Keep your credentials confidential and do not share them with unauthorized personnel.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SITE_URL") || "https://dhq-portal.lovable.app"}/commander-portal" 
                 style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Access Commander Portal
              </a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 30px;">
              This is an automated message from the Defense Headquarters Intelligence System.<br>
              For technical support, contact DHQ IT Division.
            </p>
          </div>
          
          <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">CLASSIFIED - FOR AUTHORIZED PERSONNEL ONLY</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Defense Headquarters, Nigeria</p>
          </div>
        </div>
      `,
    });

    console.log("Credentials email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending credentials email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
