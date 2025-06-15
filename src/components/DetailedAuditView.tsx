
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { 
  FileText, User, Clock, MapPin, Shield, Eye, Edit, Download, 
  History, AlertTriangle, CheckCircle, Users, Settings 
} from 'lucide-react';
import { format } from 'date-fns';

interface DetailedAuditViewProps {
  reportId?: string;
}

const DetailedAuditView = ({ reportId }: DetailedAuditViewProps) => {
  const { auditLogs, loading, fetchAuditLogs } = useAuditLogs();
  const [filters, setFilters] = useState({
    reportId: '',
    dateFrom: '',
    dateTo: '',
    threatClassification: '',
    personnel: '',
    actionType: ''
  });

  useEffect(() => {
    fetchAuditLogs({ limit: 200 });
  }, []);

  const mockDetailedReports = [
    {
      id: 'CRP-20250614-001',
      submissionDetails: {
        datetime: '2025-06-14 10:15 AM',
        submittedBy: 'Anonymous',
        ipAddress: '192.168.1.100',
        content: 'Armed robbery reported in Lagos',
        location: 'Ikeja, Lagos',
        coordinates: { lat: 6.5954, lng: 3.3364 },
        priority: 'High',
        classification: 'Banditry',
        evidence: ['image1.jpg', 'witness_statement.pdf']
      },
      statusUpdates: [
        {
          timestamp: '2025-06-14 10:30 AM',
          status: 'In Progress',
          updatedBy: 'Officer John Doe',
          serviceNumber: '12345',
          rank: 'Lieutenant',
          previousStatus: 'Pending'
        },
        {
          timestamp: '2025-06-15 09:00 AM',
          status: 'Resolved',
          updatedBy: 'Commander Jane Smith',
          serviceNumber: '67890',
          rank: 'Major',
          previousStatus: 'In Progress'
        }
      ],
      accessHistory: [
        {
          timestamp: '2025-06-14 10:20 AM',
          personnel: 'Officer John Doe',
          serviceNumber: '12345',
          rank: 'Lieutenant',
          accessType: 'Viewed',
          duration: '5 minutes'
        },
        {
          timestamp: '2025-06-14 11:00 AM',
          personnel: 'Commander Jane Smith',
          serviceNumber: '67890',
          rank: 'Major',
          accessType: 'Edited',
          duration: '12 minutes'
        }
      ],
      assignments: [
        {
          timestamp: '2025-06-14 10:35 AM',
          assignedTo: 'Officer John Doe',
          serviceNumber: '12345',
          rank: 'Lieutenant',
          assignedBy: 'Commander Jane Smith'
        }
      ],
      modifications: [
        {
          timestamp: '2025-06-14 11:05 AM',
          fieldChanged: 'Priority Level',
          beforeValue: 'High',
          afterValue: 'Critical',
          modifiedBy: 'Commander Jane Smith',
          serviceNumber: '67890',
          reason: 'Additional intelligence received'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'viewed': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'edited': return <Edit className="h-4 w-4 text-orange-400" />;
      case 'downloaded': return <Download className="h-4 w-4 text-green-400" />;
      default: return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  const exportDetailedLog = (reportData: any) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Report ID,Event Type,Timestamp,Personnel,Service Number,Rank,Details\n" +
      `${reportData.id},Submission,${reportData.submissionDetails.datetime},${reportData.submissionDetails.submittedBy},N/A,N/A,"${reportData.submissionDetails.content}"\n` +
      reportData.statusUpdates.map((update: any) => 
        `${reportData.id},Status Update,${update.timestamp},${update.updatedBy},${update.serviceNumber},${update.rank},"${update.previousStatus} → ${update.status}"`
      ).join('\n') + '\n' +
      reportData.accessHistory.map((access: any) => 
        `${reportData.id},Access,${access.timestamp},${access.personnel},${access.serviceNumber},${access.rank},"${access.accessType} for ${access.duration}"`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `detailed_audit_${reportData.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>Detailed Audit Log Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Input
              placeholder="Report ID..."
              value={filters.reportId}
              onChange={(e) => setFilters(prev => ({ ...prev, reportId: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="date"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Input
              type="date"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Select value={filters.threatClassification} onValueChange={(value) => setFilters(prev => ({ ...prev, threatClassification: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Threat Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="banditry">Banditry</SelectItem>
                <SelectItem value="kidnapping">Kidnapping</SelectItem>
                <SelectItem value="terrorism">Terrorism</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Personnel Name..."
              value={filters.personnel}
              onChange={(e) => setFilters(prev => ({ ...prev, personnel: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Select value={filters.actionType} onValueChange={(value) => setFilters(prev => ({ ...prev, actionType: value }))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="submission">Submission</SelectItem>
                <SelectItem value="status_update">Status Update</SelectItem>
                <SelectItem value="access">Access</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Report Logs */}
      <div className="space-y-6">
        {mockDetailedReports.map((report) => (
          <Card key={report.id} className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  <span>Report ID: {report.id}</span>
                  <Badge className="bg-red-900/30 text-red-300 border-red-700/50">
                    {report.submissionDetails.classification}
                  </Badge>
                  <Badge className="bg-orange-900/30 text-orange-300 border-orange-700/50">
                    {report.submissionDetails.priority} Priority
                  </Badge>
                </CardTitle>
                <Button 
                  onClick={() => exportDetailedLog(report)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="submission" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-700">
                  <TabsTrigger value="submission">Submission</TabsTrigger>
                  <TabsTrigger value="status">Status Updates</TabsTrigger>
                  <TabsTrigger value="access">Access History</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="modifications">Modifications</TabsTrigger>
                </TabsList>

                {/* Submission Details */}
                <TabsContent value="submission" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span>Submission Details</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date/Time:</span>
                            <span className="text-white">{report.submissionDetails.datetime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Submitted by:</span>
                            <span className="text-white">{report.submissionDetails.submittedBy}</span>
                          </div>
                          {report.submissionDetails.ipAddress && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">IP Address:</span>
                              <span className="text-white font-mono">{report.submissionDetails.ipAddress}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-400">Priority:</span>
                            <span className="text-white">{report.submissionDetails.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700/30 rounded-lg">
                        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-green-400" />
                          <span>Location & Content</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <p className="text-white mt-1">{report.submissionDetails.location}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Description:</span>
                            <p className="text-white mt-1">{report.submissionDetails.content}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Evidence Files:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {report.submissionDetails.evidence.map((file, idx) => (
                                <Badge key={idx} className="bg-blue-900/30 text-blue-300 border-blue-700/50 text-xs">
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Status Updates */}
                <TabsContent value="status" className="space-y-4">
                  <div className="space-y-3">
                    {report.statusUpdates.map((update, idx) => (
                      <div key={idx} className="p-4 bg-gray-700/30 rounded-lg border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(update.status)}
                            <span className="text-white font-semibold">
                              Status changed to: {update.status}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">{update.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Updated by:</span>
                            <p className="text-white">{update.updatedBy}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Service Number:</span>
                            <p className="text-white font-mono">{update.serviceNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rank:</span>
                            <p className="text-white">{update.rank}</p>
                          </div>
                        </div>
                        <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
                          <span className="text-gray-400">Previous Status:</span>
                          <span className="text-red-300 ml-2">{update.previousStatus}</span>
                          <span className="text-gray-400 mx-2">→</span>
                          <span className="text-green-300">{update.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Access History */}
                <TabsContent value="access" className="space-y-4">
                  <div className="space-y-3">
                    {report.accessHistory.map((access, idx) => (
                      <div key={idx} className="p-4 bg-gray-700/30 rounded-lg border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getAccessTypeIcon(access.accessType)}
                            <span className="text-white font-semibold">{access.accessType}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{access.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Personnel:</span>
                            <p className="text-white">{access.personnel}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Service Number:</span>
                            <p className="text-white font-mono">{access.serviceNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rank:</span>
                            <p className="text-white">{access.rank}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <p className="text-white">{access.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Assignments */}
                <TabsContent value="assignments" className="space-y-4">
                  <div className="space-y-3">
                    {report.assignments.map((assignment, idx) => (
                      <div key={idx} className="p-4 bg-gray-700/30 rounded-lg border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Users className="h-4 w-4 text-green-400" />
                            <span className="text-white font-semibold">Personnel Assignment</span>
                          </div>
                          <span className="text-gray-400 text-sm">{assignment.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Assigned to:</span>
                            <p className="text-white">{assignment.assignedTo}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Service Number:</span>
                            <p className="text-white font-mono">{assignment.serviceNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rank:</span>
                            <p className="text-white">{assignment.rank}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Modifications */}
                <TabsContent value="modifications" className="space-y-4">
                  <div className="space-y-3">
                    {report.modifications.map((mod, idx) => (
                      <div key={idx} className="p-4 bg-gray-700/30 rounded-lg border-l-4 border-l-orange-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Settings className="h-4 w-4 text-orange-400" />
                            <span className="text-white font-semibold">Field Modified: {mod.fieldChanged}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{mod.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="p-3 bg-red-900/20 rounded border border-red-700/50">
                            <span className="text-red-300 text-sm">Previous Value:</span>
                            <p className="text-white mt-1">{mod.beforeValue}</p>
                          </div>
                          <div className="p-3 bg-green-900/20 rounded border border-green-700/50">
                            <span className="text-green-300 text-sm">New Value:</span>
                            <p className="text-white mt-1">{mod.afterValue}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Modified by:</span>
                            <p className="text-white">{mod.modifiedBy} ({mod.serviceNumber})</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Reason:</span>
                            <p className="text-white">{mod.reason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DetailedAuditView;
