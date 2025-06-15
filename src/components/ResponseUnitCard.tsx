import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface ResponseUnitCardProps {
  unit: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

const ResponseUnitCard: React.FC<ResponseUnitCardProps> = ({ unit, onStatusUpdate, onDelete }) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{unit.full_name}</span>
          <Badge variant={unit.status === 'active' ? 'default' : 'secondary'}>{unit.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white">Rank: {unit.rank}</p>
        <p className="text-gray-400">Unit: {unit.unit}</p>
        <p className="text-gray-400">State: {unit.state}</p>
        <div className="flex items-center gap-3 mt-2">
          <Button
            size="sm"
            variant="destructive"
            className="flex items-center gap-1"
            onClick={() => onDelete && onDelete(unit.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
};
export default ResponseUnitCard;
