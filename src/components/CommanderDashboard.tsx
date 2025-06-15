
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useAssignments } from '@/hooks/useAssignments';
import { useReports } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommanderDashboardProps {
  commanderId: string;
  commanderState: string;
  onLogout?: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commanderId, commanderState, onLogout }) => {
  const { assignments, loading: assignmentsLoading } = useAssignments(commanderId);
  const { reports, loading: reportsLoading } = useReports();
  const { toast } = useToast();
  
  const [commander, setCommander] = useState<any>(null);
  const [stateReports, setStateReports] = useState<any[]>([]);

  // Filter reports for the commander's state
  useEffect(() => {
    if (reports && commanderState) {
      const filteredReports = reports.filter(report => report.state === commanderState);
      setStateReports(filteredReports);
    }
  }, [reports, commanderState]);

  // Get commander stats
  const totalAssignments = assignments?.length || 0;
  const pendingAssignments = assignments?.filter(a => a.status === 'pending').length || 0;
  const resolvedAssignments = assignments?.filter(a => a.status === 'resolved').length || 0;
  const acceptedAssignments = assignments?.filter(a => a.status === 'accepted').length || 0;

  // Calculate average response time from assignments
  const avgResponseTime = assignments && assignments.length > 0
    ? assignments
        .filter(a => a.created_at && a.updated_at)
        .reduce((acc, assignment) => {
          const created = new Date(assignment.created_at);
          const updated = new Date(assignment.updated_at);
          return acc + (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
        }, 0) / assignments.length
    : 0;

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Assignment Accepted",
        description: "You have successfully accepted this assignment",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (assignmentsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-dhq-blue to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Commander Dashboard</h1>
              <p className="text-blue-100">State: {commanderState}</p>
            </div>
          </div>
          {onLogout && (
            <Button onClick={onLogout} variant="outline" className="text-white border-white hover:bg-white hover:text-dhq-blue">
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Reports</CardTitle>
            <MapPin className="h-4 w-4 text-dhq-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stateReports.length}</div>
            <p className="text-xs text-gray-400">In {commanderState} state</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Open Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingAssignments}</div>
            <p className="text-xs text-gray-400">Pending assignments</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Closed Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resolvedAssignments}</div>
            <p className="text-xs text-gray-400">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(avgResponseTime)}h</div>
            <p className="text-xs text-gray-400">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-dhq-blue" />
            Recent Assignments
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest assignments for {commanderState} state
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">Assignment #{assignment.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(assignment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={assignment.status === 'pending' ? 'destructive' : 
                              assignment.status === 'accepted' ? 'default' : 'secondary'}
                    >
                      {assignment.status}
                    </Badge>
                    {assignment.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptAssignment(assignment.id)}
                        className="bg-dhq-blue hover:bg-blue-700"
                      >
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No assignments yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* State Reports */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-dhq-blue" />
            Reports in {commanderState}
          </CardTitle>
          <CardDescription className="text-gray-400">
            All reports submitted from {commanderState} state
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stateReports.length > 0 ? (
            <div className="space-y-4">
              {stateReports.slice(0, 10).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">{report.threat_type}</p>
                    <p className="text-sm text-gray-400">{report.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={report.status === 'pending' ? 'destructive' : 
                              report.status === 'resolved' ? 'default' : 'secondary'}
                    >
                      {report.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No reports from {commanderState} yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommanderDashboard;
