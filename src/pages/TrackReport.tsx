
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AIChatbot from '@/components/AIChatbot';
import { Search, Shield, Clock, MapPin, User, AlertTriangle, CheckCircle, Eye, FileText, MessageCircle } from 'lucide-react';

interface Report {
  id: string;
  description: string | null;
  location: string | null;
  status: string | null;
  urgency: string | null;
  threat_type: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const TrackReport = () => {
  const [reportId, setReportId] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const { toast } = useToast();

  const handleTrackReport = async () => {
    if (!reportId.trim()) {
      toast({
        title: "Report ID Required",
        description: "Please enter a valid report ID to track",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Report Not Found",
          description: "No report found with the provided ID",
          variant: "destructive",
        });
        setReport(null);
      } else {
        setReport(data);
        toast({
          title: "Report Located",
          description: "Successfully retrieved report details",
        });
      }
    } catch (error: any) {
      console.error('Error tracking report:', error);
      toast({
        title: "Tracking Failed",
        description: error.message || "Failed to track report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-600';
      case 'under_review': return 'bg-blue-600';
      case 'investigating': return 'bg-purple-600';
      case 'resolved': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getUrgencyIcon = (urgency: string | null) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low': return <Clock className="w-4 h-4 text-green-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8 border-b border-gray-700/50 pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white p-2 mr-6">
              <img 
                src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">DEFENSE HEADQUARTERS</h1>
              <p className="text-xl text-gray-300">Intelligence Report Tracking System</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-green-400 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>SECURE TRACKING</span>
                </div>
                <div className="flex items-center text-blue-400 text-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>REAL-TIME STATUS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tracking Section */}
          <div className="lg:col-span-2">
            {/* Search Section */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Search className="w-6 h-6 mr-3 text-blue-400" />
                TRACK INTELLIGENCE REPORT
              </h2>
              
              <div className="flex space-x-4 mb-6">
                <Input
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  placeholder="Enter Report ID (e.g., 1a2b3c4d)"
                  className="bg-gray-900/50 border-gray-600 text-white flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackReport()}
                />
                <Button 
                  onClick={handleTrackReport}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  {loading ? 'SEARCHING...' : 'TRACK REPORT'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Report Status</p>
                  <p className="text-gray-400 text-sm">Real-time updates</p>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Location Data</p>
                  <p className="text-gray-400 text-sm">Incident coordinates</p>
                </div>
                <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Timeline</p>
                  <p className="text-gray-400 text-sm">Processing history</p>
                </div>
              </div>
            </Card>

            {/* Report Details */}
            {report && (
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    REPORT DETAILS
                  </h3>
                  <Badge className={`${getStatusColor(report.status)} text-white font-bold`}>
                    {report.status?.toUpperCase().replace('_', ' ') || 'UNKNOWN'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">REPORT ID</label>
                      <p className="text-white font-mono text-lg">{report.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">THREAT TYPE</label>
                      <p className="text-white">{report.threat_type || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">LOCATION</label>
                      <p className="text-white">{report.location || 'Coordinates classified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">PRIORITY LEVEL</label>
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(report.urgency)}
                        <span className="text-white">{report.urgency?.toUpperCase() || 'STANDARD'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">SUBMITTED</label>
                      <p className="text-white">
                        {report.created_at ? new Date(report.created_at).toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold">LAST UPDATED</label>
                      <p className="text-white">
                        {report.updated_at ? new Date(report.updated_at).toLocaleString() : 'No updates'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <label className="text-gray-400 text-sm font-semibold">INTELLIGENCE SUMMARY</label>
                  <p className="text-white mt-2 leading-relaxed">
                    {report.description || 'Details classified for operational security.'}
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="mt-8">
                  <h4 className="text-white font-bold mb-4">PROCESSING STATUS</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">SUBMITTED</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-600"></div>
                    <div className={`flex items-center space-x-2 ${
                      ['under_review', 'investigating', 'resolved'].includes(report.status || '') 
                        ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">ANALYSIS</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-600"></div>
                    <div className={`flex items-center space-x-2 ${
                      ['investigating', 'resolved'].includes(report.status || '') 
                        ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">OPERATION</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-600"></div>
                    <div className={`flex items-center space-x-2 ${
                      report.status === 'resolved' ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">RESOLVED</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Chatbot Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="mb-4">
                <Button 
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{showChatbot ? 'HIDE AI ASSISTANT' : 'DHQ AI ASSISTANT'}</span>
                </Button>
              </div>
              
              {showChatbot && <AIChatbot />}

              {/* Quick Links */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4 mt-4">
                <h4 className="text-white font-bold mb-3">QUICK ACCESS</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Submit New Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Emergency Hotline
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Contact DHQ
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackReport;
