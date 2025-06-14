
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuditLogViewer from '@/components/AuditLogViewer';
import { Shield, Activity, Eye, Users, Download, BarChart3 } from 'lucide-react';

const AuditDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeView, setActiveView] = useState('overview');

  const auditStats = [
    {
      title: 'Total Audit Entries',
      value: '2,847',
      change: '+12%',
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      title: 'Report Changes',
      value: '156',
      change: '+5%',
      icon: Shield,
      color: 'text-green-400'
    },
    {
      title: 'Access Events',
      value: '1,204',
      change: '+8%',
      icon: Eye,
      color: 'text-purple-400'
    },
    {
      title: 'Active Users',
      value: '47',
      change: '+3%',
      icon: Users,
      color: 'text-orange-400'
    }
  ];

  const generateComplianceReport = () => {
    // Generate compliance report
    const reportData = {
      period: selectedPeriod,
      generated_at: new Date().toISOString(),
      summary: {
        total_audit_entries: 2847,
        report_changes: 156,
        access_events: 1204,
        unique_users: 47
      },
      compliance_status: 'Compliant',
      recommendations: [
        'Continue current logging practices',
        'Review access patterns monthly',
        'Maintain audit trail integrity'
      ]
    };

    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value,Compliance Status\n" +
      `Total Audit Entries,${reportData.summary.total_audit_entries},Compliant\n` +
      `Report Changes,${reportData.summary.report_changes},Compliant\n` +
      `Access Events,${reportData.summary.access_events},Compliant\n` +
      `Unique Users,${reportData.summary.unique_users},Compliant\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compliance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit Dashboard</h1>
              <p className="text-gray-400">Comprehensive system audit and compliance monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={generateComplianceReport}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {auditStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="bg-gray-800 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Report Audits</TabsTrigger>
            <TabsTrigger value="access">Access Logs</TabsTrigger>
            <TabsTrigger value="system">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    <span>Audit Activity Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Report Submissions</span>
                      <span className="text-white font-semibold">247</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Status Updates</span>
                      <span className="text-white font-semibold">89</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Assignment Changes</span>
                      <span className="text-white font-semibold">67</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
                      <span className="text-gray-300">Access Reviews</span>
                      <span className="text-white font-semibold">1,204</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Compliance Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Audit Trail Integrity</span>
                      <span className="text-green-400 font-semibold ml-auto">100%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Access Logging</span>
                      <span className="text-green-400 font-semibold ml-auto">100%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">Change Tracking</span>
                      <span className="text-green-400 font-semibold ml-auto">100%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300">Data Retention</span>
                      <span className="text-yellow-400 font-semibold ml-auto">95%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded">
                    <p className="text-green-300 font-semibold">✓ System is compliant</p>
                    <p className="text-green-200 text-sm mt-1">
                      All audit requirements are being met. Continue current practices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <AuditLogViewer className="w-full" />
          </TabsContent>

          <TabsContent value="access">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span>Access Logs Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Access logs viewer coming soon...</p>
                  <p className="text-gray-500 text-sm mt-2">
                    This will show detailed access patterns and user activity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="h-5 w-5 text-orange-400" />
                  <span>System Operation Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">System logs viewer coming soon...</p>
                  <p className="text-gray-500 text-sm mt-2">
                    This will show automated system operations and background tasks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuditDashboard;
