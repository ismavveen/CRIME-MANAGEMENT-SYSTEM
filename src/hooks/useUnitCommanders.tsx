
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UnitCommander {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  state: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CommanderWarning {
  id: string;
  commander_id: string;
  issued_by: string;
  reason: string;
  message: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
  commander?: UnitCommander;
}

export interface CommanderNotification {
  id: string;
  commander_id: string;
  type: 'warning' | 'assignment' | 'reminder' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  commander?: UnitCommander;
}

export interface AdminAction {
  id: string;
  commander_id: string;
  admin_id: string;
  action_type: 'warning' | 'suspension' | 'escalation' | 'reactivation';
  reason: string;
  details: string | null;
  effective_from: string | null;
  effective_until: string | null;
  created_at: string;
  commander?: UnitCommander;
}

export interface SystemMetrics {
  active_operations: number;
  total_reports: number;
  resolved_reports: number;
}

export const useUnitCommanders = () => {
  const [commanders, setCommanders] = useState<UnitCommander[]>([]);
  const [warnings, setWarnings] = useState<CommanderWarning[]>([]);
  const [notifications, setNotifications] = useState<CommanderNotification[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    active_operations: 0,
    total_reports: 0,
    resolved_reports: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommanders = async () => {
    try {
      const { data, error } = await supabase
        .from('unit_commanders')
        .select('*')
        .order('state');

      if (error) throw error;
      setCommanders(data || []);
    } catch (error: any) {
      console.error('Error fetching commanders:', error);
      toast({
        title: "Failed to load commanders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchWarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('commander_warnings')
        .select(`
          *,
          commander:unit_commanders(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWarnings(data || []);
    } catch (error: any) {
      console.error('Error fetching warnings:', error);
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
      
      setSystemMetrics(metrics);
    } catch (error: any) {
      console.error('Error fetching system metrics:', error);
    }
  };

  const fetchAdminActions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_actions')
        .select(`
          *,
          commander:unit_commanders(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminActions(data || []);
    } catch (error: any) {
      console.error('Error fetching admin actions:', error);
    }
  };

  const createCommander = async (commanderData: Omit<UnitCommander, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('unit_commanders')
        .insert([commanderData])
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

  const issueWarning = async (
    commanderId: string,
    reason: string,
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    issuedBy: string
  ) => {
    try {
      const { error } = await supabase
        .from('commander_warnings')
        .insert([{
          commander_id: commanderId,
          reason,
          message,
          severity,
          issued_by: issuedBy
        }]);

      if (error) throw error;

      toast({
        title: "Warning Issued",
        description: `${severity.toUpperCase()} warning issued successfully`,
      });

      fetchWarnings();
    } catch (error: any) {
      console.error('Error issuing warning:', error);
      toast({
        title: "Failed to Issue Warning",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const takeAdminAction = async (
    commanderId: string,
    actionType: 'warning' | 'suspension' | 'escalation' | 'reactivation',
    reason: string,
    details: string,
    adminId: string,
    effectiveUntil?: string
  ) => {
    try {
      const { error } = await supabase
        .from('admin_actions')
        .insert([{
          commander_id: commanderId,
          action_type: actionType,
          reason,
          details,
          admin_id: adminId,
          effective_until: effectiveUntil
        }]);

      if (error) throw error;

      // Update commander status if suspending
      if (actionType === 'suspension') {
        await supabase
          .from('unit_commanders')
          .update({ status: 'suspended' })
          .eq('id', commanderId);
      } else if (actionType === 'reactivation') {
        await supabase
          .from('unit_commanders')
          .update({ status: 'active' })
          .eq('id', commanderId);
      }

      toast({
        title: "Action Completed",
        description: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} action taken successfully`,
      });

      fetchCommanders();
      fetchAdminActions();
    } catch (error: any) {
      console.error('Error taking admin action:', error);
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const acknowledgeWarning = async (warningId: string) => {
    try {
      const { error } = await supabase
        .from('commander_warnings')
        .update({ 
          acknowledged: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', warningId);

      if (error) throw error;

      toast({
        title: "Warning Acknowledged",
        description: "Warning has been acknowledged",
      });

      fetchWarnings();
    } catch (error: any) {
      console.error('Error acknowledging warning:', error);
      toast({
        title: "Failed to Acknowledge",
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
        fetchWarnings(),
        fetchSystemMetrics(),
        fetchAdminActions()
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

    const warningsChannel = supabase
      .channel('warnings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'commander_warnings'
      }, () => {
        fetchWarnings();
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
      supabase.removeChannel(warningsChannel);
      supabase.removeChannel(metricsChannel);
    };
  }, []);

  return {
    commanders,
    warnings,
    notifications,
    adminActions,
    systemMetrics,
    loading,
    createCommander,
    issueWarning,
    takeAdminAction,
    acknowledgeWarning,
    refetch: () => {
      fetchCommanders();
      fetchWarnings();
      fetchSystemMetrics();
      fetchAdminActions();
    }
  };
};
