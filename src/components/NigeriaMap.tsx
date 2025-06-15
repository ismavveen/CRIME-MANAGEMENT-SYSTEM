import React, { useState } from 'react';
import IncidentDetailsDialog, { IncidentDetails } from './IncidentDetailsDialog';
import AssignmentDialog from './AssignmentDialog';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'warning' | 'resolved' | 'assigned';
  title: string;
  time: string;
  isAssigned: boolean;
}

const NigeriaMap = () => {
  const { reports, loading } = useReports();
  const { assignments } = useAssignments();
  const { commanders } = useUnitCommanders();
  const [selectedMapPoint, setSelectedMapPoint] = useState<Incident | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetails | null>(null);

  // Convert reports to incidents for the map with assignment status
  const incidents: Incident[] = reports
    .filter(report => report.latitude && report.longitude)
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

  // Convert reports to detailed incident data
  const incidentDetails: IncidentDetails[] = reports
    .filter(report => report.latitude && report.longitude)
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
        coordinates: { lat: report.latitude!, lng: report.longitude! },
        updates: [
          {
            time: report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown',
            message: `Report submitted via ${report.reporter_type} source`,
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

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'critical':
        return '#DC2626'; // Red - Critical unassigned
      case 'warning':
        return '#F59E0B'; // Yellow - Normal unassigned
      case 'assigned':
        return '#3B82F6'; // Blue - Assigned/In progress
      case 'resolved':
        return '#10B981'; // Green - Resolved
      default:
        return '#6B7280'; // Gray - Default
    }
  };

  const getMarkerSize = (type: string, isAssigned: boolean) => {
    // Smaller markers to prevent overlap - reduced from 8-14 to 4-8
    if (type === 'critical' && !isAssigned) return 8;
    if (type === 'critical') return 6;
    return 4; // Much smaller markers for better visibility
  };

  const handleMarkerClick = (incident: Incident) => {
    setSelectedMapPoint(incident);
  };

  const handleViewDetails = () => {
    if (!selectedMapPoint) return;
    
    const detailedIncident = incidentDetails.find(detail => detail.id === selectedMapPoint.id);
    if (detailedIncident) {
      setSelectedIncident(detailedIncident);
      setShowDetailsDialog(true);
      setSelectedMapPoint(null);
    }
  };

  const handleAssignReport = () => {
    if (!selectedMapPoint) return;
    setShowAssignDialog(true);
  };

  // ADD: Handler for assigning a report (even if dummy for now)
  const handleAssign = async (commanderId: string) => {
    // You may want to show a toast or perform an action later.
    // For now, just close the dialog.
    setShowAssignDialog(false);
  };

  if (loading) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-sm">SYNCING LIVE DATA</span>
          </div>
        </div>
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-white">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">🚨 LIVE THREAT MAP</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">LIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-dhq-red rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">Critical ({incidents.filter(i => i.type === 'critical').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Unassigned ({incidents.filter(i => i.type === 'warning').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Assigned ({incidents.filter(i => i.type === 'assigned').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Resolved ({incidents.filter(i => i.type === 'resolved').length})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden border border-green-500/30">
        {/* Nigeria Map SVG */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
        >
          {/* Nigeria outline (simplified) */}
          <path
            d="M50 80 L350 80 L350 100 L320 120 L300 140 L280 160 L250 180 L220 200 L200 220 L180 240 L160 250 L140 240 L120 220 L100 200 L80 180 L60 160 L50 140 Z"
            fill="rgba(15, 23, 42, 0.8)"
            stroke="rgba(34, 197, 94, 0.5)"
            strokeWidth="2"
          />
          
          {/* State boundaries (simplified) */}
          <g stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" fill="none">
            <line x1="120" y1="80" x2="120" y2="200" />
            <line x1="180" y1="80" x2="180" y2="220" />
            <line x1="240" y1="80" x2="240" y2="200" />
            <line x1="300" y1="80" x2="280" y2="160" />
            <line x1="50" y1="120" x2="320" y2="120" />
            <line x1="60" y1="160" x2="280" y2="160" />
            <line x1="80" y1="200" x2="250" y2="200" />
          </g>

          {/* Real incident markers with improved spacing and smaller size */}
          {incidents.map((incident, index) => {
            // Convert lat/lng to SVG coordinates with improved spacing algorithm
            const baseX = ((incident.lng + 15) / 25) * 300 + 50;
            const baseY = ((20 - incident.lat) / 15) * 200 + 50;
            
            // Better spacing algorithm to prevent overlaps
            const gridSize = 8; // Smaller grid for tighter spacing
            const gridX = Math.floor(index % 10) * gridSize;
            const gridY = Math.floor(index / 10) * gridSize;
            
            const x = Math.max(60, Math.min(340, baseX + (gridX - 40)));
            const y = Math.max(90, Math.min(240, baseY + (gridY - 20)));
            
            return (
              <g key={incident.id}>
                {/* Pulsing animation ring for unassigned critical incidents */}
                {incident.type === 'critical' && !incident.isAssigned && (
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="none"
                    stroke={getMarkerColor(incident.type)}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}
                
                {/* Main marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={getMarkerSize(incident.type, incident.isAssigned)}
                  fill={getMarkerColor(incident.type)}
                  className="incident-marker cursor-pointer hover:opacity-80 transition-all hover:scale-150"
                  onClick={() => handleMarkerClick(incident)}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                  }}
                />
                
                {/* Outer ring for better visibility */}
                <circle
                  cx={x}
                  cy={y}
                  r={getMarkerSize(incident.type, incident.isAssigned) + 1}
                  fill="none"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Enhanced incident tooltip */}
        {selectedMapPoint && (
          <div className="absolute top-4 right-4 bg-gray-800 border border-green-500/50 rounded-lg p-4 max-w-xs shadow-lg">
            <h4 className="text-white font-semibold mb-2">🚨 {selectedMapPoint.title}</h4>
            <p className="text-gray-400 text-sm mb-2">📅 {selectedMapPoint.time}</p>
            <div className="flex items-center space-x-2 mb-3">
              <div 
                className={`w-2 h-2 rounded-full`}
                style={{ backgroundColor: getMarkerColor(selectedMapPoint.type) }}
              ></div>
              <span className="text-sm capitalize text-gray-300">
                {selectedMapPoint.isAssigned ? '✅ Assigned' : selectedMapPoint.type}
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={handleViewDetails}
                className="text-dhq-blue text-sm hover:text-blue-400 text-left font-medium"
              >
                📋 View Full Details
              </button>
              
              {!selectedMapPoint.isAssigned && (
                <button
                  onClick={handleAssignReport}
                  className="text-green-400 text-sm hover:text-green-300 text-left font-medium"
                >
                  👮 Assign to Unit
                </button>
              )}
              
              <button
                onClick={() => setSelectedMapPoint(null)}
                className="text-gray-400 text-sm hover:text-gray-300 text-left"
              >
                ❌ Close
              </button>
            </div>
          </div>
        )}

        {incidents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p>🔍 No reports with location data yet</p>
              <p className="text-sm mt-1">Reports will appear here as they are submitted</p>
            </div>
          </div>
        )}
      </div>

      {/* Incident details dialog */}
      <IncidentDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        incident={selectedIncident}
      />

      {/* Assignment dialog */}
      {/* Added required prop onAssign below */}
      <AssignmentDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        reportId={selectedMapPoint?.id || null}
        reportLocation={selectedIncident?.location}
        reportLatitude={selectedIncident?.coordinates?.lat}
        reportLongitude={selectedIncident?.coordinates?.lng}
        onAssign={handleAssign}
      />
    </div>
  );
};

export default NigeriaMap;
