
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

const ChartsSection = () => {
  // Sample data for charts
  const attackData = [
    { day: 'Mon', attacks: 12 },
    { day: 'Tue', attacks: 8 },
    { day: 'Wed', attacks: 15 },
    { day: 'Thu', attacks: 6 },
    { day: 'Fri', attacks: 18 },
    { day: 'Sat', attacks: 9 },
    { day: 'Sun', attacks: 4 },
  ];

  const trendData = [
    { month: 'Jan', incidents: 45 },
    { month: 'Feb', incidents: 38 },
    { month: 'Mar', incidents: 52 },
    { month: 'Apr', incidents: 41 },
    { month: 'May', incidents: 48 },
    { month: 'Jun', incidents: 35 },
  ];

  const incidentTypes = [
    { name: 'Terrorism', value: 35, color: '#DC2626' },
    { name: 'Kidnapping', value: 25, color: '#F59E0B' },
    { name: 'Armed Robbery', value: 20, color: '#8B5CF6' },
    { name: 'Civil Unrest', value: 15, color: '#10B981' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

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
            <BarChart data={[
              { state: 'Lagos', time: 12 },
              { state: 'FCT', time: 8 },
              { state: 'Kano', time: 15 },
              { state: 'Rivers', time: 18 },
              { state: 'Kaduna', time: 10 },
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
