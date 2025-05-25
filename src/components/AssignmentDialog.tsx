
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssignments } from '@/hooks/useAssignments';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Users, User } from 'lucide-react';

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string | null;
  reportLocation?: string;
  reportLatitude?: number;
  reportLongitude?: number;
}

const AssignmentDialog: React.FC<AssignmentDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportLocation,
  reportLatitude,
  reportLongitude
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { militaryUnits, assignReport, findNearestUnit } = useAssignments();
  const { user } = useAuth();

  const nearestUnit = reportLatitude && reportLongitude 
    ? findNearestUnit(reportLatitude, reportLongitude)
    : null;

  const handleAssign = async () => {
    if (!reportId || !selectedUnitId || !user) return;

    setIsAssigning(true);
    try {
      const selectedUnit = militaryUnits.find(unit => unit.id === selectedUnitId);
      if (selectedUnit) {
        await assignReport(
          reportId,
          selectedUnitId,
          selectedUnit.commander,
          user.email || 'System'
        );
        onOpenChange(false);
        setSelectedUnitId('');
      }
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign Report to Military Unit</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Information */}
          <div className="bg-gray-900/60 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Report Details</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{reportLocation || 'Location not specified'}</span>
            </div>
          </div>

          {/* Nearest Unit Recommendation */}
          {nearestUnit && (
            <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-300 mb-2">Recommended Unit (Nearest)</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">{nearestUnit.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span>Commander: {nearestUnit.commander}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>{nearestUnit.location}</span>
                </div>
              </div>
              <Button
                onClick={() => setSelectedUnitId(nearestUnit.id)}
                variant="outline"
                size="sm"
                className="mt-3 bg-blue-900/30 border-blue-600 text-blue-300"
              >
                Select Recommended Unit
              </Button>
            </div>
          )}

          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Military Unit</label>
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger className="bg-gray-900/50 border-gray-600">
                <SelectValue placeholder="Choose a military unit..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {militaryUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id} className="text-white">
                    <div className="flex flex-col">
                      <span className="font-medium">{unit.name}</span>
                      <span className="text-sm text-gray-400">
                        {unit.commander} • {unit.location}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Unit Details */}
          {selectedUnitId && (
            <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
              <h3 className="font-medium text-green-300 mb-2">Selected Unit</h3>
              {(() => {
                const selectedUnit = militaryUnits.find(unit => unit.id === selectedUnitId);
                return selectedUnit ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-400" />
                      <span className="font-medium">{selectedUnit.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-400" />
                      <span>Commander: {selectedUnit.commander}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span>{selectedUnit.location}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Type: {selectedUnit.type}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedUnitId || isAssigning}
            className="bg-dhq-blue hover:bg-blue-700"
          >
            {isAssigning ? 'Assigning...' : 'Assign Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
