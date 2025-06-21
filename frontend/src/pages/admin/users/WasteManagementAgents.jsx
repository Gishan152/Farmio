import React from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Waste Management icon
const WasteManagementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const WasteManagementAgentManagement = () => {
  // Sample waste management agent data for demonstration
  const wasteManagementAgents = [
    {
      id: 1,
      name: "Green Recycling Solutions",
      contactPerson: "Michael Roberts",
      email: "operations@greenrecycle.com",
      phone: "(555) 222-5555",
      location: "Northern District",
      serviceTypes: "Composting, Recycling",
      capacity: "100 tons/day",
      certifications: "EPA Certified, Green Business",
      wasteTypes: "Organic, Packaging",
      status: "Active",
      joinDate: "2022-07-14",
      lastCollection: "2023-06-10"
    },
    {
      id: 2,
      name: "Circular Economy Inc.",
      contactPerson: "Sarah Wilson",
      email: "sarah@circulareconomy.com",
      phone: "(555) 333-6666",
      location: "East Region",
      serviceTypes: "Upcycling, Biogas Production",
      capacity: "75 tons/day",
      certifications: "ISO 14001",
      wasteTypes: "Mixed Agricultural",
      status: "Active",
      joinDate: "2023-01-20",
      lastCollection: "2023-06-08"
    },
    {
      id: 3,
      name: "Compost Creators Co-op",
      contactPerson: "James Peterson",
      email: "info@compostcreators.org",
      phone: "(555) 444-7777",
      location: "Southern Region",
      serviceTypes: "Specialized Composting",
      capacity: "30 tons/day",
      certifications: "Organic Certified",
      wasteTypes: "Plant Material Only",
      status: "Inactive",
      joinDate: "2022-09-15",
      lastCollection: "2023-05-01"
    },
    {
      id: 4,
      name: "AgriWaste Solutions",
      contactPerson: "Elena Martinez",
      email: "elena@agriwaste.com",
      phone: "(555) 555-8888",
      location: "Western Territory",
      serviceTypes: "Full Spectrum Processing",
      capacity: "120 tons/day",
      certifications: "ISO 14001, Carbon Trust",
      wasteTypes: "All Agricultural Waste",
      status: "Active",
      joinDate: "2022-04-12",
      lastCollection: "2023-06-09"
    },
    {
      id: 5,
      name: "BioEnergy Farms",
      contactPerson: "David Clark",
      email: "operations@bioenergy.com",
      phone: "(555) 666-9999",
      location: "Central Area",
      serviceTypes: "Biogas, Fertilizer Production",
      capacity: "85 tons/day",
      certifications: "Renewable Energy Certified",
      wasteTypes: "Organic, Animal Waste",
      status: "Active",
      joinDate: "2023-02-28",
      lastCollection: "2023-06-07"
    }
  ];

  // Table columns
  const columns = [
    { key: 'name', header: 'Company Name' },
    { key: 'contactPerson', header: 'Contact Person' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'location', header: 'Location' },
    { key: 'serviceTypes', header: 'Services' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'wasteTypes', header: 'Waste Types' },
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
    { key: 'lastCollection', header: 'Last Collection' },
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
      name: 'serviceTypes',
      label: 'Service Types',
      options: [
        { label: 'Composting', value: 'Composting, Recycling' },
        { label: 'Biogas Production', value: 'Upcycling, Biogas Production' },
        { label: 'Specialized Composting', value: 'Specialized Composting' },
        { label: 'Full Spectrum Processing', value: 'Full Spectrum Processing' },
        { label: 'Fertilizer Production', value: 'Biogas, Fertilizer Production' }
      ]
    },
    {
      name: 'wasteTypes',
      label: 'Waste Types',
      options: [
        { label: 'Organic, Packaging', value: 'Organic, Packaging' },
        { label: 'Mixed Agricultural', value: 'Mixed Agricultural' },
        { label: 'Plant Material Only', value: 'Plant Material Only' },
        { label: 'All Agricultural Waste', value: 'All Agricultural Waste' },
        { label: 'Organic, Animal Waste', value: 'Organic, Animal Waste' }
      ]
    }
  ];

  return (
    <UserManagement
      userType="Waste Management Agents"
      userTypePath="waste-management-agents"
      userIcon={<WasteManagementIcon />}
      columns={columns}
      userData={wasteManagementAgents}
      filters={filters}
    />
  );
};

export default WasteManagementAgentManagement;
