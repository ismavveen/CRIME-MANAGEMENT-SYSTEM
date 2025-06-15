
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface UnitCommanderFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  commanders: any[];
}

const UnitCommanderFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  commanders 
}: UnitCommanderFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, unit, rank, state, or email..."
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
  );
};

export default UnitCommanderFilters;
