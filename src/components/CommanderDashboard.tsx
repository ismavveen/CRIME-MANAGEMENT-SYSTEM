
import React, { useState, useEffect } from 'react';
import { useAssignments, Assignment } from '@/hooks/useAssignments';
import { useReports, Report } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';
import { Activity, BarChart3 } from 'lucide-react';
import GoogleMapsHeatmap from './GoogleMapsHeatmap';
import RealTimeReports from './RealTimeReports';
import ReportDetailsModal from './ReportDetailsModal';
import ChartsSection from './ChartsSection';
import RecentAssignmentsList from './commander-dashboard/RecentAssignmentsList';
import ResolutionSubmissionDialog from './commander-dashboard/ResolutionSubmissionDialog';
import CommanderHeader from './commander-dashboard/CommanderHeader';
import CommanderStats from './commander-dashboard/CommanderStats';
import ActiveAssignmentsList from './commander-dashboard/ActiveAssignmentsList';

interface CommanderDashboardProps {
  commanderId: string;
  commanderState: string;
  onLogout?: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commanderId, commanderState, onLogout }) => {
  const { reports, loading: reportsLoading, refetch: refetchReports } = useReports();
  const { assignments, loading: assignmentsLoading, updateAssignmentStatus } = useAssignments();
  const { toast } = useToast();

  const [stateReports, setStateReports] = useState<Report[]>([]);
  const [commanderAssignments, setCommanderAssignments] = useState<Assignment[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false);
  const [resolutionDialogOpen, setResolutionDialogOpen] = useState(false);
  const [selectedAssignmentForResolution, setSelectedAssignmentForResolution] = useState<Assignment | null>(null);

  const loading = reportsLoading || assignmentsLoading;

  useEffect(() => {
    if (reports && commanderState) {
      const filteredReports = reports.filter(report => report.state === commanderState);
      setStateReports(filteredReports);
    }
  }, [reports, commanderState]);

  useEffect(() => {
    if (assignments && commanderId) {
      const filtered = assignments.filter(a => a.commander_id === commanderId);
      setCommanderAssignments(filtered);
    }
  }, [assignments, commanderId]);

  const totalReports = stateReports.length;
  const resolvedReports = stateReports.filter(r => r.status === 'resolved').length;
  const pendingReports = stateReports.filter(r => r.status === 'pending' || r.status === 'assigned').length;

  const respondedAssignments = commanderAssignments.filter(a => a.status === 'responded_to' && a.response_timeframe);
  const avgResponseTime = respondedAssignments.length > 0
    ? respondedAssignments.reduce((sum, a) => sum + (a.response_timeframe || 0), 0) / respondedAssignments.length
    : 0;
  
  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleAcceptAssignment = async (assignmentId: string) => {
    setIsUpdatingAssignment(true);
    await updateAssignmentStatus(assignmentId, 'accepted');
    setIsUpdatingAssignment(false);
    toast({ title: "Assignment Accepted", description: "The report status is now 'Received'. You can proceed with the operation." });
  };

  const handleRejectAssignment = async (assignmentId: string, reason: string) => {
    setIsUpdatingAssignment(true);
    await updateAssignmentStatus(assignmentId, 'rejected', reason);
    setIsUpdatingAssignment(false);
  };

  const handleOpenResolutionDialog = (assignment: Assignment) => {
    setSelectedAssignmentForResolution(assignment);
    setResolutionDialogOpen(true);
  };
  
  const handleResolutionSubmit = async (assignmentId: string, resolutionData: any) => {
    await updateAssignmentStatus(assignmentId, 'resolved', undefined, undefined, resolutionData);
  };

  const displayStateName = commanderState.toUpperCase() === 'FCT' ? 'Abuja' : commanderState;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  const newAssignments = commanderAssignments.filter(a => a.status === 'pending');
  const activeAssignments = commanderAssignments.filter(a => a.status === 'accepted' || a.status === 'responded_to');

  return (
    <>
      <div className="p-6 space-y-6">
        <CommanderHeader displayStateName={displayStateName} onLogout={onLogout} />

        <CommanderStats
          totalReports={totalReports}
          resolvedReports={resolvedReports}
          pendingReports={pendingReports}
          avgResponseTime={avgResponseTime}
          commanderState={commanderState}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentAssignmentsList
                assignments={newAssignments}
                commanderState={commanderState}
                handleAcceptAssignment={handleAcceptAssignment}
                handleRejectAssignment={handleRejectAssignment}
                isUpdating={isUpdatingAssignment}
            />
            <ActiveAssignmentsList
                assignments={activeAssignments}
                onOpenResolutionDialog={handleOpenResolutionDialog}
            />
        </div>


        <div className="mb-8 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white dhq-heading">Live Threat Map for {commanderState}</h2>
              </div>
          </div>
          <div className="w-full">
            <div className="dhq-card p-6 h-[500px]">
              <GoogleMapsHeatmap 
                reports={stateReports} 
                onMarkerClick={handleMarkerClick}
                className="h-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-8 animate-fade-in-up">
          <RealTimeReports reportsData={stateReports} isLoading={reportsLoading} onRefetch={refetchReports} />
        </div>
        
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white dhq-heading">Threat Analytics for {commanderState}</h2>
              </div>
          </div>
          <ChartsSection filterByState={commanderState} />
        </div>
      </div>
        {selectedReport && (
          <ReportDetailsModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}

        {selectedAssignmentForResolution && (
            <ResolutionSubmissionDialog
                open={resolutionDialogOpen}
                onOpenChange={setResolutionDialogOpen}
                assignmentId={selectedAssignmentForResolution.id}
                onSubmit={handleResolutionSubmit}
            />
        )}
    </>
  );
};

export default CommanderDashboard;
