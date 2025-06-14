
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from 'lucide-react';

interface FilterCounts {
  total: number;
  resolved: number;
  unresolved: number;
  assigned: number;
  unassigned: number;
  pending: number;
  responded: number;
}

interface ReportFiltersProps {
  searchTerm: string;
  statusFilter: string;
  threatTypeFilter: string;
  stateFilter: string;
  counts: FilterCounts;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onThreatTypeFilterChange: (value: string) => void;
  onStateFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const ReportFilters = ({
  searchTerm,
  statusFilter,
  threatTypeFilter,
  stateFilter,
  counts,
  onSearchChange,
  onStatusFilterChange,
  onThreatTypeFilterChange,
  onStateFilterChange,
  onClearFilters
}: ReportFiltersProps) => {
  const hasActiveFilters = statusFilter !== 'all' || threatTypeFilter !== 'all' || stateFilter !== 'all' || searchTerm;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search reports by description, location, or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Status ({counts.total})</SelectItem>
            <SelectItem value="resolved">Resolved ({counts.resolved})</SelectItem>
            <SelectItem value="pending">Pending ({counts.pending})</SelectItem>
            <SelectItem value="assigned">Assigned ({counts.assigned})</SelectItem>
            <SelectItem value="unassigned">Unassigned ({counts.unassigned})</SelectItem>
            <SelectItem value="responded_to">Responded ({counts.responded})</SelectItem>
          </SelectContent>
        </Select>

        <Select value={threatTypeFilter} onValueChange={onThreatTypeFilterChange}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Threat Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="terrorism">Terrorism</SelectItem>
            <SelectItem value="kidnapping">Kidnapping</SelectItem>
            <SelectItem value="armed robbery">Armed Robbery</SelectItem>
            <SelectItem value="theft">Theft</SelectItem>
            <SelectItem value="vandalism">Vandalism</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stateFilter} onValueChange={onStateFilterChange}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
            <SelectItem value="Abuja">Abuja</SelectItem>
            <SelectItem value="Kano">Kano</SelectItem>
            <SelectItem value="Rivers">Rivers</SelectItem>
            <SelectItem value="Kaduna">Kaduna</SelectItem>
            <SelectItem value="Oyo">Oyo</SelectItem>
            <SelectItem value="Delta">Delta</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {statusFilter !== 'all' && (
            <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
              Status: {statusFilter.replace('_', ' ')}
            </Badge>
          )}
          {threatTypeFilter !== 'all' && (
            <Badge variant="outline" className="bg-orange-900/30 text-orange-300 border-orange-700">
              Type: {threatTypeFilter}
            </Badge>
          )}
          {stateFilter !== 'all' && (
            <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
              State: {stateFilter}
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
              Search: {searchTerm}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportFilters;
