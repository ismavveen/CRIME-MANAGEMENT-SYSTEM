
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import { Assignment } from '@/hooks/useAssignments';
import RejectAssignmentDialog from './RejectAssignmentDialog';

interface RecentAssignmentsListProps {
  assignments: Assignment[];
  commanderState: string;
  handleAcceptAssignment: (assignmentId: string) => void;
  handleRejectAssignment: (assignmentId: string, reason: string) => void;
  isUpdating: boolean;
}

const RecentAssignmentsList: React.FC<RecentAssignmentsListProps> = ({ assignments, commanderState, handleAcceptAssignment, handleRejectAssignment, isUpdating }) => {
  const [rejectionDialogOpen, setRejectionDialogOpen] = React.useState(false);
  const [selectedAssignmentForRejection, setSelectedAssignmentForRejection] = React.useState<Assignment | null>(null);

  const openRejectionDialog = (assignment: Assignment) => {
    setSelectedAssignmentForRejection(assignment);
    setRejectionDialogOpen(true);
  };

  const onConfirmRejection = (reason: string) => {
    if (selectedAssignmentForRejection) {
      handleRejectAssignment(selectedAssignmentForRejection.id, reason);
      setRejectionDialogOpen(false);
      setSelectedAssignmentForRejection(null);
    }
  };

  const getBadgeVariant = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'accepted':
      case 'responded_to':
        return 'default';
      case 'resolved':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-dhq-blue" />
            New Assignments
          </CardTitle>
          <CardDescription className="text-gray-400">
            Pending assignments for {commanderState} state. Please accept or reject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium">Assignment #{assignment.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-400">
                      Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getBadgeVariant(assignment.status)}
                      className="capitalize"
                    >
                      {assignment.status.replace('_', ' ')}
                    </Badge>
                    {assignment.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptAssignment(assignment.id)}
                          className="bg-dhq-blue hover:bg-blue-700"
                          disabled={isUpdating}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectionDialog(assignment)}
                          disabled={isUpdating}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No new assignments</p>
            </div>
          )}
        </CardContent>
      </Card>
      <RejectAssignmentDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        onConfirm={onConfirmRejection}
        isSubmitting={isUpdating}
      />
    </>
  );
};

export default RecentAssignmentsList;
