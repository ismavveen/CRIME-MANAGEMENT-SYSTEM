
import React from 'react';
import StatCard from '../StatCard';
import { FileText, CircleCheck, CircleAlert, Target } from 'lucide-react';

interface CommanderStatsProps {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  avgResponseTime: number;
  commanderState: string;
}

const CommanderStats: React.FC<CommanderStatsProps> = ({
  totalReports,
  resolvedReports,
  pendingReports,
  avgResponseTime,
  commanderState,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="TOTAL REPORTS"
        value={totalReports.toString()}
        subtitle={`In ${commanderState}`}
        icon={<FileText size={24} />}
        status="neutral"
      />
      <StatCard
        title="RESOLVED"
        value={resolvedReports.toString()}
        subtitle="Completed missions"
        status="success"
        icon={<CircleCheck size={24} />}
      />
      <StatCard
        title="PENDING"
        value={pendingReports.toString()}
        subtitle="Awaiting action"
        status="warning"
        icon={<CircleAlert size={24} />}
      />
      <StatCard
        title="AVG RESPONSE"
        value={`${Math.round(avgResponseTime || 0)} min`}
        subtitle="Your average"
        status={avgResponseTime > 60 ? "warning" : "success"}
        icon={<Target size={24} />}
      />
    </div>
  );
};

export default CommanderStats;
