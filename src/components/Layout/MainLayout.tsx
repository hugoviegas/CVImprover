import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isEditorPage = location.pathname.includes('/editor');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav showJobDescription={isEditorPage} />
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
