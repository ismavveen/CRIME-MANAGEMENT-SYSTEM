
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface CommanderHeaderProps {
  displayStateName: string;
  onLogout?: () => void;
}

const CommanderHeader: React.FC<CommanderHeaderProps> = ({ displayStateName, onLogout }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-2 flex-shrink-0">
          <img 
            src="/lovable-uploads/ba3282a6-18f0-407f-baa2-bbdab0014f65.png" 
            alt="Defense Headquarters Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{`${displayStateName} Threat Intelligence and Monitoring System (STIMS)`}</h1>
          <p className="text-gray-400">
            Live threat analysis and report management for your jurisdiction.
          </p>
        </div>
      </div>
      {onLogout && (
        <Button variant="outline" onClick={onLogout} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      )}
    </div>
  );
};

export default CommanderHeader;
