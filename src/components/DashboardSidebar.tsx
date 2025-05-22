
import React from 'react';
import { 
  Circle, 
  Settings, 
  Users, 
  FileText, 
  Calendar,
  Inbox 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const DashboardSidebar = () => {
  const menuItems = [
    { title: 'Dashboard', icon: Circle, path: '/', active: true },
    { title: 'Users', icon: Users, path: '/users' },
    { title: 'Reports', icon: FileText, path: '/reports' },
    { title: 'Calendar', icon: Calendar, path: '/calendar' },
    { title: 'Inbox', icon: Inbox, path: '/inbox' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="dhq-sidebar w-64 h-screen fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-600/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-dhq-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">DHQ</span>
          </div>
          <div>
            <p className="text-white font-semibold">Defense HQ</p>
            <p className="text-gray-300 text-sm">Intelligence Portal</p>
          </div>
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
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive || item.active
                      ? 'bg-dhq-blue text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-600/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">MA</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Murat Alpay</p>
            <p className="text-gray-400 text-sm">DHQ Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
