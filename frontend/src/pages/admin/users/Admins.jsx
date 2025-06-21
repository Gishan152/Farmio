import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Admin icon
const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AdminManagement = () => {
  // Sample admin data for demonstration
  const admins = [
    {
      id: 1,
      name: "Thomas Anderson",
      email: "t.anderson@farmio.com",
      phone: "(555) 111-2222",
      role: "System Administrator",
      department: "IT & Security",
      accessLevel: "Full Access",
      twoFactorEnabled: "Yes",
      lastPasswordChange: "2023-05-10",
      status: "Active",
      joinDate: "2022-05-15",
      lastActive: "2023-06-10"
    },
    {
      id: 2,
      name: "Diana Prince",
      email: "d.prince@farmio.com",
      phone: "(555) 222-3333",
      role: "Operations Admin",
      department: "Operations",
      accessLevel: "High",
      twoFactorEnabled: "Yes",
      lastPasswordChange: "2023-04-22",
      status: "Active",
      joinDate: "2022-06-20",
      lastActive: "2023-06-09"
    },
    {
      id: 3,
      name: "Bruce Wayne",
      email: "b.wayne@farmio.com",
      phone: "(555) 333-4444",
      role: "Executive Admin",
      department: "Executive",
      accessLevel: "Full Access",
      twoFactorEnabled: "Yes",
      lastPasswordChange: "2023-03-15",
      status: "Active",
      joinDate: "2022-04-10",
      lastActive: "2023-06-10"
    },
    {
      id: 4,
      name: "Natasha Romanoff",
      email: "n.romanoff@farmio.com",
      phone: "(555) 444-5555",
      role: "Security Admin",
      department: "IT & Security",
      accessLevel: "High",
      twoFactorEnabled: "Yes",
      lastPasswordChange: "2023-05-05",
      status: "Inactive",
      joinDate: "2022-07-18",
      lastActive: "2023-05-01"
    },
    {
      id: 5,
      name: "Tony Stark",
      email: "t.stark@farmio.com",
      phone: "(555) 555-6666",
      role: "Technology Admin",
      department: "IT & Development",
      accessLevel: "Full Access",
      twoFactorEnabled: "Yes",
      lastPasswordChange: "2023-06-01",
      status: "Active",
      joinDate: "2022-03-12",
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
    { key: 'accessLevel', header: 'Access Level' },
    { key: 'twoFactorEnabled', header: '2FA' },
    { key: 'lastPasswordChange', header: 'Password Changed' },
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
        { label: 'System Administrator', value: 'System Administrator' },
        { label: 'Operations Admin', value: 'Operations Admin' },
        { label: 'Executive Admin', value: 'Executive Admin' },
        { label: 'Security Admin', value: 'Security Admin' },
        { label: 'Technology Admin', value: 'Technology Admin' }
      ]
    },
    {
      name: 'department',
      label: 'Department',
      options: [
        { label: 'IT & Security', value: 'IT & Security' },
        { label: 'Operations', value: 'Operations' },
        { label: 'Executive', value: 'Executive' },
        { label: 'IT & Development', value: 'IT & Development' }
      ]
    },
    {
      name: 'accessLevel',
      label: 'Access Level',
      options: [
        { label: 'Full Access', value: 'Full Access' },
        { label: 'High', value: 'High' },
        { label: 'Standard', value: 'Standard' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Admins"
      userTypePath="admins"
      userIcon={<AdminIcon />}
      columns={columns}
      userData={admins}
      filters={filters}
    />
  );
};

export default AdminManagement;
