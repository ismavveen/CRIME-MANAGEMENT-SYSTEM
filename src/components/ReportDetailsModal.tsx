
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, User, AlertTriangle, FileText, Download } from 'lucide-react';
import { useAssignments } from '@/hooks/useAssignments';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { useToast } from '@/hooks/use-toast';
import DispatchModal from './DispatchModal';

interface ReportDetailsModalProps {
  report: any;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose }) => {
  const { assignments, updateAssignmentStatus } = useAssignments();
  const { commanders } = useUnitCommanders();
  const { toast } = useToast();
  const [showDispatchModal, setShowDispatchModal] = React.useState(false);

  if (!report) return null;

  const assignment = assignments.find(a => a.report_id === report.id);
  const assignedCommander = assignment ? commanders.find(c => c.id === assignment.commander_id) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const handleResolve = async () => {
    if (!assignment) return;

    try {
      await updateAssignmentStatus(assignment.id, 'resolved', 'Resolved via admin dashboard');
      toast({
        title: "Report Resolved",
        description: "Report has been marked as resolved",
      });
      onClose();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleDownloadReport = () => {
    // Create a simple PDF-like content for download
    const content = `
DEFENSE HEADQUARTERS INTELLIGENCE REPORT
========================================

Report ID: ${report.id}
Type: ${report.threat_type}
Status: ${report.status}
Priority: ${report.priority}
Location: ${report.location || report.manual_location}
State: ${report.state}
Reported: ${new Date(report.created_at).toLocaleString()}

Description:
${report.description}

${assignment ? `
Assignment Details:
- Assigned to: ${assignedCommander?.full_name} (${assignedCommander?.rank})
- Assigned at: ${new Date(assignment.assigned_at).toLocaleString()}
- Status: ${assignment.status}
${assignment.resolution_notes ? `- Resolution: ${assignment.resolution_notes}` : ''}
` : 'Status: Unassigned'}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DHQ_Report_${report.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Report details have been downloaded",
    });
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-cyan-400" />
              Report Details - {report.threat_type}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status and Priority Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(report.status)} border`}>
                  {report.status.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className={`font-medium ${getPriorityColor(report.priority)}`}>
                    {report.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                size="sm"
                className="text-gray-300 border-gray-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>

            {/* Report Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-white mb-3">Report Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white">{report.location || report.manual_location}</p>
                        {report.state && <p className="text-gray-300 text-sm">{report.state} State</p>}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Reported</p>
                        <p className="text-white">{new Date(report.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Threat Type</p>
                        <p className="text-white">{report.threat_type}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-cyan-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Reporter Type</p>
                        <p className="text-white">{report.reporter_type || 'Anonymous'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Assignment Status</h3>
                  
                  {assignment && assignedCommander ? (
                    <div className="space-y-3">
                      <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded">
                        <p className="text-blue-300 font-medium">{assignedCommander.rank} {assignedCommander.full_name}</p>
                        <p className="text-gray-300 text-sm">{assignedCommander.unit}</p>
                        <p className="text-gray-400 text-xs">Assigned: {new Date(assignment.assigned_at).toLocaleString()}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-gray-400 text-sm">Current Status:</p>
                        <Badge className={`${getStatusColor(assignment.status)} border`}>
                          {assignment.status.toUpperCase()}
                        </Badge>
                      </div>

                      {assignment.resolution_notes && (
                        <div>
                          <p className="text-gray-400 text-sm">Resolution Notes:</p>
                          <p className="text-white text-sm bg-gray-800/50 p-2 rounded">{assignment.resolution_notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-yellow-400 mb-3">Report not yet assigned</p>
                      <Button
                        onClick={() => setShowDispatchModal(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Assign to Unit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-3">Report Description</h3>
                <p className="text-gray-300 leading-relaxed">{report.description}</p>
              </CardContent>
            </Card>

            {/* Additional Details */}
            {(report.landmark || report.full_address || report.local_government) && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Additional Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.landmark && (
                      <div>
                        <p className="text-gray-400 text-sm">Landmark</p>
                        <p className="text-white">{report.landmark}</p>
                      </div>
                    )}
                    {report.local_government && (
                      <div>
                        <p className="text-gray-400 text-sm">LGA</p>
                        <p className="text-white">{report.local_government}</p>
                      </div>
                    )}
                    {report.full_address && (
                      <div>
                        <p className="text-gray-400 text-sm">Full Address</p>
                        <p className="text-white">{report.full_address}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
              <Button
                onClick={onClose}
                variant="outline"
                className="text-gray-300 border-gray-600"
              >
                Close
              </Button>
              
              {!assignment && (
                <Button
                  onClick={() => setShowDispatchModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Assign to Unit
                </Button>
              )}
              
              {assignment && assignment.status !== 'resolved' && (
                <Button
                  onClick={handleResolve}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispatch Modal */}
      <DispatchModal
        open={showDispatchModal}
        onOpenChange={setShowDispatchModal}
        report={report}
        onAssignmentComplete={() => {
          setShowDispatchModal(false);
          onClose();
        }}
      />
    </>
  );
};

export default ReportDetailsModal;
