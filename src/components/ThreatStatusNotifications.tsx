
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock, CheckCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThreatNotification {
  id: string;
  reportId: string;
  serialNumber?: string;
  threatLevel: 'clean' | 'infected' | 'suspicious' | 'pending';
  threatCount: number;
  timestamp: string;
  fileCount: number;
}

const ThreatStatusNotifications = () => {
  const [threats, setThreats] = useState<ThreatNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentThreats();

    // Subscribe to new scan results
    const channel = supabase
      .channel('threat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'file_scan_logs'
        },
        (payload) => {
          const scanLog = payload.new;
          console.log('New scan result:', scanLog);
          
          if (scanLog.scan_result === 'infected' || scanLog.scan_result === 'suspicious') {
            toast({
              title: "🚨 Threat Detected",
              description: `${scanLog.threats_detected?.length || 1} threat(s) found in uploaded file`,
              variant: "destructive",
            });
          }
          
          fetchRecentThreats(); // Refresh the list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchRecentThreats = async () => {
    try {
      setLoading(true);
      
      // Get recent scan logs with report information
      const { data: scanLogs, error } = await supabase
        .from('file_scan_logs')
        .select(`
          *,
          reports:report_id (
            id,
            serial_number,
            threat_type,
            created_at
          )
        `)
        .order('scan_timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching threat data:', error);
        return;
      }

      // Group by report and calculate threat levels
      const reportThreats = new Map<string, ThreatNotification>();
      
      scanLogs?.forEach(log => {
        const reportId = log.report_id;
        if (!reportId) return;

        if (!reportThreats.has(reportId)) {
          reportThreats.set(reportId, {
            id: reportId,
            reportId,
            serialNumber: log.reports?.serial_number,
            threatLevel: 'clean',
            threatCount: 0,
            timestamp: log.scan_timestamp,
            fileCount: 0
          });
        }

        const threat = reportThreats.get(reportId)!;
        threat.fileCount++;

        // Determine highest threat level
        if (log.scan_result === 'infected') {
          threat.threatLevel = 'infected';
          threat.threatCount += log.threats_detected?.length || 1;
        } else if (log.scan_result === 'suspicious' && threat.threatLevel !== 'infected') {
          threat.threatLevel = 'suspicious';
          threat.threatCount += log.threats_detected?.length || 1;
        } else if (log.scan_result === 'pending' && !['infected', 'suspicious'].includes(threat.threatLevel)) {
          threat.threatLevel = 'pending';
        }
      });

      setThreats(Array.from(reportThreats.values()).slice(0, 10));
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThreatBadge = (threatLevel: string, threatCount: number) => {
    switch (threatLevel) {
      case 'infected':
        return (
          <Badge className="bg-red-600 text-white animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {threatCount} Virus{threatCount > 1 ? 'es' : ''} Detected
          </Badge>
        );
      case 'suspicious':
        return (
          <Badge className="bg-orange-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {threatCount} Suspicious File{threatCount > 1 ? 's' : ''}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Scanning...
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Clean
          </Badge>
        );
    }
  };

  const getThreatIcon = (threatLevel: string) => {
    switch (threatLevel) {
      case 'infected':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'suspicious':
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <Shield className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="h-6 w-6 text-cyan-400" />
          <span>Real-time Threat Status</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading threat status...</p>
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-400" />
            <p className="text-green-400 font-medium">No recent file scans</p>
            <p className="text-gray-400 text-sm">Files will appear here when reports are submitted</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  threat.threatLevel === 'infected' ? 'bg-red-900/20 border-red-700/50' :
                  threat.threatLevel === 'suspicious' ? 'bg-orange-900/20 border-orange-700/50' :
                  threat.threatLevel === 'pending' ? 'bg-yellow-900/20 border-yellow-700/50' :
                  'bg-green-900/20 border-green-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getThreatIcon(threat.threatLevel)}
                  <div>
                    <p className="text-white font-medium">
                      Report: {threat.serialNumber || threat.reportId.slice(0, 8)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {threat.fileCount} file{threat.fileCount > 1 ? 's' : ''} scanned • {new Date(threat.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getThreatBadge(threat.threatLevel, threat.threatCount)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/reports?highlight=${threat.reportId}`}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreatStatusNotifications;
