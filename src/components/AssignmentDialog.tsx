
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAssignments } from '@/hooks/useAssignments';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { useToast } from '@/hooks/use-toast';

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string | null;
  reportLocation?: string;
  reportLatitude?: number;
  reportLongitude?: number;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportLocation,
  reportLatitude,
  reportLongitude
}) => {
  const { createAssignment } = useAssignments();
  const { commanders } = useUnitCommanders();
  const { toast } = useToast();
  
  const [selectedCommander, setSelectedCommander] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCommanders = commanders.filter(c => 
    c.status === 'active' || c.status === 'available'
  );

  const handleAssign = async () => {
    if (!reportId || !selectedCommander) return;

    setIsSubmitting(true);
    try {
      await createAssignment({
        report_id: reportId,
        commander_id: selectedCommander
      });

      toast({
        title: "Assignment Created",
        description: `Report assigned successfully`,
      });

      onOpenChange(false);
      setSelectedCommander('');
      setNotes('');
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Assign Report to Unit Commander</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="commander">Select Commander</Label>
            <Select value={selectedCommander} onValueChange={setSelectedCommander}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Choose a commander..." />
              </SelectTrigger>
              <SelectContent>
                {availableCommanders.map((commander) => (
                  <SelectItem key={commander.id} value={commander.id}>
                    {commander.full_name} - {commander.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional instructions or notes..."
              className="bg-gray-700 border-gray-600"
              rows={3}
            />
          </div>

          {reportLocation && (
            <div className="text-sm text-gray-400">
              <strong>Report Location:</strong> {reportLocation}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedCommander || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Assigning...' : 'Assign Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
