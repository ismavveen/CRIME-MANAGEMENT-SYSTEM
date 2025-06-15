
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import CommanderRegistration from '../components/CommanderRegistration';
import ResponseUnitCard from '../components/ResponseUnitCard';
import UnitCommanderStats from '../components/UnitCommanderStats';
import UnitCommanderFilters from '../components/UnitCommanderFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserPlus, Users } from 'lucide-react';
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
        <UnitCommanderStats commanders={commanders} metrics={metrics} />

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
            <UnitCommanderFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              commanders={commanders}
            />

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
