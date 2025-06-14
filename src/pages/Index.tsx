import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import StatCard from '../components/StatCard';
import GoogleMapsHeatmap from '../components/GoogleMapsHeatmap';
import IncidentTable from '../components/IncidentTable';
import NotificationPanel from '../components/NotificationPanel';
import RealTimeReports from '../components/RealTimeReports';
import ReportDetailsModal from '../components/ReportDetailsModal';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { FileText, CircleArrowUp, CircleAlert, CircleCheck, Target, Activity } from 'lucide-react';

const Index = () => {
  const { reports, loading: reportsLoading } = useReports();
  const { assignments } = useAssignments();
  const { metrics, loading: metricsLoading } = useSystemMetrics();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const loading = reportsLoading || metricsLoading;

  const handleStatCardClick = (type: string) => {
    console.log(`Clicked on ${type} stat card`);
  };

  const handleMarkerClick = (report: any) => {
    setSelectedReport(report);
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-6 space-y-6">
        {/* Enhanced Header with DHQ Logo */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 p-3 backdrop-blur-sm border border-white/20">
                <img 
                  src="/lovable-uploads/b160c848-06aa-40b9-8717-59194cc9a1a8.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white mb-2 dhq-heading tracking-tight">
                  Crime Reporting & Monitoring Portal
                </h1>
                <p className="text-gray-300 text-lg dhq-body font-medium">
                  Real-Time Crime Intelligence & Response System
                </p>
                <div className="flex items-center space-x-3 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Enhanced Map Section - Full Width */}
        <div className="mb-8 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white dhq-heading">Live Crime Intelligence Map</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
                <span className="text-green-400 text-sm font-semibold dhq-caption uppercase">LIVE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Assigned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Resolved</span>
              </div>
            </div>
          </div>
          
          {/* Full Width Map Container */}
          <div className="w-full">
            <div className="dhq-card p-6 h-[600px]">
              <GoogleMapsHeatmap 
                reports={reports} 
                onMarkerClick={handleMarkerClick}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Real-Time Reports Section */}
        <div className="mb-8 animate-fade-in-up">
          <RealTimeReports />
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

    </div>
  );
};

export default Index;
