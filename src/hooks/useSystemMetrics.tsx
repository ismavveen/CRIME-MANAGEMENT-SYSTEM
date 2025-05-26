
import { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';

export interface SystemMetrics {
  active_operations: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
  accepted_reports: number;
  critical_reports: number;
  high_priority_reports: number;
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
    critical_reports: 0,
    high_priority_reports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = () => {
      // Real-time calculations based on actual data
      const totalReports = reports.length;
      const resolvedAssignments = assignments.filter(a => a.status === 'resolved').length;
      const acceptedAssignments = assignments.filter(a => a.status === 'accepted').length;
      const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
      
      // Calculate pending reports (reports without assignments)
      const assignedReportIds = assignments.map(a => a.report_id);
      const unassignedReports = reports.filter(r => !assignedReportIds.includes(r.id)).length;
      
      // Calculate critical and high priority reports
      const criticalReports = reports.filter(r => 
        r.urgency === 'critical' || r.priority === 'high'
      ).length;
      
      const activeOperations = pendingAssignments + acceptedAssignments;

      const newMetrics: SystemMetrics = {
        active_operations: activeOperations,
        total_reports: totalReports,
        resolved_reports: resolvedAssignments,
        pending_reports: unassignedReports,
        accepted_reports: acceptedAssignments,
        critical_reports: criticalReports,
        high_priority_reports: criticalReports
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
