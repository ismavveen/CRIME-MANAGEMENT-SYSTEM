
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

  const mapDatabaseToReport = (dbReport: any): Report => {
    return {
      id: dbReport.id,
      serial_number: dbReport.serial_number || undefined,
      description: dbReport.description || '',
      threat_type: dbReport.threat_type || dbReport.crime_type || '',
      location: dbReport.location || '',
      manual_location: dbReport.manual_location || undefined,
      urgency: (['low', 'medium', 'high', 'critical'].includes(dbReport.urgency)) 
        ? dbReport.urgency as 'low' | 'medium' | 'high' | 'critical' 
        : 'medium',
      priority: (['low', 'medium', 'high'].includes(dbReport.priority)) 
        ? dbReport.priority as 'low' | 'medium' | 'high' 
        : 'low',
      status: dbReport.status || 'pending',
      state: dbReport.state || '',
      local_government: dbReport.local_government || undefined,
      full_address: dbReport.full_address || undefined,
      landmark: dbReport.landmark || undefined,
      acknowledged_at: dbReport.acknowledged_at || undefined,
      assigned_commander_id: dbReport.assigned_commander_id || undefined,
      response_time_hours: dbReport.response_time_hours || undefined,
      created_at: dbReport.created_at,
      updated_at: dbReport.updated_at,
      latitude: dbReport.latitude || undefined,
      longitude: dbReport.longitude || undefined,
      file_url: dbReport.file_url || undefined,
      reporter_type: dbReport.reporter_type || undefined,
      is_anonymous: dbReport.is_anonymous !== false,
      timestamp: dbReport.timestamp || undefined,
      location_accuracy: dbReport.location_accuracy || undefined,
      assigned_to: dbReport.assigned_to || undefined,
      images: dbReport.images || undefined,
      videos: dbReport.videos || undefined,
      documents: dbReport.documents || undefined,
      reporter_name: dbReport.reporter_name || undefined,
      reporter_contact: dbReport.reporter_contact || undefined,
      reporter_phone: dbReport.reporter_phone || undefined,
      reporter_email: dbReport.reporter_email || undefined,
      submission_source: dbReport.submission_source || undefined,
      validation_status: dbReport.validation_status || undefined,
      metadata: dbReport.metadata || undefined
    };
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedReports = (data || []).map(mapDatabaseToReport);
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

      return mapDatabaseToReport(data);
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
        const newReport = mapDatabaseToReport(payload.new);
        setReports(prev => [newReport, ...prev]);
        
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
        const updatedReport = mapDatabaseToReport(payload.new);
        
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
