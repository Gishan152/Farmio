import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Moderator icon
const ModeratorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ModeratorManagement = () => {
  // Sample moderator data for demonstration
  const moderators = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@farmio.com",
      phone: "(555) 123-7890",
      role: "Content Moderator",
      department: "User Support",
      permissions: "Content, Users",
      activityLevel: "High",
      status: "Active",
      joinDate: "2022-09-10",
      lastActive: "2023-06-10"
    },
    {
      id: 2,
      name: "Sophia Williams",
      email: "sophia.w@farmio.com",
      phone: "(555) 234-5678",
      role: "Product Moderator",
      department: "Quality Control",
      permissions: "Products, Reviews",
      activityLevel: "Medium",
      status: "Active",
      joinDate: "2022-11-22",
      lastActive: "2023-06-09"
    },
    {
      id: 3,
      name: "Miguel Rodriguez",
      email: "miguel.r@farmio.com",
      phone: "(555) 345-6789",
      role: "Support Moderator",
      department: "Customer Success",
      permissions: "Support Tickets, Chat",
      activityLevel: "Very High",
      status: "Active",
      joinDate: "2023-01-05",
      lastActive: "2023-06-10"
    },
    {
      id: 4,
      name: "Emma Chen",
      email: "emma.c@farmio.com",
      phone: "(555) 456-7890",
      role: "Community Moderator",
      department: "Community Management",
      permissions: "Forums, Comments",
      activityLevel: "Medium",
      status: "Inactive",
      joinDate: "2022-08-15",
      lastActive: "2023-05-01"
    },
    {
      id: 5,
      name: "Jamal Williams",
      email: "jamal.w@farmio.com",
      phone: "(555) 567-8901",
      role: "Lead Moderator",
      department: "Operations",
      permissions: "All Areas",
      activityLevel: "High",
      status: "Active",
      joinDate: "2022-06-20",
      lastActive: "2023-06-09"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'role', header: 'Role' },
    { key: 'department', header: 'Department' },
    { key: 'permissions', header: 'Permissions' },
    { key: 'activityLevel', header: 'Activity' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastActive', header: 'Last Active' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button className="text-red-600 hover:text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'role',
      label: 'Role',
      options: [
        { label: 'Content Moderator', value: 'Content Moderator' },
        { label: 'Product Moderator', value: 'Product Moderator' },
        { label: 'Support Moderator', value: 'Support Moderator' },
        { label: 'Community Moderator', value: 'Community Moderator' },
        { label: 'Lead Moderator', value: 'Lead Moderator' }
      ]
    },
    {
      name: 'department',
      label: 'Department',
      options: [
        { label: 'User Support', value: 'User Support' },
        { label: 'Quality Control', value: 'Quality Control' },
        { label: 'Customer Success', value: 'Customer Success' },
        { label: 'Community Management', value: 'Community Management' },
        { label: 'Operations', value: 'Operations' }
      ]
    },
    {
      name: 'activityLevel',
      label: 'Activity Level',
      options: [
        { label: 'Very High', value: 'Very High' },
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Moderators"
      userTypePath="moderators"
      userIcon={<ModeratorIcon />}
      columns={columns}
      userData={moderators}
      filters={filters}
    />
  );
};

export default ModeratorManagement;
