
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface PDFReportGeneratorProps {
  report: any;
  assignment?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PDFReportGenerator = ({ report, assignment, open, onOpenChange }: PDFReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF blob
      const pdfContent = `
        DEFENSE HEADQUARTERS NIGERIA
        OPERATION REPORT
        
        Report ID: ${report.id}
        Threat Type: ${report.threat_type}
        Location: ${report.location || report.manual_location}
        Status: ${report.status}
        
        Description:
        ${report.description}
        
        Response Details:
        ${assignment ? `
        Assigned to: ${assignment.commander_id}
        Status: ${assignment.status}
        ${assignment.operation_outcome ? `Outcome: ${assignment.operation_outcome}` : ''}
        ${assignment.casualties !== null ? `Casualties: ${assignment.casualties}` : ''}
        ${assignment.injured_personnel !== null ? `Injured Personnel: ${assignment.injured_personnel}` : ''}
        ${assignment.civilians_rescued !== null ? `Civilians Rescued: ${assignment.civilians_rescued}` : ''}
        ${assignment.weapons_recovered !== null ? `Weapons Recovered: ${assignment.weapons_recovered}` : ''}
        ` : 'No assignment details available'}
        
        Generated on: ${new Date().toLocaleString()}
      `;
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Report is ready for download or viewing",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "An error occurred while generating the PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `report-${report.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "PDF report is being downloaded",
      });
    }
  };

  const viewPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-400" />
            Generate PDF Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Report Summary */}
          <div className="bg-gray-900/60 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">Report Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Report ID:</span>
                <span className="text-white ml-2 font-mono">{report.id.slice(0, 8)}...</span>
              </div>
              <div>
                <span className="text-gray-400">Threat Type:</span>
                <span className="text-white ml-2">{report.threat_type}</span>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{report.location || report.manual_location}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <Badge className="ml-2 bg-green-600 text-white">{report.status}</Badge>
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          {assignment && (
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Response Unit Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Assignment Status:</span>
                  <Badge className="bg-blue-600 text-white">{assignment.status}</Badge>
                </div>
                {assignment.response_timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-white">{new Date(assignment.response_timestamp).toLocaleString()}</span>
                  </div>
                )}
                {assignment.operation_outcome && (
                  <div>
                    <span className="text-gray-400">Operation Outcome:</span>
                    <p className="text-white mt-1">{assignment.operation_outcome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PDF Generation Controls */}
          <div className="bg-gray-900/60 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-3">PDF Generation</h3>
            
            {!pdfUrl ? (
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF Report
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <FileText className="h-6 w-6 text-green-400 mr-2" />
                  <span className="text-green-300">PDF Report Generated Successfully</span>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={viewPDF} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                  <Button onClick={downloadPDF} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFReportGenerator;
