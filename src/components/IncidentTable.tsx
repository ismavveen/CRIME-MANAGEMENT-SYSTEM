
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  location: string;
  status: 'critical' | 'warning' | 'resolved' | 'investigating';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  officer: string;
}

const IncidentTable = () => {
  const incidents: Incident[] = [
    {
      id: 'INC-001',
      type: 'Armed Robbery',
      location: 'Lagos State, Victoria Island',
      status: 'critical',
      timestamp: '2024-01-20 14:30',
      priority: 'high',
      officer: 'Lt. Col. Johnson'
    },
    {
      id: 'INC-002',
      type: 'Suspicious Activity',
      location: 'FCT, Wuse District',
      status: 'investigating',
      timestamp: '2024-01-20 12:15',
      priority: 'medium',
      officer: 'Maj. Williams'
    },
    {
      id: 'INC-003',
      type: 'Border Security',
      location: 'Borno State, Mai Duguri',
      status: 'critical',
      timestamp: '2024-01-20 09:45',
      priority: 'high',
      officer: 'Col. Ahmed'
    },
    {
      id: 'INC-004',
      type: 'Civil Unrest',
      location: 'Rivers State, Port Harcourt',
      status: 'resolved',
      timestamp: '2024-01-19 16:20',
      priority: 'medium',
      officer: 'Capt. Okafor'
    },
    {
      id: 'INC-005',
      type: 'Kidnapping',
      location: 'Kaduna State, Zaria',
      status: 'warning',
      timestamp: '2024-01-19 11:30',
      priority: 'high',
      officer: 'Maj. Bello'
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
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
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
                    <button className="text-dhq-blue hover:text-blue-400 text-sm">
                      View
                    </button>
                    <button className="text-gray-400 hover:text-gray-300 text-sm">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentTable;
