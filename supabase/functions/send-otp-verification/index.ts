
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
    const { email, fullName, otpCode } = await req.json();

    if (!email || !fullName || !otpCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For demo purposes, we'll log the OTP (in production, use a proper email service)
    console.log(`Sending OTP ${otpCode} to ${email} for ${fullName}`);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would integrate with an email service like:
    // - Supabase Auth (for magic links)
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
        subject: 'Defense Headquarters - Email Verification',
        html: `
          <h2>Email Verification Required</h2>
          <p>Hello ${fullName},</p>
          <p>Please use the following verification code to complete your registration:</p>
          <h1 style="color: #2563eb; font-size: 2em; letter-spacing: 0.2em;">${otpCode}</h1>
          <p>This code is valid for 10 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Defense Headquarters IT Team</p>
        `
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send verification email');
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Verification code sent successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-otp-verification function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
