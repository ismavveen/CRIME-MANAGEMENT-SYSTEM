
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import IncidentDetailsDialog from './IncidentDetailsDialog';
import { DetailedIncident } from '@/types/incidents';

const IncidentTable = () => {
  const [selectedIncident, setSelectedIncident] = useState<DetailedIncident | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample incident data with enhanced details
  const incidents: DetailedIncident[] = [
    {
      id: 'INC-001',
      type: 'Armed Robbery',
      location: 'Lagos State, Victoria Island',
      status: 'critical',
      timestamp: '2024-01-20 14:30',
      priority: 'high',
      officer: 'Lt. Col. Johnson',
      description: 'Armed individuals reported at First Bank branch on Kofo Abayomi Street. Multiple suspects, potentially armed with automatic weapons. Hostages reported inside.',
      coordinates: { lat: 6.4281, lng: 3.4219 },
      updates: [
        {
          time: '2024-01-20 14:35',
          message: 'Tactical team dispatched to location, ETA 5 minutes.',
          author: 'Dispatch Officer'
        },
        {
          time: '2024-01-20 14:40',
          message: 'Perimeter established around target location. Negotiation team on standby.',
          author: 'Capt. Williams'
        }
      ]
    },
    {
      id: 'INC-002',
      type: 'Suspicious Activity',
      location: 'FCT, Wuse District',
      status: 'investigating',
      timestamp: '2024-01-20 12:15',
      priority: 'medium',
      officer: 'Maj. Williams',
      description: 'Multiple reports of suspicious packages left unattended near government buildings. Bomb squad has been alerted and is conducting assessment.',
      coordinates: { lat: 9.0765, lng: 7.4912 }
    },
    {
      id: 'INC-003',
      type: 'Border Security',
      location: 'Borno State, Mai Duguri',
      status: 'critical',
      timestamp: '2024-01-20 09:45',
      priority: 'high',
      officer: 'Col. Ahmed',
      description: 'Reports of unauthorized border crossings with potential weapons trafficking. Surveillance indicates 3-5 vehicles involved.',
      coordinates: { lat: 11.8469, lng: 13.1571 }
    },
    {
      id: 'INC-004',
      type: 'Civil Unrest',
      location: 'Rivers State, Port Harcourt',
      status: 'resolved',
      timestamp: '2024-01-19 16:20',
      priority: 'medium',
      officer: 'Capt. Okafor',
      description: 'Demonstration escalated to violence near government buildings. Riot police deployed and situation now contained.',
      coordinates: { lat: 4.8156, lng: 7.0498 },
      updates: [
        {
          time: '2024-01-19 17:30',
          message: 'Situation contained, 15 arrests made. Minor injuries reported.',
          author: 'Capt. Okafor'
        }
      ]
    },
    {
      id: 'INC-005',
      type: 'Kidnapping',
      location: 'Kaduna State, Zaria',
      status: 'warning',
      timestamp: '2024-01-19 11:30',
      priority: 'high',
      officer: 'Maj. Bello',
      description: 'Foreign national working with NGO reported missing. Last known location was near the university. Ransom demand received.',
      coordinates: { lat: 11.1093, lng: 7.7210 }
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/20 text-dhq-red border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'investigating':
        return 'bg-blue-500/20 text-dhq-blue border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-dhq-red';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleIncidentClick = (incident: DetailedIncident) => {
    setSelectedIncident(incident);
    setIsDialogOpen(true);
  };

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Incidents</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Officer</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr 
                key={incident.id} 
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                onClick={() => handleIncidentClick(incident)}
              >
                <td className="py-4 px-4">
                  <span className="text-dhq-blue font-mono text-sm">{incident.id}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white font-medium">{incident.type}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{incident.location}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${getPriorityColor(incident.priority)}`}>
                    {incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock size={14} />
                    <span className="text-sm">{incident.timestamp}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{incident.officer}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button 
                      className="text-dhq-blue hover:text-blue-400 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncidentClick(incident);
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-gray-400 hover:text-gray-300 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incident details dialog */}
      <IncidentDetailsDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        incident={selectedIncident}
      />
    </div>
  );
};

export default IncidentTable;
