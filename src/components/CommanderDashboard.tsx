
import React, { useState, useEffect } from 'react';
import { useAssignments, Assignment } from '@/hooks/useAssignments';
import { useReports, Report } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';
import CommanderDashboardHeader from './commander-dashboard/CommanderDashboardHeader';
import StatCard from './StatCard';
import { FileText, CircleCheck, CircleAlert, Target, Activity } from 'lucide-react';
import GoogleMapsHeatmap from './GoogleMapsHeatmap';
import RealTimeReports from './RealTimeReports';
import ReportDetailsModal from './ReportDetailsModal';

interface CommanderDashboardProps {
  commanderId: string;
  commanderState: string;
  onLogout?: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commanderId, commanderState, onLogout }) => {
  const { reports, loading: reportsLoading, refetch: refetchReports } = useReports();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { toast } = useToast();

  const [stateReports, setStateReports] = useState<Report[]>([]);
  const [commanderAssignments, setCommanderAssignments] = useState<Assignment[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-screen bg-dhq-dark-bg">
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

      <div className="mb-8 animate-slide-in-right">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white dhq-heading">Live Threat Map for {commanderState}</h2>
            </div>
        </div>
        <div className="w-full">
          <div className="dhq-card p-6 h-[700px]">
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

      {selectedReport && (
        <ReportDetailsModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};

export default CommanderDashboard;
