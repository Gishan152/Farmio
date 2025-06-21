import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Farmer icon
const FarmerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const FarmerManagement = () => {
  // Sample farmer data for demonstration
  const farmers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@farm.com",
      phone: "(555) 123-4567",
      location: "Riverside County",
      farmSize: "250 acres",
      crops: "Corn, Wheat",
      status: "Active",
      joinDate: "2023-01-15",
      lastActive: "2023-06-10"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      email: "maria.r@greenvalley.com",
      phone: "(555) 987-6543",
      location: "Central Valley",
      farmSize: "120 acres",
      crops: "Tomatoes, Lettuce",
      status: "Active",
      joinDate: "2022-08-22",
      lastActive: "2023-06-08"
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@johnsonacres.com",
      phone: "(555) 234-5678",
      location: "Eastern Plains",
      farmSize: "375 acres",
      crops: "Soybeans, Alfalfa",
      status: "Inactive",
      joinDate: "2022-03-10",
      lastActive: "2023-02-15"
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@organicfarms.net",
      phone: "(555) 876-5432",
      location: "Northern Hills",
      farmSize: "75 acres",
      crops: "Organic Vegetables, Herbs",
      status: "Active",
      joinDate: "2023-04-02",
      lastActive: "2023-06-09"
    },
    {
      id: 5,
      name: "Michael Chen",
      email: "mchen@familyfarm.org",
      phone: "(555) 345-6789",
      location: "Southern Coast",
      farmSize: "180 acres",
      crops: "Rice, Beans",
      status: "Active",
      joinDate: "2022-11-30",
      lastActive: "2023-06-07"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'location', header: 'Location' },
    { key: 'farmSize', header: 'Farm Size' },
    { key: 'crops', header: 'Crops' },
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
    { key: 'joinDate', header: 'Join Date' },
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
      name: 'location',
      label: 'Location',
      options: [
        { label: 'Riverside County', value: 'Riverside County' },
        { label: 'Central Valley', value: 'Central Valley' },
        { label: 'Eastern Plains', value: 'Eastern Plains' },
        { label: 'Northern Hills', value: 'Northern Hills' },
        { label: 'Southern Coast', value: 'Southern Coast' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Farmers"
      userTypePath="farmers"
      userIcon={<FarmerIcon />}
      columns={columns}
      userData={farmers}
      filters={filters}
    />
  );
};

export default FarmerManagement;
