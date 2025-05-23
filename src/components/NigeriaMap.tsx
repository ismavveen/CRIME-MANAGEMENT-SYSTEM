
import React, { useState } from 'react';
import IncidentDetailsDialog, { IncidentDetails } from './IncidentDetailsDialog';
import { useReports } from '@/hooks/useReports';

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'warning' | 'resolved';
  title: string;
  time: string;
}

const NigeriaMap = () => {
  const { reports, loading, error } = useReports();
  const [selectedMapPoint, setSelectedMapPoint] = useState<Incident | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetails | null>(null);

  // Convert reports to incidents for the map
  const incidents: Incident[] = reports
    .filter(report => report.latitude && report.longitude)
    .map(report => {
      let type: 'critical' | 'warning' | 'resolved' = 'warning';
      
      if (report.status === 'resolved') {
        type = 'resolved';
      } else if (report.urgency === 'critical' || report.priority === 'high') {
        type = 'critical';
      }

      return {
        id: report.id,
        lat: report.latitude!,
        lng: report.longitude!,
        type,
        title: report.threat_type || 'Security Report',
        time: report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown'
      };
    });

  // Convert reports to detailed incident data
  const incidentDetails: IncidentDetails[] = reports
    .filter(report => report.latitude && report.longitude)
    .map(report => ({
      id: report.id,
      type: report.threat_type || 'Security Report',
      location: report.location || report.manual_location || `${report.latitude}, ${report.longitude}`,
      status: report.status === 'resolved' ? 'resolved' : 
              report.urgency === 'critical' ? 'critical' : 'warning',
      timestamp: report.created_at || report.timestamp || new Date().toISOString(),
      priority: report.priority || 'medium',
      officer: 'Dispatch Team',
      description: report.description || 'No description provided',
      coordinates: { lat: report.latitude!, lng: report.longitude! },
      updates: [
        {
          time: report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown',
          message: `Report submitted via ${report.reporter_type} source`,
          author: 'System'
        }
      ]
    }));

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'critical':
        return '#DC2626';
      case 'warning':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getMarkerSize = (type: string) => {
    return type === 'critical' ? 16 : 12;
  };

  const handleMarkerClick = (incident: Incident) => {
    setSelectedMapPoint(incident);
    
    // Find the corresponding detailed incident and open the dialog
    const detailedIncident = incidentDetails.find(detail => detail.id === incident.id);
    if (detailedIncident) {
      setSelectedIncident(detailedIncident);
      setShowDialog(true);
    }
  };

  if (loading) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
        </div>
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-white">Loading reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
        </div>
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-red-400">Error loading reports: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-dhq-red rounded-full"></div>
            <span className="text-gray-400 text-sm">Critical ({incidents.filter(i => i.type === 'critical').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Warning ({incidents.filter(i => i.type === 'warning').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Resolved ({incidents.filter(i => i.type === 'resolved').length})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Nigeria Map SVG */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
        >
          {/* Nigeria outline (simplified) */}
          <path
            d="M50 80 L350 80 L350 100 L320 120 L300 140 L280 160 L250 180 L220 200 L200 220 L180 240 L160 250 L140 240 L120 220 L100 200 L80 180 L60 160 L50 140 Z"
            fill="rgba(55, 65, 81, 0.3)"
            stroke="rgba(75, 85, 99, 0.5)"
            strokeWidth="1"
          />
          
          {/* State boundaries (simplified) */}
          <g stroke="rgba(75, 85, 99, 0.3)" strokeWidth="0.5" fill="none">
            <line x1="120" y1="80" x2="120" y2="200" />
            <line x1="180" y1="80" x2="180" y2="220" />
            <line x1="240" y1="80" x2="240" y2="200" />
            <line x1="300" y1="80" x2="280" y2="160" />
            <line x1="50" y1="120" x2="320" y2="120" />
            <line x1="60" y1="160" x2="280" y2="160" />
            <line x1="80" y1="200" x2="250" y2="200" />
          </g>

          {/* Real incident markers */}
          {incidents.map((incident) => {
            // Convert lat/lng to SVG coordinates (simplified projection)
            const x = ((incident.lng + 15) / 25) * 300 + 50; // Rough Nigeria longitude range
            const y = ((20 - incident.lat) / 15) * 200 + 50; // Rough Nigeria latitude range
            
            return (
              <g key={incident.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={getMarkerSize(incident.type)}
                  fill={getMarkerColor(incident.type)}
                  className="incident-marker animate-pulse-glow cursor-pointer"
                  onClick={() => handleMarkerClick(incident)}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={getMarkerSize(incident.type) + 4}
                  fill="none"
                  stroke={getMarkerColor(incident.type)}
                  strokeWidth="1"
                  opacity="0.5"
                  className="animate-ping"
                />
              </g>
            );
          })}
        </svg>

        {/* Incident tooltip */}
        {selectedMapPoint && !showDialog && (
          <div className="absolute top-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-xs">
            <h4 className="text-white font-semibold mb-2">{selectedMapPoint.title}</h4>
            <p className="text-gray-400 text-sm mb-2">{selectedMapPoint.time}</p>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-2 h-2 rounded-full`}
                style={{ backgroundColor: getMarkerColor(selectedMapPoint.type) }}
              ></div>
              <span className="text-sm capitalize text-gray-300">{selectedMapPoint.type}</span>
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => setSelectedMapPoint(null)}
                className="text-gray-400 text-sm hover:text-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const detailedIncident = incidentDetails.find(detail => detail.id === selectedMapPoint.id);
                  if (detailedIncident) {
                    setSelectedIncident(detailedIncident);
                    setShowDialog(true);
                  }
                }}
                className="text-dhq-blue text-sm hover:text-blue-400"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {incidents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p>No reports with location data yet</p>
              <p className="text-sm mt-1">Reports will appear here as they are submitted</p>
            </div>
          </div>
        )}
      </div>

      {/* Incident details dialog */}
      <IncidentDetailsDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        incident={selectedIncident}
      />
    </div>
  );
};

export default NigeriaMap;
