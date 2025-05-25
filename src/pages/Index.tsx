
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import GoogleMapsHeatmap from '../components/GoogleMapsHeatmap';
import IncidentTable from '../components/IncidentTable';
import NewsLiveFeed from '../components/NewsLiveFeed';
import NotificationPanel from '../components/NotificationPanel';
import SimpleMap from '../components/SimpleMap';
import RealTimeReports from '../components/RealTimeReports';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { FileText, CircleArrowUp, CircleAlert, CircleCheck, Target, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { assignments } = useAssignments();
  const { metrics, loading: metricsLoading } = useSystemMetrics();

  const loading = reportsLoading || metricsLoading;

  const handleStatCardClick = (type: string) => {
    // Enhanced interactivity - could navigate to specific filtered views
    console.log(`Clicked on ${type} stat card`);
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8 space-y-8">
        {/* Enhanced Header with DHQ Logo */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                <img 
                  src="/lovable-uploads/3a43392d-f923-4787-9d0b-535a9a9a56a4.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white mb-3 dhq-heading tracking-tight">
                  Defense Headquarters Intelligence Portal
                </h1>
                <p className="text-gray-300 text-xl dhq-body font-medium">
                  Crime Reporting & Intelligence Portal
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
                  <p className="text-green-400 text-sm font-semibold dhq-caption uppercase tracking-wider">
                    🔒 CLASSIFIED - FOR AUTHORIZED PERSONNEL ONLY
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <NotificationPanel />
              <div className="text-right space-y-1">
                <p className="text-white font-semibold dhq-subheading">System Status</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} live-indicator`}></div>
                  <p className={`text-sm dhq-caption font-medium ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                    {loading ? 'SYNCHRONIZING...' : 'OPERATIONAL'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard
            title="TOTAL REPORTS"
            value={loading ? "..." : metrics.total_reports.toString()}
            subtitle="ALL INCIDENTS"
            icon={<FileText size={28} />}
            status="neutral"
            onClick={() => handleStatCardClick('total_reports')}
          />
          <StatCard
            title="RESOLVED"
            value={loading ? "..." : metrics.resolved_reports.toString()}
            subtitle="COMPLETED MISSIONS"
            status="success"
            icon={<CircleCheck size={28} />}
            onClick={() => handleStatCardClick('resolved_reports')}
          />
          <StatCard
            title="PENDING"
            value={loading ? "..." : metrics.pending_reports.toString()}
            subtitle="AWAITING ACTION"
            status="warning"
            icon={<CircleAlert size={28} />}
            onClick={() => handleStatCardClick('pending_reports')}
          />
          <StatCard
            title="RESPONSE TIME"
            value="15 min"
            subtitle="AVERAGE RESPONSE"
            status="success"
            icon={<Target size={28} />}
            onClick={() => handleStatCardClick('response_time')}
          />
        </div>

        {/* Enhanced Map Section */}
        <div className="mb-10 animate-slide-in-right">
          <Tabs defaultValue="simple" className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white dhq-heading">Interactive Threat Map</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
                  <span className="text-green-400 text-sm font-semibold dhq-caption uppercase">LIVE</span>
                </div>
              </div>
              <TabsList className="bg-gray-800/60 border border-gray-700/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="simple" 
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white dhq-caption font-medium"
                >
                  Map View
                </TabsTrigger>
                <TabsTrigger 
                  value="google" 
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white dhq-caption font-medium"
                >
                  CIA Tactical View
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="simple" className="space-y-0">
              <SimpleMap showAllReports={true} />
            </TabsContent>

            <TabsContent value="google" className="space-y-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <GoogleMapsHeatmap />
                </div>
                <div className="lg:col-span-1">
                  <div className="dhq-card p-6 h-full">
                    <div className="flex items-center space-x-3 mb-6">
                      <FileText className="h-5 w-5 text-cyan-400" />
                      <h3 className="text-xl font-bold text-white dhq-heading">INTELLIGENCE FEED</h3>
                      <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
                    </div>
                    <NewsLiveFeed />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Real-Time Reports Section */}
        <div className="mb-10 animate-fade-in-up">
          <RealTimeReports />
        </div>

        {/* Enhanced Intelligence Reports Table */}
        <div className="dhq-card p-8 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white dhq-heading">INTELLIGENCE REPORTS</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400 dhq-caption">Classification:</div>
              <div className="px-4 py-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm font-semibold dhq-caption uppercase backdrop-blur-sm">
                CONFIDENTIAL
              </div>
            </div>
          </div>
          <IncidentTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
