
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DispatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any;
  onAssignmentComplete?: () => void;
}

const DispatchModal = ({ open, onOpenChange, report, onAssignmentComplete }: DispatchModalProps) => {
  const [selectedCommander, setSelectedCommander] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
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

  const getThreatColor = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'critical':
        return 'text-red-400';
      case 'kidnapping':
      case 'armed robbery':
        return 'text-orange-400';
      case 'theft':
      case 'vandalism':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
            <span>Dispatch Response Unit</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Details */}
          <div className="bg-gray-900/50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Report Details</h3>
              <Badge className="bg-blue-900/30 text-blue-300 border-blue-700/50">
                ID: {report.id.slice(0, 8)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-cyan-400" />
                  <span className="text-gray-400">Threat Type:</span>
                </div>
                <p className={`font-medium ${getThreatColor(report.threat_type)}`}>
                  {report.threat_type}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span className="text-gray-400">Location:</span>
                </div>
                <p className="text-white">{report.location || report.manual_location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span className="text-gray-400">Reported:</span>
                </div>
                <p className="text-white">{new Date(report.created_at).toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <span className="text-gray-400">Priority:</span>
                <Badge className={`${
                  report.priority === 'high' || report.urgency === 'critical' 
                    ? 'bg-red-900/30 text-red-300 border-red-700/50'
                    : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                }`}>
                  {report.priority || report.urgency}
                </Badge>
              </div>
            </div>

            {report.description && (
              <div className="space-y-2">
                <span className="text-gray-400">Description:</span>
                <p className="text-white text-sm bg-gray-800/50 p-3 rounded">
                  {report.description}
                </p>
              </div>
            )}
          </div>

          {/* Commander Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Assign Response Unit</h3>
            </div>

            <Select value={selectedCommander} onValueChange={setSelectedCommander}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue placeholder="Select an available commander" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {availableCommanders.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No commanders available in {report.state}
                  </SelectItem>
                ) : (
                  availableCommanders.map((commander) => (
                    <SelectItem key={commander.id} value={commander.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white">
                          {commander.rank} {commander.full_name}
                        </span>
                        <span className="text-gray-400 text-sm ml-4">
                          Active: {commander.active_assignments}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {selectedCommander && (
              <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded">
                {(() => {
                  const commander = commanders.find(c => c.id === selectedCommander);
                  return commander ? (
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-300">Selected Commander</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Rank & Name:</span>
                          <p className="text-white">{commander.rank} {commander.full_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Unit:</span>
                          <p className="text-white">{commander.unit}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Active Assignments:</span>
                          <p className="text-white">{commander.active_assignments}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Success Rate:</span>
                          <p className="text-white">{commander.success_rate}%</p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedCommander || isAssigning}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAssigning ? 'Assigning...' : 'Assign & Dispatch'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchModal;
