
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  report_id: string;
  commander_id: string;
  assigned_at: string;
  status: 'pending' | 'accepted' | 'responded_to' | 'resolved' | 'assigned' | 'rejected' | 'verified' | 'needs_revision';
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  witness_info: string | null;
  resolution_evidence: any | null;
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
  accepted_at: string | null;
  rejection_reason: string | null;
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

      // Map database data to Assignment interface with all required fields
      const typedAssignments: Assignment[] = (data || []).map(assignment => ({
        id: assignment.id,
        report_id: assignment.report_id,
        commander_id: assignment.commander_id,
        assigned_at: assignment.assigned_at,
        status: assignment.status as 'pending' | 'accepted' | 'responded_to' | 'resolved' | 'assigned' | 'rejected',
        resolved_at: assignment.resolved_at,
        resolved_by: assignment.resolved_by,
        resolution_notes: assignment.resolution_notes,
        witness_info: (assignment as any).witness_info || null,
        resolution_evidence: (assignment as any).resolution_evidence || null,
        response_timestamp: (assignment as any).response_timestamp || null,
        response_timeframe: (assignment as any).response_timeframe || null,
        operation_outcome: (assignment as any).operation_outcome || null,
        casualties: (assignment as any).casualties || null,
        injured_personnel: (assignment as any).injured_personnel || null,
        civilians_rescued: (assignment as any).civilians_rescued || null,
        weapons_recovered: (assignment as any).weapons_recovered || null,
        custom_message: (assignment as any).custom_message || null,
        created_at: assignment.created_at,
        updated_at: assignment.updated_at,
        accepted_at: assignment.accepted_at,
        rejection_reason: assignment.rejection_reason,
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
    status: 'pending' | 'accepted' | 'responded_to' | 'resolved' | 'assigned' | 'rejected' | 'verified' | 'needs_revision',
    notes?: string,
    operationData?: {
      operation_outcome?: string;
      casualties?: number;
      injured_personnel?: number;
      civilians_rescued?: number;
      weapons_recovered?: number;
      custom_message?: string;
    },
    resolutionData?: {
        resolution_notes: string;
        witness_info?: string;
        resolution_evidence?: any;
    }
  ) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      const assignment = assignments.find(a => a.id === assignmentId);

      if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
        if (assignment) {
            // Per requirements, update report status to show it's received by commander
            await supabase.from('reports').update({ status: 'accepted' }).eq('id', assignment.report_id);
        }
      }

      if (status === 'rejected') {
          if (notes) {
            updateData.rejection_reason = notes;
          }
          if (assignment) {
            // Per requirements, revert report status to 'pending' to re-appear in admin queue
            await supabase.from('reports').update({ status: 'pending', assigned_to: null, assigned_commander_id: null }).eq('id', assignment.report_id);
          }
      }
      
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
        if (resolutionData) {
          updateData.resolution_notes = resolutionData.resolution_notes;
          updateData.witness_info = resolutionData.witness_info;
          updateData.resolution_evidence = resolutionData.resolution_evidence;
        } else if (notes) {
          updateData.resolution_notes = notes;
        }
        
        if (assignment) {
            await supabase.from('reports').update({ status: 'resolved' }).eq('id', assignment.report_id);
        }
      }

      if (status === 'verified') {
        if (assignment) {
            await supabase.from('reports').update({ status: 'verified' }).eq('id', assignment.report_id);
            await supabase.from('notifications').insert({
              title: 'Resolution Verified',
              message: `Your resolution for report #${assignment.report_id.slice(0, 8)} has been verified.`,
              type: 'info'
            });
        }
      }

      if (status === 'needs_revision') {
          if (assignment) {
            // Revert status to 'accepted' so it goes back into the commander's active queue
            // and clear previous resolution data.
            updateData.status = 'accepted'; 
            updateData.resolution_notes = null;
            updateData.resolution_evidence = null;
            updateData.witness_info = null;
            updateData.resolved_at = null;
            
            await supabase.from('notifications').insert({
              title: 'Resolution Requires Revision',
              message: `Your report submission requires revision. Reason: ${notes}`,
              type: 'update'
            });
          }
      }

      const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', assignmentId);

      if (error) throw error;
      
      let successTitle = 'Status Updated';
      let successDescription = `Assignment status updated to ${status.replace('_', ' ')}`;

      if (status === 'rejected') {
        successTitle = 'Assignment Rejected';
      }
      if (status === 'resolved' && resolutionData) {
        successTitle = 'Resolution Submitted';
        successDescription = 'Your report has been submitted for verification.';
      }
      
      if (status === 'verified') {
        successTitle = 'Resolution Verified';
        successDescription = 'The resolution has been marked as verified.';
      }

      if (status === 'needs_revision') {
        successTitle = 'Returned for Revision';
        successDescription = 'The resolution has been sent back to the commander for revision.';
      }

      toast({
        title: successTitle,
        description: successDescription,
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
