
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';

const ChartsSection = () => {
  const { reports } = useReports();
  const { assignments } = useAssignments();

  // Generate real-time data from actual reports
  const attackData = React.useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const attacksByDay = daysOfWeek.map(day => ({ day, attacks: 0 }));
    
    reports.forEach(report => {
      const reportDate = new Date(report.created_at);
      const dayIndex = (reportDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      attacksByDay[dayIndex].attacks++;
    });
    
    return attacksByDay;
  }, [reports]);

  const trendData = React.useMemo(() => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('en-US', { month: 'short' });
      
      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.created_at);
        return reportDate.getMonth() === month.getMonth() && 
               reportDate.getFullYear() === month.getFullYear();
      }).length;
      
      last6Months.push({ month: monthName, incidents: monthReports });
    }
    
    return last6Months;
  }, [reports]);

  const incidentTypes = React.useMemo(() => {
    const typeCount: { [key: string]: number } = {};
    
    reports.forEach(report => {
      const type = report.threat_type || 'Other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    const colors = ['#DC2626', '#F59E0B', '#8B5CF6', '#10B981', '#6B7280'];
    
    return Object.entries(typeCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [reports]);

  const responseTimeData = React.useMemo(() => {
    const stateResponseTimes: { [key: string]: { total: number; count: number } } = {};
    
    assignments.forEach(assignment => {
      const report = reports.find(r => r.id === assignment.report_id);
      if (report && report.state && assignment.resolved_at) {
        const responseTime = new Date(assignment.resolved_at).getTime() - new Date(assignment.assigned_at).getTime();
        const responseMinutes = Math.round(responseTime / (1000 * 60));
        
        if (!stateResponseTimes[report.state]) {
          stateResponseTimes[report.state] = { total: 0, count: 0 };
        }
        stateResponseTimes[report.state].total += responseMinutes;
        stateResponseTimes[report.state].count++;
      }
    });
    
    return Object.entries(stateResponseTimes)
      .map(([state, data]) => ({
        state,
        time: Math.round(data.total / data.count) || 0
      }))
      .slice(0, 5); // Top 5 states
  }, [reports, assignments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attack Frequency Bar Chart */}
      <div className="dhq-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Attack Frequency</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="attacks" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident Trends Line Chart */}
      <div className="dhq-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Incident Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="incidents" 
                stroke="#DC2626" 
                strokeWidth={3}
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident Types Pie Chart */}
      <div className="dhq-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Incident Types Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incidentTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {incidentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="dhq-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Average Response Time (Minutes)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeData.length > 0 ? responseTimeData : [
              { state: 'No Data', time: 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="state" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="time" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
