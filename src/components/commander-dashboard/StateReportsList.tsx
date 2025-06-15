
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import { Report } from '@/hooks/useReports';

interface StateReportsListProps {
  reports: Report[];
  commanderState: string;
}

const StateReportsList: React.FC<StateReportsListProps> = ({ reports, commanderState }) => {
  return (
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
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.slice(0, 10).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1 pr-4">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-medium">{report.threat_type}</p>
                    {report.serial_number && (
                      <p className="text-xs text-dhq-blue font-mono whitespace-nowrap">{report.serial_number}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{report.location || report.full_address}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
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
  );
};

export default StateReportsList;
