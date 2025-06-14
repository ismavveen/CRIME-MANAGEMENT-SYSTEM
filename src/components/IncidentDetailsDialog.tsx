
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, MapPin, User, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface IncidentDetails {
  id: string;
  type: string;
  location: string;
  status: 'critical' | 'warning' | 'resolved' | 'investigating';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  officer: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  updates?: {
    time: string;
    message: string;
    author: string;
  }[];
}

interface IncidentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentDetails | null;
}

const IncidentDetailsDialog: React.FC<IncidentDetailsDialogProps> = ({
  open,
  onOpenChange,
  incident
}) => {
  const { toast } = useToast();

  if (!incident) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500/20 text-dhq-red border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'investigating':
        return 'bg-blue-500/20 text-dhq-blue border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-dhq-red" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'investigating':
        return <AlertCircle className="h-5 w-5 text-dhq-blue" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-dhq-red';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleResolve = () => {
    toast({
      title: "Incident resolved",
      description: `Incident ${incident.id} has been marked as resolved.`,
    });
    onOpenChange(false);
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
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            {getStatusIcon(incident.status)}
            <span>{incident.type} - {incident.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Status and priority */}
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
          
          {/* Incident details */}
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
          
          {/* Description */}
          <div>
            <h3 className="text-md font-semibold mb-2">Description</h3>
            <p className="text-gray-300">
              {incident.description || "No detailed description available for this incident."}
            </p>
          </div>

          {/* Updates if available */}
          {incident.updates && incident.updates.length > 0 && (
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
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center mt-6">
          <div>
            <Button variant="outline" className="bg-transparent text-gray-300 border-gray-600">
              View Full Report
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent text-gray-300 border-gray-600" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAssign}>
              Assign
            </Button>
            {incident.status !== 'resolved' && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleResolve}>
                Resolve
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsDialog;
