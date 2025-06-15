
import { useMemo } from 'react';
import { Report } from './useReports';
import { Assignment } from './useAssignments';
import { UnitCommander } from './useUnitCommanders';
import { MapIncident, DetailedIncident } from '@/types/incidents';

export const useMapIncidents = (
  reports: Report[],
  assignments: Assignment[],
  commanders: UnitCommander[],
  filterByState?: string
) => {
  const incidents = useMemo<MapIncident[]>(() => {
    return reports
      .filter(report => report.latitude && report.longitude)
      .filter(report => !filterByState || report.state === filterByState)
      .map(report => {
        const assignment = assignments.find(a => a.report_id === report.id);
        let type: 'critical' | 'warning' | 'resolved' | 'assigned' = 'warning';
        
        if (assignment?.status === 'resolved') {
          type = 'resolved';
        } else if (assignment) {
          type = 'assigned';
        } else if (report.urgency === 'critical' || report.priority === 'high') {
          type = 'critical';
        }

        return {
          id: report.id,
          lat: report.latitude!,
          lng: report.longitude!,
          type,
          title: report.threat_type || 'Security Report',
          time: report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown',
          isAssigned: !!assignment
        };
      });
  }, [reports, assignments, filterByState]);

  const incidentDetails = useMemo<DetailedIncident[]>(() => {
    return reports
      .filter(report => report.latitude && report.longitude)
      .filter(report => !filterByState || report.state === filterByState)
      .map(report => {
        const assignment = assignments.find(a => a.report_id === report.id);
        const commander = assignment ? commanders.find(c => c.id === assignment.commander_id) : null;
        
        let mappedPriority: 'high' | 'medium' | 'low' = 'medium';
        if (report.priority === 'high' || report.urgency === 'critical') {
          mappedPriority = 'high';
        } else if (report.priority === 'low') {
          mappedPriority = 'low';
        }

        let status: 'critical' | 'warning' | 'resolved' | 'investigating' = 'warning';
        if (assignment?.status === 'resolved') {
          status = 'resolved';
        } else if (assignment?.status === 'accepted') {
          status = 'investigating';
        } else if (report.urgency === 'critical') {
          status = 'critical';
        }

        return {
          id: report.id,
          type: report.threat_type || 'Security Report',
          location: report.location || report.manual_location || `${report.latitude}, ${report.longitude}`,
          status,
          timestamp: report.created_at || report.timestamp || new Date().toISOString(),
          priority: mappedPriority,
          officer: commander?.full_name || 'Unassigned',
          description: report.description || 'No description provided',
          state: report.state,
          coordinates: { lat: report.latitude!, lng: report.longitude! },
          updates: [
            {
              time: report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown',
              message: `Report submitted via ${report.reporter_type || 'unknown'} source`,
              author: 'System'
            },
            ...(assignment && commander ? [{
              time: new Date(assignment.assigned_at).toLocaleString(),
              message: `Assigned to ${commander.full_name}`,
              author: 'System'
            }] : []),
            ...(assignment?.status === 'resolved' && assignment.resolved_at ? [{
              time: new Date(assignment.resolved_at).toLocaleString(),
              message: `Case resolved: ${assignment.resolution_notes || 'No notes provided'}`,
              author: assignment.resolved_by || 'System'
            }] : [])
          ]
        };
      });
  }, [reports, assignments, commanders, filterByState]);
  
  return { incidents, incidentDetails };
};
