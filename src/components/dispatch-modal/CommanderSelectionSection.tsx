
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, User } from 'lucide-react';

interface CommanderSelectionSectionProps {
  selectedCommander: string;
  onCommanderChange: (commanderId: string) => void;
  availableCommanders: any[];
  commanders: any[];
  report: any;
}

const CommanderSelectionSection = ({ 
  selectedCommander, 
  onCommanderChange, 
  availableCommanders, 
  commanders, 
  report 
}: CommanderSelectionSectionProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Target className="h-5 w-5 text-cyan-400" />
          <span>Response Unit Assignment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedCommander} onValueChange={onCommanderChange}>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder="Select an available commander for deployment" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {availableCommanders.length === 0 ? (
              <SelectItem value="none" disabled>
                No commanders available in {report.state}
              </SelectItem>
            ) : (
              availableCommanders.map((commander) => (
                <SelectItem key={commander.id} value={commander.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <p className="font-medium text-white">
                        {commander.rank} {commander.full_name}
                      </p>
                      <p className="text-gray-400 text-xs">{commander.unit}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-gray-400">Active: {commander.active_assignments}</p>
                      <p className="text-green-400">{commander.success_rate}% Success</p>
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {selectedCommander && (
          <Card className="bg-blue-900/20 border border-blue-700/50">
            <CardContent className="p-4">
              {(() => {
                const commander = commanders.find(c => c.id === selectedCommander);
                return commander ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-300 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Selected Response Commander</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name & Rank:</span>
                        <p className="text-white font-medium">{commander.rank} {commander.full_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Unit:</span>
                        <p className="text-white">{commander.unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Active Missions:</span>
                        <p className="text-white">{commander.active_assignments}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Success Rate:</span>
                        <p className="text-green-400 font-medium">{commander.success_rate}%</p>
                      </div>
                      {commander.specialization && (
                        <div className="col-span-2">
                          <span className="text-gray-400">Specialization:</span>
                          <p className="text-white">{commander.specialization}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default CommanderSelectionSection;
