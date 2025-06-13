
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
  metadata?: Record<string, any>;
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
      
      // Simplified mapping without complex type casting
      const typedReports = (data || []).map(report => {
        const mappedReport: Report = {
          id: report.id,
          serial_number: report.serial_number || undefined,
          description: report.description || '',
          threat_type: report.threat_type || report.crime_type || '',
          location: report.location || '',
          manual_location: report.manual_location || undefined,
          urgency: (['low', 'medium', 'high', 'critical'].includes(report.urgency)) ? report.urgency : 'medium',
          priority: (['low', 'medium', 'high'].includes(report.priority)) ? report.priority : 'low',
          status: report.status || 'pending',
          state: report.state || '',
          local_government: report.local_government || undefined,
          full_address: report.full_address || undefined,
          landmark: report.landmark || undefined,
          acknowledged_at: report.acknowledged_at || undefined,
          assigned_commander_id: report.assigned_commander_id || undefined,
          response_time_hours: report.response_time_hours || undefined,
          created_at: report.created_at,
          updated_at: report.updated_at,
          latitude: report.latitude || undefined,
          longitude: report.longitude || undefined,
          file_url: report.file_url || undefined,
          reporter_type: report.reporter_type || undefined,
          is_anonymous: report.is_anonymous !== false,
          timestamp: report.timestamp || undefined,
          location_accuracy: report.location_accuracy || undefined,
          assigned_to: report.assigned_to || undefined,
          images: report.images || undefined,
          videos: report.videos || undefined,
          documents: report.documents || undefined,
          reporter_name: report.reporter_name || undefined,
          reporter_contact: report.reporter_contact || undefined,
          reporter_phone: report.reporter_phone || undefined,
          reporter_email: report.reporter_email || undefined,
          submission_source: report.submission_source || undefined,
          validation_status: report.validation_status || undefined,
          metadata: report.metadata || undefined
        };
        return mappedReport;
      });
      
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
      const updateData: Record<string, any> = { status };
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

      // Simplified conversion without complex type casting
      const mappedReport: Report = {
        id: data.id,
        serial_number: data.serial_number || undefined,
        description: data.description || '',
        threat_type: data.threat_type || data.crime_type || '',
        location: data.location || '',
        manual_location: data.manual_location || undefined,
        urgency: (['low', 'medium', 'high', 'critical'].includes(data.urgency)) ? data.urgency : 'medium',
        priority: (['low', 'medium', 'high'].includes(data.priority)) ? data.priority : 'low',
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
        is_anonymous: data.is_anonymous !== false,
        timestamp: data.timestamp || undefined,
        location_accuracy: data.location_accuracy || undefined,
        assigned_to: data.assigned_to || undefined,
        images: data.images || undefined,
        videos: data.videos || undefined,
        documents: data.documents || undefined,
        reporter_name: data.reporter_name || undefined,
        reporter_contact: data.reporter_contact || undefined,
        reporter_phone: data.reporter_phone || undefined,
        reporter_email: data.reporter_email || undefined,
        submission_source: data.submission_source || undefined,
        validation_status: data.validation_status || undefined,
        metadata: data.metadata || undefined
      };

      return mappedReport;
    } catch (error: any) {
      console.error('Error fetching report by serial number:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchReports();

    // Real-time subscription for immediate updates
    const channel = supabase
      .channel('reports-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('New report received:', payload);
        const newReport = payload.new;
        
        // Convert the new report to our Report type
        const mappedNewReport: Report = {
          id: newReport.id,
          serial_number: newReport.serial_number || undefined,
          description: newReport.description || '',
          threat_type: newReport.threat_type || newReport.crime_type || '',
          location: newReport.location || '',
          manual_location: newReport.manual_location || undefined,
          urgency: (['low', 'medium', 'high', 'critical'].includes(newReport.urgency)) ? newReport.urgency : 'medium',
          priority: (['low', 'medium', 'high'].includes(newReport.priority)) ? newReport.priority : 'low',
          status: newReport.status || 'pending',
          state: newReport.state || '',
          local_government: newReport.local_government || undefined,
          full_address: newReport.full_address || undefined,
          landmark: newReport.landmark || undefined,
          acknowledged_at: newReport.acknowledged_at || undefined,
          assigned_commander_id: newReport.assigned_commander_id || undefined,
          response_time_hours: newReport.response_time_hours || undefined,
          created_at: newReport.created_at,
          updated_at: newReport.updated_at,
          latitude: newReport.latitude || undefined,
          longitude: newReport.longitude || undefined,
          file_url: newReport.file_url || undefined,
          reporter_type: newReport.reporter_type || undefined,
          is_anonymous: newReport.is_anonymous !== false,
          timestamp: newReport.timestamp || undefined,
          location_accuracy: newReport.location_accuracy || undefined,
          assigned_to: newReport.assigned_to || undefined,
          images: newReport.images || undefined,
          videos: newReport.videos || undefined,
          documents: newReport.documents || undefined,
          reporter_name: newReport.reporter_name || undefined,
          reporter_contact: newReport.reporter_contact || undefined,
          reporter_phone: newReport.reporter_phone || undefined,
          reporter_email: newReport.reporter_email || undefined,
          submission_source: newReport.submission_source || undefined,
          validation_status: newReport.validation_status || undefined,
          metadata: newReport.metadata || undefined
        };

        setReports(prev => [mappedNewReport, ...prev]);
        
        // Show toast notification for new reports
        toast({
          title: "New Report Received",
          description: `${mappedNewReport.threat_type || 'Security report'} from ${mappedNewReport.state || 'Unknown location'}`,
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'reports'
      }, (payload) => {
        console.log('Report updated:', payload);
        const updatedReport = payload.new;
        
        setReports(prev => prev.map(report => 
          report.id === updatedReport.id ? {
            ...report,
            ...updatedReport,
            urgency: (['low', 'medium', 'high', 'critical'].includes(updatedReport.urgency)) ? updatedReport.urgency : 'medium',
            priority: (['low', 'medium', 'high'].includes(updatedReport.priority)) ? updatedReport.priority : 'low'
          } : report
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
