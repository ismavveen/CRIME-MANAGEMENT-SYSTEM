
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Clock, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { UnitCommander } from '@/hooks/useUnitCommanders';

interface UnitCommanderStatsProps {
  commanders: UnitCommander[];
  metrics: {
    active_operations: number;
    average_response_time: number;
    responded_reports: number;
  };
}

const UnitCommanderStats = ({ commanders, metrics }: UnitCommanderStatsProps) => {
  const activeCommanders = commanders.filter(c => c.status === 'active').length;
  const availableCommanders = commanders.filter(c => c.status === 'available').length;
  const totalAssignments = commanders.reduce((sum, c) => sum + c.total_assignments, 0);
  const averageSuccessRate = commanders.length > 0 
    ? commanders.reduce((sum, c) => sum + c.success_rate, 0) / commanders.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Active Units</CardTitle>
          <Shield className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{activeCommanders}</div>
          <p className="text-xs text-gray-400">
            {availableCommanders} available
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Assignments</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalAssignments}</div>
          <p className="text-xs text-gray-400">
            {metrics.active_operations} active ops
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{metrics.average_response_time}</div>
          <p className="text-xs text-gray-400">
            minutes average
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{Math.round(averageSuccessRate)}%</div>
          <p className="text-xs text-gray-400">
            overall performance
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitCommanderStats;
