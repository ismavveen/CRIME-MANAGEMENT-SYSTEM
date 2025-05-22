
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'critical' | 'neutral';
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status = 'neutral',
  icon
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-dhq-red';
      default:
        return 'text-dhq-blue';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-dhq-red';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="dhq-card p-6 hover:bg-gray-800/70 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-3xl font-bold ${getStatusColor()}`}>
              {value}
            </h3>
            {trendValue && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-gray-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
