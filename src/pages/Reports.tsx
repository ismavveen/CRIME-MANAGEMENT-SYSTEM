
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, Search, Download, Map } from "lucide-react";

const Reports = () => {
  // Mock data for reports
  const reports = [
    { 
      id: "REP-2023-001", 
      title: "Suspicious activity in Borno State", 
      location: "Maiduguri, Borno", 
      reportType: "Security Threat", 
      priority: "Critical",
      reportedAt: "2023-05-22 08:24",
      status: "Investigating"
    },
    { 
      id: "REP-2023-002", 
      title: "Weapons stockpile found", 
      location: "Katsina, Katsina", 
      reportType: "Intelligence", 
      priority: "High",
      reportedAt: "2023-05-21 16:40",
      status: "Verified"
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
                <tr key={report.id} className="hover:bg-gray-700/40 transition-colors cursor-pointer">
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
    </div>
  );
};

export default Reports;
