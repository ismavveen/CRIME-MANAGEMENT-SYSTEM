
import React from 'react';
import { Clock } from 'lucide-react';
import { Report } from '@/hooks/useReports';
import { Badge } from '@/components/ui/badge';

interface IncidentTableProps {
  reports: Report[];
  onIncidentClick: (report: Report) => void;
}

const IncidentTable: React.FC<IncidentTableProps> = ({ reports, onIncidentClick }) => {

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-dhq-blue border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
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
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Serial No.</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Priority</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Assigned To</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 10).map((report) => (
              <tr 
                key={report.id} 
                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                onClick={() => onIncidentClick(report)}
              >
                <td className="py-4 px-4">
                  <span className="text-dhq-blue font-mono text-sm">{report.serial_number || `REP-${report.id.slice(0, 4).toUpperCase()}`}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white font-medium">{report.threat_type}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{report.state}, {report.local_government}</span>
                </td>
                <td className="py-4 px-4">
                  <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${getPriorityColor(report.priority)}`}>
                    {(report.priority || 'low').charAt(0).toUpperCase() + (report.priority || 'low').slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock size={14} />
                    <span className="text-sm">{new Date(report.created_at).toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{report.assigned_to || 'Unassigned'}</span>
                </td>
                <td className="py-4 px-4">
                  <button 
                    className="text-dhq-blue hover:text-blue-400 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIncidentClick(report);
                    }}
                  >
                    View
                  </button>
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

