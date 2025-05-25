
import React, { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, AlertTriangle, CheckCircle, Send } from 'lucide-react';

const RealTimeReports = () => {
  const { reports, loading } = useReports();
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Get the most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const filteredReports = recentReports.filter(report => {
    if (filter === 'all') return true;
    return report.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-900/30 text-green-300 border-green-700/50';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
      default:
        return 'bg-blue-900/30 text-blue-300 border-blue-700/50';
    }
  };

  const getThreatColor = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'critical':
        return 'text-red-400';
      case 'kidnapping':
      case 'armed robbery':
        return 'text-orange-400';
      case 'theft':
      case 'vandalism':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDispatchUnit = (reportId: string) => {
    setSelectedReport(reportId);
    // Add dispatch logic here
    console.log('Dispatching unit for report:', reportId);
  };

  return (
    <div className="dhq-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white dhq-heading">Real-Time Reports</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
              <span className="text-green-400 text-sm font-semibold dhq-caption uppercase">LIVE</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.location.reload()}
          >
            <Send className="h-4 w-4 mr-2" />
            Dispatch Response Unit
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-gray-700/50 text-gray-300 font-semibold dhq-caption uppercase tracking-wider">
          <div className="col-span-1">ID</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Threat</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Filter</div>
          <div className="col-span-1">Action</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No reports found matching the current filter.
            </div>
          ) : (
            filteredReports.map((report, index) => (
              <div 
                key={report.id} 
                className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors cursor-pointer ${
                  selectedReport === report.id ? 'bg-blue-900/20' : ''
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="col-span-1 text-white font-mono text-sm">
                  {report.id.slice(0, 4)}
                </div>
                
                <div className="col-span-2 text-gray-300 text-sm">
                  {formatTime(report.created_at)}
                </div>
                
                <div className="col-span-2 text-gray-300 text-sm flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-cyan-400" />
                  {report.location || report.manual_location || 'Unknown'}
                </div>
                
                <div className={`col-span-2 text-sm font-medium ${getThreatColor(report.threat_type)}`}>
                  {report.threat_type || 'Security Incident'}
                </div>
                
                <div className="col-span-2">
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(report.status)} flex items-center space-x-1`}>
                    {getStatusIcon(report.status)}
                    <span>{report.status || 'Pending'}</span>
                  </Badge>
                </div>
                
                <div className="col-span-2">
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(report.status)}`}>
                    {report.status || 'Pending'}
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  {report.status !== 'resolved' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-6 px-2 text-xs bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatchUnit(report.id);
                      }}
                    >
                      Dispatch
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <h4 className="text-white font-semibold mb-2">Report Details - ID: {selectedReport.slice(0, 8)}</h4>
          {(() => {
            const report = reports.find(r => r.id === selectedReport);
            return report ? (
              <div className="text-gray-300 text-sm space-y-2">
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.location || report.manual_location}</p>
                <p><strong>Urgency:</strong> {report.urgency || report.priority}</p>
                <p><strong>Reported:</strong> {new Date(report.created_at).toLocaleString()}</p>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default RealTimeReports;
