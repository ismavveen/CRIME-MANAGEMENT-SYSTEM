
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MediaViewerModal from './MediaViewerModal';
import DispatchHeader from './dispatch-modal/DispatchHeader';
import DispatchTabs from './dispatch-modal/DispatchTabs';
import CommanderSelectionSection from './dispatch-modal/CommanderSelectionSection';
import DispatchFooter from './dispatch-modal/DispatchFooter';

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

  if (!report) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <DispatchHeader report={report} />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <DispatchTabs report={report} onViewMedia={handleViewMedia} />

            <CommanderSelectionSection
              selectedCommander={selectedCommander}
              onCommanderChange={setSelectedCommander}
              availableCommanders={availableCommanders}
              commanders={commanders}
              report={report}
            />
          </div>

          <DispatchFooter
            selectedCommander={selectedCommander}
            isAssigning={isAssigning}
            onAssign={handleAssign}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

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
