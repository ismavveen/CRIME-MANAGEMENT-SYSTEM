
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Shield, FileText, Loader2 } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { Link } from 'react-router-dom';

const AssignedReports: React.FC = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { assignments, loading: assignmentsLoading } = useAssignments();

  const loading = reportsLoading || assignmentsLoading;

  // Filter for reports that are assigned, accepted, or responded_to
  const assignedStatuses = ['assigned', 'accepted', 'responded_to'];
  
  const assignedReports = reports.filter(
    report => assignedStatuses.includes(report.status.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          Assigned Reports ({loading ? <Loader2 className="h-4 w-4 animate-spin" /> : assignedReports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <span className="ml-4 text-gray-400">Loading Assigned Reports...</span>
            </div>
        ) : (
            <div className="space-y-4">
            {assignedReports.length > 0 ? assignedReports.slice(0, 10).map((report) => (
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
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{report.description}</p>
                
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
                        <Badge variant="outline" className="border-blue-500 text-blue-300">{report.status}</Badge>
                    </div>
                </div>
                
                <div className="flex justify-end mt-3">
                    <Link to="/reports">
                        <Button size="sm" variant="outline" className="text-blue-400 border-blue-600 hover:bg-blue-900/50">
                            <FileText className="h-3 w-3 mr-1" />
                            View Details
                        </Button>
                    </Link>
                </div>
                </div>
            )) : (
                <div className="text-center py-8">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No assigned reports</p>
                <p className="text-gray-500 text-sm">Reports will appear here once assigned to a commander.</p>
                </div>
            )}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedReports;
