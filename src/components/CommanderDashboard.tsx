
import React, { useState, useEffect } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { useReports } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CommanderDashboardHeader from './commander-dashboard/CommanderDashboardHeader';
import CommanderStatsGrid from './commander-dashboard/CommanderStatsGrid';
import RecentAssignmentsList from './commander-dashboard/RecentAssignmentsList';
import StateReportsList from './commander-dashboard/StateReportsList';

interface CommanderDashboardProps {
  commanderId: string;
  commanderState: string;
  onLogout?: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commanderId, commanderState, onLogout }) => {
  const { assignments, loading: assignmentsLoading, refetch: refetchAssignments } = useAssignments();
  const { reports, loading: reportsLoading } = useReports();
  const { toast } = useToast();
  
  const [stateReports, setStateReports] = useState<any[]>([]);

  // Filter reports for the commander's state
  useEffect(() => {
    if (reports && commanderState) {
      const filteredReports = reports.filter(report => report.state === commanderState);
      setStateReports(filteredReports);
    }
  }, [reports, commanderState]);

  // Get commander stats
  const pendingAssignments = assignments?.filter(a => a.status === 'pending').length || 0;
  const resolvedAssignments = assignments?.filter(a => a.status === 'resolved').length || 0;

  // Calculate average response time from assignments
  const avgResponseTime = assignments && assignments.length > 0
    ? assignments
        .filter(a => a.created_at && a.updated_at)
        .reduce((acc, assignment) => {
          const created = new Date(assignment.created_at);
          const updated = new Date(assignment.updated_at);
          return acc + (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        }, 0) / assignments.length
    : 0;

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment Accepted",
        description: "You have successfully accepted this assignment",
      });
      refetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (assignmentsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommanderDashboardHeader
        commanderState={commanderState}
        onLogout={onLogout}
      />

      <CommanderStatsGrid
        totalReports={stateReports.length}
        pendingAssignments={pendingAssignments}
        resolvedAssignments={resolvedAssignments}
        avgResponseTime={avgResponseTime}
        commanderState={commanderState}
      />

      <RecentAssignmentsList
        assignments={assignments || []}
        commanderState={commanderState}
        handleAcceptAssignment={handleAcceptAssignment}
      />

      <StateReportsList
        reports={stateReports}
        commanderState={commanderState}
      />
    </div>
  );
};

export default CommanderDashboard;
