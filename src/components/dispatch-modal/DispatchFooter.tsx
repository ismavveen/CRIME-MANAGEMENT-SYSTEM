
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface DispatchFooterProps {
  selectedCommander: string;
  isAssigning: boolean;
  onAssign: () => void;
  onCancel: () => void;
}

const DispatchFooter = ({ selectedCommander, isAssigning, onAssign, onCancel }: DispatchFooterProps) => {
  return (
    <DialogFooter className="flex justify-between items-center">
      <div className="text-sm text-gray-400">
        {selectedCommander ? (
          <span className="text-green-400">
            ✓ Commander selected - Ready for deployment
          </span>
        ) : (
          <span>Select a response commander to proceed</span>
        )}
      </div>
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button 
          onClick={onAssign}
          disabled={!selectedCommander || isAssigning}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          {isAssigning ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Deploying...</span>
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              <span>Deploy Response Unit</span>
            </>
          )}
        </Button>
      </div>
    </DialogFooter>
  );
};

export default DispatchFooter;
