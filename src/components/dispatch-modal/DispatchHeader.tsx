
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface DispatchHeaderProps {
  report: any;
}

const DispatchHeader = ({ report }: DispatchHeaderProps) => {
  const getUrgencyColor = (urgency: string, priority: string) => {
    const level = urgency || priority;
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-900/30 text-red-300 border-red-700/50';
      case 'medium':
        return 'bg-orange-900/30 text-orange-300 border-orange-700/50';
      default:
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-2">
          <img 
            src="/lovable-uploads/b160c848-06aa-40b9-8717-59194cc9a1a8.png" 
            alt="DHQ Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <span className="text-xl">Dispatch Response Unit</span>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className="bg-blue-900/30 text-blue-300 border-blue-700/50 text-xs">
              ID: {report.id.slice(0, 8)}
            </Badge>
            <Badge className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs">
              Serial: {report.serial_number || 'Not Assigned'}
            </Badge>
          </div>
        </div>
      </div>
      <Badge className={`${getUrgencyColor(report.urgency, report.priority)} animate-pulse`}>
        {(report.urgency === 'critical' || report.priority === 'high') && (
          <Zap className="h-3 w-3 mr-1" />
        )}
        {report.priority || report.urgency || 'Medium'} Priority
      </Badge>
    </div>
  );
};

export default DispatchHeader;
