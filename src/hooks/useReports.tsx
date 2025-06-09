
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  serial_number?: string;
  description: string;
  threat_type: string;
  location: string;
  manual_location?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high';
  status: string;
  state: string;
  local_government?: string;
  full_address?: string;
  landmark?: string;
  acknowledged_at?: string;
  assigned_commander_id?: string;
  response_time_hours?: number;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  file_url?: string;
  reporter_type?: string;
  is_anonymous?: boolean;
  timestamp?: string;
  location_accuracy?: number;
  assigned_to?: string;
  images?: string[];
  videos?: string[];
  reporter_name?: string;
  reporter_contact?: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure urgency and priority are properly typed
      const typedReports = (data || []).map(report => ({
        ...report,
        urgency: (report.urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        priority: (report.priority as 'low' | 'medium' | 'high') || 'low'
      }));
      
      setReports(typedReports);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Failed to load reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string, assignedTo?: string) => {
    try {
      const updateData: any = { status };
      if (assignedTo) {
        updateData.assigned_to = assignedTo;
      }

      const { error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report Updated",
        description: `Report status updated to ${status}`,
      });

      fetchReports();
    } catch (error: any) {
      console.error('Error updating report:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getReportBySerialNumber = async (serialNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('serial_number', serialNumber)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching report by serial number:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchReports();

    // Enhanced real-time subscription for immediate updates
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('New report received:', payload);
        setReports(prev => [payload.new as Report, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('Report updated:', payload);
        setReports(prev => prev.map(report => 
          report.id === payload.new.id ? payload.new as Report : report
        ));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('Report deleted:', payload);
        setReports(prev => prev.filter(report => report.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    reports,
    loading,
    updateReportStatus,
    getReportBySerialNumber,
    refetch: fetchReports
  };
};
