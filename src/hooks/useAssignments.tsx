
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  report_id: string;
  commander_id: string;
  assigned_at: string;
  status: 'pending' | 'accepted' | 'responded_to' | 'resolved';
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  response_timestamp: string | null;
  response_timeframe: number | null;
  operation_outcome: string | null;
  casualties: number | null;
  injured_personnel: number | null;
  civilians_rescued: number | null;
  weapons_recovered: number | null;
  custom_message: string | null;
  created_at: string;
  updated_at: string;
}

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedAssignments = (data || []).map(assignment => ({
        ...assignment,
        status: assignment.status as 'pending' | 'accepted' | 'responded_to' | 'resolved'
      }));

      setAssignments(typedAssignments);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Failed to load assignments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignmentData: {
    report_id: string;
    commander_id: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          ...assignmentData,
          status: 'pending' as const
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Assignment Created",
        description: `Report assigned successfully`,
      });

      fetchAssignments();
      return data[0];
    } catch (error: any) {
      console.error('Error creating assignment:', error);
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
    status: 'pending' | 'accepted' | 'responded_to' | 'resolved',
    resolutionNotes?: string,
    operationData?: {
      operation_outcome?: string;
      casualties?: number;
      injured_personnel?: number;
      civilians_rescued?: number;
      weapons_recovered?: number;
      custom_message?: string;
    }
  ) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'responded_to') {
        updateData.response_timestamp = new Date().toISOString();
        // Calculate response timeframe if needed
        const assignment = assignments.find(a => a.id === assignmentId);
        if (assignment) {
          const assignedTime = new Date(assignment.assigned_at);
          const responseTime = new Date();
          updateData.response_timeframe = Math.round((responseTime.getTime() - assignedTime.getTime()) / (1000 * 60)); // minutes
        }
        
        if (operationData) {
          Object.assign(updateData, operationData);
        }
      }
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = 'Current User';
        if (resolutionNotes) {
          updateData.resolution_notes = resolutionNotes;
        }
      }

      const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Assignment status updated to ${status.replace('_', ' ')}`,
      });

      fetchAssignments();
    } catch (error: any) {
      console.error('Error updating assignment status:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAssignments();

    const channel = supabase
      .channel('assignments-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assignments'
      }, () => {
        fetchAssignments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    assignments,
    loading,
    createAssignment,
    updateAssignmentStatus,
    refetch: fetchAssignments
  };
};
