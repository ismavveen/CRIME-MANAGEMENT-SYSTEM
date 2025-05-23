
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  description: string | null;
  location: string | null;
  manual_location: string | null;
  threat_type: string | null;
  urgency: string | null;
  status: string | null;
  priority: string | null;
  latitude: number | null;
  longitude: number | null;
  location_accuracy: number | null;
  created_at: string | null;
  timestamp: string | null;
  reporter_type: string;
  is_anonymous: boolean | null;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      console.log('Fetched reports:', data);
      setReports(data || []);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message);
      toast({
        title: "Failed to load reports",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Set up real-time subscription to listen for new reports
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('New report added:', payload.new);
          setReports(prev => [payload.new as Report, ...prev]);
          toast({
            title: "New report received",
            description: `Report ${(payload.new as Report).id.slice(0, 8)} has been submitted`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('Report updated:', payload.new);
          setReports(prev => prev.map(report => 
            report.id === (payload.new as Report).id 
              ? payload.new as Report 
              : report
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  };
};
