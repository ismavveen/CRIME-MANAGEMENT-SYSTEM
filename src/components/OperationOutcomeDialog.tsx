
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAssignments } from '@/hooks/useAssignments';
import { Shield, Users, Target, AlertTriangle, FileText, Download } from 'lucide-react';

interface OperationOutcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string | null;
  reportId: string | null;
}

const OperationOutcomeDialog: React.FC<OperationOutcomeDialogProps> = ({
  open,
  onOpenChange,
  assignmentId,
  reportId
}) => {
  const { updateAssignmentStatus } = useAssignments();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    operation_outcome: '',
    casualties: 0,
    injured_personnel: 0,
    civilians_rescued: 0,
    weapons_recovered: 0,
    custom_message: ''
  });

  const handleSubmit = async () => {
    if (!assignmentId) return;

    setIsSubmitting(true);
    try {
      await updateAssignmentStatus(
        assignmentId,
        'responded_to',
        undefined,
        formData
      );

      toast({
        title: "Operation Report Submitted",
        description: "Response unit report has been successfully recorded",
      });

      onOpenChange(false);
      setFormData({
        operation_outcome: '',
        casualties: 0,
        injured_personnel: 0,
        civilians_rescued: 0,
        weapons_recovered: 0,
        custom_message: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit operation report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    // This would generate and download the PDF report
    toast({
      title: "Generating Report",
      description: "Professional PDF report is being prepared for download",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-2">
              <img 
                src="/lovable-uploads/ba3282a6-18f0-407f-baa2-bbdab0014f65.png" 
                alt="DHQ Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span>Response Unit Operation Report</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="casualties" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span>Casualties</span>
              </Label>
              <Input
                id="casualties"
                type="number"
                value={formData.casualties}
                onChange={(e) => setFormData({...formData, casualties: parseInt(e.target.value) || 0})}
                className="bg-gray-700 border-gray-600"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="injured" className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-400" />
                <span>Injured Personnel</span>
              </Label>
              <Input
                id="injured"
                type="number"
                value={formData.injured_personnel}
                onChange={(e) => setFormData({...formData, injured_personnel: parseInt(e.target.value) || 0})}
                className="bg-gray-700 border-gray-600"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="rescued" className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-400" />
                <span>Civilians Rescued</span>
              </Label>
              <Input
                id="rescued"
                type="number"
                value={formData.civilians_rescued}
                onChange={(e) => setFormData({...formData, civilians_rescued: parseInt(e.target.value) || 0})}
                className="bg-gray-700 border-gray-600"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="weapons" className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span>Weapons Recovered</span>
              </Label>
              <Input
                id="weapons"
                type="number"
                value={formData.weapons_recovered}
                onChange={(e) => setFormData({...formData, weapons_recovered: parseInt(e.target.value) || 0})}
                className="bg-gray-700 border-gray-600"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="outcome" className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Operation Outcome</span>
            </Label>
            <Textarea
              id="outcome"
              value={formData.operation_outcome}
              onChange={(e) => setFormData({...formData, operation_outcome: e.target.value})}
              placeholder="Describe the operation outcome and status..."
              className="bg-gray-700 border-gray-600"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="message" className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Custom Message/Narrative</span>
            </Label>
            <Textarea
              id="message"
              value={formData.custom_message}
              onChange={(e) => setFormData({...formData, custom_message: e.target.value})}
              placeholder="Additional operational details and narrative..."
              className="bg-gray-700 border-gray-600"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            className="bg-transparent border-gray-600 text-gray-300 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Report</span>
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.operation_outcome.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperationOutcomeDialog;
