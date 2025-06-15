
import React from 'react';
import { MapIncident } from '@/types/incidents';

interface MapDisplayProps {
  incidents: MapIncident[];
  selectedMapPoint: MapIncident | null;
  onMarkerClick: (incident: MapIncident) => void;
  onViewDetails: () => void;
  onAssignReport: () => void;
  onCloseTooltip: () => void;
}

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
  if (type === 'critical' && !isAssigned) return 8;
  if (type === 'critical') return 6;
  return 4;
};

const MapDisplay: React.FC<MapDisplayProps> = ({
  incidents,
  selectedMapPoint,
  onMarkerClick,
  onViewDetails,
  onAssignReport,
  onCloseTooltip,
}) => {
  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden border border-green-500/30">
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
                onClick={() => onMarkerClick(incident)}
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
              {selectedMapPoint.isAssigned ? '✅ Assigned' : selectedMapPoint.type === 'warning' ? '🕒 Pending' : selectedMapPoint.type}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={onViewDetails}
              className="text-dhq-blue text-sm hover:text-blue-400 text-left font-medium"
            >
              📋 View Full Details
            </button>
            
            {!selectedMapPoint.isAssigned && (
              <button
                onClick={onAssignReport}
                className="text-green-400 text-sm hover:text-green-300 text-left font-medium"
              >
                👮 Assign to Unit
              </button>
            )}
            
            <button
              onClick={onCloseTooltip}
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
  );
};

export default MapDisplay;
