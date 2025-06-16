import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action_type: string;
  actor_id?: string;
  actor_type: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
  timestamp: string;
  session_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  access_method?: string | null;
  severity_level: string;
  is_sensitive: boolean;
  created_at: string;
}

export interface ReportAuditTrail {
  id: string;
  report_id: string;
  audit_log_id: string;
  field_changed?: string;
  previous_value?: string;
  new_value?: string;
  change_reason?: string;
  approved_by?: string;
  created_at: string;
  audit_log?: AuditLog;
}

export interface ReportAccessLog {
  id: string;
  report_id: string;
  audit_log_id: string;
  access_type: string;
  duration_seconds?: number;
  accessed_sections?: any;
  purpose?: string;
  created_at: string;
  audit_log?: AuditLog;
}

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAuditLogs = async (filters?: {
    entity_type?: string;
    entity_id?: string;
    action_type?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters?.entity_id) {
        query = query.eq('entity_id', filters.entity_id);
      }
      if (filters?.action_type) {
        query = query.eq('action_type', filters.action_type);
      }
      if (filters?.date_from) {
        query = query.gte('timestamp', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('timestamp', filters.date_to);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw error;
      }
      
      // Safe type conversion with null checks
      const processedData = (data || []).map(log => ({
        ...log,
        ip_address: log.ip_address || null,
        user_agent: log.user_agent || null,
        access_method: log.access_method || null,
        actor_id: log.actor_id || undefined,
        old_values: log.old_values || undefined,
        new_values: log.new_values || undefined,
        metadata: log.metadata || undefined,
        session_id: log.session_id || undefined,
      })) as AuditLog[];
      
      setAuditLogs(processedData);
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Failed to load audit logs",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      setAuditLogs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getReportAuditTrail = async (reportId: string): Promise<ReportAuditTrail[]> => {
    try {
      const { data, error } = await supabase
        .from('report_audit_trail')
        .select(`
          *,
          audit_log:audit_logs(*)
        `)
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching report audit trail:', error);
        throw error;
      }
      
      // Safe type conversion with null checks
      const processedData = (data || []).map(trail => ({
        ...trail,
        audit_log: trail.audit_log ? {
          ...trail.audit_log,
          ip_address: trail.audit_log.ip_address || null,
          user_agent: trail.audit_log.user_agent || null,
          access_method: trail.audit_log.access_method || null,
        } : undefined
      })) as ReportAuditTrail[];
      
      return processedData;
    } catch (error: any) {
      console.error('Error fetching report audit trail:', error);
      toast({
        title: "Failed to load audit trail",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return [];
    }
  };

  const getReportAccessLogs = async (reportId: string): Promise<ReportAccessLog[]> => {
    try {
      const { data, error } = await supabase
        .from('report_access_logs')
        .select(`
          *,
          audit_log:audit_logs(*)
        `)
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching access logs:', error);
        throw error;
      }
      
      // Safe type conversion with null checks
      const processedData = (data || []).map(accessLog => ({
        ...accessLog,
        audit_log: accessLog.audit_log ? {
          ...accessLog.audit_log,
          ip_address: accessLog.audit_log.ip_address || null,
          user_agent: accessLog.audit_log.user_agent || null,
          access_method: accessLog.audit_log.access_method || null,
        } : undefined
      })) as ReportAccessLog[];
      
      return processedData;
    } catch (error: any) {
      console.error('Error fetching access logs:', error);
      toast({
        title: "Failed to load access logs",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return [];
    }
  };

  const logReportAccess = async (
    reportId: string,
    accessType: string = 'view',
    durationSeconds?: number,
    accessedSections?: any,
    purpose?: string
  ) => {
    try {
      const { data, error } = await supabase
        .rpc('log_report_access', {
          p_report_id: reportId,
          p_access_type: accessType,
          p_duration_seconds: durationSeconds,
          p_accessed_sections: accessedSections,
          p_purpose: purpose
        });

      if (error) {
        console.error('Error logging report access:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      console.error('Error logging report access:', error);
      // Don't show toast for logging errors to avoid disrupting user experience
      return null;
    }
  };

  return {
    auditLogs,
    loading,
    fetchAuditLogs,
    getReportAuditTrail,
    getReportAccessLogs,
    logReportAccess
  };
};
