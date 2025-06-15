
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Zap } from 'lucide-react';

interface ReportOverviewSectionProps {
  report: any;
}

const ReportOverviewSection = ({ report }: ReportOverviewSectionProps) => {
  const getThreatColor = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'critical':
        return 'text-red-400';
      case 'kidnapping':
      case 'armed robbery':
        return 'text-orange-400';
      case 'theft':
      case 'vandalism':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Incident Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-gray-400 text-xs">Threat Type</p>
            <p className={`font-semibold ${getThreatColor(report.threat_type)}`}>
              {report.threat_type}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Description</p>
            <p className="text-white text-sm bg-gray-800/50 p-2 rounded">
              {report.description}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Validation Status</p>
            <Badge className={`text-xs ${
              report.validation_status === 'validated' ? 'bg-green-900/30 text-green-300 border-green-700/50' :
              report.validation_status === 'rejected' ? 'bg-red-900/30 text-red-300 border-red-700/50' :
              'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
            }`}>
              {report.validation_status || 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-gray-400 text-xs">Reported At</p>
            <p className="text-white text-sm">{formatTime(report.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Time Elapsed</p>
            <p className="text-orange-300 text-sm font-medium">
              {Math.floor((Date.now() - new Date(report.created_at).getTime()) / 60000)} minutes ago
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Current Status</p>
            <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-700/50">
              {report.status || 'Pending'}
            </Badge>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Submission Source</p>
            <Badge className={`text-xs ${
              report.submission_source === 'external_portal' 
                ? 'bg-purple-900/30 text-purple-300 border-purple-700/50' 
                : 'bg-blue-900/30 text-blue-300 border-blue-700/50'
            }`}>
              {report.submission_source === 'external_portal' ? 'External Portal' : 'Internal System'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportOverviewSection;
