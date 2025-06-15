
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeReports from '@/components/RealTimeReports';
import ReportAnalytics from '@/components/ReportAnalytics';
import AssignedReports from '@/components/AssignedReports';
import PendingReportsSection from '@/components/PendingReportsSection';
import ResolvedReports from '@/components/ResolvedReports';
import { FileText, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const navigate = useNavigate();

  return (
    <div>
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
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 mb-6">
            <TabsTrigger 
              value="reports" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <FileText className="h-4 w-4" />
              <span>Live Reports</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <Clock className="h-4 w-4" />
              <span>Pending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assigned" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <Shield className="h-4 w-4" />
              <span>Assigned</span>
            </TabsTrigger>
            <TabsTrigger 
              value="resolved" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Resolved</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 data-[state=active]:bg-cyan-600"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <RealTimeReports />
          </TabsContent>

          {/* Pending Reports Tab */}
          <TabsContent value="pending" className="space-y-6">
            <PendingReportsSection />
          </TabsContent>
          
          {/* Assigned Reports Tab */}
          <TabsContent value="assigned" className="space-y-6">
            <AssignedReports />
          </TabsContent>

          {/* Resolved Reports Tab */}
          <TabsContent value="resolved" className="space-y-6">
            <ResolvedReports />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <ReportAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
