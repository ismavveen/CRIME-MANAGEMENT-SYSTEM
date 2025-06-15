
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStatusIcon } from '@/lib/status-helpers';
import { DetailedIncident } from '@/types/incidents';

interface IncidentDetailsHeaderProps {
  incident: DetailedIncident;
}

const IncidentDetailsHeader: React.FC<IncidentDetailsHeaderProps> = ({ incident }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl text-white flex items-center gap-2">
        {getStatusIcon(incident.status)}
        <span>{incident.type} - {incident.id}</span>
      </DialogTitle>
    </DialogHeader>
  );
};

export default IncidentDetailsHeader;
