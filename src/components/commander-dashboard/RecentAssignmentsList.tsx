
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

interface Assignment {
  id: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'resolved' | 'in_progress';
}

interface RecentAssignmentsListProps {
  assignments: Assignment[];
  commanderState: string;
  handleAcceptAssignment: (assignmentId: string) => Promise<void>;
}

const RecentAssignmentsList: React.FC<RecentAssignmentsListProps> = ({ assignments, commanderState, handleAcceptAssignment }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-dhq-blue" />
          Recent Assignments
        </CardTitle>
        <CardDescription className="text-gray-400">
          Latest assignments for {commanderState} state
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
                    Created: {new Date(assignment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={assignment.status === 'pending' ? 'destructive' :
                            assignment.status === 'accepted' ? 'default' : 'secondary'}
                  >
                    {assignment.status}
                  </Badge>
                  {assignment.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleAcceptAssignment(assignment.id)}
                      className="bg-dhq-blue hover:bg-blue-700"
                    >
                      Accept
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No assignments yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAssignmentsList;
