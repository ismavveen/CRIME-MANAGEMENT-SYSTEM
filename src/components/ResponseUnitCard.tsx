
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Award, Shield, User } from 'lucide-react';
import { UnitCommander } from '@/hooks/useUnitCommanders';
import ResponseUnitModal from './ResponseUnitModal';

interface ResponseUnitCardProps {
  unit: UnitCommander;
  onStatusUpdate: (unitId: string, status: 'active' | 'suspended' | 'inactive' | 'available') => void;
}

const ResponseUnitCard = ({ unit, onStatusUpdate }: ResponseUnitCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'available': return 'bg-blue-500';
      case 'suspended': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(unit.full_name)}&background=1e40af&color=fff`} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(unit.full_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white text-lg">{unit.full_name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {unit.rank} • Response Unit {unit.unit}
                </CardDescription>
              </div>
            </div>
            <Badge className={`${getStatusColor(unit.status)} text-white capitalize`}>
              {unit.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center text-gray-300">
            <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-sm truncate">{unit.email}</span>
          </div>
          
          {unit.contact_info && (
            <div className="flex items-center text-gray-300">
              <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate">{unit.contact_info}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-300">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-sm truncate">{unit.state}</span>
          </div>
          
          {unit.specialization && (
            <div className="flex items-center text-gray-300">
              <Award className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate">{unit.specialization}</span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{unit.total_assignments}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{unit.active_assignments}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{Math.round(unit.success_rate)}%</div>
              <div className="text-xs text-gray-400">Success</div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => setShowModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
            >
              <User className="h-3 w-3 mr-1" />
              View Profile
            </Button>
            {unit.status !== 'active' && (
              <Button
                size="sm"
                onClick={() => onStatusUpdate(unit.id, 'active')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
              >
                Activate
              </Button>
            )}
            {unit.status !== 'suspended' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusUpdate(unit.id, 'suspended')}
                className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20 text-xs"
              >
                Suspend
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ResponseUnitModal
        unit={unit}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
};

export default ResponseUnitCard;
