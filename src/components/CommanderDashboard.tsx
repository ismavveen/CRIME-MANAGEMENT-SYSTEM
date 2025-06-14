
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, MapPin, FileText, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import SimpleMap from './SimpleMap';

interface CommanderDashboardProps {
  commander: any;
  onLogout: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commander, onLogout }) => {
  const { reports } = useReports();
  const { assignments } = useAssignments();

  // Filter reports for commander's state
  const stateReports = reports.filter(report => report.state === commander.state);
  const pendingReports = stateReports.filter(report => report.status === 'pending');
  const assignedReports = assignments.filter(assignment => assignment.commander_id === commander.id);
  const resolvedReports = assignedReports.filter(assignment => assignment.status === 'resolved');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={commander.profile_image} />
              <AvatarFallback className="bg-dhq-blue text-white">
                {getInitials(commander.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-white">{commander.rank} {commander.full_name}</h1>
              <p className="text-gray-400">{commander.unit} • {commander.state} State</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Active
            </Badge>
            <Button variant="outline" onClick={onLogout} className="text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{pendingReports.length}</div>
              <p className="text-xs text-gray-400">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Assigned to Me</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{assignedReports.length}</div>
              <p className="text-xs text-gray-400">Active assignments</p>
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
        </div>

        {/* Map Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-dhq-blue" />
              {commander.state} State Threat Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleMap commanderState={commander.state} showAllReports={false} />
          </CardContent>
        </Card>

        {/* Recent Reports Table */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-dhq-blue" />
              Recent Reports - {commander.state} State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 text-gray-300">Location</th>
                    <th className="text-left py-3 px-4 text-gray-300">Priority</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stateReports.slice(0, 10).map((report) => (
                    <tr key={report.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-white">{report.threat_type}</td>
                      <td className="py-3 px-4 text-gray-300">{report.location || report.manual_location}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            report.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            report.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }
                        >
                          {report.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            report.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                            report.assigned_to ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }
                        >
                          {report.status === 'resolved' ? 'Resolved' : 
                           report.assigned_to ? 'Assigned' : 'Pending'}
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
      </div>
    </div>
  );
};

export default CommanderDashboard;
