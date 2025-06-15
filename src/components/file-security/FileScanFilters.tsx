
/**
 * File Scan Filters Component
 * Provides filtering and search functionality
 * Implements accessible form controls and responsive design
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';

interface FileScanFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

/**
 * Filter controls with proper accessibility and validation
 */
const FileScanFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  onRefresh,
  isLoading = false
}: FileScanFiltersProps) => {
  // Input validation for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic XSS prevention - strip potentially dangerous characters
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    onSearchChange(sanitizedValue);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by threat type or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-gray-700/50 border-gray-600 text-white"
              maxLength={100} // Prevent excessively long inputs
              aria-label="Search files by threat type or description"
            />
          </div>
          
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger 
              className="w-full md:w-48 bg-gray-700/50 border-gray-600"
              aria-label="Filter files by status"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="unscanned">Unscanned</SelectItem>
              <SelectItem value="scanned">Scanned</SelectItem>
              <SelectItem value="clean">Clean</SelectItem>
              <SelectItem value="infected">Infected/Suspicious</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={onRefresh}
            variant="outline"
            className="bg-cyan-600/20 border-cyan-500 text-cyan-300 hover:bg-cyan-600/30"
            disabled={isLoading}
            aria-label="Refresh file list"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileScanFilters;
