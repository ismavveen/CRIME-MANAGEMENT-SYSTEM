
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ReturnForRevisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}

const ReturnForRevisionDialog: React.FC<ReturnForRevisionDialogProps> = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Return for Revision</DialogTitle>
          <DialogDescription>
            Please provide a reason for returning this resolution report for revision. The commander will be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="revision-reason">Reason for Revision</Label>
            <Textarea
              id="revision-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Evidence is insufficient, please provide more details on the outcome."
              className="bg-gray-700 border-gray-600 min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting} className="bg-yellow-600 hover:bg-yellow-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnForRevisionDialog;
