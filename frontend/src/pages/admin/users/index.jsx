import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

// User type icons
const FarmerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const BuyerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const WasteManagementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ModeratorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserManagementHome = () => {
  // User categories for management
  const userCategories = [
    {
      name: "Farmers",
      path: "/admin/users/farmers",
      description: "Manage farm owners and agricultural producers",
      icon: <FarmerIcon />,
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Buyers",
      path: "/admin/users/buyers",
      description: "Manage retail stores, restaurants, and other product purchasers",
      icon: <BuyerIcon />,
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Transport Providers",
      path: "/admin/users/transport-providers",
      description: "Manage logistics companies and delivery services",
      icon: <TransportIcon />,
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "Warehouse Owners",
      path: "/admin/users/warehouse-owners",
      description: "Manage storage facilities and distribution centers",
      icon: <WarehouseIcon />,
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Waste Management Agents",
      path: "/admin/users/waste-management-agents",
      description: "Manage composting, recycling, and waste processing services",
      icon: <WasteManagementIcon />,
      color: "bg-orange-100 text-orange-800"
    },
    {
      name: "Moderators",
      path: "/admin/users/moderators",
      description: "Manage platform moderators and content reviewers",
      icon: <ModeratorIcon />,
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      name: "Admins",
      path: "/admin/users/admins",
      description: "Manage system administrators and advanced users",
      icon: <AdminIcon />,
      color: "bg-red-100 text-red-800"
    }
  ];

  return (
    <DashboardLayout
      title="User Management"
      breadcrumbs="User Management"
      userRole="admin"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCategories.map((category, index) => (
          <Link 
            key={index} 
            to={category.path}
            className="block bg-white border border-dashboard-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-4 ${category.color}`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-medium text-dashboard-text-primary">
                  {category.name}
                </h3>
              </div>
              <p className="text-dashboard-text-secondary">
                {category.description}
              </p>
              <div className="flex justify-end mt-4">
                <span className="inline-flex items-center text-sm font-medium text-farmio">
                  Manage
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default UserManagementHome;
