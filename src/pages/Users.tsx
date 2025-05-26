
import React, { useState, useEffect } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users as UsersIcon, Search, Filter, Mail, Calendar, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  rank: string | null;
  unit: string | null;
  role: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
}

const Users = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.unit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'commander': return 'bg-blue-500';
      case 'officer': return 'bg-green-500';
      case 'user': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg">
        <DashboardSidebar />
        <div className="ml-64 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading users...</div>
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
                src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Registered Users</h1>
              <p className="text-gray-400">
                Manage and view all registered users in the system
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Registered Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <p className="text-xs text-gray-400">
              {users.filter(u => u.role === 'admin').length} admins, {' '}
              {users.filter(u => u.role === 'commander').length} commanders, {' '}
              {users.filter(u => u.role === 'user').length} users
            </p>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="commander">Commander</SelectItem>
              <SelectItem value="officer">Officer</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg truncate">
                      {user.full_name || 'Unknown User'}
                    </CardTitle>
                    <CardDescription className="text-gray-400 truncate">
                      {user.email}
                    </CardDescription>
                  </div>
                  <Badge className={`${getRoleColor(user.role)} text-white capitalize ml-2 flex-shrink-0`}>
                    {user.role || 'user'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                {user.rank && (
                  <div className="flex items-center text-gray-300">
                    <Shield className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{user.rank}</span>
                  </div>
                )}
                
                {user.unit && (
                  <div className="flex items-center text-gray-300">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{user.unit}</span>
                  </div>
                )}
                
                {user.phone && (
                  <div className="flex items-center text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                {user.state && (
                  <div className="text-center pt-2 border-t border-gray-700">
                    <div className="text-sm font-medium text-white">{user.state}</div>
                    <div className="text-xs text-gray-400">State</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No users have registered yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
