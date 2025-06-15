
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResponseUnitCardProps {
  unit: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  onViewProfile?: () => void;
  isDeleteEnabled?: boolean;
  isStatusEnabled?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const ResponseUnitCard: React.FC<ResponseUnitCardProps> = ({
  unit,
  onStatusUpdate,
  onDelete,
  onViewProfile,
  isDeleteEnabled,
  isStatusEnabled,
}) => {
  const avatarUrl = unit.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(unit.full_name)}&background=1e40af&color=fff&size=48`;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} alt={unit.full_name} />
                    <AvatarFallback>{getInitials(unit.full_name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="flex flex-col">
                    <span className="text-base">{unit.full_name}</span>
                    <span className="text-xs text-gray-400 font-normal">{unit.rank}</span>
                </CardTitle>
            </div>
            <Badge variant={unit.status === 'active' ? 'default' : 'secondary'} className="capitalize">{unit.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm">Unit: {unit.unit}</p>
        <p className="text-gray-400 text-sm">State: {unit.state}</p>
        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="w-full flex items-center gap-1 bg-gray-700/50 border-gray-600 hover:bg-gray-700"
            onClick={onViewProfile}
          >
            <User className="h-4 w-4" />
            View Profile
          </Button>
          {isDeleteEnabled && (
            <Button
              size="sm"
              variant="destructive"
              className="flex items-center gap-1"
              onClick={() => onDelete && onDelete(unit.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
};
export default ResponseUnitCard;
