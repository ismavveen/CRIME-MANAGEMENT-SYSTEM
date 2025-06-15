import React, { useEffect, useState, useMemo } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartsSectionProps {
  filterByState?: string;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ filterByState }) => {
  const { reports: allReports } = useReports();
  const { assignments: allAssignments } = useAssignments();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const reports = useMemo(() => {
    return filterByState 
      ? allReports.filter(report => report.state === filterByState) 
      : allReports;
  }, [allReports, filterByState]);

  const assignments = useMemo(() => {
    if (!filterByState) return allAssignments;
    const stateReportIds = new Set(reports.map(r => r.id));
    return allAssignments.filter(assignment => stateReportIds.has(assignment.report_id));
  }, [allAssignments, reports, filterByState]);

  useEffect(() => {
    const channel = supabase
      .channel('charts-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports'
      }, () => {
        setLastUpdated(new Date());
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assignments'
      }, () => {
        setLastUpdated(new Date());
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate attack frequency by day of week
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

  // Generate incident types distribution
  const incidentTypes = React.useMemo(() => {
    const typeCount: { [key: string]: number } = {};
    
    reports.forEach(report => {
      const type = report.threat_type || 'Other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    
    return Object.entries(typeCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [reports]);

  // Generate response time data
  const responseTimeData = React.useMemo(() => {
    if (filterByState) {
      // By LGA within the state
      const lgaResponseTimes: { [key: string]: { total: number; count: number } } = {};
      assignments.forEach(assignment => {
        const report = reports.find(r => r.id === assignment.report_id);
        if (report && report.local_government && assignment.resolved_at && assignment.assigned_at) {
          const responseTime = new Date(assignment.resolved_at).getTime() - new Date(assignment.assigned_at).getTime();
          const responseMinutes = Math.round(responseTime / (1000 * 60));
          if (!lgaResponseTimes[report.local_government]) {
            lgaResponseTimes[report.local_government] = { total: 0, count: 0 };
          }
          lgaResponseTimes[report.local_government].total += responseMinutes;
          lgaResponseTimes[report.local_government].count++;
        }
      });
      return Object.entries(lgaResponseTimes).map(([key, data]) => ({
        name: key,
        time: Math.round(data.total / data.count) || 0
      })).slice(0, 8);
    } else {
      // By State for global view
      const stateResponseTimes: { [key: string]: { total: number; count: number } } = {};
      allAssignments.forEach(assignment => {
        const report = allReports.find(r => r.id === assignment.report_id);
        if (report && report.state && assignment.resolved_at && assignment.assigned_at) {
          const responseTime = new Date(assignment.resolved_at).getTime() - new Date(assignment.assigned_at).getTime();
          const responseMinutes = Math.round(responseTime / (1000 * 60));
          if (!stateResponseTimes[report.state]) {
            stateResponseTimes[report.state] = { total: 0, count: 0 };
          }
          stateResponseTimes[report.state].total += responseMinutes;
          stateResponseTimes[report.state].count++;
        }
      });
      return Object.entries(stateResponseTimes).map(([key, data]) => ({
        name: key,
        time: Math.round(data.total / data.count) || 0
      })).slice(0, 8);
    }
  }, [reports, assignments, filterByState, allReports, allAssignments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ name, percent }: any) => {
    return (
      <text 
        x="0" 
        y="0" 
        fill="#D1D5DB" 
        fontSize="12"
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-semibold">LIVE DATA</span>
          <span className="text-gray-400 text-sm">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        <Badge className="bg-cyan-600/20 text-cyan-300">
          {reports.length} Total Reports {filterByState ? `in ${filterByState}` : ''}
        </Badge>
      </div>

      {/* Overall Incident Types Distribution */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span>Overall Incident Types Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#D1D5DB" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#D1D5DB" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Total Reports">
                  {incidentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attack Frequency */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Activity className="h-5 w-5 text-blue-400" />
              <span>Weekly Attack Frequency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attackData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#D1D5DB" fontSize={12} />
                  <YAxis stroke="#D1D5DB" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="attacks" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident Types Distribution */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <PieChartIcon className="h-5 w-5 text-purple-400" />
              <span>Incident Types Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={CustomPieLabel}
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
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        {responseTimeData.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>
                  Average Response Time (Minutes) by {filterByState ? 'LGA' : 'State'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#D1D5DB" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#D1D5DB" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="time" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
