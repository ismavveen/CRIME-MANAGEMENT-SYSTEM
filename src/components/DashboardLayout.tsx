
import React from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dhq-dark-bg flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
