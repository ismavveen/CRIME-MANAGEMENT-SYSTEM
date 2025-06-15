
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Check } from 'lucide-react';
import { Assignment } from '@/hooks/useAssignments';

interface ActiveAssignmentsListProps {
  assignments: Assignment[];
  onOpenResolutionDialog: (assignment: Assignment) => void;
}

const ActiveAssignmentsList: React.FC<ActiveAssignmentsListProps> = ({ assignments, onOpenResolutionDialog }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-green-400" />
          Active Assignments
        </CardTitle>
        <CardDescription className="text-gray-400">
          Assignments you have accepted and are working on.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">Assignment #{assignment.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-400">
                    Accepted: {new Date(assignment.accepted_at!).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onOpenResolutionDialog(assignment)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Submit Resolution
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No active assignments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveAssignmentsList;
