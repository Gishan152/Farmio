import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Transport Provider icon
const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const TransportProviderManagement = () => {
  // Sample transport provider data for demonstration
  const transportProviders = [
    {
      id: 1,
      name: "Fast Track Logistics",
      contactPerson: "Marcus Rivera",
      email: "dispatch@fasttrack.com",
      phone: "(555) 333-4444",
      location: "Central Depot",
      fleetSize: "15 vehicles",
      vehicleTypes: "Refrigerated Trucks, Vans",
      serviceArea: "State-wide",
      certification: "HACCP Certified",
      status: "Active",
      joinDate: "2022-10-18",
      lastDelivery: "2023-06-09"
    },
    {
      id: 2,
      name: "Green Mile Transports",
      contactPerson: "Jessica Martinez",
      email: "operations@greenmile.com",
      phone: "(555) 555-6666",
      location: "South Hub",
      fleetSize: "8 vehicles",
      vehicleTypes: "Electric Vans, Small Trucks",
      serviceArea: "Metropolitan Area",
      certification: "Organic Certified",
      status: "Active",
      joinDate: "2023-01-05",
      lastDelivery: "2023-06-10"
    },
    {
      id: 3,
      name: "Rural Routes Delivery",
      contactPerson: "Robert Wilson",
      email: "rob@ruralroutes.com",
      phone: "(555) 777-8888",
      location: "Eastern Terminal",
      fleetSize: "12 vehicles",
      vehicleTypes: "All-Terrain Trucks",
      serviceArea: "Rural Communities",
      certification: "Standard",
      status: "Active",
      joinDate: "2022-06-20",
      lastDelivery: "2023-06-07"
    },
    {
      id: 4,
      name: "Swift Stream Logistics",
      contactPerson: "Amanda Taylor",
      email: "dispatch@swiftstream.com",
      phone: "(555) 999-0000",
      location: "North Port",
      fleetSize: "20 vehicles",
      vehicleTypes: "Mixed Fleet",
      serviceArea: "National",
      certification: "HACCP, ISO 9001",
      status: "Inactive",
      joinDate: "2022-08-14",
      lastDelivery: "2023-04-22"
    },
    {
      id: 5,
      name: "Local Haul Co-op",
      contactPerson: "David Chang",
      email: "scheduling@localhaul.org",
      phone: "(555) 123-7890",
      location: "City Center",
      fleetSize: "6 vehicles",
      vehicleTypes: "Small to Medium Trucks",
      serviceArea: "Local (25 mile radius)",
      certification: "Community Certified",
      status: "Active",
      joinDate: "2023-03-10",
      lastDelivery: "2023-06-08"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Company Name' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'fleetSize', header: 'Fleet Size' },
    { key: 'serviceArea', header: 'Service Area' },
    { key: 'certification', header: 'Certification' },
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
    { key: 'lastDelivery', header: 'Last Delivery' },
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
      name: 'serviceArea',
      label: 'Service Area',
      options: [
        { label: 'State-wide', value: 'State-wide' },
        { label: 'Metropolitan Area', value: 'Metropolitan Area' },
        { label: 'Rural Communities', value: 'Rural Communities' },
        { label: 'National', value: 'National' },
        { label: 'Local (25 mile radius)', value: 'Local (25 mile radius)' }
      ]
    },
    {
      name: 'certification',
      label: 'Certification',
      options: [
        { label: 'HACCP Certified', value: 'HACCP Certified' },
        { label: 'Organic Certified', value: 'Organic Certified' },
        { label: 'Standard', value: 'Standard' },
        { label: 'HACCP, ISO 9001', value: 'HACCP, ISO 9001' },
        { label: 'Community Certified', value: 'Community Certified' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Transport Providers"
      userTypePath="transport-providers"
      userIcon={<TransportIcon />}
      columns={columns}
      userData={transportProviders}
      filters={filters}
    />
  );
};

export default TransportProviderManagement;
