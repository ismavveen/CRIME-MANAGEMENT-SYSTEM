
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'critical' | 'neutral';
  icon?: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status = 'neutral',
  icon,
  onClick
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400 status-resolved';
      case 'warning':
        return 'text-yellow-400 status-warning';
      case 'critical':
        return 'text-red-400 status-critical';
      default:
        return 'text-cyan-400 status-active';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getGlowEffect = () => {
    switch (status) {
      case 'success':
        return 'hover:shadow-green-400/20';
      case 'warning':
        return 'hover:shadow-yellow-400/20';
      case 'critical':
        return 'hover:shadow-red-400/20';
      default:
        return 'hover:shadow-cyan-400/20';
    }
  };

  return (
    <div 
      className={`stat-card p-4 group animate-fade-in-up ${getGlowEffect()} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2 dhq-caption uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline space-x-2 mb-2">
            <h3 className={`text-3xl font-bold dhq-heading ${getStatusColor()} transition-all duration-300`}>
              {value}
            </h3>
            {trendValue && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-semibold ${getTrendColor()} dhq-caption`}>
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                </span>
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
                </span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-400 text-sm dhq-body">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-gray-500 group-hover:text-gray-400 transition-all duration-300 transform group-hover:scale-110">
            {icon}
          </div>
        )}
      </div>
      
      {/* Enhanced hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </div>
  );
};

export default StatCard;
