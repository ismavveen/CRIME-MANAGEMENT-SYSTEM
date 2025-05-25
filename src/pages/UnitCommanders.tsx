
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Shield, UserPlus, Search, Filter, Users, Award, Clock, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';

const UnitCommanders = () => {
  const { commanders, systemMetrics, loading, createCommander, updateCommanderStatus } = useUnitCommanders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCommander, setNewCommander] = useState({
    full_name: '',
    rank: '',
    unit: '',
    specialization: '',
    location: '',
    contact_info: '',
    status: 'active' as const
  });

  const filteredCommanders = commanders.filter(commander => {
    const matchesSearch = commander.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.rank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commander.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCommander = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCommander(newCommander);
      setShowAddDialog(false);
      setNewCommander({
        full_name: '',
        rank: '',
        unit: '',
        specialization: '',
        location: '',
        contact_info: '',
        status: 'active'
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'available':
        return 'bg-blue-500';
      case 'suspended':
        return 'bg-red-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading commanders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-2">
                <img 
                  src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Unit Commanders</h1>
                <p className="text-gray-400">
                  Manage field unit commanders and operational assignments
                </p>
              </div>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-dhq-blue hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Commander
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Register New Commander</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new unit commander to the system
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddCommander} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="full_name"
                        value={newCommander.full_name}
                        onChange={(e) => setNewCommander({...newCommander, full_name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="rank" className="text-gray-300">Rank</Label>
                      <Select 
                        value={newCommander.rank} 
                        onValueChange={(value) => setNewCommander({...newCommander, rank: value})}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                          <SelectItem value="Captain">Captain</SelectItem>
                          <SelectItem value="Major">Major</SelectItem>
                          <SelectItem value="Colonel">Colonel</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unit" className="text-gray-300">Unit</Label>
                      <Input
                        id="unit"
                        value={newCommander.unit}
                        onChange={(e) => setNewCommander({...newCommander, unit: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
                      <Input
                        id="specialization"
                        value={newCommander.specialization}
                        onChange={(e) => setNewCommander({...newCommander, specialization: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-gray-300">Location</Label>
                      <Input
                        id="location"
                        value={newCommander.location}
                        onChange={(e) => setNewCommander({...newCommander, location: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_info" className="text-gray-300">Contact</Label>
                      <Input
                        id="contact_info"
                        value={newCommander.contact_info}
                        onChange={(e) => setNewCommander({...newCommander, contact_info: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-dhq-blue hover:bg-blue-700">
                      Register Commander
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Commanders</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{commanders.length}</div>
              <p className="text-xs text-gray-400">
                {commanders.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Operations</CardTitle>
              <Shield className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemMetrics.active_operations}</div>
              <p className="text-xs text-gray-400">
                Currently in progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {commanders.length > 0 
                  ? Math.round(commanders.reduce((acc, c) => acc + c.success_rate, 0) / commanders.length)
                  : 0
                }%
              </div>
              <p className="text-xs text-gray-400">
                Average across all units
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {commanders.length > 0 
                  ? Math.round(commanders.reduce((acc, c) => acc + c.average_response_time, 0) / commanders.length)
                  : 0
                }h
              </div>
              <p className="text-xs text-gray-400">
                Response time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search commanders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Commanders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommanders.map((commander) => (
            <Card key={commander.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{commander.full_name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {commander.rank} • {commander.unit}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(commander.status)} text-white capitalize`}>
                    {commander.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {commander.specialization && (
                  <div className="flex items-center text-gray-300">
                    <Award className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{commander.specialization}</span>
                  </div>
                )}
                
                {commander.location && (
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{commander.location}</span>
                  </div>
                )}
                
                {commander.contact_info && (
                  <div className="flex items-center text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{commander.contact_info}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{commander.total_assignments}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{commander.active_assignments}</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{commander.success_rate}%</div>
                    <div className="text-xs text-gray-400">Success</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {commander.status !== 'active' && (
                    <Button
                      size="sm"
                      onClick={() => updateCommanderStatus(commander.id, 'active')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Activate
                    </Button>
                  )}
                  {commander.status !== 'suspended' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCommanderStatus(commander.id, 'suspended')}
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCommanders.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No commanders found</h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Register the first commander to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitCommanders;
