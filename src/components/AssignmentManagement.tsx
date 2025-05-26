
import React, { useState } from 'react';
import { useAssignments } from '@/hooks/useAssignments';
import { useReports } from '@/hooks/useReports';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, MapPin, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const AssignmentManagement = () => {
  const { assignments, updateAssignmentStatus } = useAssignments();
  const { reports } = useReports();
  const { commanders } = useUnitCommanders();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Separate assignments by status
  const pendingReports = assignments.filter(a => a.status === 'pending');
  const acceptedReports = assignments.filter(a => a.status === 'accepted');
  const resolvedReports = assignments.filter(a => a.status === 'resolved');

  const getReportDetails = (reportId: string) => {
    return reports.find(r => r.id === reportId);
  };

  const getCommanderDetails = (commanderId: string) => {
    return commanders.find(c => c.id === commanderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500 text-white';
      case 'accepted':
        return 'bg-orange-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleStatusUpdate = async (assignmentId: string, status: 'accepted' | 'resolved') => {
    setIsUpdating(true);
    try {
      if (status === 'resolved') {
        await updateAssignmentStatus(assignmentId, status, resolutionNotes);
        setResolveDialogOpen(false);
        setResolutionNotes('');
        setSelectedAssignment(null);
      } else {
        await updateAssignmentStatus(assignmentId, status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openResolveDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setResolveDialogOpen(true);
  };

  const AssignmentCard = ({ assignment, showActions = true }: { assignment: any; showActions?: boolean }) => {
    const report = getReportDetails(assignment.report_id);
    const commander = getCommanderDetails(assignment.commander_id);
    
    return (
      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="font-mono text-sm text-gray-300">
                {assignment.report_id.slice(0, 8)}...
              </span>
            </div>
            <Badge className={getStatusColor(assignment.status)}>
              {assignment.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Report Details */}
          {report && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {report.location || report.manual_location || 'Unknown location'}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <strong>Type:</strong> {report.threat_type || 'Security Report'}
              </div>
              {report.description && (
                <div className="text-sm text-gray-300">
                  <strong>Description:</strong> {report.description.substring(0, 100)}...
                </div>
              )}
            </div>
          )}

          {/* Assignment Details */}
          <div className="space-y-2 pt-2 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">{commander?.full_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-400">
                Assigned: {new Date(assignment.assigned_at).toLocaleString()}
              </span>
            </div>
            {assignment.resolved_at && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">
                  Resolved: {new Date(assignment.resolved_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Resolution Notes */}
          {assignment.resolution_notes && (
            <div className="bg-green-900/20 border border-green-700/50 p-3 rounded">
              <p className="text-sm text-green-300">
                <strong>Resolution Notes:</strong> {assignment.resolution_notes}
              </p>
              {assignment.resolved_by && (
                <p className="text-xs text-green-400 mt-1">
                  Resolved by: {assignment.resolved_by}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && assignment.status !== 'resolved' && (
            <div className="flex space-x-2 pt-2">
              {assignment.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(assignment.id, 'accepted')}
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={isUpdating}
                >
                  Accept
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => openResolveDialog(assignment)}
                className="bg-green-600 hover:bg-green-700"
                disabled={isUpdating}
              >
                Mark Resolved
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Assignment Management</h2>

      {/* Pending Reports */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
          Pending Reports ({pendingReports.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingReports.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No pending reports
            </div>
          ) : (
            pendingReports.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </div>
      </div>

      {/* Accepted Reports */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-orange-400" />
          Accepted Reports ({acceptedReports.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedReports.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No accepted reports
            </div>
          ) : (
            acceptedReports.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          )}
        </div>
      </div>

      {/* Resolved Reports */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
          Resolved Reports ({resolvedReports.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resolvedReports.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No resolved reports
            </div>
          ) : (
            resolvedReports.slice(0, 6).map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} showActions={false} />
            ))
          )}
        </div>
        {resolvedReports.length > 6 && (
          <div className="text-center">
            <Button variant="outline" className="bg-transparent border-gray-600 text-gray-300">
              View All Resolved Reports
            </Button>
          </div>
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Resolve Assignment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Please provide details about how this report was resolved:
            </p>
            <Textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Enter resolution notes..."
              className="bg-gray-900/50 border-gray-600 text-white"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
              className="bg-transparent border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedAssignment && handleStatusUpdate(selectedAssignment.id, 'resolved')}
              disabled={!resolutionNotes.trim() || isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? 'Resolving...' : 'Mark as Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentManagement;
