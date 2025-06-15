
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, MapPin, FileText, Clock, CheckCircle, AlertTriangle, User, Bell, Shield } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useNotifications } from '@/hooks/useNotifications';
import SimpleMap from './SimpleMap';
import NotificationPanel from './NotificationPanel';

interface CommanderDashboardProps {
  commander: any;
  onLogout: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commander, onLogout }) => {
  const { reports } = useReports();
  const { assignments } = useAssignments();
  const { notifications, unreadCount } = useNotifications();

  // Filter reports for commander's state only
  const stateReports = reports.filter(report => report.state === commander.state);
  const pendingReports = stateReports.filter(report => report.status === 'pending');
  const assignedReports = assignments.filter(assignment => assignment.commander_id === commander.id);
  const resolvedReports = assignedReports.filter(assignment => assignment.status === 'resolved');
  const inProgressReports = assignedReports.filter(assignment => assignment.status === 'in_progress');

  // Calculate response metrics
  const averageResponseTime = assignedReports.length > 0 
    ? assignedReports.reduce((sum, assignment) => sum + (assignment.response_time || 0), 0) / assignedReports.length 
    : 0;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'assigned': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      {/* Enhanced Header with Security Badge */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-dhq-blue">
              <AvatarImage src={commander.profile_image} />
              <AvatarFallback className="bg-dhq-blue text-white">
                {getInitials(commander.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{commander.rank} {commander.full_name}</h1>
                <Shield className="h-4 w-4 text-green-400" title="Secure Session" />
              </div>
              <p className="text-gray-400">{commander.unit} • {commander.state} State Command</p>
              <p className="text-xs text-gray-500">Service #: {commander.service_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationPanel />
            <Badge variant="outline" className="text-green-400 border-green-400">
              Active
            </Badge>
            <Button variant="outline" onClick={onLogout} className="text-white hover:bg-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Secure Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">State Reports</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stateReports.length}</div>
              <p className="text-xs text-gray-400">Total for {commander.state}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Action</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{pendingReports.length}</div>
              <p className="text-xs text-gray-400">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">In Progress</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{inProgressReports.length}</div>
              <p className="text-xs text-gray-400">Active operations</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{resolvedReports.length}</div>
              <p className="text-xs text-gray-400">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{Math.round(averageResponseTime)}h</div>
              <p className="text-xs text-gray-400">Response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-dhq-blue">
              Dashboard Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-dhq-blue">
              State Reports
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-dhq-blue">
              Threat Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Recent High Priority Reports */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  High Priority Reports - {commander.state} State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stateReports
                    .filter(report => report.priority === 'high')
                    .slice(0, 5)
                    .map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-red-900/10 border border-red-700/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-red-500/20 text-red-400 border-red-500 text-xs">
                              HIGH PRIORITY
                            </Badge>
                            <span className="text-white font-medium">{report.threat_type}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{report.location || report.manual_location}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                    ))}
                  {stateReports.filter(report => report.priority === 'high').length === 0 && (
                    <p className="text-gray-400 text-center py-4">No high priority reports</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-dhq-blue" />
                  All Reports - {commander.state} State
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300">ID</th>
                        <th className="text-left py-3 px-4 text-gray-300">Type</th>
                        <th className="text-left py-3 px-4 text-gray-300">Location</th>
                        <th className="text-left py-3 px-4 text-gray-300">Priority</th>
                        <th className="text-left py-3 px-4 text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateReports.map((report) => (
                        <tr key={report.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3 px-4 text-white font-mono text-xs">
                            {report.serial_number || report.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-white">{report.threat_type}</td>
                          <td className="py-3 px-4 text-gray-300">{report.location || report.manual_location}</td>
                          <td className="py-3 px-4">
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(report.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {stateReports.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No reports found for {commander.state} state</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-dhq-blue" />
                  {commander.state} State Threat Map
                  <Badge variant="outline" className="text-xs">
                    {stateReports.length} Reports
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleMap commanderState={commander.state} showAllReports={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommanderDashboard;
