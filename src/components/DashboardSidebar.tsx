
import React from 'react';
import {
  Circle,
  Settings,
  Users,
  FileText,
  Calendar,
  Inbox,
  LogOut,
  Shield
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DashboardSidebar = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const menuItems = [
    { title: 'Command Center', icon: Circle, path: '/', active: true },
    { title: 'Personnel', icon: Users, path: '/users' },
    { title: 'Intel Reports', icon: FileText, path: '/reports' },
    { title: 'Operations', icon: Calendar, path: '/calendar' },
    { title: 'Communications', icon: Inbox, path: '/inbox' },
    { title: 'System Config', icon: Settings, path: '/settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Session terminated - DHQ Intelligence Portal",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="dhq-sidebar w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-700/50">
      {/* Enhanced Header with DHQ Logo */}
      <div className="p-6 border-b border-gray-600/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
            <img 
              src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
              alt="DHQ Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-white font-bold text-lg">DHQ</p>
            <p className="text-gray-300 text-xs">DEFENSE HQ</p>
          </div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xs font-semibold mb-1">INTELLIGENCE PORTAL</div>
          <div className="text-gray-400 text-xs">v2.1.0 | CLASSIFIED</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive || item.active
                    ? 'bg-dhq-blue text-white shadow-lg border border-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600/30'
                  }`
                }
              >
                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Enhanced User Profile Section */}
      <div className="p-4 border-t border-gray-600/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center border-2 border-green-500/30">
            <Shield size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Maj. Gen. Analyst</p>
            <p className="text-gray-400 text-sm">Security Clearance: TOP SECRET</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-red-700/30 rounded-lg transition-colors border border-transparent hover:border-red-600/30"
        >
          <LogOut size={16} />
          <span className="text-sm">Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
