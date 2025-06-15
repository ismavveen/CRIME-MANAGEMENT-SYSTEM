
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

export const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/20 text-dhq-red border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'investigating':
        return 'bg-blue-500/20 text-dhq-blue border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-dhq-red" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'investigating':
        return <AlertCircle className="h-5 w-5 text-dhq-blue" />;
      default:
        return null;
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-dhq-red';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
};
