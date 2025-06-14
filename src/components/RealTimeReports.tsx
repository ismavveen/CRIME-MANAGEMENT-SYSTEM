import React, { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, AlertTriangle, CheckCircle, Send, ExternalLink, FileText, Image, Video, History } from 'lucide-react';
import DispatchModal from './DispatchModal';
import ReportAuditModal from './ReportAuditModal';

const RealTimeReports = () => {
  const { reports, loading, refetch } = useReports();
  const { logReportAccess } = useAuditLogs();
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [reportToDispatch, setReportToDispatch] = useState<any>(null);
  const [reportForAudit, setReportForAudit] = useState<any>(null);

  // Get the most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15);

  const filteredReports = recentReports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'external') return report.submission_source === 'external_portal';
    return report.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'assigned':
        return <Clock className="h-4 w-4 text-blue-400" />;
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
      case 'assigned':
        return 'bg-blue-900/30 text-blue-300 border-blue-700/50';
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

  const getSubmissionSourceBadge = (source: string) => {
    if (source === 'external_portal') {
      return (
        <Badge className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 border-purple-700/50 flex items-center space-x-1">
          <ExternalLink className="w-3 h-3" />
          <span>External</span>
        </Badge>
      );
    }
    return null;
  };

  const getMediaCount = (report: any) => {
    const images = report.images?.length || 0;
    const videos = report.videos?.length || 0;
    const documents = report.documents?.length || 0;
    
    if (images + videos + documents === 0) return null;
    
    return (
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        {images > 0 && (
          <div className="flex items-center space-x-1">
            <Image className="w-3 h-3" />
            <span>{images}</span>
          </div>
        )}
        {videos > 0 && (
          <div className="flex items-center space-x-1">
            <Video className="w-3 h-3" />
            <span>{videos}</span>
          </div>
        )}
        {documents > 0 && (
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{documents}</span>
          </div>
        )}
      </div>
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleDispatchClick = (report: any) => {
    setReportToDispatch(report);
    setDispatchModalOpen(true);
  };

  const handleAssignmentComplete = () => {
    refetch();
  };

  const handleReportSelection = async (reportId: string) => {
    setSelectedReport(reportId);
    
    // Log the report access
    const report = reports.find(r => r.id === reportId);
    if (report) {
      await logReportAccess(
        reportId, 
        'view', 
        undefined, 
        { section: 'report_details' }, 
        'Administrative review'
      );
    }
  };

  const handleAuditClick = (report: any) => {
    setReportForAudit(report);
    setAuditModalOpen(true);
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
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="external">External Portal</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-gray-700/50 text-gray-300 font-semibold dhq-caption uppercase tracking-wider">
          <div className="col-span-1">Serial</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Threat</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1">Media</div>
          <div className="col-span-2">Action</div>
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
                } ${report.submission_source === 'external_portal' ? 'border-l-4 border-l-purple-500' : ''}`}
                onClick={() => handleReportSelection(report.id)}
              >
                <div className="col-span-1 text-white font-mono text-xs">
                  {report.serial_number || `CRP-${report.id.slice(0, 3)}`}
                </div>
                
                <div className="col-span-1 text-gray-300 text-xs">
                  {formatTime(report.created_at)}
                </div>
                
                <div className="col-span-2 text-gray-300 text-xs flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-cyan-400" />
                  <span className="truncate">{report.state || report.location || 'Unknown'}</span>
                </div>
                
                <div className={`col-span-2 text-xs font-medium ${getThreatColor(report.threat_type)} truncate`}>
                  {report.threat_type || 'Security Incident'}
                </div>
                
                <div className="col-span-1">
                  {getSubmissionSourceBadge(report.submission_source || 'internal')}
                </div>
                
                <div className="col-span-1">
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(report.status)} flex items-center space-x-1`}>
                    {getStatusIcon(report.status)}
                    <span className="truncate">{report.status || 'Pending'}</span>
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  <Badge className={`text-xs px-2 py-1 ${
                    report.priority === 'high' || report.urgency === 'critical'
                      ? 'bg-red-900/30 text-red-300 border-red-700/50'
                      : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                  }`}>
                    {report.priority || report.urgency || 'Medium'}
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  {getMediaCount(report)}
                </div>
                
                <div className="col-span-2 flex space-x-1">
                  {report.status !== 'resolved' && report.status !== 'assigned' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-6 px-2 text-xs bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDispatchClick(report);
                      }}
                    >
                      Dispatch
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-6 px-2 text-xs bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuditClick(report);
                    }}
                  >
                    <History className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Report Details */}
      {selectedReport && (
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold">
              Report Details - Serial: {reports.find(r => r.id === selectedReport)?.serial_number || 'Not assigned'}
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const report = reports.find(r => r.id === selectedReport);
                if (report) handleAuditClick(report);
              }}
              className="border-purple-500 text-purple-300 hover:bg-purple-600/20"
            >
              <History className="h-4 w-4 mr-2" />
              View Audit Trail
            </Button>
          </div>
          {(() => {
            const report = reports.find(r => r.id === selectedReport);
            return report ? (
              <div className="text-gray-300 text-sm space-y-2">
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.full_address || report.location || report.manual_location}</p>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>State:</strong> {report.state}</p>
                  <p><strong>LGA:</strong> {report.local_government}</p>
                  <p><strong>Urgency:</strong> {report.urgency || report.priority}</p>
                  <p><strong>Source:</strong> {report.submission_source || 'Internal'}</p>
                </div>
                <p><strong>Reported:</strong> {new Date(report.created_at).toLocaleString()}</p>
                {!report.is_anonymous && report.reporter_name && (
                  <p><strong>Reporter:</strong> {report.reporter_name}</p>
                )}
                {(report.images?.length || report.videos?.length || report.documents?.length) && (
                  <p><strong>Evidence:</strong> 
                    {report.images?.length || 0} image(s), 
                    {report.videos?.length || 0} video(s), 
                    {report.documents?.length || 0} document(s)
                  </p>
                )}
                {report.validation_status && (
                  <p><strong>Validation Status:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${
                      report.validation_status === 'validated' ? 'bg-green-900/30 text-green-300' :
                      report.validation_status === 'rejected' ? 'bg-red-900/30 text-red-300' :
                      'bg-yellow-900/30 text-yellow-300'
                    }`}>
                      {report.validation_status}
                    </span>
                  </p>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Dispatch Modal */}
      <DispatchModal
        open={dispatchModalOpen}
        onOpenChange={setDispatchModalOpen}
        report={reportToDispatch}
        onAssignmentComplete={handleAssignmentComplete}
      />

      {/* Audit Modal */}
      <ReportAuditModal
        open={auditModalOpen}
        onOpenChange={setAuditModalOpen}
        reportId={reportForAudit?.id || ''}
        reportTitle={reportForAudit?.description || reportForAudit?.threat_type}
      />
    </div>
  );
};

export default RealTimeReports;
