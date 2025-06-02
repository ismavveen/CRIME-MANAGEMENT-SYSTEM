
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UnitCommander {
  id: string;
  full_name: string;
  rank: string;
  unit: string;
  specialization: string | null;
  location: string | null;
  contact_info: string | null;
  status: 'active' | 'suspended' | 'inactive' | 'available';
  is_active: boolean;
  total_assignments: number;
  active_assignments: number;
  success_rate: number;
  average_response_time: number;
  state: string;
  email: string;
  service_number: string | null;
  password_hash: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  active_operations: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
}

export const useUnitCommanders = () => {
  const [commanders, setCommanders] = useState<UnitCommander[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    active_operations: 0,
    total_reports: 0,
    resolved_reports: 0,
    pending_reports: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommanders = async () => {
    try {
      const { data, error } = await supabase
        .from('unit_commanders')
        .select('*')
        .order('full_name');

      if (error) throw error;
      
      const typedCommanders = (data || []).map(commander => ({
        ...commander,
        status: commander.status as 'active' | 'suspended' | 'inactive' | 'available'
      }));
      
      setCommanders(typedCommanders);
    } catch (error: any) {
      console.error('Error fetching commanders:', error);
      toast({
        title: "Failed to load commanders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*');

      if (error) throw error;
      
      const metrics = (data || []).reduce((acc, metric) => {
        acc[metric.metric_name as keyof SystemMetrics] = metric.metric_value;
        return acc;
      }, {} as SystemMetrics);
      
      setSystemMetrics({
        active_operations: metrics.active_operations || 0,
        total_reports: metrics.total_reports || 0,
        resolved_reports: metrics.resolved_reports || 0,
        pending_reports: metrics.pending_reports || 0
      });
    } catch (error: any) {
      console.error('Error fetching system metrics:', error);
    }
  };

  const createCommander = async (commanderData: {
    full_name: string;
    rank: string;
    unit: string;
    state: string;
    email: string;
    service_number?: string;
    profile_image?: string;
    password_hash?: string;
    specialization?: string;
    location?: string;
    contact_info?: string;
    status?: 'active' | 'suspended' | 'inactive' | 'available';
  }) => {
    try {
      const { data, error } = await supabase
        .from('unit_commanders')
        .insert([{
          ...commanderData,
          status: commanderData.status || 'active' as const
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Commander Registered",
        description: `${commanderData.full_name} has been successfully registered`,
      });

      fetchCommanders();
      return data[0];
    } catch (error: any) {
      console.error('Error creating commander:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCommanderStatus = async (
    commanderId: string,
    status: 'active' | 'suspended' | 'inactive' | 'available'
  ) => {
    try {
      const { error } = await supabase
        .from('unit_commanders')
        .update({ status })
        .eq('id', commanderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Commander status has been updated successfully",
      });

      fetchCommanders();
    } catch (error: any) {
      console.error('Error updating commander status:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCommanders(),
        fetchSystemMetrics()
      ]);
      setLoading(false);
    };

    loadData();

    const commandersChannel = supabase
      .channel('commanders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'unit_commanders'
      }, () => {
        fetchCommanders();
      })
      .subscribe();

    const metricsChannel = supabase
      .channel('metrics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_metrics'
      }, () => {
        fetchSystemMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commandersChannel);
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  return {
    commanders,
    systemMetrics,
    loading,
    createCommander,
    updateCommanderStatus,
    refetch: () => {
      fetchCommanders();
      fetchSystemMetrics();
    }
  };
};
