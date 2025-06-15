
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
          console.error('Supabase Edge Function error:', fetchError);
          setError('Could not contact Google Maps API key service.');
          return;
        }
        if (!data || !data.apiKey) {
          console.error('No apiKey received in response:', data);
          setError('Failed to retrieve Google Maps API key.');
          return;
        }
        setApiKey(data.apiKey);

        // Remove any existing Google Maps script to avoid duplicates or conflicts
        const prevScript = document.querySelector('script[data-dhq-google="1"]');
        if (prevScript && prevScript.parentNode) {
          prevScript.parentNode.removeChild(prevScript);
        }

        script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=visualization`;
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
          console.error('Failed to load Google Maps script', e);
          setError('Failed to load Google Maps. Check API key and restrictions.');
        };
        document.head.appendChild(script);
      } catch (err: any) {
        console.error('Error fetching API key for Google Maps:', err);
        setError('Error fetching API key or loading Google Maps.');
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
