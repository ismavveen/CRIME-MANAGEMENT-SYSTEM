import React, { useState, useEffect } from 'react';
import { useReports, Report } from '@/hooks/useReports';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, AlertTriangle, CheckCircle, Send, FileText, History, Shield } from 'lucide-react';
import DispatchModal from './DispatchModal';
import ReportAuditModal from './ReportAuditModal';

interface RealTimeReportsProps {
  reportsData?: Report[];
  isLoading?: boolean;
  onRefetch?: () => void;
}

const RealTimeReports = ({ reportsData, isLoading, onRefetch }: RealTimeReportsProps) => {
  const { reports: fetchedReports, loading: fetchedLoading, refetch: fetchedRefetch } = useReports();
  const { logReportAccess } = useAuditLogs();
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [reportToDispatch, setReportToDispatch] = useState<Report | null>(null);
  const [reportForAudit, setReportForAudit] = useState<Report | null>(null);

  const reports = reportsData ?? fetchedReports;
  const loading = isLoading ?? fetchedLoading;
  const refetch = onRefetch ?? fetchedRefetch;

  // Get the most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15);

  const filteredReports = recentReports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return report.urgency === 'critical' || report.priority === 'high';
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

  const getUrgencyColor = (urgency: string, priority: string) => {
    const level = urgency || priority;
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-900/30 text-red-300 border-red-700/50 animate-pulse';
      case 'medium':
        return 'bg-orange-900/30 text-orange-300 border-orange-700/50';
      default:
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleQuickDispatch = (report: Report) => {
    setReportToDispatch(report);
    setDispatchModalOpen(true);
  };

  const handleAssignmentComplete = () => {
    if (refetch) {
      refetch();
    }
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

  const handleAuditClick = (report: Report) => {
    setReportForAudit(report);
    setAuditModalOpen(true);
  };

  return (
    <div className="dhq-card p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white dhq-heading">Live Crime Reports</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
              <span className="text-green-400 text-sm font-semibold dhq-caption uppercase">LIVE</span>
            </div>
          </div>
          <Badge className="bg-blue-900/30 text-blue-300 border-blue-700/50 px-3 py-1">
            {filteredReports.length} Active Reports
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600 text-gray-200 focus:ring-cyan-500">
              <SelectValue placeholder="Filter Reports" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-gray-200">
              <SelectItem value="all" className="data-[highlighted]:bg-gray-700">All Reports ({recentReports.length})</SelectItem>
              <SelectItem value="urgent" className="text-red-300 data-[highlighted]:bg-red-900/40 data-[highlighted]:text-red-100">Urgent/Critical</SelectItem>
              <SelectItem value="pending" className="text-yellow-300 data-[highlighted]:bg-yellow-900/40 data-[highlighted]:text-yellow-100">Pending Action</SelectItem>
              <SelectItem value="assigned" className="text-blue-300 data-[highlighted]:bg-blue-900/40 data-[highlighted]:text-blue-100">Assigned</SelectItem>
              <SelectItem value="resolved" className="text-green-300 data-[highlighted]:bg-green-900/40 data-[highlighted]:text-green-100">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Reports Grid */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800/50 border-b border-gray-700/50 text-gray-300 font-semibold dhq-caption uppercase tracking-wider">
          <div className="col-span-2">Time</div>
          <div className="col-span-4">Location</div>
          <div className="col-span-2">Threat Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-center">Quick Actions</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading reports...
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p className="text-lg font-medium">No reports found</p>
              <p className="text-sm">Try adjusting your filter or check back later</p>
            </div>
          ) : (
            filteredReports.map((report, index) => (
              <div 
                key={report.id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-200 cursor-pointer ${
                  selectedReport === report.id ? 'bg-blue-900/20 border-l-4 border-l-blue-400' : ''
                } ${
                  (report.urgency === 'critical' || report.priority === 'high') ? 'border-l-4 border-l-red-500' : ''
                }`}
                onClick={() => handleReportSelection(report.id)}
              >
                <div className="col-span-2 text-gray-300 text-xs">
                  <div className="font-medium">{formatTime(report.created_at)}</div>
                  <div className="text-gray-400">
                    {formatDate(report.created_at)}
                  </div>
                </div>
                
                <div className="col-span-4 text-gray-300 text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    <span className="font-medium truncate">{report.state || 'Unknown State'}</span>
                  </div>
                  <div className="text-gray-400 truncate">
                    {report.local_government || report.location || 'Location pending'}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className={`text-xs font-medium ${getThreatColor(report.threat_type)}`}>
                    {report.threat_type || 'Security Incident'}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(report.status)} flex items-center space-x-1`}>
                    {getStatusIcon(report.status)}
                    <span className="truncate">{report.status || 'Pending'}</span>
                  </Badge>
                </div>
                
                <div className="col-span-2 flex space-x-1 justify-center">
                  {report.status !== 'resolved' && report.status !== 'assigned' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 px-3 text-xs bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30 flex items-center space-x-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickDispatch(report);
                      }}
                    >
                      <Send className="h-3 w-3" />
                      <span>Dispatch</span>
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 text-xs bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30"
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

      {selectedReport && (
        <div className="mt-6 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              <span>Report Details - Serial: {reports.find(r => r.id === selectedReport)?.serial_number || 'Not assigned'}</span>
            </h4>
            <div className="flex space-x-2">
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
              {(() => {
                const report = reports.find(r => r.id === selectedReport);
                return report && report.status !== 'resolved' && report.status !== 'assigned' ? (
                  <Button
                    size="sm"
                    onClick={() => handleQuickDispatch(report)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Quick Dispatch
                  </Button>
                ) : null;
              })()}
            </div>
          </div>
          {(() => {
            const report = reports.find(r => r.id === selectedReport);
            return report ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm font-medium">Incident Description</label>
                    <p className="text-gray-300 bg-gray-700/30 p-3 rounded mt-1">{report.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm font-medium">Threat Type</label>
                      <p className={`font-semibold mt-1 ${getThreatColor(report.threat_type)}`}>
                        {report.threat_type}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-medium">Priority Level</label>
                      <Badge className={`mt-1 ${getUrgencyColor(report.urgency, report.priority)}`}>
                        {report.priority || report.urgency}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm font-medium">Location Details</label>
                    <div className="bg-gray-700/30 p-3 rounded mt-1 space-y-1">
                      <p className="text-gray-300"><strong>Address:</strong> {report.full_address || report.location || report.manual_location}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="text-gray-300"><strong>State:</strong> {report.state}</p>
                        <p className="text-gray-300"><strong>LGA:</strong> {report.local_government}</p>
                      </div>
                      {report.landmark && (
                        <p className="text-gray-300"><strong>Landmark:</strong> {report.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm font-medium">Report Timeline</label>
                    <div className="bg-gray-700/30 p-3 rounded mt-1 space-y-2">
                      <p className="text-gray-300 text-sm">
                        <strong>Submitted:</strong> {new Date(report.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong>Source:</strong> {report.submission_source === 'external_portal' ? 'External Portal' : 'Internal System'}
                      </p>
                      <p className="text-gray-300 text-sm">
                        <strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(report.status)}`}>
                          {report.status}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  {!report.is_anonymous && (
                    <div>
                      <label className="text-gray-400 text-sm font-medium">Reporter Information</label>
                      <div className="bg-gray-700/30 p-3 rounded mt-1 space-y-1">
                        {report.reporter_name && (
                          <p className="text-gray-300 text-sm"><strong>Name:</strong> {report.reporter_name}</p>
                        )}
                        {report.reporter_phone && (
                          <p className="text-gray-300 text-sm"><strong>Phone:</strong> {report.reporter_phone}</p>
                        )}
                        {report.reporter_email && (
                          <p className="text-gray-300 text-sm"><strong>Email:</strong> {report.reporter_email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {report.validation_status && (
                    <div>
                      <label className="text-gray-400 text-sm font-medium">Validation Status</label>
                      <div className="mt-1">
                        <Badge className={`${
                          report.validation_status === 'validated' ? 'bg-green-900/30 text-green-300 border-green-700/50' :
                          report.validation_status === 'rejected' ? 'bg-red-900/30 text-red-300 border-red-700/50' :
                          'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                        }`}>
                          {report.validation_status.charAt(0).toUpperCase() + report.validation_status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      <DispatchModal
        open={dispatchModalOpen}
        onOpenChange={setDispatchModalOpen}
        report={reportToDispatch}
        onAssignmentComplete={handleAssignmentComplete}
      />

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
