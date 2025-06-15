
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  Mail, 
  Settings, 
  Shield,
  UserCog,
  BarChart3,
  Activity
} from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/reports', label: 'Reports & Intel', icon: FileText },
    // Audit & Logs nav removed
    { path: '/charts', label: 'Analytics & Charts', icon: BarChart3 },
    { path: '/unit-commanders', label: 'Unit Commanders', icon: Shield },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/inbox', label: 'Inbox', icon: Mail },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 dhq-sidebar z-40 flex flex-col">
      {/* Enhanced Logo/Header */}
      <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-lg dhq-heading tracking-tight truncate">DHQ</h2>
            <p className="text-gray-400 text-xs dhq-caption truncate">Defense HQ Portal</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation - Scrollable */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 group dhq-caption font-medium text-sm relative ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-all duration-300 flex-shrink-0 ${
                      active ? 'text-white' : 'text-gray-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="font-medium tracking-wide truncate">{item.label}</span>
                  {active && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full ml-auto animate-pulse flex-shrink-0"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced Quick Actions - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/50 to-transparent flex-shrink-0">
        <div className="space-y-3">
          <Link
            to="/commander-portal"
            className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-all duration-300 group"
          >
            <UserCog size={16} className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 flex-shrink-0" />
            <span className="text-xs dhq-caption font-medium truncate">Commander Portal</span>
          </Link>
          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs dhq-caption">v2.1.0 - Secure</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-xs dhq-caption">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
