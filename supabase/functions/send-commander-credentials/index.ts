
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

    // For demo purposes, we'll log the credentials (in production, use a proper email service)
    console.log(`Service Number: ${serviceNumber}, Password: ${password}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES  
    // - Resend
    
    // Example with a hypothetical email service:
    /*
    const emailResponse = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('EMAIL_SERVICE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Defense Headquarters - Your Login Credentials',
        html: `
          <h2>Welcome to Defense Headquarters Portal</h2>
          <p>Hello ${rank} ${fullName},</p>
          <p>Your account has been successfully created for the Defense Headquarters Crime Reporting Portal.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Service Number:</strong> ${serviceNumber}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p><strong>Military Branch:</strong> ${category}</p>
            <p><strong>Rank:</strong> ${rank}</p>
            ${unit ? `<p><strong>Unit:</strong> ${unit}</p>` : ''}
          </div>
          
          <p>You can log in using either your email address or service number along with your password.</p>
          <p>Please keep these credentials secure and do not share them with anyone.</p>
          <p>For security reasons, we recommend changing your password after your first login.</p>
          
          <br>
          <p>Best regards,<br>Defense Headquarters IT Team</p>
        `
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send credentials email');
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Credentials sent successfully'
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
