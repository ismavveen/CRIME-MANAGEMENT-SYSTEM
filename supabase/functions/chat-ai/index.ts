
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userType, context, conversationHistory } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = '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';

    console.log(`Processing ${userType} query: ${message.substring(0, 100)}...`);

    // Create system prompt based on user type
    let systemPrompt = '';
    if (userType === 'admin') {
      systemPrompt = `You are an AI assistant for the Defense Headquarters Crime Reporting & Intelligence Portal admin dashboard. 
      You help administrators analyze crime reports, provide insights, and assist with decision-making. 
      You have access to report data, analysis results, and can provide summaries, patterns, and recommendations.
      Always be professional, concise, and security-conscious in your responses.`;
    } else {
      systemPrompt = `You are an AI assistant for the Defense Headquarters Crime Reporting Portal. 
      You help citizens report crimes and provide guidance on the reporting process. 
      Be supportive, clear, and helpful while maintaining the seriousness of crime reporting.
      Guide users through the process and provide reassurance about anonymity and safety.`;
    }

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: context ? `Context: ${context}\n\nUser: ${message}` : message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        usage: data.usage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
