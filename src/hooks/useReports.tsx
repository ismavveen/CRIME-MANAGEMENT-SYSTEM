
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
  documents?: string[];
  reporter_name?: string;
  reporter_contact?: string;
  reporter_phone?: string;
  reporter_email?: string;
  submission_source?: string;
  validation_status?: string;
  metadata?: any;
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
      
      // Cast database rows to Report type with proper handling of new fields
      const typedReports = (data || []).map(report => ({
        ...report,
        urgency: (report.urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        priority: (report.priority as 'low' | 'medium' | 'high') || 'low',
        documents: (report as any).documents || [],
        serial_number: (report as any).serial_number || undefined,
        reporter_name: (report as any).reporter_name || undefined,
        reporter_contact: (report as any).reporter_contact || undefined,
        reporter_phone: (report as any).reporter_phone || undefined,
        reporter_email: (report as any).reporter_email || undefined,
        submission_source: (report as any).submission_source || undefined,
        validation_status: (report as any).validation_status || undefined,
        metadata: (report as any).metadata || undefined
      } as Report));
      
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

  const getReportBySerialNumber = async (serialNumber: string): Promise<Report | null> => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('serial_number', serialNumber)
        .maybeSingle();

      if (error) {
        console.error('Error fetching report by serial number:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Convert database row to Report type with proper type handling
      return {
        id: data.id,
        serial_number: (data as any).serial_number || undefined,
        description: data.description || '',
        threat_type: data.threat_type || data.crime_type || '',
        location: data.location || '',
        manual_location: data.manual_location || undefined,
        urgency: (data.urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        priority: (data.priority as 'low' | 'medium' | 'high') || 'low',
        status: data.status || 'pending',
        state: data.state || '',
        local_government: data.local_government || undefined,
        full_address: data.full_address || undefined,
        landmark: data.landmark || undefined,
        acknowledged_at: data.acknowledged_at || undefined,
        assigned_commander_id: data.assigned_commander_id || undefined,
        response_time_hours: data.response_time_hours || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        file_url: data.file_url || undefined,
        reporter_type: data.reporter_type || undefined,
        is_anonymous: data.is_anonymous || false,
        timestamp: data.timestamp || undefined,
        location_accuracy: data.location_accuracy || undefined,
        assigned_to: data.assigned_to || undefined,
        images: data.images || undefined,
        videos: data.videos || undefined,
        documents: (data as any).documents || undefined,
        reporter_name: (data as any).reporter_name || undefined,
        reporter_contact: (data as any).reporter_contact || undefined,
        reporter_phone: (data as any).reporter_phone || undefined,
        reporter_email: (data as any).reporter_email || undefined,
        submission_source: (data as any).submission_source || undefined,
        validation_status: (data as any).validation_status || undefined,
        metadata: (data as any).metadata || undefined
      };
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
        const newReport = payload.new as Report;
        setReports(prev => [newReport, ...prev]);
        
        // Show toast notification for new reports
        toast({
          title: "New Report Received",
          description: `${newReport.threat_type || 'Security report'} from ${newReport.state || 'Unknown location'}`,
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('Report updated:', payload);
        const updatedReport = payload.new as Report;
        setReports(prev => prev.map(report => 
          report.id === updatedReport.id ? updatedReport : report
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
  }, [toast]);

  return {
    reports,
    loading,
    updateReportStatus,
    getReportBySerialNumber,
    refetch: fetchReports
  };
};
