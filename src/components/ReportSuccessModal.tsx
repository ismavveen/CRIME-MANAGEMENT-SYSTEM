
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  serialNumber: string;
}

const ReportSuccessModal = ({ isOpen, onClose, reportId, serialNumber }: ReportSuccessModalProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Reference number copied to clipboard",
    });
  };

  const downloadReference = () => {
    const content = `
Defence Headquarters Crime Report Reference

Report ID: ${reportId}
Reference Number: ${serialNumber}
Submission Date: ${new Date().toLocaleString()}

Please keep this reference number safe.
You can use it to track your report status.

Thank you for helping keep Nigeria safe.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `DHQ-Report-${serialNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-green-600 text-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            Report Submitted Successfully!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 mb-3 font-semibold">Your Reference Number:</p>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="font-mono text-xl text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                {serialNumber}
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(serialNumber)}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex justify-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={downloadReference}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="text-gray-600 space-y-2 text-sm">
            <p>✓ Your report has been received and is being processed</p>
            <p>✓ Save this reference number to track your report</p>
            <p>✓ You will be contacted if additional information is needed</p>
            <p>✓ Reports are reviewed by professional security teams</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Your report is automatically assigned to the appropriate unit</li>
              <li>• Initial review will be completed within 24-48 hours</li>
              <li>• You can track status using your reference number</li>
              <li>• Action will be taken based on priority level</li>
            </ul>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportSuccessModal;
