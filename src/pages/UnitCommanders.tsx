
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import CommanderRegistration from '../components/CommanderRegistration';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserPlus, Search, Filter, Users, Award, Clock, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';

const UnitCommanders = () => {
  const { commanders, loading, updateCommanderStatus } = useUnitCommanders();
  const { metrics } = useSystemMetrics();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCommanders = commanders.filter(commander => {
    const matchesSearch = commander.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.rank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commander.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'available': return 'bg-blue-500';
      case 'suspended': return 'bg-red-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading response units...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      <div className="ml-64 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-2">
              <img 
                src="/lovable-uploads/ba3282a6-18f0-407f-baa2-bbdab0014f65.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Response Unit Management</h1>
              <p className="text-gray-400">
                Register and manage field response units with real-time data updates
              </p>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Response Units</CardTitle>
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
              <div className="text-2xl font-bold text-white">{metrics.active_operations}</div>
              <p className="text-xs text-gray-400">
                Currently in progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Average Response Time</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.average_response_time}</div>
              <p className="text-xs text-gray-400">
                minutes average
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Responded Reports</CardTitle>
              <Award className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.responded_reports}</div>
              <p className="text-xs text-gray-400">
                Units responded
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="commanders" className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="commanders" className="data-[state=active]:bg-dhq-blue">
              <Users className="h-4 w-4 mr-2" />
              Active Response Units
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-dhq-blue">
              <UserPlus className="h-4 w-4 mr-2" />
              Register New Response Unit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commanders" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search response units..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
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

            {/* Response Units Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCommanders.map((commander) => (
                <Card key={commander.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg truncate">{commander.full_name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {commander.rank} • Response Unit {commander.unit}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(commander.status)} text-white capitalize`}>
                        {commander.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 pt-0">
                    {commander.specialization && (
                      <div className="flex items-center text-gray-300">
                        <Award className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{commander.specialization}</span>
                      </div>
                    )}
                    
                    {commander.location && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{commander.location}</span>
                      </div>
                    )}
                    
                    {commander.contact_info && (
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-sm truncate">{commander.contact_info}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{commander.total_assignments}</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{commander.active_assignments}</div>
                        <div className="text-xs text-gray-400">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{Math.round(commander.success_rate)}%</div>
                        <div className="text-xs text-gray-400">Success</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {commander.status !== 'active' && (
                        <Button
                          size="sm"
                          onClick={() => updateCommanderStatus(commander.id, 'active')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
                        >
                          Activate
                        </Button>
                      )}
                      {commander.status !== 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCommanderStatus(commander.id, 'suspended')}
                          className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20 text-xs"
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
                <h3 className="text-lg font-semibold text-white mb-2">No response units found</h3>
                <p className="text-gray-400">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Register the first response unit to get started'
                  }
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="register">
            <CommanderRegistration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnitCommanders;
