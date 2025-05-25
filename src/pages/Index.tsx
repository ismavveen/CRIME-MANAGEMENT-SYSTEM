
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import GoogleMapsHeatmap from '../components/GoogleMapsHeatmap';
import ChartsSection from '../components/ChartsSection';
import IncidentTable from '../components/IncidentTable';
import NewsLiveFeed from '../components/NewsLiveFeed';
import NotificationPanel from '../components/NotificationPanel';
import SimpleMap from '../components/SimpleMap';
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
        {/* Enhanced Header with improved spacing and typography */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                <img 
                  src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white mb-3 dhq-heading tracking-tight">
                  Defense Headquarters Intelligence Portal
                </h1>
                <p className="text-gray-300 text-xl dhq-body font-medium">
                  Real-time Crime Reporting & Threat Assessment System
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

        {/* Enhanced Stats Grid with improved cards and spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard
            title="ACTIVE OPERATIONS"
            value={loading ? "..." : metrics.active_operations.toString()}
            subtitle="ONGOING INCIDENTS"
            icon={<CircleAlert size={28} />}
            status="critical"
            onClick={() => handleStatCardClick('active_operations')}
          />
          <StatCard
            title="HIGH PRIORITY ALERTS"
            value={loading ? "..." : metrics.critical_reports.toString()}
            subtitle={`TOTAL INTEL: ${metrics.total_reports}`}
            status="critical"
            trend="up"
            trendValue={metrics.critical_reports > 0 ? metrics.critical_reports.toString() : "0"}
            icon={<CircleArrowUp size={28} />}
            onClick={() => handleStatCardClick('critical_reports')}
          />
          <StatCard
            title="MISSIONS COMPLETED"
            value={loading ? "..." : metrics.resolved_reports.toString()}
            subtitle="TOTAL RESOLVED"
            status="success"
            icon={<CircleCheck size={28} />}
            onClick={() => handleStatCardClick('resolved_reports')}
          />
          <StatCard
            title="PENDING ASSIGNMENT"
            value={loading ? "..." : metrics.pending_reports.toString()}
            subtitle="AWAITING DEPLOYMENT"
            status="warning"
            icon={<Target size={28} />}
            onClick={() => handleStatCardClick('pending_reports')}
          />
        </div>

        {/* Enhanced Map Section with improved styling */}
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

        {/* Enhanced Charts Section */}
        <div className="mb-10 animate-fade-in-up">
          <ChartsSection />
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
