
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RejectAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

const RejectAssignmentDialog: React.FC<RejectAssignmentDialogProps> = ({ open, onOpenChange, onConfirm, isSubmitting }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Reject Assignment</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this assignment. This will be logged and the report will be returned to the queue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Rejection Reason</Label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Insufficient information, outside of jurisdiction, etc."
            className="bg-gray-700 border-gray-600"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!reason.trim() || isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? 'Submitting...' : 'Confirm Rejection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectAssignmentDialog;
