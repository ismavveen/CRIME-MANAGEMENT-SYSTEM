
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, AlertTriangle, FileText } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';

const PendingReportsSection: React.FC = () => {
  const { reports } = useReports();
  const { assignments } = useAssignments();

  // Filter reports that are not assigned yet
  const assignedReportIds = assignments.map(a => a.report_id);
  const pendingReports = reports.filter(report => !assignedReportIds.includes(report.id));

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
          <Clock className="h-5 w-5 text-yellow-400" />
          Pending Reports ({pendingReports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingReports.slice(0, 5).map((report) => (
            <div key={report.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
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
              </div>
              
              <div className="flex justify-end mt-3">
                <Button size="sm" variant="outline" className="text-blue-400 border-blue-600">
                  <FileText className="h-3 w-3 mr-1" />
                  Assign Unit
                </Button>
              </div>
            </div>
          ))}
          
          {pendingReports.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No pending reports</p>
              <p className="text-gray-500 text-sm">All reports have been assigned</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingReportsSection;
