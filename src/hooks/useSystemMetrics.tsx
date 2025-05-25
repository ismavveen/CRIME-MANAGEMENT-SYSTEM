
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetric {
  metric_name: string;
  metric_value: number;
  last_updated: string;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({
    active_operations: 0,
    total_reports: 0,
    resolved_reports: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*');

      if (error) throw error;

      const metricsMap = (data || []).reduce((acc, metric) => {
        acc[metric.metric_name] = metric.metric_value;
        return acc;
      }, {} as Record<string, number>);

      setMetrics(metricsMap);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription
    const channel = supabase
      .channel('system-metrics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_metrics'
      }, () => {
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    metrics,
    loading,
    refetch: fetchMetrics
  };
};
