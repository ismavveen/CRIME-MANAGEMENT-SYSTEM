
import React from 'react';
import { Flag, MapPin, Clock, User } from 'lucide-react';
import { getStatusColor, getPriorityColor } from '@/lib/status-helpers';
import { DetailedIncident } from '@/types/incidents';

interface IncidentMetadataProps {
  incident: DetailedIncident;
}

const IncidentMetadata: React.FC<IncidentMetadataProps> = ({ incident }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flag size={16} />
          <span className={`font-medium ${getPriorityColor(incident.priority)}`}>
            {incident.priority.toUpperCase()} PRIORITY
          </span>
        </div>
      </div>
      
      <div className="bg-gray-900/60 p-4 rounded-md space-y-3">
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-200">{incident.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-200">{incident.timestamp}</span>
        </div>
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-gray-200">Officer in Charge: {incident.officer}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold mb-2">Description</h3>
        <p className="text-gray-300">
          {incident.description || "No detailed description available for this incident."}
        </p>
      </div>
    </div>
  );
};

export default IncidentMetadata;
