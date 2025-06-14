
import React, { useState, useMemo } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import ReportAnalytics from '../components/ReportAnalytics';
import AssignmentManagement from '../components/AssignmentManagement';
import ReportFilters from '../components/ReportFilters';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, Search, Download, Map, CheckCircle, XCircle, AlertCircle, Clock, Share2, Printer, Flag, TrendingUp, Users, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import AssignmentDialog from '../components/AssignmentDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  title: string;
  location: string;
  reportType: string;
  priority: string;
  reportedAt: string;
  status: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
  reportedBy?: string;
  assignedTo?: string;
  lastUpdated?: string;
  evidenceCount?: number;
  threat_type?: string;
  urgency?: string;
  created_at?: string;
}

const Reports = () => {
  const { reports } = useReports();
  const { assignments } = useAssignments();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [threatTypeFilter, setThreatTypeFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const { toast } = useToast();

  // Enhance reports with assignment data
  const enhancedReports = reports.map(report => {
    const assignment = assignments.find(a => a.report_id === report.id);
    return {
      ...report,
      assignment,
      isAssigned: !!assignment,
      assignmentStatus: assignment?.status || 'unassigned'
    };
  });

  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    let filtered = enhancedReports;

    // Apply main filter (from analytics cards or radio buttons)
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'pending':
          filtered = filtered.filter(r => r.status === 'pending');
          break;
        case 'assigned':
          filtered = filtered.filter(r => r.isAssigned && r.assignmentStatus !== 'resolved');
          break;
        case 'resolved':
          filtered = filtered.filter(r => r.status === 'resolved' || r.assignmentStatus === 'resolved');
          break;
      }
    }

    // Apply additional filters
    if (statusFilter !== 'all') {
      if (statusFilter === 'responded_to') {
        filtered = filtered.filter(r => r.assignmentStatus === 'responded_to');
      } else {
        filtered = filtered.filter(r => r.status === statusFilter || r.assignmentStatus === statusFilter);
      }
    }

    if (threatTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.threat_type === threatTypeFilter);
    }

    if (stateFilter !== 'all') {
      filtered = filtered.filter(r => r.state === stateFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.description?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.manual_location?.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term) ||
        r.threat_type?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [enhancedReports, selectedFilter, statusFilter, threatTypeFilter, stateFilter, searchTerm]);

  // Calculate filter counts for ReportFilters component
  const filterCounts = useMemo(() => {
    const total = enhancedReports.length;
    const resolved = enhancedReports.filter(r => r.status === 'resolved' || r.assignmentStatus === 'resolved').length;
    const unresolved = total - resolved;
    const assigned = enhancedReports.filter(r => r.isAssigned && r.assignmentStatus !== 'resolved').length;
    const unassigned = enhancedReports.filter(r => !r.isAssigned).length;
    const pending = enhancedReports.filter(r => r.status === 'pending').length;
    const responded = enhancedReports.filter(r => r.assignmentStatus === 'responded_to').length;

    return {
      total,
      resolved,
      unresolved,
      assigned,
      unassigned,
      pending,
      responded
    };
  }, [enhancedReports]);

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleStatusUpdate = (newStatus: string) => {
    toast({
      title: "Status updated",
      description: `Report ${selectedReport?.id} status changed to ${newStatus}`,
    });
    setDialogOpen(false);
  };

  const handleAssign = () => {
    setAssignDialogOpen(true);
  };

  const handleShare = () => {
    toast({
      title: "Report shared",
      description: "Report details have been shared with authorized personnel",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Report is being prepared for export",
    });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleClearFilters = () => {
    setSelectedFilter('all');
    setSearchTerm('');
    setStatusFilter('all');
    setThreatTypeFilter('all');
    setStateFilter('all');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-dhq-red text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "assigned":
      case "accepted":
        return "bg-blue-500 text-white";
      case "responded_to":
        return "bg-orange-500 text-white";
      case "resolved":
        return "bg-green-500 text-white";
      case "unassigned":
        return "bg-gray-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "assigned":
      case "accepted":
        return <Users className="h-4 w-4 mr-1" />;
      case "responded_to":
        return <Clock className="h-4 w-4 mr-1" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "unassigned":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Reports & Intelligence Center</h1>
              <p className="text-gray-400">
                Comprehensive view and analysis of incident reports and intelligence data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-dhq-blue"
                />
              </div>
              <button className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Filter className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Map className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <Download className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-dhq-blue">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics Overview
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-dhq-blue">
              <Users className="h-4 w-4 mr-2" />
              Assignment Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-dhq-blue">
              <FileText className="h-4 w-4 mr-2" />
              All Reports ({filteredReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ReportAnalytics onFilterChange={handleFilterChange} selectedFilter={selectedFilter} />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Filters */}
            <ReportFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              threatTypeFilter={threatTypeFilter}
              stateFilter={stateFilter}
              counts={filterCounts}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onThreatTypeFilterChange={setThreatTypeFilter}
              onStateFilterChange={setStateFilter}
              onClearFilters={handleClearFilters}
            />

            {/* Reports Table */}
            <div className="bg-gray-800/30 rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Report ID</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Threat Type</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignment</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reported At</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        No reports found matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => (
                      <tr 
                        key={report.id} 
                        className="hover:bg-gray-700/40 transition-colors cursor-pointer"
                        onClick={() => handleViewReport(report)}
                      >
                        <td className="py-4 px-6 whitespace-nowrap text-gray-300 font-mono">
                          {report.id.slice(0, 8)}...
                        </td>
                        <td className="py-4 px-6 text-white font-medium">
                          {report.threat_type || 'Security Report'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-gray-300">
                          {report.location || report.manual_location || 'Unknown'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <Badge className={`${getPriorityColor(report.priority || report.urgency)}`}>
                            {report.priority || report.urgency || 'Medium'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <Badge className={`${getAssignmentStatusColor(report.assignmentStatus)}`}>
                            {getStatusIcon(report.assignmentStatus)}
                            {report.assignmentStatus.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-gray-400">
                          {report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            {!report.isAssigned && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setAssignDialogOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-xs"
                              >
                                Assign
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReport(report)}
                              className="bg-transparent border-gray-600 text-gray-300 text-xs"
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - Show only if there are reports */}
            {filteredReports.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl text-white mb-2">
                    {selectedReport.threat_type || 'Security Report'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Report ID: <span className="font-mono text-dhq-blue">{selectedReport.id}</span>
                  </DialogDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={`${getPriorityColor(selectedReport.priority || selectedReport.urgency)} text-sm`}>
                    {selectedReport.priority || selectedReport.urgency || 'Medium'} Priority
                  </Badge>
                  <Badge className={`${getAssignmentStatusColor(selectedReport.assignmentStatus)} text-sm`}>
                    {selectedReport.assignmentStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-gray-900/60 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedReport.description}</p>
                </div>
                
                <div className="bg-gray-900/60 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-3">Status History</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(selectedReport.status)}
                        <span className="text-white">{selectedReport.status}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{selectedReport.lastUpdated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-white">Reported</span>
                      </div>
                      <span className="text-gray-400 text-sm">{selectedReport.reportedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/60 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Evidence</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{selectedReport.evidenceCount || 0} items</span>
                    <Button variant="outline" size="sm" className="bg-transparent border-gray-600 text-gray-300">
                      View All
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-900/60 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{selectedReport.location || selectedReport.manual_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{selectedReport.threat_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">State:</span>
                      <span className="text-white">{selectedReport.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Assigned to:</span>
                      <span className="text-white">{selectedReport.assignedTo || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Actions</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleStatusUpdate("Resolved")} 
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate("Investigating")} 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                    </div>
                    <Button 
                      onClick={handleAssign} 
                      variant="outline" 
                      className="w-full bg-transparent border-gray-600 text-gray-300"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Assign to Unit
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={handleShare} 
                        variant="outline" 
                        className="bg-transparent border-gray-600 text-gray-300"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        onClick={handleExport} 
                        variant="outline" 
                        className="bg-transparent border-gray-600 text-gray-300"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-end mt-6">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="bg-transparent border-gray-600 text-gray-300"
              >
                Close
              </Button>
              {!selectedReport.isAssigned && (
                <Button 
                  onClick={handleAssign}
                  className="bg-dhq-blue hover:bg-blue-700"
                >
                  Assign to Unit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assignment Dialog */}
      <AssignmentDialog
        open={assignDialogOpen}
        reportId={selectedReport?.id}
        reportLocation={selectedReport?.location || selectedReport?.manual_location}
        reportLatitude={selectedReport?.latitude}
        reportLongitude={selectedReport?.longitude}
        onOpenChange={setAssignDialogOpen}
      />
    </div>
  );
};

export default Reports;
