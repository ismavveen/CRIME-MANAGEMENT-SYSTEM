
import React from 'react';
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
    toast({
      title: "Assignment initiated",
      description: `Starting assignment process for incident ${incident.id}.`,
    });
    // In a real app, this would open the assignment dialog
  };

  return (
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
  );
};

export default IncidentDetailsDialog;
