import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { useReports, Report } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ReportDetailsModal from './ReportDetailsModal';

interface ResolutionReport {
  id: string;
  report_id: string;
  resolution_notes: string;
  witness_info?: string;
  resolution_evidence?: any[];
  submitted_by: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'changes_requested';
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const AdminReviewPanel: React.FC = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { auditLogs, fetchAuditLogs } = useAuditLogs();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [filters, setFilters] = useState({
    state: 'all',
    priority: 'all',
    status: 'all'
  });
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];
  const filteredStates = nigerianStates.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const [modalReport, setModalReport] = useState<Report | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleApproveReport = async (report: Report) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      // Log the approval action
      await supabase.from('audit_logs').insert({
        action_type: 'report_approved',
        entity_type: 'report',
        entity_id: report.id,
        actor_type: 'admin',
        severity_level: 'info',
        details: 'Report approved by admin',
        is_sensitive: false
      });

      toast({
        title: "Report Approved",
        description: "The report has been successfully approved.",
        variant: "default",
      });

      // Refresh data
      fetchAuditLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectReport = async (report: Report, reason: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id);

      if (error) throw error;

      // Log the rejection action
      await supabase.from('audit_logs').insert({
        action_type: 'report_rejected',
        entity_type: 'report',
        entity_id: report.id,
        actor_type: 'admin',
        severity_level: 'warning',
        details: `Report rejected. Reason: ${reason}`,
        is_sensitive: false
      });

      toast({
        title: "Report Rejected",
        description: "The report has been rejected.",
        variant: "default",
      });

      // Refresh data
      fetchAuditLogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApproveModalReport = async () => {
    if (!modalReport) return;
    await handleApproveReport(modalReport);
    setModalReport(null);
  };

  const handleRejectModalReport = async () => {
    if (!modalReport || !rejectNote.trim()) return;
    setIsRejecting(true);
    await handleRejectReport(modalReport, rejectNote);
    setIsRejecting(false);
    setRejectNote('');
    setModalReport(null);
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.threat_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = filters.state === 'all' || report.state === filters.state;
    const matchesPriority = filters.priority === 'all' || report.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    
    return matchesSearch && matchesState && matchesPriority && matchesStatus;
  });

  if (reportsLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          Admin Review Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900/50 border-gray-700"
              />
            </div>
            <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
              <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent 
                className="bg-gray-800 border-gray-700 max-h-[350px] overflow-y-auto"
                position="popper"
                sideOffset={5}
                align="start"
              >
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-2 z-10">
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={e => setStateSearch(e.target.value)}
                    placeholder="Search state..."
                    className="w-full px-2 py-1 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 p-2">
                  <SelectItem value="all" className="text-cyan-400 hover:bg-gray-700 focus:bg-gray-700">
                    All States
                  </SelectItem>
                  {filteredStates.length === 0 ? (
                    <div className="text-gray-400 text-center py-2">No states found</div>
                  ) : (
                    filteredStates.map(state => (
                      <SelectItem key={state} value={state} className="hover:bg-gray-700 focus:bg-gray-700">
                        {state}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-700">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="changes_requested">Changes Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const assignment = assignments.find(a => a.report_id === report.id);
              return (
                <div key={report.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <h4 className="font-medium text-white">{report.threat_type}</h4>
                    </div>
                    <Badge className={`${getPriorityColor(report.priority)} border`}>
                      {report.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{report.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{report.location || report.manual_location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={
                        report.status === 'approved' 
                          ? 'border-green-500 text-green-300'
                          : report.status === 'rejected'
                          ? 'border-red-500 text-red-300'
                          : 'border-blue-500 text-blue-300'
                      }>
                        {report.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Review Button for pending reports */}
                  {report.status === 'pending' && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-cyan-400 border-cyan-600 hover:bg-cyan-900/50"
                        onClick={() => setModalReport(report)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="flex justify-end mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-blue-400 border-blue-600 hover:bg-blue-900/50"
                      onClick={() => setSelectedReport(report)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Logs */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Audit Logs</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-gray-900/30 border border-gray-700 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-300">{log.action_type}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.severity_level}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {log.actor_type}: {log.actor_id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Review Modal */}
      {modalReport && (
        <ReportDetailsModal
          report={modalReport}
          onClose={() => {
            setModalReport(null);
            setRejectNote('');
          }}
        >
          {/* Evidence, resolution notes, status updates can be shown in ReportDetailsModal */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-400 border-green-600 hover:bg-green-900/50"
                onClick={handleApproveModalReport}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-400 border-red-600 hover:bg-red-900/50"
                onClick={() => setIsRejecting(true)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
            {/* Show rejection note input if rejecting */}
            {isRejecting && (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  className="w-full p-2 rounded bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter rejection note (required)"
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400 border-red-600 hover:bg-red-900/50"
                    disabled={!rejectNote.trim()}
                    onClick={handleRejectModalReport}
                  >
                    Submit Rejection
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setIsRejecting(false); setRejectNote(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ReportDetailsModal>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </Card>
  );
};

export default AdminReviewPanel; 