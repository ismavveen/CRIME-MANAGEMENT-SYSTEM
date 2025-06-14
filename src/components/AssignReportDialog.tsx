
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Unit {
  id: string;
  name: string;
  type: string;
  location: string;
  commander: string;
}

interface AssignReportDialogProps {
  open: boolean;
  reportId: string | undefined;
  reportTitle: string | undefined;
  onOpenChange: (open: boolean) => void;
}

const AssignReportDialog: React.FC<AssignReportDialogProps> = ({
  open,
  reportId,
  reportTitle,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for units
  const units: Unit[] = [
    {
      id: "UNIT-001",
      name: "1st Battalion, 7th Infantry",
      type: "Infantry",
      location: "Lagos",
      commander: "Lt. Col. Adebayo"
    },
    {
      id: "UNIT-002",
      name: "3rd Armored Division",
      type: "Armored",
      location: "Kaduna",
      commander: "Brig. Gen. Musa"
    },
    {
      id: "UNIT-003",
      name: "5th Special Forces",
      type: "Special Forces",
      location: "Port Harcourt",
      commander: "Col. Ibrahim"
    },
    {
      id: "UNIT-004",
      name: "2nd Military Police Brigade",
      type: "Military Police",
      location: "Abuja",
      commander: "Col. Okonkwo"
    },
    {
      id: "UNIT-005",
      name: "4th Intelligence Unit",
      type: "Intelligence",
      location: "Maiduguri",
      commander: "Lt. Col. Abubakar"
    }
  ];

  // Filter units based on search query
  const filteredUnits = searchQuery 
    ? units.filter(unit => 
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        unit.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : units;

  const handleAssign = () => {
    if (!selectedUnit) {
      toast({
        title: "Selection required",
        description: "Please select a unit for assignment",
        variant: "destructive"
      });
      return;
    }
    
    const assignedUnit = units.find(unit => unit.id === selectedUnit);
    
    // In a real app, this would call an API to assign the report
    toast({
      title: "Report assigned",
      description: `Report ${reportId} assigned to ${assignedUnit?.name}`,
    });
    
    onOpenChange(false);
    setSelectedUnit(null);
    setSearchQuery("");
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    setSelectedUnit(null);
    setSearchQuery("");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">
            Assign Report to Unit
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {reportId ? `Report ID: ${reportId}` : "Select a unit to assign this report to"}
            {reportTitle && (
              <p className="mt-1 text-dhq-blue font-medium">{reportTitle}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search units by name, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-dhq-blue"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-900/60">
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-4 py-2">Select</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Commander</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUnits.map((unit) => (
                  <tr 
                    key={unit.id} 
                    className={`hover:bg-gray-700/30 cursor-pointer ${
                      selectedUnit === unit.id ? 'bg-gray-700/50' : ''
                    }`}
                    onClick={() => setSelectedUnit(unit.id)}
                  >
                    <td className="px-4 py-3">
                      <input 
                        type="radio" 
                        name="unit" 
                        checked={selectedUnit === unit.id} 
                        onChange={() => setSelectedUnit(unit.id)}
                        className="h-4 w-4 accent-dhq-blue"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {unit.name}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {unit.type}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {unit.location}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {unit.commander}
                    </td>
                  </tr>
                ))}
                {filteredUnits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                      No units found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <AlertDialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {selectedUnit ? `${units.find(u => u.id === selectedUnit)?.name} selected` : "No unit selected"}
          </div>
          <div className="flex space-x-3">
            <AlertDialogCancel 
              onClick={handleCancel}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAssign}
              className="bg-dhq-blue hover:bg-blue-700 text-white"
            >
              Confirm Assignment
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssignReportDialog;
