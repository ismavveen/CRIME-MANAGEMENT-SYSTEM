
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

      // Convert database row to Report type
      const reportData: Report = {
        id: data.id,
        serial_number: data.serial_number,
        description: data.description,
        threat_type: data.threat_type,
        location: data.location || '',
        manual_location: data.manual_location,
        urgency: (data.urgency as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        priority: (data.priority as 'low' | 'medium' | 'high') || 'low',
        status: data.status,
        state: data.state || '',
        local_government: data.local_government,
        full_address: data.full_address,
        landmark: data.landmark,
        acknowledged_at: data.acknowledged_at,
        assigned_commander_id: data.assigned_commander_id,
        response_time_hours: data.response_time_hours,
        created_at: data.created_at,
        updated_at: data.updated_at,
        latitude: data.latitude,
        longitude: data.longitude,
        file_url: data.file_url,
        reporter_type: data.reporter_type,
        is_anonymous: data.is_anonymous,
        timestamp: data.timestamp,
        location_accuracy: data.location_accuracy,
        assigned_to: data.assigned_to,
        images: data.images,
        videos: data.videos
      };

      return reportData;
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
  }, []);

  return {
    reports,
    loading,
    updateReportStatus,
    getReportBySerialNumber,
    refetch: fetchReports
  };
};
