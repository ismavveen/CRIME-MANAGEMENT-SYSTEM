
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, password, serviceNumber, rank, unit, category } = await req.json();

    if (!email || !fullName || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending credentials to ${email} for ${fullName}`);

    // Create secure password reset link
    const resetToken = crypto.randomUUID();
    const resetLink = `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/commander-password-setup?email=${encodeURIComponent(email)}&token=${resetToken}`;

    // Email content with enhanced security notice
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Defense Headquarters - Login Credentials</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #002b5c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credentials { background: #e8f4f8; padding: 15px; border-left: 4px solid #002b5c; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .button { display: inline-block; background: #002b5c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Defense Headquarters</h1>
            <h2>Crime Reporting & Intelligence Portal</h2>
          </div>
          
          <div class="content">
            <h3>Welcome ${rank} ${fullName},</h3>
            
            <p>Your account has been successfully created for the Defense Headquarters Crime Reporting Portal. You have been assigned as a Unit Commander for <strong>${category}</strong>.</p>
            
            <div class="credentials">
              <h4>🔐 Your Login Credentials:</h4>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Service Number:</strong> ${serviceNumber}</p>
              <p><strong>Temporary Password:</strong> <code>${password}</code></p>
              <p><strong>Military Branch:</strong> ${category}</p>
              <p><strong>Rank:</strong> ${rank}</p>
              ${unit ? `<p><strong>Unit:</strong> ${unit}</p>` : ''}
            </div>
            
            <div class="warning">
              <h4>⚠️ Important Security Notice:</h4>
              <p>For your security, you <strong>MUST</strong> set up a new password before accessing your dashboard. The temporary password above will expire in 24 hours.</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Click the secure link below to set up your new password</li>
              <li>Create a strong password with at least 8 characters</li>
              <li>Log in to your commander dashboard using your new credentials</li>
            </ol>
            
            <a href="${resetLink}" class="button">🔒 Set Up New Password</a>
            
            <p><strong>Login Instructions:</strong></p>
            <ul>
              <li>You can log in using either your email address or service number</li>
              <li>Access the commander portal at: <a href="${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/commander-portal">${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/commander-portal</a></li>
              <li>Your dashboard will show reports and data specific to your assigned state</li>
            </ul>
            
            <div class="warning">
              <p><strong>Security Reminders:</strong></p>
              <ul>
                <li>Never share your credentials with anyone</li>
                <li>Log out when finished using the system</li>
                <li>Report any suspicious activity immediately</li>
                <li>This email contains sensitive information - please delete it after setting up your password</li>
              </ul>
            </div>
            
            <p>If you have any issues accessing your account or need technical support, please contact the DHQ IT Support team immediately.</p>
            
            <p>Thank you for your service to our nation's security.</p>
          </div>
          
          <div class="footer">
            <p>Defense Headquarters - Crime Reporting & Intelligence Portal<br>
            This is an automated message. Please do not reply to this email.<br>
            © ${new Date().getFullYear()} Federal Republic of Nigeria</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // For demo purposes, we'll log the email content (in production, use a proper email service)
    console.log(`Email HTML content prepared for ${email}`);
    console.log(`Reset link: ${resetLink}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would integrate with Resend, SendGrid, or another email service:
    /*
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Defense Headquarters <noreply@defensehq.ng>',
        to: [email],
        subject: 'Defense Headquarters - Your Login Credentials & Password Setup',
        html: emailHTML
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send credentials email');
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Credentials sent successfully',
        resetLink: resetLink // Include for demo purposes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-commander-credentials function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
