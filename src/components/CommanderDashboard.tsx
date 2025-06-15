
import React, { useState, useEffect } from 'react';
import { useAssignments, Assignment } from '@/hooks/useAssignments';
import { useReports, Report } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';
import DashboardSidebar from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import StatCard from './StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CircleCheck, CircleAlert, Target, Activity, LogOut, Shield, BarChart3, ListTodo } from 'lucide-react';
import GoogleMapsHeatmap from './GoogleMapsHeatmap';
import RealTimeReports from './RealTimeReports';
import ReportDetailsModal from './ReportDetailsModal';
import ChartsSection from './ChartsSection';
import RecentAssignmentsList from './commander-dashboard/RecentAssignmentsList';

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

  const displayStateName = commanderState.toUpperCase() === 'FCT' ? 'Abuja' : commanderState;

  if (loading) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg">
        <DashboardSidebar />
        <div className="ml-64 p-8 flex items-center justify-center h-screen">
          <div className="text-white">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      <div className="ml-64 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
              <img 
                src="/lovable-uploads/ba3282a6-18f0-407f-baa2-bbdab0014f65.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{`${displayStateName} Threat Intelligence and Monitoring System (STIMS)`}</h1>
              <p className="text-gray-400">
                Live threat analysis and report management for your jurisdiction.
              </p>
            </div>
          </div>
          {onLogout && (
            <Button variant="outline" onClick={onLogout} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="TOTAL REPORTS"
            value={totalReports.toString()}
            subtitle={`In ${commanderState}`}
            icon={<FileText size={24} />}
            status="neutral"
          />
          <StatCard
            title="RESOLVED"
            value={resolvedReports.toString()}
            subtitle="Completed missions"
            status="success"
            icon={<CircleCheck size={24} />}
          />
          <StatCard
            title="PENDING"
            value={pendingReports.toString()}
            subtitle="Awaiting action"
            status="warning"
            icon={<CircleAlert size={24} />}
          />
          <StatCard
            title="AVG RESPONSE"
            value={`${Math.round(avgResponseTime || 0)} min`}
            subtitle="Your average"
            status={avgResponseTime > 60 ? "warning" : "success"}
            icon={<Target size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentAssignmentsList
                assignments={commanderAssignments.filter(a => a.status === 'pending')}
                commanderState={commanderState}
                handleAcceptAssignment={handleAcceptAssignment}
                handleRejectAssignment={handleRejectAssignment}
                isUpdating={isUpdatingAssignment}
            />
            {/* Placeholder for accepted/active assignments */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <ListTodo className="h-5 w-5 text-green-400" />
                        Active Assignments
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Assignments you have accepted and are working on.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            {commanderAssignments.filter(a => a.status === 'accepted' || a.status === 'responded_to').length} active assignment(s).
                        </p>
                    </div>
                </CardContent>
            </Card>
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

        {selectedReport && (
          <ReportDetailsModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default CommanderDashboard;
