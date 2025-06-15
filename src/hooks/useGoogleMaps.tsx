import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let unmounted = false;

    const fetchKey = async () => {
      try {
        const { data, error: fetchError } = await supabase.functions.invoke('get-google-maps-key', {
          body: { requestType: 'apiKey' }
        });

        if (fetchError) {
          // Network, CORS, or Supabase Edge Function error
          if (
            fetchError.message &&
            (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('network'))
          ) {
            console.error('[GoogleMaps] Network error contacting Supabase Edge Function:', fetchError);
            setError(
              'Could not reach Supabase Edge Function. ' +
              'Possible network problem, function not deployed, or ad-blocking/firewall. ' +
              'Check your network connection and try again.'
            );
            return;
          }

          // Other edge function errors
          console.error('[GoogleMaps] Supabase Edge Function error:', fetchError);
          setError('Could not contact Google Maps API key service (Supabase Edge Function error).');
          return;
        }

        if (!data || !data.apiKey) {
          // Key missing = likely not set
          console.error('[GoogleMaps] No apiKey received in response from Supabase:', data);
          setError(
            'Google Maps API key missing. ' +
            'Check your Supabase Edge Function secret: "GOOGLE_MAPS_API_KEY". ' +
            'Contact admin to configure the Google Maps API key in Supabase.'
          );
          return;
        }

        // Defensive coding: Trim whitespace and remove accidental quotes from the API key.
        const cleanedApiKey = data.apiKey.trim().replace(/^"|"$/g, '');
        
        if (!cleanedApiKey) {
             setError(
                'Google Maps API key is empty after cleanup. ' +
                'Check your Supabase Edge Function secret: "GOOGLE_MAPS_API_KEY". '
            );
            return;
        }
        
        setApiKey(cleanedApiKey);

        // Remove any existing Google Maps script
        const prevScript = document.querySelector('script[data-dhq-google="1"]');
        if (prevScript && prevScript.parentNode) {
          prevScript.parentNode.removeChild(prevScript);
        }

        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${cleanedApiKey}&libraries=visualization`;
        script.async = true;
        script.defer = true;
        script.setAttribute('data-dhq-google', '1');
        script.onload = () => {
          if (!unmounted) {
            setIsLoaded(true);
            setError(null);
          }
        };
        script.onerror = (e) => {
          // Google Maps script failed to load (bad key or CORS)
          console.error('[GoogleMaps] Failed to load Google Maps script', e, script?.src);
          setError(
            'Failed to load Google Maps JavaScript. ' +
            'Check if the API key is valid, and enabled for Maps JavaScript API. ' +
            'Open browser console for details.'
          );
        };
        document.head.appendChild(script);
      } catch (err: any) {
        // This may catch JSON/network issues
        console.error('[GoogleMaps] Exception during API key fetch or script injection:', err);
        setError(
          'Exception fetching API key or loading Google Maps. ' +
          'Check your network connection and Supabase Edge Function. See browser console.'
        );
      }
    };
    fetchKey();

    return () => {
      unmounted = true;
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, error, apiKey };
};
