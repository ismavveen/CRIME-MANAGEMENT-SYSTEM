
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Zap } from 'lucide-react';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MediaViewerModal from './MediaViewerModal';
import ReportOverviewSection from './dispatch-modal/ReportOverviewSection';
import LocationInfoSection from './dispatch-modal/LocationInfoSection';
import EvidenceSection from './dispatch-modal/EvidenceSection';
import ReporterInfoSection from './dispatch-modal/ReporterInfoSection';
import CommanderSelectionSection from './dispatch-modal/CommanderSelectionSection';

interface DispatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any;
  onAssignmentComplete?: () => void;
}

const DispatchModal = ({ open, onOpenChange, report, onAssignmentComplete }: DispatchModalProps) => {
  const [selectedCommander, setSelectedCommander] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);
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

  const handleViewMedia = (url: string, type: 'image' | 'video') => {
    setSelectedMedia({ url, type });
    setViewerOpen(true);
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

  if (!report) return null;

  return (
    <>
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
                <ReportOverviewSection report={report} />
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <LocationInfoSection report={report} />
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4">
                <EvidenceSection report={report} onViewMedia={handleViewMedia} />
              </TabsContent>

              <TabsContent value="reporter" className="space-y-4">
                <ReporterInfoSection report={report} />
              </TabsContent>
            </Tabs>

            {/* Commander Selection */}
            <CommanderSelectionSection
              selectedCommander={selectedCommander}
              onCommanderChange={setSelectedCommander}
              availableCommanders={availableCommanders}
              commanders={commanders}
              report={report}
            />
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

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          reportId={report.id}
          reportDetails={{
            threat_type: report.threat_type,
            location: report.location || report.full_address,
            created_at: report.created_at,
            description: report.description
          }}
        />
      )}
    </>
  );
};

export default DispatchModal;
