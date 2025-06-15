
import { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';

export interface SystemMetrics {
  active_operations: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
  accepted_reports: number;
  responded_reports: number;
  critical_reports: number;
  high_priority_reports: number;
  average_response_time: number;
}

export const useSystemMetrics = () => {
  const { reports } = useReports();
  const { assignments } = useAssignments();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    active_operations: 0,
    total_reports: 0,
    resolved_reports: 0,
    pending_reports: 0,
    accepted_reports: 0,
    responded_reports: 0,
    critical_reports: 0,
    high_priority_reports: 0,
    average_response_time: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = () => {
      // Calculations based on reports and assignments data
      const totalReports = reports.length;
      const resolvedReports = reports.filter(r => r.status === 'resolved').length;
      const pendingReports = reports.filter(r => r.status === 'pending').length;
      
      const acceptedAssignments = assignments.filter(a => a.status === 'accepted').length;
      const respondedAssignments = assignments.filter(a => a.status === 'responded_to').length;
      
      // Active operations are based on assignments that are not resolved
      const activeOperations = assignments.filter(a => a.status !== 'resolved').length;
      
      // Calculate critical and high priority reports
      const criticalReports = reports.filter(r => 
        r.urgency === 'critical' || r.urgency === 'high' || r.priority === 'high'
      ).length;
      
      // Calculate average response time
      const respondedAssignmentsWithTime = assignments.filter(a => 
        a.status === 'responded_to' && a.response_timeframe
      );
      const avgResponseTime = respondedAssignmentsWithTime.length > 0 
        ? respondedAssignmentsWithTime.reduce((sum, a) => sum + (a.response_timeframe || 0), 0) / respondedAssignmentsWithTime.length
        : 0;

      const newMetrics: SystemMetrics = {
        active_operations: activeOperations,
        total_reports: totalReports,
        resolved_reports: resolvedReports,
        pending_reports: pendingReports,
        accepted_reports: acceptedAssignments,
        responded_reports: respondedAssignments,
        critical_reports: criticalReports,
        high_priority_reports: criticalReports,
        average_response_time: Math.round(avgResponseTime)
      };

      setMetrics(newMetrics);
      setLoading(false);
    };

    // Calculate metrics whenever reports or assignments change
    calculateMetrics();
  }, [reports, assignments]);

  return {
    metrics,
    loading
  };
};
