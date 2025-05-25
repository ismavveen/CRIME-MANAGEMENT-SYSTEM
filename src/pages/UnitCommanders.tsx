
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { useReports } from '@/hooks/useReports';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Eye,
  UserX,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnitCommanders = () => {
  const { commanders, warnings, adminActions, systemMetrics, loading, issueWarning, takeAdminAction, acknowledgeWarning } = useUnitCommanders();
  const { reports } = useReports();
  const { toast } = useToast();
  
  const [selectedCommander, setSelectedCommander] = useState<any>(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = useState(false);
  
  const [warningForm, setWarningForm] = useState({
    reason: '',
    message: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });
  
  const [actionForm, setActionForm] = useState({
    actionType: 'warning' as 'warning' | 'suspension' | 'escalation' | 'reactivation',
    reason: '',
    details: '',
    effectiveUntil: ''
  });

  // Calculate performance metrics for each commander
  const getCommanderMetrics = (commanderId: string, state: string) => {
    const stateReports = reports.filter(r => r.state === state);
    const assignedReports = stateReports.length;
    const pendingReports = stateReports.filter(r => r.status !== 'resolved').length;
    const resolvedReports = stateReports.filter(r => r.status === 'resolved').length;
    const commanderWarnings = warnings.filter(w => w.commander_id === commanderId);
    const unacknowledgedWarnings = commanderWarnings.filter(w => !w.acknowledged).length;
    
    return {
      assignedReports,
      pendingReports,
      resolvedReports,
      warnings: commanderWarnings.length,
      unacknowledgedWarnings,
      responseRate: assignedReports > 0 ? Math.round((resolvedReports / assignedReports) * 100) : 0
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleIssueWarning = async () => {
    if (!selectedCommander) return;
    
    await issueWarning(
      selectedCommander.id,
      warningForm.reason,
      warningForm.message,
      warningForm.severity,
      'DHQ Admin' // This would be the current user in a real app
    );
    
    setWarningDialogOpen(false);
    setWarningForm({ reason: '', message: '', severity: 'medium' });
  };

  const handleAdminAction = async () => {
    if (!selectedCommander) return;
    
    await takeAdminAction(
      selectedCommander.id,
      actionForm.actionType,
      actionForm.reason,
      actionForm.details,
      'DHQ Admin', // This would be the current user in a real app
      actionForm.effectiveUntil || undefined
    );
    
    setActionDialogOpen(false);
    setActionForm({ actionType: 'warning', reason: '', details: '', effectiveUntil: '' });
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-64"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Unit Commanders Management</h1>
              <p className="text-gray-400">
                Monitor and manage unit commanders across all Nigerian states
              </p>
            </div>
            <Button 
              onClick={() => setRegistrationDialogOpen(true)}
              className="bg-dhq-blue hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Register New Commander
            </Button>
          </div>
        </div>

        {/* System Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Operations</p>
                  <p className="text-2xl font-bold text-white">{systemMetrics.active_operations}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-white">{systemMetrics.total_reports}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Resolved Cases</p>
                  <p className="text-2xl font-bold text-white">{systemMetrics.resolved_reports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Commanders</p>
                  <p className="text-2xl font-bold text-white">{commanders.filter(c => c.status === 'active').length}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="commanders" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="commanders" className="data-[state=active]:bg-dhq-blue">
              <Users className="h-4 w-4 mr-2" />
              Unit Commanders
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-dhq-blue">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Monitoring
            </TabsTrigger>
            <TabsTrigger value="warnings" className="data-[state=active]:bg-dhq-blue">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warnings & Actions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-dhq-blue">
              <Activity className="h-4 w-4 mr-2" />
              State Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commanders">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {commanders.map((commander) => {
                const metrics = getCommanderMetrics(commander.id, commander.state);
                const recentWarnings = warnings.filter(w => w.commander_id === commander.id).slice(0, 3);
                
                return (
                  <Card key={commander.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">{commander.full_name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {commander.state} State
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(commander.status)} text-white`}>
                          {commander.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          {commander.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Phone className="h-4 w-4 mr-2" />
                          {commander.phone_number}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-400">Assigned Reports</p>
                          <p className="text-white font-semibold">{metrics.assignedReports}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-400">Response Rate</p>
                          <p className="text-white font-semibold">{metrics.responseRate}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-400">Pending</p>
                          <p className="text-orange-400 font-semibold">{metrics.pendingReports}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-400">Warnings</p>
                          <p className="text-red-400 font-semibold">{metrics.unacknowledgedWarnings}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCommander(commander);
                            setPerformanceDialogOpen(true);
                          }}
                          className="bg-transparent border-gray-600 text-gray-300 flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCommander(commander);
                            setWarningDialogOpen(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 flex-1"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Warn
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCommander(commander);
                            setActionDialogOpen(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 flex-1"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Action
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {commanders.map((commander) => {
                  const metrics = getCommanderMetrics(commander.id, commander.state);
                  const stateReports = reports.filter(r => r.state === commander.state);
                  const overdueReports = stateReports.filter(r => {
                    if (r.status === 'resolved') return false;
                    const daysSinceReport = Math.floor((new Date().getTime() - new Date(r.created_at || '').getTime()) / (1000 * 60 * 60 * 24));
                    return daysSinceReport > 7; // Consider reports older than 7 days as overdue
                  });
                  
                  return (
                    <Card key={commander.id} className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-white">{commander.full_name}</CardTitle>
                            <CardDescription>{commander.state} State Performance</CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(commander.status)} text-white`}>
                            {commander.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Reports:</span>
                              <span className="text-white font-semibold">{metrics.assignedReports}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Resolved:</span>
                              <span className="text-green-400 font-semibold">{metrics.resolvedReports}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Pending:</span>
                              <span className="text-orange-400 font-semibold">{metrics.pendingReports}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Response Rate:</span>
                              <span className="text-blue-400 font-semibold">{metrics.responseRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Overdue:</span>
                              <span className="text-red-400 font-semibold">{overdueReports.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Warnings:</span>
                              <span className="text-yellow-400 font-semibold">{metrics.warnings}</span>
                            </div>
                          </div>
                        </div>
                        
                        {overdueReports.length > 0 && (
                          <div className="bg-red-900/20 border border-red-700/50 rounded p-3">
                            <div className="flex items-center mb-2">
                              <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                              <span className="text-red-300 font-semibold">Overdue Reports</span>
                            </div>
                            <p className="text-red-200 text-sm">
                              {overdueReports.length} report(s) have been pending for more than 7 days
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="warnings">
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Recent Warnings & Actions</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {warnings.map((warning) => (
                    <div key={warning.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className={`${getSeverityColor(warning.severity)} text-white`}>
                              {warning.severity.toUpperCase()}
                            </Badge>
                            <span className="text-white font-medium">{warning.commander?.full_name}</span>
                            <span className="text-gray-400">({warning.commander?.state})</span>
                          </div>
                          <p className="text-gray-300 mb-1">{warning.reason}</p>
                          {warning.message && (
                            <p className="text-gray-400 text-sm">{warning.message}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
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
                              Mark Acknowledged
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Administrative Actions</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {adminActions.map((action) => (
                    <div key={action.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className={`${action.action_type === 'suspension' ? 'bg-red-500' : action.action_type === 'escalation' ? 'bg-orange-500' : 'bg-blue-500'} text-white`}>
                              {action.action_type.toUpperCase()}
                            </Badge>
                            <span className="text-white font-medium">{action.commander?.full_name}</span>
                            <span className="text-gray-400">({action.commander?.state})</span>
                          </div>
                          <p className="text-gray-300 mb-1">{action.reason}</p>
                          {action.details && (
                            <p className="text-gray-400 text-sm">{action.details}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span>By: {action.admin_id}</span>
                            <span>•</span>
                            <span>{new Date(action.created_at).toLocaleString()}</span>
                            {action.effective_until && (
                              <>
                                <span>•</span>
                                <span>Until: {new Date(action.effective_until).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {nigerianStates.map((state) => {
                const stateReports = reports.filter(r => r.state === state);
                const stateCommander = commanders.find(c => c.state === state);
                const pendingReports = stateReports.filter(r => r.status !== 'resolved').length;
                const resolvedReports = stateReports.filter(r => r.status === 'resolved').length;
                const totalReports = stateReports.length;
                const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
                
                return (
                  <Card key={state} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        {state} State
                        {!stateCommander && (
                          <Badge className="bg-red-500 text-white">No Commander</Badge>
                        )}
                      </CardTitle>
                      {stateCommander && (
                        <CardDescription>{stateCommander.full_name}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Reports:</span>
                          <span className="text-white font-semibold">{totalReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pending:</span>
                          <span className="text-orange-400 font-semibold">{pendingReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resolved:</span>
                          <span className="text-green-400 font-semibold">{resolvedReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Resolution Rate:</span>
                          <span className="text-blue-400 font-semibold">{resolutionRate}%</span>
                        </div>
                        
                        {stateCommander && (
                          <div className="pt-3 border-t border-gray-700">
                            <Badge className={`${getStatusColor(stateCommander.status)} text-white`}>
                              Commander {stateCommander.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Warning Dialog */}
        <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Issue Warning</DialogTitle>
              <DialogDescription>
                Issue a warning to {selectedCommander?.full_name} ({selectedCommander?.state} State)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select value={warningForm.severity} onValueChange={(value) => setWarningForm({...warningForm, severity: value as any})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={warningForm.reason}
                  onChange={(e) => setWarningForm({...warningForm, reason: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter warning reason..."
                />
              </div>
              <div>
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  value={warningForm.message}
                  onChange={(e) => setWarningForm({...warningForm, message: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter additional details..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWarningDialogOpen(false)} className="bg-transparent border-gray-600">
                Cancel
              </Button>
              <Button onClick={handleIssueWarning} className="bg-yellow-600 hover:bg-yellow-700">
                Issue Warning
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Admin Action Dialog */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Administrative Action</DialogTitle>
              <DialogDescription>
                Take administrative action against {selectedCommander?.full_name} ({selectedCommander?.state} State)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="actionType">Action Type</Label>
                <Select value={actionForm.actionType} onValueChange={(value) => setActionForm({...actionForm, actionType: value as any})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="warning">Official Warning</SelectItem>
                    <SelectItem value="suspension">Suspension</SelectItem>
                    <SelectItem value="escalation">Escalation</SelectItem>
                    <SelectItem value="reactivation">Reactivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="actionReason">Reason</Label>
                <Input
                  id="actionReason"
                  value={actionForm.reason}
                  onChange={(e) => setActionForm({...actionForm, reason: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter reason for action..."
                />
              </div>
              <div>
                <Label htmlFor="actionDetails">Details</Label>
                <Textarea
                  id="actionDetails"
                  value={actionForm.details}
                  onChange={(e) => setActionForm({...actionForm, details: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter detailed explanation..."
                  rows={3}
                />
              </div>
              {actionForm.actionType === 'suspension' && (
                <div>
                  <Label htmlFor="effectiveUntil">Suspension Until</Label>
                  <Input
                    id="effectiveUntil"
                    type="datetime-local"
                    value={actionForm.effectiveUntil}
                    onChange={(e) => setActionForm({...actionForm, effectiveUntil: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialogOpen(false)} className="bg-transparent border-gray-600">
                Cancel
              </Button>
              <Button onClick={handleAdminAction} className="bg-red-600 hover:bg-red-700">
                Execute Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UnitCommanders;
