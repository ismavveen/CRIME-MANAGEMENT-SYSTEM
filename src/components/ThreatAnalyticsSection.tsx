import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useReports } from '@/hooks/useReports';
import { MapPin, Filter, AlertTriangle, TrendingUp, BarChart as BarChartIcon } from 'lucide-react';

const ThreatAnalyticsSection = () => {
  const { reports } = useReports();
  const [selectedState, setSelectedState] = useState('all');
  const [selectedLGA, setSelectedLGA] = useState('all');
  const [timeRange, setTimeRange] = useState('1month');

  // Nigerian states and sample LGAs
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  // Filter reports based on selections and time range
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filter by time range
    const now = new Date();
    const cutoffDate = new Date();
    switch (timeRange) {
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    filtered = filtered.filter(report => 
      new Date(report.created_at) >= cutoffDate
    );

    // Filter by state
    if (selectedState !== 'all') {
      filtered = filtered.filter(report => report.state === selectedState);
    }

    // Filter by LGA
    if (selectedLGA !== 'all') {
      filtered = filtered.filter(report => report.local_government === selectedLGA);
    }

    return filtered;
  }, [reports, selectedState, selectedLGA, timeRange]);

  // Get unique LGAs for selected state
  const availableLGAs = useMemo(() => {
    if (selectedState === 'all') return [];
    return [...new Set(
      reports
        .filter(report => report.state === selectedState && report.local_government)
        .map(report => report.local_government)
    )];
  }, [reports, selectedState]);

  // LGA-level threat analysis
  const lgaThreatData = useMemo(() => {
    if (selectedState === 'all') return [];
    
    const lgaMap = new Map();
    
    filteredReports
      .filter(report => report.state === selectedState && report.local_government)
      .forEach(report => {
        const lga = report.local_government;
        if (!lgaMap.has(lga)) {
          lgaMap.set(lga, { lga, total: 0, types: {} });
        }
        
        const lgaData = lgaMap.get(lga);
        lgaData.total++;
        
        const threatType = report.threat_type || 'Other';
        lgaData.types[threatType] = (lgaData.types[threatType] || 0) + 1;
      });

    return Array.from(lgaMap.values())
      .sort((a, b) => b.total - a.total);
  }, [filteredReports, selectedState]);

  // Threat type distribution
  const threatTypeData = useMemo(() => {
    const typeMap = new Map();
    
    filteredReports.forEach(report => {
      const type = report.threat_type || 'Other';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
    
    return Array.from(typeMap.entries())
      .map(([type, count], index) => ({
        type,
        count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredReports]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Filter className="h-5 w-5 text-cyan-400" />
            <span>Analytics Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">State</label>
              <Select value={selectedState} onValueChange={(value) => {
                setSelectedState(value);
                setSelectedLGA('all'); // Reset LGA when state changes
              }}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                  <SelectItem value="all">All States</SelectItem>
                  {nigerianStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Local Government Area</label>
              <Select 
                value={selectedLGA} 
                onValueChange={setSelectedLGA}
                disabled={selectedState === 'all' || availableLGAs.length === 0}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder={selectedState === 'all' ? 'Select a state first' : 'Select LGA'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">All LGAs</SelectItem>
                  {availableLGAs.map(lga => (
                    <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{filteredReports.length}</div>
                <div className="text-gray-400 text-sm">Filtered Reports</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Distribution for Selected Period */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChartIcon className="h-5 w-5 text-cyan-400" />
            <span>Threat Distribution for Selected Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="type" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    cursor={{fill: 'rgba(100,100,100,0.1)'}}
                />
                <Bar dataKey="count" name="Reports">
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Type Distribution */}
        <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span>Threat Type Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ type, count }) => `${type}: ${count}`}
                  >
                    {threatTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LGA-Level Analysis (when state is selected) */}
      {selectedState !== 'all' && lgaThreatData.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <span>Local Government Areas in {selectedState}</span>
              </div>
              <Badge className="bg-green-600/20 text-green-300">
                {lgaThreatData.length} LGAs
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lgaThreatData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="lga" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">High Priority Threats</p>
                <p className="text-2xl font-bold text-red-400">
                  {filteredReports.filter(r => r.priority === 'high' || r.urgency === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">States Affected</p>
                <p className="text-2xl font-bold text-blue-400">
                  {new Set(filteredReports.map(r => r.state).filter(Boolean)).size}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-700/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">LGAs Affected</p>
                <p className="text-2xl font-bold text-green-400">
                  {new Set(filteredReports.map(r => r.local_government).filter(Boolean)).size}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatAnalyticsSection;
