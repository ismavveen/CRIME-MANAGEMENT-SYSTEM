
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import NigeriaMap from '../components/NigeriaMap';
import ChartsSection from '../components/ChartsSection';
import IncidentTable from '../components/IncidentTable';
import NewsLiveFeed from '../components/NewsLiveFeed';
import { Users, FileText, CircleArrowUp, CircleCheck } from 'lucide-react';

const Index = () => {
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
                <p className="text-gray-400 text-sm">2 minutes ago</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="TOTAL USERS"
            value="2,045"
            icon={<Users size={24} />}
            status="neutral"
          />
          <StatCard
            title="SIGN-UPS"
            value="3"
            subtitle="PAST 24 HOURS"
            status="success"
            trend="up"
            trendValue="2"
          />
          <StatCard
            title="SIGN-INS"
            value="3"
            subtitle="SUCCESS: 3 | FAILED: 0"
            status="success"
            trend="neutral"
          />
          <StatCard
            title="ACTIVE INCIDENTS"
            value="7"
            subtitle="CRITICAL: 3 | WARNING: 4"
            status="critical"
            icon={<CircleArrowUp size={24} />}
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
