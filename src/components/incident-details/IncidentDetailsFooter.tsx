
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DetailedIncident } from '@/types/incidents';

interface IncidentDetailsFooterProps {
  incident: DetailedIncident;
  onClose: () => void;
  onAssign: () => void;
  onResolve: () => void;
}

const IncidentDetailsFooter: React.FC<IncidentDetailsFooterProps> = ({
  incident,
  onClose,
  onAssign,
  onResolve,
}) => {
  return (
    <DialogFooter className="flex justify-between items-center mt-6">
      <div>
        <Button variant="outline" className="bg-transparent text-gray-300 border-gray-600">
          View Full Report
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="bg-transparent text-gray-300 border-gray-600" onClick={onClose}>
          Close
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAssign}>
          Assign
        </Button>
        {incident.status !== 'resolved' && (
          <Button className="bg-green-600 hover:bg-green-700" onClick={onResolve}>
            Resolve
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};

export default IncidentDetailsFooter;
