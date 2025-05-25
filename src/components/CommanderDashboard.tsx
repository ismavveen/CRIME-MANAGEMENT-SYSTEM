
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bell,
  LogOut,
  Activity,
  MapPin,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useReports } from '@/hooks/useReports';

interface CommanderDashboardProps {
  commander: any;
  onLogout: () => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ commander, onLogout }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [acknowledgmentDialog, setAcknowledgmentDialog] = useState(false);
  const [resolutionDialog, setResolutionDialog] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const { reports } = useReports();
  const { toast } = useToast();

  const stateReports = reports.filter(r => r.state === commander.state);
  const pendingReports = stateReports.filter(r => r.status !== 'resolved');
  const resolvedReports = stateReports.filter(r => r.status === 'resolved');
  const urgentReports = stateReports.filter(r => r.urgency === 'critical' || r.priority === 'high');

  useEffect(() => {
    fetchNotifications();
    fetchWarnings();

    // Set up real-time subscriptions
    const notificationsChannel = supabase
      .channel('commander-notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'commander_notifications',
        filter: `commander_id=eq.${commander.id}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    const warningsChannel = supabase
      .channel('commander-warnings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'commander_warnings',
        filter: `commander_id=eq.${commander.id}`
      }, () => {
        fetchWarnings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(warningsChannel);
    };
  }, [commander.id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('commander_notifications')
        .select('*')
        .eq('commander_id', commander.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchWarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('commander_warnings')
        .select('*')
        .eq('commander_id', commander.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWarnings(data || []);
    } catch (error: any) {
      console.error('Error fetching warnings:', error);
    }
  };

  const acknowledgeReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          acknowledged_at: new Date().toISOString(),
          assigned_commander_id: commander.id 
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report Acknowledged",
        description: "Report has been acknowledged and assigned to you",
      });

      setAcknowledgmentDialog(false);
    } catch (error: any) {
      toast({
        title: "Acknowledgment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resolveReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // Also update assignment if exists
      await supabase
        .from('report_assignments')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: commander.full_name,
          resolution_notes: resolutionNotes
        })
        .eq('report_id', reportId);

      toast({
        title: "Report Resolved",
        description: "Report has been marked as resolved",
      });

      setResolutionDialog(false);
      setResolutionNotes('');
    } catch (error: any) {
      toast({
        title: "Resolution Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const acknowledgeWarning = async (warningId: string) => {
    try {
      const { error } = await supabase
        .from('commander_warnings')
        .update({ 
          acknowledged: true,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', warningId);

      if (error) throw error;

      toast({
        title: "Warning Acknowledged",
        description: "Warning has been acknowledged",
      });

      fetchWarnings();
    } catch (error: any) {
      toast({
        title: "Acknowledgment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await supabase
        .from('commander_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      fetchNotifications();
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;
  const unacknowledgedWarnings = warnings.filter(w => !w.acknowledged).length;

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-dhq-blue rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{commander.full_name}</h1>
              <p className="text-gray-400">{commander.state} State Command Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              {unreadNotifications > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <Button onClick={onLogout} variant="outline" className="bg-transparent border-gray-600 text-gray-300">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Warning Alerts */}
        {unacknowledgedWarnings > 0 && (
          <div className="mb-6 bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-red-300 font-semibold">Unacknowledged Warnings</h3>
                <p className="text-red-200">You have {unacknowledgedWarnings} warning(s) that require your attention.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-white">{stateReports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-orange-400">{pendingReports.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved</p>
                  <p className="text-2xl font-bold text-green-400">{resolvedReports.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Urgent</p>
                  <p className="text-2xl font-bold text-red-400">{urgentReports.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="reports" className="data-[state=active]:bg-dhq-blue">
              <FileText className="h-4 w-4 mr-2" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-dhq-blue">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {unreadNotifications > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadNotifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="warnings" className="data-[state=active]:bg-dhq-blue">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warnings
              {unacknowledgedWarnings > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unacknowledgedWarnings}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-dhq-blue">
              <Shield className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="space-y-4">
              {stateReports.map((report) => (
                <Card key={report.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={`${getUrgencyColor(report.urgency || report.priority)} text-white`}>
                            {(report.urgency || report.priority || 'medium').toUpperCase()}
                          </Badge>
                          <span className="text-white font-medium">{report.threat_type || 'Security Report'}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{report.id.slice(0, 8)}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {report.location || report.manual_location || 'Unknown location'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(report.created_at || '').toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.status !== 'resolved' && (
                          <>
                            {!report.acknowledged_at && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setAcknowledgmentDialog(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setResolutionDialog(true);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {report.status === 'resolved' && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border-gray-700 cursor-pointer transition-colors ${
                    notification.is_read ? 'bg-gray-800/30' : 'bg-blue-900/20 border-blue-700'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Badge className="bg-gray-600 text-white">
                            {notification.type.toUpperCase()}
                          </Badge>
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="warnings">
            <div className="space-y-4">
              {warnings.map((warning) => (
                <Card key={warning.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={`${getSeverityColor(warning.severity)} text-white`}>
                            {warning.severity.toUpperCase()}
                          </Badge>
                          <span className="text-white font-medium">{warning.reason}</span>
                        </div>
                        {warning.message && (
                          <p className="text-gray-300 mb-2">{warning.message}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Issued by: {warning.issued_by}</span>
                          <span>•</span>
                          <span>{new Date(warning.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {warning.acknowledged ? (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => acknowledgeWarning(warning.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Commander Profile</CardTitle>
                <CardDescription>Your command information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Full Name</Label>
                      <p className="text-white font-medium">{commander.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Command Area</Label>
                      <p className="text-white font-medium">{commander.state} State</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Status</Label>
                      <Badge className={`${getStatusColor(commander.status)} text-white`}>
                        {commander.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Email</Label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{commander.email}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Phone</Label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{commander.phone_number}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Joined</Label>
                      <p className="text-white">{new Date(commander.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Acknowledgment Dialog */}
        <Dialog open={acknowledgmentDialog} onOpenChange={setAcknowledgmentDialog}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Acknowledge Report</DialogTitle>
              <DialogDescription>
                Acknowledge that you have received and will handle this report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-gray-300">Report ID: {selectedReport?.id}</p>
              <p className="text-gray-300">Type: {selectedReport?.threat_type}</p>
              <p className="text-gray-300">Location: {selectedReport?.location || selectedReport?.manual_location}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAcknowledgmentDialog(false)} className="bg-transparent border-gray-600">
                Cancel
              </Button>
              <Button onClick={() => acknowledgeReport(selectedReport?.id)} className="bg-blue-600 hover:bg-blue-700">
                Acknowledge Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Resolution Dialog */}
        <Dialog open={resolutionDialog} onOpenChange={setResolutionDialog}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Resolve Report</DialogTitle>
              <DialogDescription>
                Mark this report as resolved and provide resolution notes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-300">Report ID: {selectedReport?.id}</p>
                <p className="text-gray-300">Type: {selectedReport?.threat_type}</p>
              </div>
              <div>
                <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                <Textarea
                  id="resolutionNotes"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Describe how the issue was resolved..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResolutionDialog(false)} className="bg-transparent border-gray-600">
                Cancel
              </Button>
              <Button onClick={() => resolveReport(selectedReport?.id)} className="bg-green-600 hover:bg-green-700">
                Mark as Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'suspended': return 'bg-red-500';
    case 'inactive': return 'bg-gray-500';
    default: return 'bg-blue-500';
  }
};

export default CommanderDashboard;
