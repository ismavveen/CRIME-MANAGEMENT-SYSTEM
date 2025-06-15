
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Get the Google Maps API key from Supabase secrets
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      console.error('[get-google-maps-key] GOOGLE_MAPS_API_KEY not found in environment secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Google Maps API key not configured in Supabase secrets' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[get-google-maps-key] Successfully retrieved API key from secrets');
    
    return new Response(
      JSON.stringify({ apiKey }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[get-google-maps-key] Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error retrieving Google Maps API key' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
