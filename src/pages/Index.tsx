
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import NigeriaMap from '../components/NigeriaMap';
import ChartsSection from '../components/ChartsSection';
import IncidentTable from '../components/IncidentTable';
import NewsLiveFeed from '../components/NewsLiveFeed';
import { useReports } from '@/hooks/useReports';
import { FileText, CircleArrowUp, CircleAlert, CircleCheck, Target } from 'lucide-react';

const Index = () => {
  const { reports, loading } = useReports();

  // Calculate real-time statistics from actual reports
  const activeIncidents = reports.filter(r => r.status !== 'resolved').length;
  const criticalAlerts = reports.filter(r => 
    r.urgency === 'critical' || r.priority === 'high'
  ).length;
  const resolvedToday = reports.filter(r => {
    const today = new Date().toDateString();
    const reportDate = new Date(r.created_at || '').toDateString();
    return r.status === 'resolved' && reportDate === today;
  }).length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Enhanced Header with DHQ Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white p-2">
                <img 
                  src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Defense Headquarters Intelligence Portal
                </h1>
                <p className="text-gray-400 text-lg">
                  Real-time Crime Reporting & Threat Assessment System
                </p>
                <p className="text-green-400 text-sm font-semibold">
                  🔒 CLASSIFIED - FOR AUTHORIZED PERSONNEL ONLY
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">System Status</p>
                <p className="text-gray-400 text-sm">
                  {loading ? 'Synchronizing...' : 'OPERATIONAL'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with Military Terminology */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="ACTIVE OPERATIONS"
            value={loading ? "..." : activeIncidents.toString()}
            subtitle="ONGOING INCIDENTS"
            icon={<CircleAlert size={24} />}
            status="critical"
          />
          <StatCard
            title="HIGH PRIORITY ALERTS"
            value={loading ? "..." : criticalAlerts.toString()}
            subtitle={`TOTAL INTEL: ${reports.length}`}
            status="critical"
            trend="up"
            trendValue={criticalAlerts > 0 ? criticalAlerts.toString() : "0"}
            icon={<CircleArrowUp size={24} />}
          />
          <StatCard
            title="MISSIONS COMPLETED"
            value={loading ? "..." : resolvedToday.toString()}
            subtitle="TODAY"
            status="success"
            icon={<CircleCheck size={24} />}
          />
          <StatCard
            title="PENDING ANALYSIS"
            value={loading ? "..." : pendingReports.toString()}
            subtitle="AWAITING REVIEW"
            status="warning"
            icon={<Target size={24} />}
          />
        </div>

        {/* Tactical Map and Intelligence Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">TACTICAL SITUATION MAP</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm">LIVE INTEL</span>
                </div>
              </div>
              <NigeriaMap />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-4">INTELLIGENCE FEED</h3>
              <NewsLiveFeed />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <ChartsSection />
        </div>

        {/* Intelligence Reports Table */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">INTELLIGENCE REPORTS</h3>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-400">Classification:</div>
              <div className="px-2 py-1 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs">
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
