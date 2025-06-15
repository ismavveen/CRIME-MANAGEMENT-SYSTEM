
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';

interface CommanderDashboardHeaderProps {
  commanderState: string;
  onLogout?: () => void;
}

const CommanderDashboardHeader: React.FC<CommanderDashboardHeaderProps> = ({ commanderState, onLogout }) => {
  return (
    <div className="bg-gradient-to-r from-dhq-blue to-blue-700 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Commander Dashboard</h1>
            <p className="text-blue-100">State: {commanderState}</p>
          </div>
        </div>
        {onLogout && (
          <Button onClick={onLogout} variant="outline" className="text-white border-white hover:bg-white hover:text-dhq-blue">
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommanderDashboardHeader;
