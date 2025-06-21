import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Warehouse icon
const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const WarehouseOwnerManagement = () => {
  // Sample warehouse owner data for demonstration
  const warehouseOwners = [
    {
      id: 1,
      name: "Central Storage Solutions",
      contactPerson: "Richard Davis",
      email: "admin@centralstorage.com",
      phone: "(555) 111-3333",
      location: "Industrial District",
      warehouseSize: "25,000 sq ft",
      specialFeatures: "Climate Controlled, Cold Storage",
      certification: "ISO 22000",
      capacityUsed: "75%",
      status: "Active",
      joinDate: "2022-08-12",
      lastUpdate: "2023-06-07"
    },
    {
      id: 2,
      name: "Valley Fresh Warehousing",
      contactPerson: "Alicia Torres",
      email: "operations@valleyfresh.com",
      phone: "(555) 222-4444",
      location: "Agricultural Zone",
      warehouseSize: "12,500 sq ft",
      specialFeatures: "Humidity Controlled",
      certification: "Organic Certified",
      capacityUsed: "60%",
      status: "Active",
      joinDate: "2023-02-15",
      lastUpdate: "2023-06-09"
    },
    {
      id: 3,
      name: "Riverside Cold Storage",
      contactPerson: "Peter Johnson",
      email: "peter@riversidecold.com",
      phone: "(555) 333-5555",
      location: "Riverside Area",
      warehouseSize: "18,000 sq ft",
      specialFeatures: "Freezers, Blast Chillers",
      certification: "HACCP",
      capacityUsed: "90%",
      status: "Active",
      joinDate: "2022-05-20",
      lastUpdate: "2023-06-10"
    },
    {
      id: 4,
      name: "Metro Distribution Hub",
      contactPerson: "Linda Garcia",
      email: "logistics@metrohub.com",
      phone: "(555) 444-6666",
      location: "Metro Center",
      warehouseSize: "30,000 sq ft",
      specialFeatures: "Loading Docks, Sorting Area",
      certification: "ISO 9001",
      capacityUsed: "65%",
      status: "Inactive",
      joinDate: "2022-11-08",
      lastUpdate: "2023-04-15"
    },
    {
      id: 5,
      name: "Eco-Store Cooperative",
      contactPerson: "Mark Thompson",
      email: "facilities@ecostorecoop.org",
      phone: "(555) 555-7777",
      location: "Green Business Park",
      warehouseSize: "8,000 sq ft",
      specialFeatures: "Solar Powered, Waste Reduction",
      certification: "Green Business Certified",
      capacityUsed: "40%",
      status: "Active",
      joinDate: "2023-03-01",
      lastUpdate: "2023-06-08"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Facility Name' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'location', header: 'Location' },
    { key: 'warehouseSize', header: 'Size' },
    { key: 'specialFeatures', header: 'Features' },
    { key: 'capacityUsed', header: 'Capacity Used' },
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
      name: 'certification',
      label: 'Certification',
      options: [
        { label: 'ISO 22000', value: 'ISO 22000' },
        { label: 'Organic Certified', value: 'Organic Certified' },
        { label: 'HACCP', value: 'HACCP' },
        { label: 'ISO 9001', value: 'ISO 9001' },
        { label: 'Green Business Certified', value: 'Green Business Certified' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Warehouse Owners"
      userTypePath="warehouse-owners"
      userIcon={<WarehouseIcon />}
      columns={columns}
      userData={warehouseOwners}
      filters={filters}
    />
  );
};

export default WarehouseOwnerManagement;
