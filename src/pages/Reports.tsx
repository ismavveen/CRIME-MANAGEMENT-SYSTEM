import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, Search, Download, Map, CheckCircle, XCircle, AlertCircle, Clock, Share2, Printer, Flag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
}

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for reports
  const reports: Report[] = [
    { 
      id: "REP-2023-001", 
      title: "Suspicious activity in Borno State", 
      location: "Maiduguri, Borno", 
      reportType: "Security Threat", 
      priority: "Critical",
      reportedAt: "2023-05-22 08:24",
      status: "Investigating",
      description: "Multiple individuals spotted surveying military checkpoint locations over the past 48 hours. Behavior indicates possible planning for coordinated attack.",
      coordinates: { lat: 11.8469, lng: 13.1571 },
      reportedBy: "Anonymous Source",
      assignedTo: "Col. Ibrahim Mohammed",
      lastUpdated: "2023-05-22 10:30",
      evidenceCount: 3
    },
    { 
      id: "REP-2023-002", 
      title: "Weapons stockpile found", 
      location: "Katsina, Katsina", 
      reportType: "Intelligence", 
      priority: "High",
      reportedAt: "2023-05-21 16:40",
      status: "Verified",
      description: "Cache of weapons discovered in abandoned warehouse. Includes approximately 24 assault rifles and explosives. Location secured.",
      coordinates: { lat: 12.9982, lng: 7.6094 },
      reportedBy: "Lt. Ahmed Yusuf",
      assignedTo: "Maj. Abubakar Sani",
      lastUpdated: "2023-05-22 09:15",
      evidenceCount: 7
    },
    { 
      id: "REP-2023-003", 
      title: "Vandalism of public property", 
      location: "Ikeja, Lagos", 
      reportType: "Criminal Activity", 
      priority: "Medium",
      reportedAt: "2023-05-21 09:15",
      status: "Resolved"
    },
    { 
      id: "REP-2023-004", 
      title: "Unauthorized checkpoint", 
      location: "Owerri, Imo", 
      reportType: "Security Concern", 
      priority: "High",
      reportedAt: "2023-05-20 23:10",
      status: "Dispatched"
    },
    { 
      id: "REP-2023-005", 
      title: "Suspected trafficking operation", 
      location: "Calabar, Cross River", 
      reportType: "Intelligence", 
      priority: "High",
      reportedAt: "2023-05-20 19:32",
      status: "Investigating"
    },
    { 
      id: "REP-2023-006", 
      title: "Community conflict escalation", 
      location: "Jos, Plateau", 
      reportType: "Civil Unrest", 
      priority: "High",
      reportedAt: "2023-05-19 14:58",
      status: "Monitoring"
    },
    { 
      id: "REP-2023-007", 
      title: "Drug related activity", 
      location: "Kaduna, Kaduna", 
      reportType: "Criminal Activity", 
      priority: "Medium",
      reportedAt: "2023-05-19 11:23",
      status: "Verified"
    },
    { 
      id: "REP-2023-008", 
      title: "Counterfeit document operation", 
      location: "Port Harcourt, Rivers", 
      reportType: "Criminal Activity", 
      priority: "Low",
      reportedAt: "2023-05-18 08:40",
      status: "Resolved"
    }
  ];

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleStatusUpdate = (newStatus: string) => {
    // In a real implementation, this would update the backend
    toast({
      title: "Status updated",
      description: `Report ${selectedReport?.id} status changed to ${newStatus}`,
    });
    setDialogOpen(false);
  };

  const handleAssign = () => {
    toast({
      title: "Assignment action triggered",
      description: "This would open an assignment dialog in a full implementation",
    });
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "investigating":
        return "bg-blue-500 text-white";
      case "verified":
        return "bg-purple-500 text-white";
      case "dispatched":
        return "bg-orange-500 text-white";
      case "monitoring":
        return "bg-yellow-500 text-black";
      case "resolved":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "investigating":
        return <Clock className="h-4 w-4 mr-1" />;
      case "verified":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "dispatched":
        return <Share2 className="h-4 w-4 mr-1" />;
      case "monitoring":
        return <AlertCircle className="h-4 w-4 mr-1" />;
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
              <h1 className="text-3xl font-bold text-white mb-2">Reports & Intelligence</h1>
              <p className="text-gray-400">
                View and analyze incident reports and intelligence data
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

        {/* Reports Table */}
        <div className="bg-gray-800/30 rounded-lg shadow-lg overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Report ID</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reported At</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {reports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-gray-700/40 transition-colors cursor-pointer"
                  onClick={() => handleViewReport(report)}
                >
                  <td className="py-4 px-6 whitespace-nowrap text-gray-300 font-mono">
                    {report.id}
                  </td>
                  <td className="py-4 px-6 text-white font-medium">
                    {report.title}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-300">
                    {report.location}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-300">
                    {report.reportType}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <Badge className={`${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-400">
                    {report.reportedAt}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <Badge className={`${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl text-white mb-2">{selectedReport.title}</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Report ID: <span className="font-mono text-dhq-blue">{selectedReport.id}</span>
                  </DialogDescription>
                </div>
                <Badge className={`${getPriorityColor(selectedReport.priority)} text-sm`}>
                  {selectedReport.priority} Priority
                </Badge>
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
                    <span className="text-gray-300">{selectedReport.evidenceCount} items</span>
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
                      <span className="text-white">{selectedReport.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{selectedReport.reportType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reported by:</span>
                      <span className="text-white">{selectedReport.reportedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Assigned to:</span>
                      <span className="text-white">{selectedReport.assignedTo}</span>
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Reports;
