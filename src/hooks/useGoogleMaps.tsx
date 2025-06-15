
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// This hook will NOT hardcode the API key
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let unmounted = false;

    // Fetch the Google Maps API key securely via Supabase Edge Function
    const fetchKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-maps-key', {
          body: { requestType: 'apiKey' }
        });
        if (error || !data || !data.apiKey) {
          setError('Could not retrieve Google Maps API key.');
          return;
        }
        setApiKey(data.apiKey);

        // Wait for the key before adding the script
        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=visualization`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (!unmounted) setIsLoaded(true);
        };
        script.onerror = () => {
          setError('Failed to load Google Maps');
        };
        document.head.appendChild(script);
      } catch (err) {
        setError('Error fetching API key or loading Google Maps');
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
