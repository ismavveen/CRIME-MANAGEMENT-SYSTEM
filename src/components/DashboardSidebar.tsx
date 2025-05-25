
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
  BarChart3
} from 'lucide-react';

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/reports', label: 'Reports & Intel', icon: FileText },
    { path: '/unit-commanders', label: 'Unit Commanders', icon: Shield },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/inbox', label: 'Inbox', icon: Mail },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 dhq-sidebar z-40">
      {/* Enhanced Logo/Header */}
      <div className="p-8 border-b border-gray-700/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl dhq-heading tracking-tight">DHQ</h2>
            <p className="text-gray-400 text-sm dhq-caption">Defense HQ Portal</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="mt-8 px-6">
        <ul className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group dhq-caption font-medium ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg'
                  }`}
                >
                  <Icon 
                    size={22} 
                    className={`transition-all duration-300 ${
                      active ? 'text-white' : 'text-gray-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="font-medium tracking-wide">{item.label}</span>
                  {active && (
                    <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced Quick Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/50 to-transparent">
        <div className="space-y-4">
          <Link
            to="/commander-portal"
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-xl transition-all duration-300 group"
          >
            <UserCog size={20} className="text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
            <span className="text-sm dhq-caption font-medium">Commander Portal</span>
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
