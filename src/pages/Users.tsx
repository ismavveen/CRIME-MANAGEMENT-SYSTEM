
import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search } from "lucide-react";

const Users = () => {
  // Mock data for users
  const users = [
    { id: 1, name: "Murat Alpay", role: "DHQ Analyst", status: "active", email: "murat.alpay@dhq.gov.ng", lastActive: "2 hours ago" },
    { id: 2, name: "Sarah Okafor", role: "Intelligence Officer", status: "active", email: "sarah.okafor@dhq.gov.ng", lastActive: "5 mins ago" },
    { id: 3, name: "David Adebayo", role: "Field Agent", status: "offline", email: "david.adebayo@dhq.gov.ng", lastActive: "2 days ago" },
    { id: 4, name: "Amina Ibrahim", role: "Data Analyst", status: "active", email: "amina.ibrahim@dhq.gov.ng", lastActive: "Just now" },
    { id: 5, name: "John Okonkwo", role: "DHQ Administrator", status: "away", email: "john.okonkwo@dhq.gov.ng", lastActive: "1 hour ago" },
    { id: 6, name: "Fatima Bello", role: "Response Coordinator", status: "active", email: "fatima.bello@dhq.gov.ng", lastActive: "30 mins ago" },
    { id: 7, name: "Michael Eze", role: "Security Specialist", status: "offline", email: "michael.eze@dhq.gov.ng", lastActive: "5 days ago" },
    { id: 8, name: "Elizabeth Danjuma", role: "Threat Analyst", status: "active", email: "elizabeth.d@dhq.gov.ng", lastActive: "15 mins ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400">
                Manage users, roles, and permissions for the DHQ Intelligence Portal
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-dhq-blue"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/30 rounded-lg shadow-lg overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/40 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-white">{user.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-300">
                    {user.role}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(user.status)} mr-2`}></div>
                      <span className="capitalize text-gray-300">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-400">
                    {user.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Users;
