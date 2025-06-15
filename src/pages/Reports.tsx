import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RealTimeReports from '@/components/RealTimeReports';
import AuditDashboard from '@/pages/AuditDashboard';
import ReportAnalytics from '@/components/ReportAnalytics';
import FileScanDashboard from '@/components/FileScanDashboard';
import { FileText, Activity, BarChart3, Shield, History, Users, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-300 hover:bg-gray-700 mr-4"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-white dhq-heading">Reports & Intelligence Portal</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold uppercase tracking-wide">LIVE MONITORING</span>
                </div>
              </div>
              <p className="text-gray-400">Comprehensive crime reporting and intelligence management system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-6">
            <TabsTrigger 
              value="reports" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <FileText className="h-4 w-4" />
              <span>Live Reports</span>
            </TabsTrigger>
            {/* Removed Audit & Logs Tab */}
            <TabsTrigger 
              value="security" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <Shield className="h-4 w-4" />
              <span>File Security</span>
              <Badge className="bg-red-600 text-white text-xs ml-1">NEW</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="intelligence" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <Shield className="h-4 w-4" />
              <span>Intelligence</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <RealTimeReports />
          </TabsContent>

          {/* Audit & Logs Tab Removed */}

          {/* File Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <FileScanDashboard />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <ReportAnalytics />
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  <span>Intelligence Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Threat Analysis</h3>
                    <p className="text-gray-300 text-sm">Real-time threat classification and pattern analysis</p>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Geographic Intelligence</h3>
                    <p className="text-gray-300 text-sm">Location-based threat mapping and hotspot identification</p>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg">
                    <h3 className="text-white font-semibold mb-2">Predictive Analytics</h3>
                    <p className="text-gray-300 text-sm">AI-powered threat prediction and risk assessment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
