
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  report_id: string;
  assigned_to_commander: string;
  assigned_by: string;
  assigned_at: string | null;
  status: 'assigned' | 'in_progress' | 'resolved';
  resolution_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  notes: string | null;
  priority: string | null;
}

export interface MilitaryUnit {
  id: string;
  name: string;
  type: string;
  location: string;
  commander: string;
  latitude: number | null;
  longitude: number | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [militaryUnits, setMilitaryUnits] = useState<MilitaryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAssignments(data || []);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchMilitaryUnits = async () => {
    try {
      // Use unit_commanders table as a substitute for military units
      const { data, error } = await supabase
        .from('unit_commanders')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      
      // Transform unit_commanders data to match MilitaryUnit interface
      const transformedUnits: MilitaryUnit[] = (data || []).map(commander => ({
        id: commander.id,
        name: commander.unit || 'Unknown Unit',
        type: commander.specialization || 'General',
        location: commander.location || 'Unknown Location',
        commander: commander.full_name,
        latitude: null,
        longitude: null,
        status: commander.is_active ? 'active' as const : 'inactive' as const,
        created_at: commander.created_at,
        updated_at: commander.updated_at
      }));
      
      setMilitaryUnits(transformedUnits);
    } catch (error: any) {
      console.error('Error fetching military units:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignReport = async (
    reportId: string,
    unitId: string,
    commander: string,
    assignedBy: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          report_id: reportId,
          assigned_to_commander: commander,
          assigned_by: assignedBy
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Report Assigned",
        description: `Report has been assigned to ${commander}`,
      });

      return data[0];
    } catch (error: any) {
      console.error('Error assigning report:', error);
      toast({
        title: "Assignment Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAssignmentStatus = async (
    assignmentId: string,
    status: 'in_progress' | 'resolved',
    resolutionNotes?: string,
    resolvedBy?: string
  ) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolution_notes = resolutionNotes;
        updateData.resolved_by = resolvedBy;
      }

      const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Assignment status updated to ${status}`,
      });

      fetchAssignments(); // Refresh assignments
    } catch (error: any) {
      console.error('Error updating assignment status:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const findNearestUnit = (latitude: number, longitude: number): MilitaryUnit | null => {
    if (militaryUnits.length === 0) return null;

    // For now, just return the first available unit since we don't have coordinates
    return militaryUnits[0] || null;
  };

  useEffect(() => {
    fetchAssignments();
    fetchMilitaryUnits();

    // Set up real-time subscription for assignments
    const channel = supabase
      .channel('assignments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assignments'
        },
        () => {
          fetchAssignments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    assignments,
    militaryUnits,
    loading,
    assignReport,
    updateAssignmentStatus,
    findNearestUnit,
    refetch: () => {
      fetchAssignments();
      fetchMilitaryUnits();
    }
  };
};
