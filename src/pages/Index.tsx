
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import NigeriaMap from '../components/NigeriaMap';
import ChartsSection from '../components/ChartsSection';
import IncidentTable from '../components/IncidentTable';
import NewsLiveFeed from '../components/NewsLiveFeed';
import NotificationPanel from '../components/NotificationPanel';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { FileText, CircleArrowUp, CircleAlert, CircleCheck, Target } from 'lucide-react';

const Index = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { assignments } = useAssignments();
  const { metrics, loading: metricsLoading } = useSystemMetrics();

  const loading = reportsLoading || metricsLoading;

  // Calculate real-time statistics from actual reports and system metrics
  const activeIncidents = metrics.active_operations || 0;
  const criticalAlerts = reports.filter(r => 
    r.urgency === 'critical' || r.priority === 'high'
  ).length;
  const resolvedToday = assignments.filter(a => {
    const today = new Date().toDateString();
    const resolvedDate = a.resolved_at ? new Date(a.resolved_at).toDateString() : null;
    return a.status === 'resolved' && resolvedDate === today;
  }).length;
  const pendingReports = reports.filter(r => 
    !assignments.some(a => a.report_id === r.id)
  ).length;

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Enhanced Header with DHQ Logo and Notifications */}
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
              <NotificationPanel />
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

        {/* Enhanced Stats Grid with Real-time Data */}
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
            subtitle={`TOTAL INTEL: ${metrics.total_reports || reports.length}`}
            status="critical"
            trend="up"
            trendValue={criticalAlerts > 0 ? criticalAlerts.toString() : "0"}
            icon={<CircleArrowUp size={24} />}
          />
          <StatCard
            title="MISSIONS COMPLETED"
            value={loading ? "..." : (metrics.resolved_reports || resolvedToday).toString()}
            subtitle="TOTAL RESOLVED"
            status="success"
            icon={<CircleCheck size={24} />}
          />
          <StatCard
            title="PENDING ASSIGNMENT"
            value={loading ? "..." : pendingReports.toString()}
            subtitle="AWAITING DEPLOYMENT"
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
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
