
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IncidentDetailsHeader from './incident-details/IncidentDetailsHeader';
import IncidentMetadata from './incident-details/IncidentMetadata';
import IncidentUpdates from './incident-details/IncidentUpdates';
import IncidentDetailsFooter from './incident-details/IncidentDetailsFooter';
import { DetailedIncident } from '@/types/incidents';
import { useReports } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';

interface IncidentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: DetailedIncident | null;
  onAssignClick?: (incident: DetailedIncident) => void;
}

const IncidentDetailsDialog: React.FC<IncidentDetailsDialogProps> = ({ open, onOpenChange, incident, onAssignClick }) => {
  const { updateReportStatus, refetch: refetchReports } = useReports();
  const { toast } = useToast();

  if (!incident) {
    return null;
  }

  const handleResolve = async () => {
    if (!incident) return;
    try {
      await updateReportStatus(incident.id, "resolved");
      toast({
        title: "Report Resolved",
        description: `Report ${incident.type} has been marked as resolved.`,
      });
      refetchReports();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Resolution Failed",
        description: error.message || "Could not resolve the report.",
        variant: "destructive",
      });
    }
  };

  const handleAssign = () => {
    if (onAssignClick && incident) {
      onAssignClick(incident);
    } else {
      console.warn("onAssignClick not provided to IncidentDetailsDialog");
      toast({
        title: "Cannot Assign",
        description: "Assignment functionality not available from here.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl p-0">
        {incident && (
          <>
            <div className="p-6">
              <IncidentDetailsHeader incident={incident} />
            </div>
            <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <IncidentMetadata incident={incident} />
              <IncidentUpdates incident={incident} />
            </div>
            <div className="p-6 bg-gray-900/50">
                <IncidentDetailsFooter
                  incident={incident}
                  onClose={() => onOpenChange(false)}
                  onAssign={handleAssign}
                  onResolve={handleResolve}
                />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsDialog;
