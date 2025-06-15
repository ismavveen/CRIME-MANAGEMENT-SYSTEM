
import React from 'react';
import { DetailedIncident } from '@/types/incidents';

interface IncidentUpdatesProps {
  incident: DetailedIncident;
}

const IncidentUpdates: React.FC<IncidentUpdatesProps> = ({ incident }) => {
  if (!incident.updates || incident.updates.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-md font-semibold mb-2">Updates</h3>
      <div className="space-y-3">
        {incident.updates.map((update, index) => (
          <div key={index} className="bg-gray-900/40 p-3 rounded-md">
            <div className="flex justify-between mb-1">
              <span className="text-dhq-blue font-medium">{update.author}</span>
              <span className="text-gray-400 text-sm">{update.time}</span>
            </div>
            <p className="text-gray-300">{update.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentUpdates;
