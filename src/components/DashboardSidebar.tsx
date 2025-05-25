
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
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-40">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-dhq-blue rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">DHQ</h2>
            <p className="text-gray-400 text-xs">Defense HQ Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-dhq-blue text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="space-y-2">
          <Link
            to="/commander-portal"
            className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <UserCog size={18} />
            <span className="text-sm">Commander Portal</span>
          </Link>
          <div className="text-center">
            <p className="text-gray-500 text-xs">v2.1.0 - Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
