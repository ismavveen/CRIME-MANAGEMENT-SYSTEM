
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useReports } from '@/hooks/useReports';
import { DetailedIncident } from '@/types/incidents';
import IncidentDetailsHeader from './incident-details/IncidentDetailsHeader';
import IncidentMetadata from './incident-details/IncidentMetadata';
import IncidentUpdates from './incident-details/IncidentUpdates';
import IncidentDetailsFooter from './incident-details/IncidentDetailsFooter';
import { useAssignments } from '@/hooks/useAssignments';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import AssignmentDialog from './AssignmentDialog';

interface IncidentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: DetailedIncident | null;
}

const IncidentDetailsDialog: React.FC<IncidentDetailsDialogProps> = ({
  open,
  onOpenChange,
  incident
}) => {
  const { toast } = useToast();
  const { updateReportStatus } = useReports();
  const { createAssignment } = useAssignments();
  const { commanders } = useUnitCommanders();
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  if (!incident) return null;

  const handleResolve = async () => {
    if (!incident) return;
    try {
      await updateReportStatus(incident.id, 'resolved');
      toast({
        title: "Incident resolved",
        description: `Incident ${incident.id} has been marked as resolved.`,
      });
      onOpenChange(false);
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to resolve incident.",
        variant: "destructive"
      });
    }
  };

  const handleAssign = () => {
    setAssignmentDialogOpen(true);
  };

  const handleCreateAssignment = async (commanderId: string) => {
    if (!incident) return;
    try {
      await createAssignment({
        report_id: incident.id,
        commander_id: commanderId,
      });

      const commander = commanders.find(c => c.id === commanderId);
      await updateReportStatus(incident.id, 'assigned', commander?.full_name || commanderId);
      
      setAssignmentDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
       console.error("Assignment error:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <IncidentDetailsHeader incident={incident} />
          
          <div className="mt-4 space-y-6">
            <IncidentMetadata incident={incident} />
            <IncidentUpdates incident={incident} />
          </div>
          
          <IncidentDetailsFooter
            incident={incident}
            onClose={() => onOpenChange(false)}
            onAssign={handleAssign}
            onResolve={handleResolve}
          />
        </DialogContent>
      </Dialog>
      <AssignmentDialog
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        reportId={incident.id}
        onAssign={handleCreateAssignment}
        reportLocation={incident.location}
        reportState={incident.state}
        reportLatitude={incident.latitude}
        reportLongitude={incident.longitude}
      />
    </>
  );
};

export default IncidentDetailsDialog;
