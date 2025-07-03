import React from "react";
import { Link } from "react-router-dom";
import { FaCog, FaLink, FaBell, FaSearch } from "react-icons/fa";

const PageHeader = ({ title, subtitle }) => (
  <header
    className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-8 py-4 bg-white border-b transition-all duration-300
      lg:left-60 lg:w-[calc(100%-15rem)]"
  >
    <div>
      <h1 className="text-xl font-bold text-green-900">{title}</h1>
      {subtitle && (
        <p className="text-sm text-green-700 mt-1">{subtitle}</p>
      )}
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="border rounded pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          style={{ minWidth: 160 }}
        />
        <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
      </div>
      <Link to="/warehouse/settings" title="Settings">
        <FaCog className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" />
      </Link>
      <Link to="/warehouse/notifications" title="Notifications">
        <FaBell className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" />
      </Link>
      <Link to="/warehouse/links" title="Links">
        <FaLink className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer" />
      </Link>
      <Link to="/warehouse/profile" title="Profile">
        <img
          src="/Images/warehouse/user.jpg"
          alt="Profile"
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
      </Link>
    </div>
  </header>
);

export default PageHeader;