import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-green-900 text-green-100 w-64 min-h-screen flex flex-col shadow-lg">
      <div className="p-6 flex-1">
        {/* Farmio Brand Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold flex items-center text-green-100">
            <span className="text-3xl mr-3">🌾</span>
            Farmio
          </h2>
          <p className="text-green-300 text-sm mt-1">Warehouse Management</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mb-8">
          <ul className="space-y-2">
            <SidebarItem to="/warehouse/dashboard" icon="📊" label="Dashboard" />
            <SidebarItem to="/warehouse/facilities" icon="🏭" label="Facilities" />
            <SidebarItem to="/warehouse/bookings" icon="📅" label="Bookings" />
            <SidebarItem to="/warehouse/inventory" icon="📦" label="Inventory" />                    
            <SidebarItem to="/warehouse/customers" icon="👥" label="Customers" />
            <SidebarItem to="/warehouse/service-providers" icon="🚛" label="Service Providers" />  
            <SidebarItem to="/warehouse/pricing" icon="💳" label="Billing & Payments" />   
            <SidebarItem to="/warehouse/analytics" icon="📈" label="Analytics" />                       
          </ul>
        </nav>
      </div>

      {/* User Info */}
      <div className="p-6 border-t border-green-800">
        <div className="flex items-center">
          <div className="bg-green-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <span className="text-green-200">👤</span>
          </div>
          <div>
            <div className="text-green-100 font-semibold text-sm">John Perera</div>
            <div className="text-green-400 text-xs">Warehouse Owner</div>
          </div>
          <button className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ to, icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive ? "bg-green-800 text-white shadow" : "hover:bg-green-800 hover:text-white"
        }`
      }
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  </li>
);

export default Sidebar;