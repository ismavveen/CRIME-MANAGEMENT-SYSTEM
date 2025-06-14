
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Award, Shield, Clock, TrendingUp } from 'lucide-react';
import { UnitCommander } from '@/hooks/useUnitCommanders';

interface ResponseUnitModalProps {
  unit: UnitCommander;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponseUnitModal = ({ unit, open, onOpenChange }: ResponseUnitModalProps) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(unit.full_name)}&background=1e40af&color=fff`} />
              <AvatarFallback className="bg-blue-600 text-white text-lg">
                {getInitials(unit.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>{unit.full_name}</div>
              <div className="text-sm text-gray-400 font-normal">
                {unit.rank} • Response Unit {unit.unit}
              </div>
            </div>
            <Badge className={`${getStatusColor(unit.status)} text-white capitalize ml-auto`}>
              {unit.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{unit.email}</span>
                </div>
                {unit.contact_info && (
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{unit.contact_info}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{unit.state}</span>
                </div>
                {unit.location && (
                  <div className="flex items-start text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400 mt-0.5" />
                    <span>{unit.location}</span>
                  </div>
                )}
              </div>
            </div>

            {unit.specialization && (
              <div className="bg-gray-900/60 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  Specialization
                </h3>
                <p className="text-gray-300">{unit.specialization}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{unit.total_assignments}</div>
                  <div className="text-sm text-gray-400">Total Assignments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{unit.active_assignments}</div>
                  <div className="text-sm text-gray-400">Active Assignments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round(unit.success_rate)}%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round(unit.average_response_time)}</div>
                  <div className="text-sm text-gray-400">Avg Response (min)</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                Service Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Joined:</span>
                  <span className="text-white">{new Date(unit.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{new Date(unit.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className={`${getStatusColor(unit.status)} text-white capitalize text-xs`}>
                    {unit.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseUnitModal;
