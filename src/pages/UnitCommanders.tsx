
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import CommanderRegistration from '../components/CommanderRegistration';
import ResponseUnitCard from '../components/ResponseUnitCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserPlus, Search, Filter, Users, Award, Clock, TrendingUp } from 'lucide-react';
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
                         commander.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commander.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commander.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <Tabs defaultValue="units" className="space-y-4">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="units" className="data-[state=active]:bg-dhq-blue">
              <Users className="h-4 w-4 mr-2" />
              Active Response Units
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-dhq-blue">
              <UserPlus className="h-4 w-4 mr-2" />
              Register New Response Unit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search response units by name, unit, rank, state, or email..."
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
                  <SelectItem value="all">All Status ({commanders.length})</SelectItem>
                  <SelectItem value="active">Active ({commanders.filter(c => c.status === 'active').length})</SelectItem>
                  <SelectItem value="available">Available ({commanders.filter(c => c.status === 'available').length})</SelectItem>
                  <SelectItem value="suspended">Suspended ({commanders.filter(c => c.status === 'suspended').length})</SelectItem>
                  <SelectItem value="inactive">Inactive ({commanders.filter(c => c.status === 'inactive').length})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Response Units Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCommanders.map((commander) => (
                <ResponseUnitCard 
                  key={commander.id} 
                  unit={commander}
                  onStatusUpdate={updateCommanderStatus}
                />
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
