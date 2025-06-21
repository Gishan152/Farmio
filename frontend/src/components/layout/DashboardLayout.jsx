import { useState } from 'react';
import Sidebar from './Sidebar';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const DashboardLayout = ({ 
  children, 
  title, 
  userRole = 'admin',
  breadcrumbs = null,
  actions = null
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-dashboard-bg">
      {/* Sidebar - show on desktop or when opened */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar userRole={userRole} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            {/* Left side - Menu toggle & title */}
            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MenuIcon />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-dashboard-text-primary">{title}</h1>
                {breadcrumbs && (
                  <div className="text-xs text-dashboard-text-light mt-1">
                    {breadcrumbs}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Actions & search */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 w-64 bg-gray-100 border border-transparent rounded-md focus:bg-white focus:border-dashboard-border focus:outline-none"
                />
                <div className="absolute left-3 top-2.5">
                  <SearchIcon />
                </div>
              </div>
              
              {/* Action buttons */}
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
