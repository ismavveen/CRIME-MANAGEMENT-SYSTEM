
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ReportAnalytics {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  assignedReports: number;
  monthlyData: Array<{ month: string; reports: number; resolved: number }>;
  threatTypeData: Array<{ type: string; count: number; color: string }>;
}

interface ReportAnalyticsProps {
  onFilterChange?: (filter: string) => void;
  selectedFilter?: string;
}

const ReportAnalytics = ({ onFilterChange, selectedFilter = 'all' }: ReportAnalyticsProps) => {
  const [timeframe, setTimeframe] = useState('3months');
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const timeframeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];

  const getDateRange = (timeframe: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 3);
    }
    
    return startDate.toISOString();
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const startDate = getDateRange(timeframe);

      // Fetch reports in date range
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Fetch assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .gte('created_at', startDate);

      if (assignmentsError) throw assignmentsError;

      // Process data
      const totalReports = reports?.length || 0;
      const resolvedReports = reports?.filter(r => r.status === 'resolved').length || 0;
      const assignedReports = assignments?.filter(a => a.status === 'pending' || a.status === 'accepted' || a.status === 'responded_to').length || 0;
      const pendingReports = reports?.filter(r => r.status === 'pending').length || 0;

      // Monthly data
      const monthlyMap = new Map<string, { reports: number; resolved: number }>();
      reports?.forEach(report => {
        const month = new Date(report.created_at || '').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { reports: 0, resolved: 0 });
        }
        monthlyMap.get(month)!.reports++;
        
        if (report.status === 'resolved') {
          monthlyMap.get(month)!.resolved++;
        }
      });

      const monthlyData = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Threat type data
      const threatTypeMap = new Map<string, number>();
      reports?.forEach(report => {
        const type = report.threat_type || 'Other';
        threatTypeMap.set(type, (threatTypeMap.get(type) || 0) + 1);
      });

      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
      const threatTypeData = Array.from(threatTypeMap.entries())
        .map(([type, count], index) => ({ 
          type, 
          count, 
          color: colors[index % colors.length] 
        }))
        .sort((a, b) => b.count - a.count);

      setAnalytics({
        totalReports,
        resolvedReports,
        pendingReports,
        assignedReports,
        monthlyData,
        threatTypeData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports'
      }, () => {
        fetchAnalytics();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assignments'
      }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeframe]);

  const handleCardClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const handleRadioChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header with timeframe selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reports Analytics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {timeframeOptions.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-white">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Radio Button Filter */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Filter Reports</h3>
        <RadioGroup value={selectedFilter} onValueChange={handleRadioChange} className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" className="border-gray-400 text-blue-400" />
            <Label htmlFor="all" className="text-gray-300 cursor-pointer">All Reports ({analytics.totalReports})</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" className="border-gray-400 text-yellow-400" />
            <Label htmlFor="pending" className="text-gray-300 cursor-pointer">Pending ({analytics.pendingReports})</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="assigned" id="assigned" className="border-gray-400 text-orange-400" />
            <Label htmlFor="assigned" className="text-gray-300 cursor-pointer">Assigned ({analytics.assignedReports})</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="resolved" id="resolved" className="border-gray-400 text-green-400" />
            <Label htmlFor="resolved" className="text-gray-300 cursor-pointer">Resolved ({analytics.resolvedReports})</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Summary Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${selectedFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleCardClick('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white">{analytics.totalReports}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card 
          className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${selectedFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => handleCardClick('pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{analytics.pendingReports}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>

        <Card 
          className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${selectedFilter === 'assigned' ? 'ring-2 ring-orange-500' : ''}`}
          onClick={() => handleCardClick('assigned')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Assigned</p>
              <p className="text-2xl font-bold text-orange-400">{analytics.assignedReports}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-400" />
          </div>
        </Card>

        <Card 
          className={`bg-gray-800/50 border-gray-700 p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${selectedFilter === 'resolved' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => handleCardClick('resolved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{analytics.resolvedReports}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="reports" fill="#3B82F6" name="Reports" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Threat Types */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.threatTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ type, count }) => `${type}: ${count}`}
              >
                {analytics.threatTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ReportAnalytics;
