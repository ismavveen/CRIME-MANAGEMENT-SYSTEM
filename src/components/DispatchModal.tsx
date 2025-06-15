
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, User, AlertTriangle, Shield, FileText, Image, Video, Users, Phone, Mail, Calendar, Target, Zap } from 'lucide-react';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DispatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any;
  onAssignmentComplete?: () => void;
}

const DispatchModal = ({ open, onOpenChange, report, onAssignmentComplete }: DispatchModalProps) => {
  const [selectedCommander, setSelectedCommander] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { commanders } = useUnitCommanders();
  const { toast } = useToast();

  // Filter available commanders based on report state
  const availableCommanders = commanders.filter(
    commander => commander.state === report?.state && commander.status === 'active'
  );

  const handleAssign = async () => {
    if (!selectedCommander || !report) return;

    setIsAssigning(true);
    try {
      // Create assignment
      const { error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          report_id: report.id,
          commander_id: selectedCommander,
          status: 'assigned'
        });

      if (assignmentError) throw assignmentError;

      // Update report status
      const { error: reportError } = await supabase
        .from('reports')
        .update({ 
          status: 'assigned',
          assigned_commander_id: selectedCommander,
          assigned_to: commanders.find(c => c.id === selectedCommander)?.full_name
        })
        .eq('id', report.id);

      if (reportError) throw reportError;

      // Update commander's active assignments
      const { error: commanderError } = await supabase
        .from('unit_commanders')
        .update({ 
          active_assignments: commanders.find(c => c.id === selectedCommander)?.active_assignments + 1 || 1,
          total_assignments: commanders.find(c => c.id === selectedCommander)?.total_assignments + 1 || 1
        })
        .eq('id', selectedCommander);

      if (commanderError) throw commanderError;

      toast({
        title: "Assignment Successful",
        description: `Report has been assigned to ${commanders.find(c => c.id === selectedCommander)?.full_name}`,
      });

      onOpenChange(false);
      setSelectedCommander('');
      onAssignmentComplete?.();

    } catch (error: any) {
      console.error('Assignment error:', error);
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign report",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const getThreatColor = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'critical':
        return 'text-red-400';
      case 'kidnapping':
      case 'armed robbery':
        return 'text-orange-400';
      case 'theft':
      case 'vandalism':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  const getUrgencyColor = (urgency: string, priority: string) => {
    const level = urgency || priority;
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-900/30 text-red-300 border-red-700/50';
      case 'medium':
        return 'bg-orange-900/30 text-orange-300 border-orange-700/50';
      default:
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-2">
                <img 
                  src="/lovable-uploads/b160c848-06aa-40b9-8717-59194cc9a1a8.png" 
                  alt="DHQ Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl">Dispatch Response Unit</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-blue-900/30 text-blue-300 border-blue-700/50 text-xs">
                    ID: {report.id.slice(0, 8)}
                  </Badge>
                  <Badge className="bg-purple-900/30 text-purple-300 border-purple-700/50 text-xs">
                    Serial: {report.serial_number || 'Not Assigned'}
                  </Badge>
                </div>
              </div>
            </div>
            <Badge className={`${getUrgencyColor(report.urgency, report.priority)} animate-pulse`}>
              {(report.urgency === 'critical' || report.priority === 'high') && (
                <Zap className="h-3 w-3 mr-1" />
              )}
              {report.priority || report.urgency || 'Medium'} Priority
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comprehensive Report Overview */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="reporter">Reporter</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Incident Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs">Threat Type</p>
                      <p className={`font-semibold ${getThreatColor(report.threat_type)}`}>
                        {report.threat_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Description</p>
                      <p className="text-white text-sm bg-gray-800/50 p-2 rounded">
                        {report.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Validation Status</p>
                      <Badge className={`text-xs ${
                        report.validation_status === 'validated' ? 'bg-green-900/30 text-green-300 border-green-700/50' :
                        report.validation_status === 'rejected' ? 'bg-red-900/30 text-red-300 border-red-700/50' :
                        'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                      }`}>
                        {report.validation_status || 'Pending'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-gray-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs">Reported At</p>
                      <p className="text-white text-sm">{formatTime(report.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Time Elapsed</p>
                      <p className="text-orange-300 text-sm font-medium">
                        {Math.floor((Date.now() - new Date(report.created_at).getTime()) / 60000)} minutes ago
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Current Status</p>
                      <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-700/50">
                        {report.status || 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Submission Source</p>
                      <Badge className={`text-xs ${
                        report.submission_source === 'external_portal' 
                          ? 'bg-purple-900/30 text-purple-300 border-purple-700/50' 
                          : 'bg-blue-900/30 text-blue-300 border-blue-700/50'
                      }`}>
                        {report.submission_source === 'external_portal' ? 'External Portal' : 'Internal System'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs">State</p>
                      <p className="text-white font-medium">{report.state || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Local Government</p>
                      <p className="text-white font-medium">{report.local_government || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-xs">Full Address</p>
                    <p className="text-white bg-gray-800/50 p-2 rounded">
                      {report.full_address || report.location || report.manual_location || 'Address not provided'}
                    </p>
                  </div>

                  {report.landmark && (
                    <div>
                      <p className="text-gray-400 text-xs">Landmark</p>
                      <p className="text-white bg-gray-800/50 p-2 rounded">{report.landmark}</p>
                    </div>
                  )}

                  {(report.latitude && report.longitude) && (
                    <div>
                      <p className="text-gray-400 text-xs">Coordinates</p>
                      <p className="text-cyan-300 font-mono text-sm">
                        {report.latitude}, {report.longitude}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Evidence & Attachments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(report.images?.length || report.videos?.length || report.documents?.length) ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {report.images?.length > 0 && (
                        <div className="text-center p-4 bg-gray-800/50 rounded">
                          <Image className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                          <p className="text-white font-medium">{report.images.length}</p>
                          <p className="text-gray-400 text-xs">Images</p>
                        </div>
                      )}
                      {report.videos?.length > 0 && (
                        <div className="text-center p-4 bg-gray-800/50 rounded">
                          <Video className="h-8 w-8 mx-auto mb-2 text-green-400" />
                          <p className="text-white font-medium">{report.videos.length}</p>
                          <p className="text-gray-400 text-xs">Videos</p>
                        </div>
                      )}
                      {report.documents?.length > 0 && (
                        <div className="text-center p-4 bg-gray-800/50 rounded">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                          <p className="text-white font-medium">{report.documents.length}</p>
                          <p className="text-gray-400 text-xs">Documents</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <p>No evidence files attached to this report</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporter" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Reporter Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.is_anonymous ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
                      <p className="text-white font-medium mb-2">Anonymous Report</p>
                      <p className="text-gray-400 text-sm">
                        Reporter identity is protected for security purposes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.reporter_name && (
                          <div>
                            <p className="text-gray-400 text-xs">Reporter Name</p>
                            <p className="text-white font-medium">{report.reporter_name}</p>
                          </div>
                        )}
                        {report.reporter_phone && (
                          <div>
                            <p className="text-gray-400 text-xs flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>Phone Number</span>
                            </p>
                            <p className="text-white font-medium">{report.reporter_phone}</p>
                          </div>
                        )}
                        {report.reporter_email && (
                          <div>
                            <p className="text-gray-400 text-xs flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>Email Address</span>
                            </p>
                            <p className="text-white font-medium">{report.reporter_email}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400 text-xs">Reporter Type</p>
                          <p className="text-white font-medium">{report.reporter_type || 'Web Application'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Commander Selection */}
          <Card className="bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Target className="h-5 w-5 text-cyan-400" />
                <span>Response Unit Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedCommander} onValueChange={setSelectedCommander}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select an available commander for deployment" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {availableCommanders.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No commanders available in {report.state}
                    </SelectItem>
                  ) : (
                    availableCommanders.map((commander) => (
                      <SelectItem key={commander.id} value={commander.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="text-left">
                            <p className="font-medium text-white">
                              {commander.rank} {commander.full_name}
                            </p>
                            <p className="text-gray-400 text-xs">{commander.unit}</p>
                          </div>
                          <div className="text-right text-xs">
                            <p className="text-gray-400">Active: {commander.active_assignments}</p>
                            <p className="text-green-400">{commander.success_rate}% Success</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedCommander && (
                <Card className="bg-blue-900/20 border border-blue-700/50">
                  <CardContent className="p-4">
                    {(() => {
                      const commander = commanders.find(c => c.id === selectedCommander);
                      return commander ? (
                        <div className="space-y-3">
                          <h4 className="font-medium text-blue-300 flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Selected Response Commander</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Name & Rank:</span>
                              <p className="text-white font-medium">{commander.rank} {commander.full_name}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Unit:</span>
                              <p className="text-white">{commander.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Active Missions:</span>
                              <p className="text-white">{commander.active_assignments}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Success Rate:</span>
                              <p className="text-green-400 font-medium">{commander.success_rate}%</p>
                            </div>
                            {commander.specialization && (
                              <div className="col-span-2">
                                <span className="text-gray-400">Specialization:</span>
                                <p className="text-white">{commander.specialization}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {selectedCommander ? (
              <span className="text-green-400">
                ✓ Commander selected - Ready for deployment
              </span>
            ) : (
              <span>Select a response commander to proceed</span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedCommander || isAssigning}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  <span>Deploy Response Unit</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchModal;
