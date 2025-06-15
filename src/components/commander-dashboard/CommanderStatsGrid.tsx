
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface CommanderStatsGridProps {
  totalReports: number;
  pendingAssignments: number;
  resolvedAssignments: number;
  avgResponseTime: number;
  commanderState: string;
}

const CommanderStatsGrid: React.FC<CommanderStatsGridProps> = ({
  totalReports,
  pendingAssignments,
  resolvedAssignments,
  avgResponseTime,
  commanderState
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Reports</CardTitle>
          <MapPin className="h-4 w-4 text-dhq-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalReports}</div>
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
  );
};

export default CommanderStatsGrid;
