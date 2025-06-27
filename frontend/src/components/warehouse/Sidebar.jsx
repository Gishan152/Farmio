import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-gradient-to-b from-green-800 to-green-700 
        flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-60'} min-h-screen lg:w-60 animate-fadeIn`}
    >
      {/* Toggle Button for Mobile */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden p-2 text-green-50 hover:bg-green-600/50 rounded-full m-2 self-end
          transition-colors duration-200 hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Farmio Brand Header */}
      <div className="p-4">
        <div className={`flex items-center p-3 bg-green-800/30 
          rounded-xl border border-green-600/20 backdrop-blur-md ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-green-600 rounded-lg p-2 mr-2 shadow-lg shadow-green-600/30
            hover:scale-105 transition-transform duration-200">
            <span className="text-white text-lg">🌾</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
                Farmio
              </h2>
              <p className="text-green-100 text-xs font-medium">Warehouse</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <SidebarItem to="/warehouse/dashboard" icon="📊" label="Dashboard" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/facilities" icon="🏭" label="Facilities" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/bookings" icon="📅" label="Bookings" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/inventory" icon="📦" label="Inventory" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/customers" icon="👥" label="Customers" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/service-providers" icon="🚛" label="Services" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/pricing" icon="💳" label="Billing" isCollapsed={isCollapsed} />
          <SidebarItem to="/warehouse/analytics" icon="📈" label="Analytics" isCollapsed={isCollapsed} />
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-green-600/30">
        <div className={`bg-green-800/30 rounded-xl p-3 
          border border-green-600/20 backdrop-blur-md ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-green-600 rounded-full w-8 h-8 
                    flex items-center justify-center shadow-lg shadow-green-600/30
                    hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-semibold text-sm">JP</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-300 rounded-full 
                    border-2 border-green-800 animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <div className="text-green-50 font-medium text-sm">John Perera</div>
                  <div className="text-green-200 text-xs">Owner</div>
                </div>
              </div>
            )}
            <button className="text-green-50 hover:text-white transition-all duration-200 
              hover:bg-green-600/50 p-2 rounded-lg border border-transparent 
              hover:border-green-600/30 hover:scale-110 group">
              <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge Line with Modern Design */}
      <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-green-200 via-green-400 to-green-600 
        rounded-l-full shadow-lg shadow-green-400/50 animate-pulseGradient"></div>
    </aside>
  );
};

// Modern Sidebar Item Component
const SidebarItem = ({ to, icon, label, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-xl transition-all duration-200 group relative overflow-hidden 
      ${isCollapsed ? 'justify-center' : ''} ${
        isActive 
          ? "bg-green-700/40 text-white shadow-md shadow-green-600/30 border border-green-600/30 backdrop-blur-md" 
          : "text-green-50 hover:bg-green-700/40 hover:text-white border border-transparent hover:border-green-600/20 hover:shadow-md hover:shadow-green-600/20"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg ${isCollapsed ? 'mr-0' : 'mr-3'} 
          transition-all duration-200 ${
          isActive 
            ? "bg-green-600 text-white shadow-lg shadow-green-600/30" 
            : "bg-green-800/40 text-green-50 group-hover:bg-green-600/40 group-hover:text-white group-hover:shadow-lg group-hover:scale-105"
        }`}>
          <span className="text-base">{icon}</span>
        </div>
        
        {!isCollapsed && (
          <span className="relative font-medium text-sm">{label}</span>
        )}
        
        {/* Active indicator */}
        {isActive && !isCollapsed && (
          <div className="absolute right-3 flex space-x-1">
            <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse delay-100"></div>
          </div>
        )}
        
        {/* Right hover effect line */}
        <div className={`absolute right-0 top-0 h-full w-0.5 bg-gradient-to-b from-green-300 to-green-500 
          rounded-l-full transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}></div>
      </>
    )}
  </NavLink>
);

export default Sidebar;