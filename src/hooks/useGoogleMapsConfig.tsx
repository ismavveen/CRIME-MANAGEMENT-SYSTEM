
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGoogleMapsConfig = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoogleMapsConfig();
  }, []);

  const fetchGoogleMapsConfig = async () => {
    try {
      // Try to get the API key from Supabase secrets/edge functions
      // This would typically be done through an edge function for security
      const { data, error } = await supabase.functions.invoke('get-google-maps-key', {
        body: { requestType: 'apiKey' }
      });

      if (error) {
        console.warn('Could not fetch Google Maps API key from Supabase:', error);
        // Fallback to environment variable for development
        const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (envKey) {
          setApiKey(envKey);
        } else {
          toast({
            title: "Google Maps Configuration Missing",
            description: "Please configure your Google Maps API key in Supabase secrets",
            variant: "destructive",
          });
        }
      } else {
        setApiKey(data.apiKey);
      }
    } catch (error) {
      console.warn('Error fetching Google Maps config:', error);
      // Fallback to placeholder for development
      setApiKey('YOUR_GOOGLE_MAPS_API_KEY_HERE');
    } finally {
      setLoading(false);
    }
  };

  return { apiKey, loading };
};
