import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faHouse,
  faCalendarAlt,
  faBoxes,  
  faTrashAlt,
  faCreditCard,
  faChartLine,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";


const navItems = [
  { to: "/warehouse/dashboard", icon: faChartBar, label: "Dashboard" },
  { to: "/warehouse/warehouse", icon: faHouse, label: "Warehouse" },
  { to: "/warehouse/bookings", icon: faCalendarAlt, label: "Bookings" },
  { to: "/warehouse/inventory", icon: faBoxes, label: "Inventory" },
  { to: "/warehouse/service-providers", icon: faTrashAlt, label: "Services" },
  { to: "/warehouse/payment", icon: faCreditCard, label: "Payments" },
  { to: "/warehouse/analytics", icon: faChartLine, label: "Analytics" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white flex flex-col shadow-2xl transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"} min-h-screen lg:w-64 animate-fadeIn relative border-r border-green-100`}
    >
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden p-2 text-green-700 hover:bg-green-100 rounded-full m-2 self-end
          transition-colors duration-200 hover:scale-110"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Brand Header */}
      <div className="p-4">
        <div
          className={`flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100
          rounded-xl border border-green-100 shadow-sm ${isCollapsed ? "justify-center" : ""}`}
        >
          {/* Logo
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 mr-2 object-contain"
            style={{ minWidth: 32 }}
          /> */}
          {!isCollapsed && (
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-green-800 tracking-tight mr-2">Farmio</h2>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-green-100 mt-auto">
        <div
          className={`bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 
          border border-green-100 shadow-sm ${isCollapsed ? "flex justify-center" : ""}`}
        >
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="relative">
                  <div className="bg-green-600 rounded-full w-9 h-9 
                    flex items-center justify-center shadow-lg shadow-green-600/20
                    hover:scale-105 transition-transform duration-200">
                    <FontAwesomeIcon icon={faUserCircle} className="text-white text-xl" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-300 rounded-full 
                    border-2 border-white animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <div className="text-green-900 font-semibold text-sm">John Perera</div>
                  <div className="text-green-500 text-xs">Owner</div>
                </div>
              </div>
            )}
            <button
              className="text-green-700 hover:text-green-900 transition-all duration-200 
                hover:bg-green-100 p-2 rounded-lg border border-transparent 
                hover:border-green-200 hover:scale-110 group"
              aria-label="Sign out"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Edge Line */}
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600 
        rounded-l-full shadow-lg shadow-green-400/30 animate-pulseGradient pointer-events-none"></div>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, isCollapsed }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg transition-all duration-200 group relative overflow-hidden
        ${isCollapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-green-100 text-green-900 shadow-md shadow-green-200 border border-green-200"
            : "text-green-900 hover:bg-green-50 hover:text-green-900 border border-transparent hover:border-green-100"
        }`
      }
      tabIndex={0}
    >
      {({ isActive }) => (
        <>
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg ${
              isCollapsed ? "mr-0" : "mr-3"
            } transition-all duration-200
            bg-transparent text-black group-hover:text-green-700`}
          >
            <FontAwesomeIcon icon={icon} className="text-lg" />
          </div>
          {!isCollapsed && (
            <span className="relative font-medium text-sm tracking-wide">{label}</span>
          )}
          {/* Active indicator */}
          {isActive && !isCollapsed && (
            <div className="absolute right-3 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse delay-100"></div>
            </div>
          )}
          {/* Right hover effect line */}
          <div
            className={`absolute right-0 top-0 h-full w-0.5 bg-gradient-to-b from-green-300 to-green-500 
            rounded-l-full transition-all duration-200 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
            }`}
          ></div>
        </>
      )}
    </NavLink>
  </li>
);

export default Sidebar;