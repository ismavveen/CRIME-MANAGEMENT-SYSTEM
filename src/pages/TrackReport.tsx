
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, MessageSquare, MapPin, Clock, CheckCircle, AlertTriangle, Phone, Mail } from 'lucide-react';

interface Report {
  id: string;
  description: string;
  status: string;
  created_at: string;
  threat_type: string;
  location: string;
  reporter_type: string;
  urgency: string;
}

const TrackReport = () => {
  const [reportId, setReportId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!reportId && !phoneNumber) {
      toast({
        title: "Search required",
        description: "Please enter a report ID or phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let query = supabase.from('reports').select('*');
      
      if (searchType === 'id' && reportId) {
        query = query.eq('id', reportId);
      } else if (searchType === 'phone' && phoneNumber) {
        // In a real implementation, you'd store phone numbers separately
        // For now, we'll search by the first few characters of the ID
        query = query.ilike('id', `${phoneNumber}%`);
      }

      const { data, error } = await query.single();

      if (error) {
        toast({
          title: "Report not found",
          description: "No report found with the provided information",
          variant: "destructive"
        });
        setReport(null);
        return;
      }

      setReport(data);
    } catch (error) {
      console.error('Error searching report:', error);
      toast({
        title: "Search failed",
        description: "Failed to search for report",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return 'bg-yellow-500';
      case 'investigating':
      case 'being investigated':
        return 'bg-blue-500';
      case 'responded':
        return 'bg-purple-500';
      case 'closed':
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'investigating':
      case 'being investigated':
        return <AlertTriangle className="w-4 h-4" />;
      case 'responded':
        return <MessageSquare className="w-4 h-4" />;
      case 'closed':
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Report</h1>
          <p className="text-gray-400">Monitor the status of your submitted reports</p>
        </div>

        {/* Search Card */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setSearchType('id')}
                className={`px-4 py-2 rounded-lg ${
                  searchType === 'id' 
                    ? 'bg-dhq-blue text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Report ID
              </button>
              <button
                onClick={() => setSearchType('phone')}
                className={`px-4 py-2 rounded-lg ${
                  searchType === 'phone' 
                    ? 'bg-dhq-blue text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                Phone Number
              </button>
            </div>

            <div className="flex space-x-4">
              {searchType === 'id' ? (
                <Input
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  placeholder="Enter your report ID (e.g., REP-2023-001)"
                  className="bg-gray-900/50 border-gray-600 text-white flex-1"
                />
              ) : (
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-gray-900/50 border-gray-600 text-white flex-1"
                />
              )}
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-dhq-blue hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Details */}
        {report && (
          <Card className="bg-gray-800/50 border-gray-700/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Report Details</h2>
              <Badge className={`${getStatusColor(report.status)} text-white`}>
                {getStatusIcon(report.status)}
                <span className="ml-1">{report.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Report ID</label>
                  <p className="text-white font-mono">{report.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Type</label>
                  <p className="text-white">{report.threat_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Urgency</label>
                  <p className="text-white capitalize">{report.urgency}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Submitted</label>
                  <p className="text-white">{new Date(report.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Location</label>
                  <p className="text-white flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Channel</label>
                  <p className="text-white capitalize">{report.reporter_type}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-400">Description</label>
              <p className="text-white mt-1">{report.description}</p>
            </div>

            {/* Status Timeline */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Status Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white">Report Submitted</p>
                    <p className="text-gray-400 text-sm">{new Date(report.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {report.status !== 'pending' && (
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white">Under Investigation</p>
                      <p className="text-gray-400 text-sm">Being reviewed by DHQ team</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* DHQ AI Chatbot */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">DHQ AI Assistant</h2>
            <Button
              onClick={() => setShowChat(!showChat)}
              variant="outline"
              className="bg-transparent border-dhq-blue text-dhq-blue"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {showChat ? 'Hide Chat' : 'Start Chat'}
            </Button>
          </div>

          {showChat && (
            <div className="space-y-4">
              <div className="bg-gray-900/60 p-4 rounded-lg max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-dhq-blue/20 p-3 rounded-lg">
                    <p className="text-white text-sm">
                      <strong>DHQ AI:</strong> Hello! I'm here to help you with your report status and answer any questions about DHQ processes. How can I assist you today?
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  className="bg-gray-900/50 border-gray-600 text-white flex-1"
                />
                <Button className="bg-dhq-blue hover:bg-blue-700">
                  Send
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 text-left justify-start">
                  What's the status of my report?
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 text-left justify-start">
                  How long does investigation take?
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 text-left justify-start">
                  Can I update my report?
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300 text-left justify-start">
                  Emergency contact information
                </Button>
              </div>
            </div>
          )}

          {!showChat && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Click "Start Chat" to get instant help from our AI assistant</p>
            </div>
          )}
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-dhq-blue" />
              <div>
                <p className="text-white font-medium">Emergency Hotline</p>
                <p className="text-gray-400">199 | 112</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-dhq-blue" />
              <div>
                <p className="text-white font-medium">Report via Email</p>
                <p className="text-gray-400">reports@dhq.gov.ng</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrackReport;
