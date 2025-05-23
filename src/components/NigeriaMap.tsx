
import React, { useState } from 'react';
import IncidentDetailsDialog, { IncidentDetails } from './IncidentDetailsDialog';

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'warning' | 'resolved';
  title: string;
  time: string;
}

const NigeriaMap = () => {
  const [selectedMapPoint, setSelectedMapPoint] = useState<Incident | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetails | null>(null);

  // Sample incidents for the map
  const incidents: Incident[] = [
    { id: 'INC-001', lat: 9.0579, lng: 7.4951, type: 'critical', title: 'Security Alert - FCT', time: '2 hours ago' },
    { id: 'INC-002', lat: 6.5244, lng: 3.3792, type: 'warning', title: 'Traffic Incident - Lagos', time: '5 hours ago' },
    { id: 'INC-003', lat: 7.3775, lng: 3.9470, type: 'resolved', title: 'Resolved - Oyo', time: '7 hours ago' },
    { id: 'INC-004', lat: 11.8469, lng: 13.1571, type: 'critical', title: 'Border Alert - Borno', time: '1 hour ago' },
    { id: 'INC-005', lat: 5.0197, lng: 6.7849, type: 'warning', title: 'Civil Unrest - Delta', time: '3 hours ago' },
    { id: 'INC-006', lat: 10.5105, lng: 7.4165, type: 'resolved', title: 'Completed - Kaduna', time: '12 hours ago' },
    { id: 'INC-007', lat: 4.8156, lng: 7.0498, type: 'critical', title: 'Emergency - Rivers', time: '30 mins ago' },
    { id: 'INC-008', lat: 12.0022, lng: 8.5919, type: 'warning', title: 'Monitoring - Kano', time: '4 hours ago' },
  ];

  // Sample detailed incident data that matches map points
  const incidentDetails: IncidentDetails[] = [
    {
      id: 'INC-001',
      type: 'Armed Robbery',
      location: 'FCT, Abuja Central',
      status: 'critical',
      timestamp: '2024-01-20 14:30',
      priority: 'high',
      officer: 'Lt. Col. Johnson',
      description: 'Armed individuals reported near government complex. Multiple suspects, potentially armed.',
      coordinates: { lat: 9.0579, lng: 7.4951 },
      updates: [
        {
          time: '2 hours ago',
          message: 'Tactical team dispatched to location, securing perimeter.',
          author: 'Dispatch Officer'
        }
      ]
    },
    {
      id: 'INC-002',
      type: 'Traffic Incident',
      location: 'Lagos, Victoria Island',
      status: 'warning',
      timestamp: '2024-01-20 11:15',
      priority: 'medium',
      officer: 'Capt. Adeyemi',
      description: 'Major traffic disruption due to overturned tanker. Fire risk present.',
      coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    {
      id: 'INC-003',
      type: 'Public Disturbance', 
      location: 'Oyo State, Ibadan',
      status: 'resolved',
      timestamp: '2024-01-20 09:45',
      priority: 'low',
      officer: 'Lt. Ogunbiyi',
      description: 'Protest that blocked major highway now dispersed. Traffic flowing normally.',
      coordinates: { lat: 7.3775, lng: 3.9470 }
    },
    {
      id: 'INC-004',
      type: 'Border Security Breach',
      location: 'Borno State, Maiduguri',
      status: 'critical',
      timestamp: '2024-01-20 15:45',
      priority: 'high',
      officer: 'Col. Ahmed',
      description: 'Reports of unauthorized border crossings with potential security threat.',
      coordinates: { lat: 11.8469, lng: 13.1571 }
    },
    {
      id: 'INC-005',
      type: 'Civil Unrest',
      location: 'Delta State, Warri',
      status: 'warning',
      timestamp: '2024-01-20 13:30',
      priority: 'medium',
      officer: 'Maj. Okoro',
      description: 'Demonstrations near oil facility with potential for escalation.',
      coordinates: { lat: 5.0197, lng: 6.7849 }
    },
    {
      id: 'INC-006',
      type: 'Security Operation',
      location: 'Kaduna State, Zaria',
      status: 'resolved',
      timestamp: '2024-01-20 04:20',
      priority: 'medium',
      officer: 'Maj. Bello',
      description: 'Planned security operation completed successfully. Area secured.',
      coordinates: { lat: 10.5105, lng: 7.4165 }
    },
    {
      id: 'INC-007',
      type: 'Kidnapping',
      location: 'Rivers State, Port Harcourt',
      status: 'critical',
      timestamp: '2024-01-20 15:30',
      priority: 'high',
      officer: 'Capt. Okafor',
      description: 'Expatriate workers reported kidnapped from oil facility. Ransom demand received.',
      coordinates: { lat: 4.8156, lng: 7.0498 }
    },
    {
      id: 'INC-008',
      type: 'Suspicious Activity',
      location: 'Kano State, Kano City',
      status: 'warning',
      timestamp: '2024-01-20 12:15',
      priority: 'medium',
      officer: 'Lt. Ibrahim',
      description: 'Suspicious packages reported near market area. Bomb squad investigating.',
      coordinates: { lat: 12.0022, lng: 8.5919 }
    }
  ];

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

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-dhq-red rounded-full"></div>
            <span className="text-gray-400 text-sm">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Resolved</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
        {/* Simplified Nigeria Map SVG */}
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

          {/* Incident markers */}
          {incidents.map((incident) => (
            <g key={incident.id}>
              <circle
                cx={incident.lng * 40 + 50}
                cy={incident.lat * 20 + 50}
                r={getMarkerSize(incident.type)}
                fill={getMarkerColor(incident.type)}
                className="incident-marker animate-pulse-glow cursor-pointer"
                onClick={() => handleMarkerClick(incident)}
              />
              <circle
                cx={incident.lng * 40 + 50}
                cy={incident.lat * 20 + 50}
                r={getMarkerSize(incident.type) + 4}
                fill="none"
                stroke={getMarkerColor(incident.type)}
                strokeWidth="1"
                opacity="0.5"
                className="animate-ping"
              />
            </g>
          ))}
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
