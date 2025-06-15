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
  arm_of_service: 'Army' | 'Navy' | 'Air Force' | null;
  created_at: string;
  updated_at: string;
}

export interface SystemMetrics {
  active_operations: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
  responded_reports: number;
  average_response_time: number;
}

export const useUnitCommanders = () => {
  const [commanders, setCommanders] = useState<UnitCommander[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    active_operations: 0,
    total_reports: 0,
    resolved_reports: 0,
    pending_reports: 0,
    responded_reports: 0,
    average_response_time: 0
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
        status: commander.status as 'active' | 'suspended' | 'inactive' | 'available',
        password_hash: commander.password_hash || null,
        profile_image: commander.profile_image || null,
        service_number: commander.service_number || null,
        arm_of_service: commander.arm_of_service as 'Army' | 'Navy' | 'Air Force' | null
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
      // Fetch from system_metrics table
      const { data: metricsData, error: metricsError } = await supabase
        .from('system_metrics')
        .select('*');

      if (metricsError) throw metricsError;
      
      const metrics = (metricsData || []).reduce((acc, metric) => {
        acc[metric.metric_name as keyof SystemMetrics] = metric.metric_value;
        return acc;
      }, {} as SystemMetrics);

      // Calculate additional metrics from reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('status, created_at, acknowledged_at');

      if (!reportsError && reportsData) {
        const resolvedReports = reportsData.filter(r => r.status === 'resolved');
        const totalResponseTimes = resolvedReports
          .filter(r => r.acknowledged_at)
          .map(r => {
            const created = new Date(r.created_at);
            const acknowledged = new Date(r.acknowledged_at!);
            return (acknowledged.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
          });

        const avgResponseTime = totalResponseTimes.length > 0
          ? totalResponseTimes.reduce((sum, time) => sum + time, 0) / totalResponseTimes.length
          : 0;

        metrics.average_response_time = Math.round(avgResponseTime * 10) / 10;
        metrics.responded_reports = resolvedReports.length;
      }
      
      setSystemMetrics({
        active_operations: metrics.active_operations || 0,
        total_reports: metrics.total_reports || 0,
        resolved_reports: metrics.resolved_reports || 0,
        pending_reports: metrics.pending_reports || 0,
        responded_reports: metrics.responded_reports || 0,
        average_response_time: metrics.average_response_time || 0
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
    arm_of_service?: 'Army' | 'Navy' | 'Air Force';
    status?: 'active' | 'suspended' | 'inactive' | 'available';
  }) => {
    try {
      // Check if email or service number already exists
      const { data: existingCommander } = await supabase
        .from('unit_commanders')
        .select('id, email, service_number')
        .or(`email.eq.${commanderData.email},service_number.eq.${commanderData.service_number}`)
        .limit(1);

      if (existingCommander && existingCommander.length > 0) {
        throw new Error('A commander with this email or service number already exists');
      }

      const { data, error } = await supabase
        .from('unit_commanders')
        .insert([{
          ...commanderData,
          status: commanderData.status || 'active' as const,
          password_hash: commanderData.password_hash || null,
          profile_image: commanderData.profile_image || null,
          service_number: commanderData.service_number || null,
          arm_of_service: commanderData.arm_of_service || null
        }])
        .select();

      if (error) throw error;

      // Log the registration action for audit
      await supabase.functions.invoke('log-user-activity', {
        body: {
          user_id: data[0].id,
          activity_type: 'commander_registration',
          metadata: {
            registered_by: 'admin',
            state: commanderData.state,
            rank: commanderData.rank
          }
        }
      });

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
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', commanderId);

      if (error) throw error;

      // Log the status change for audit
      await supabase.functions.invoke('log-user-activity', {
        body: {
          user_id: commanderId,
          activity_type: 'status_change',
          metadata: {
            new_status: status,
            changed_by: 'admin'
          }
        }
      });

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

  const getCommandersByState = (state: string) => {
    return commanders.filter(commander => commander.state === state && commander.status === 'active');
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

    // Set up real-time subscriptions
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

  const deleteCommander = async (commanderId: string) => {
    try {
      // Delete commander from Supabase
      const { error } = await supabase
        .from('unit_commanders')
        .delete()
        .eq('id', commanderId);
      if (error) throw error;

      toast({
        title: "Commander Deleted",
        description: "The commander has been deleted from the system.",
      });

      // Optionally re-fetch the list
      fetchCommanders();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    commanders,
    systemMetrics,
    loading,
    createCommander,
    updateCommanderStatus,
    getCommandersByState,
    refetch: () => {
      fetchCommanders();
      fetchSystemMetrics();
    },
    deleteCommander,
  };
};
// TODO: Consider refactoring this file into smaller parts for maintainability; it's now getting lengthy.
