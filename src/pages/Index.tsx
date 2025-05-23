
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Defense Intelligence Dashboard
              </h1>
              <p className="text-gray-400">
                Real-time monitoring and threat assessment across Nigeria
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">Last Updated</p>
                <p className="text-gray-400 text-sm">
                  {loading ? 'Loading...' : 'Live'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Real-time data from reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="ACTIVE INCIDENTS"
            value={loading ? "..." : activeIncidents.toString()}
            icon={<CircleAlert size={24} />}
            status="critical"
          />
          <StatCard
            title="CRITICAL ALERTS"
            value={loading ? "..." : criticalAlerts.toString()}
            subtitle={`TOTAL REPORTS: ${reports.length}`}
            status="critical"
            trend="up"
            trendValue={criticalAlerts > 0 ? criticalAlerts.toString() : "0"}
            icon={<CircleArrowUp size={24} />}
          />
          <StatCard
            title="INCIDENTS RESOLVED"
            value={loading ? "..." : resolvedToday.toString()}
            subtitle="TODAY"
            status="success"
            icon={<CircleCheck size={24} />}
          />
          <StatCard
            title="PENDING REPORTS"
            value={loading ? "..." : pendingReports.toString()}
            subtitle="AWAITING REVIEW"
            status="warning"
            icon={<Target size={24} />}
          />
        </div>

        {/* Map and Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <NigeriaMap />
          </div>
          <div className="lg:col-span-1">
            <NewsLiveFeed />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <ChartsSection />
        </div>

        {/* Incident Table */}
        <IncidentTable />
      </div>
    </div>
  );
};

export default Index;
