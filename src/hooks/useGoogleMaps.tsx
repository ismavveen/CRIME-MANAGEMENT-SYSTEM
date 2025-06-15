
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// This hook will NOT hardcode the API key
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
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

        // Only load the script after key is available
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=visualization`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setError('Failed to load Google Maps');
        document.head.appendChild(script);

        return () => {
          if (script.parentNode) script.parentNode.removeChild(script);
        };
      } catch (err) {
        setError('Error fetching API key or loading Google Maps');
      }
    };
    fetchKey();
  }, []);

  return { isLoaded, error, apiKey };
};
