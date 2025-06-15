import React, { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, AlertTriangle, CheckCircle, Send, ExternalLink, FileText, Image, Video, History, Users, Zap, Eye, Download, Play, Shield } from 'lucide-react';
import DispatchModal from './DispatchModal';
import ReportAuditModal from './ReportAuditModal';
import MediaViewerModal from './MediaViewerModal';

const RealTimeReports = () => {
  const { reports, loading, refetch } = useReports();
  const { logReportAccess } = useAuditLogs();
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [reportToDispatch, setReportToDispatch] = useState<any>(null);
  const [reportForAudit, setReportForAudit] = useState<any>(null);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    reportId: string;
    reportDetails?: any;
  } | null>(null);

  // Get the most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15);

  const filteredReports = recentReports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'external') return report.submission_source === 'external_portal';
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

  const getSubmissionSourceBadge = (source: string) => {
    if (source === 'external_portal') {
      return (
        <Badge className="text-xs px-2 py-1 bg-purple-900/30 text-purple-300 border-purple-700/50 flex items-center space-x-1">
          <ExternalLink className="w-3 h-3" />
          <span>External</span>
        </Badge>
      );
    }
    return (
      <Badge className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 border-blue-700/50">
        Internal
      </Badge>
    );
  };

  const getMediaCount = (report: any) => {
    const images = report.images?.length || 0;
    const videos = report.videos?.length || 0;
    const documents = report.documents?.length || 0;
    
    if (images + videos + documents === 0) return null;
    
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        {images > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-blue-600/20"
            onClick={(e) => {
              e.stopPropagation();
              handleMediaView(report.images[0], 'image', report);
            }}
          >
            <Image className="w-3 h-3 mr-1" />
            <span>{images}</span>
          </Button>
        )}
        {videos > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-green-600/20"
            onClick={(e) => {
              e.stopPropagation();
              handleMediaView(report.videos[0], 'video', report);
            }}
          >
            <Video className="w-3 h-3 mr-1" />
            <span>{videos}</span>
          </Button>
        )}
        {documents > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-yellow-600/20"
            onClick={(e) => {
              e.stopPropagation();
              handleDocumentDownload(report.documents[0], report);
            }}
          >
            <FileText className="w-3 h-3 mr-1" />
            <span>{documents}</span>
          </Button>
        )}
      </div>
    );
  };

  const handleMediaView = async (mediaUrl: string, mediaType: 'image' | 'video', report: any) => {
    // Log media access
    await logReportAccess(
      report.id,
      'media_view',
      undefined,
      { 
        media_type: mediaType,
        media_url: mediaUrl,
        section: 'evidence_viewer' 
      },
      `Viewing ${mediaType} evidence`
    );

    setSelectedMedia({
      url: mediaUrl,
      type: mediaType,
      reportId: report.id,
      reportDetails: {
        threat_type: report.threat_type,
        location: report.location || report.full_address,
        created_at: report.created_at,
        description: report.description
      }
    });
    setMediaViewerOpen(true);
  };

  const handleDocumentDownload = async (documentUrl: string, report: any) => {
    try {
      // Log document access
      await logReportAccess(
        report.id,
        'document_download',
        undefined,
        { 
          document_url: documentUrl,
          section: 'evidence_download' 
        },
        'Downloading document evidence'
      );

      // Create download link
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `evidence-${report.id}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleQuickDispatch = (report: any) => {
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
              <SelectItem value="external" className="text-purple-300 data-[highlighted]:bg-purple-900/40 data-[highlighted]:text-purple-100">External Portal</SelectItem>
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
          <div className="col-span-1">ID</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Threat Type</div>
          <div className="col-span-1">Source</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1">Evidence</div>
          <div className="col-span-2">Quick Actions</div>
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
                className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-700/30 hover:bg-gray-700/20 transition-all duration-200 cursor-pointer ${
                  selectedReport === report.id ? 'bg-blue-900/20 border-l-4 border-l-blue-400' : ''
                } ${report.submission_source === 'external_portal' ? 'border-l-4 border-l-purple-500' : ''} ${
                  (report.urgency === 'critical' || report.priority === 'high') ? 'border-l-4 border-l-red-500' : ''
                }`}
                onClick={() => handleReportSelection(report.id)}
              >
                <div className="col-span-1 text-white font-mono text-xs">
                  <div className="font-semibold">
                    {report.serial_number || `CRP-${report.id.slice(0, 3)}`}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {formatDate(report.created_at)}
                  </div>
                </div>
                
                <div className="col-span-1 text-gray-300 text-xs">
                  <div className="font-medium">{formatTime(report.created_at)}</div>
                  <div className="text-gray-400">
                    {Math.floor((Date.now() - new Date(report.created_at).getTime()) / 60000)}m ago
                  </div>
                </div>
                
                <div className="col-span-2 text-gray-300 text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    <span className="font-medium truncate">{report.state || 'Unknown State'}</span>
                  </div>
                  <div className="text-gray-400 truncate">
                    {report.local_government || report.location || 'Location pending'}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className={`text-xs font-medium ${getThreatColor(report.threat_type)} mb-1`}>
                    {report.threat_type || 'Security Incident'}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {report.description?.slice(0, 40)}...
                  </div>
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
                  <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(report.urgency, report.priority)}`}>
                    {(report.urgency === 'critical' || report.priority === 'high') && (
                      <Zap className="h-3 w-3 mr-1" />
                    )}
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

      {/* Enhanced Report Details */}
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

                  {(report.images?.length || report.videos?.length || report.documents?.length) && (
                    <div>
                      <label className="text-gray-400 text-sm font-medium">Evidence Attached</label>
                      <div className="bg-gray-700/30 p-3 rounded mt-1">
                        <div className="flex items-center space-x-4 text-sm">
                          {report.images?.length > 0 && (
                            <div className="flex items-center space-x-1 text-blue-300">
                              <Image className="h-4 w-4" />
                              <span>{report.images.length} Image(s)</span>
                            </div>
                          )}
                          {report.videos?.length > 0 && (
                            <div className="flex items-center space-x-1 text-green-300">
                              <Video className="h-4 w-4" />
                              <span>{report.videos.length} Video(s)</span>
                            </div>
                          )}
                          {report.documents?.length > 0 && (
                            <div className="flex items-center space-x-1 text-yellow-300">
                              <FileText className="h-4 w-4" />
                              <span>{report.documents.length} Document(s)</span>
                            </div>
                          )}
                        </div>
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

          {/* Enhanced Evidence Section */}
          {(() => {
            const report = reports.find(r => r.id === selectedReport);
            return report && (report.images?.length || report.videos?.length || report.documents?.length) ? (
              <div className="mt-4">
                <h4 className="text-white font-semibold text-lg flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Evidence Files (Virus Scanned)</span>
                </h4>
                
                {/* Images */}
                {report.images && report.images.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-gray-300 font-medium mb-3 flex items-center">
                      <Image className="h-4 w-4 mr-2 text-blue-400" />
                      Images ({report.images.length})
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {report.images.map((imageUrl: string, index: number) => (
                        <div 
                          key={index} 
                          className="relative group cursor-pointer bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-700/70 transition-all"
                          onClick={() => handleMediaView(imageUrl, 'image', report)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-600/80 text-white text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Safe
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {report.videos && report.videos.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-gray-300 font-medium mb-3 flex items-center">
                      <Video className="h-4 w-4 mr-2 text-green-400" />
                      Videos ({report.videos.length})
                    </h5>
                    <div className="space-y-3">
                      {report.videos.map((videoUrl: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer"
                          onClick={() => handleMediaView(videoUrl, 'video', report)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-600/20 rounded">
                              <Video className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">Video Evidence {index + 1}</p>
                              <p className="text-gray-400 text-sm">Click to play</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-600/80 text-white text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Safe
                            </Badge>
                            <Button size="sm" variant="outline" className="bg-green-600/20 border-green-500 text-green-300">
                              <Play className="w-4 h-4 mr-1" />
                              Play
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {report.documents && report.documents.length > 0 && (
                  <div>
                    <h5 className="text-gray-300 font-medium mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-yellow-400" />
                      Documents ({report.documents.length})
                    </h5>
                    <div className="space-y-3">
                      {report.documents.map((documentUrl: string, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-yellow-600/20 rounded">
                              <FileText className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">Document {index + 1}</p>
                              <p className="text-gray-400 text-sm">PDF Document</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-600/80 text-white text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Safe
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDocumentDownload(documentUrl, report)}
                              className="bg-yellow-600/20 border-yellow-500 text-yellow-300"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Enhanced Dispatch Modal */}
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

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewerModal
          isOpen={mediaViewerOpen}
          onClose={() => {
            setMediaViewerOpen(false);
            setSelectedMedia(null);
          }}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          reportId={selectedMedia.reportId}
          reportDetails={selectedMedia.reportDetails}
        />
      )}
    </div>
  );
};

export default RealTimeReports;
