import React, { useState } from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Transport Provider icon
const TransportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// Sample driver data
const driversData = {
  1: [
    {
      id: 101,
      name: "Rajitha Gunawardena",
      photo: "https://randomuser.me/api/portraits/men/51.jpg",
      phone: "+94 77 865 4321",
      email: "rajitha.g@lankaexpress.lk",
      licenseNumber: "DL23457896",
      licenseExpiry: "2027-04-15",
      experience: "8 years",
      address: "45 Temple Road, Colombo 06",
      joinDate: "2021-03-10",
      specializations: "Refrigerated Transport, Long-distance"
    },
    {
      id: 102,
      name: "Pradeep Fernando",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      phone: "+94 71 986 5432",
      email: "pradeep.f@lankaexpress.lk",
      licenseNumber: "DL87612345",
      licenseExpiry: "2026-08-22",
      experience: "5 years",
      address: "128 Galle Road, Colombo 04",
      joinDate: "2022-01-18",
      specializations: "Urban Delivery, Fresh Produce"
    }
  ],
  2: [
    {
      id: 201,
      name: "Nimal Jayasuriya",
      photo: "https://randomuser.me/api/portraits/men/62.jpg",
      phone: "+94 76 432 1876",
      email: "nimal@greenmile.lk",
      licenseNumber: "DL56781234",
      licenseExpiry: "2028-02-10",
      experience: "6 years",
      address: "75 Peradeniya Road, Kandy",
      joinDate: "2023-02-05",
      specializations: "Electric Vehicles, Highland Routes"
    }
  ],
  3: [
    {
      id: 301,
      name: "Chaminda Ratnayake",
      photo: "https://randomuser.me/api/portraits/men/28.jpg",
      phone: "+94 77 123 7654",
      email: "chaminda@ruralroutes.lk",
      licenseNumber: "DL12398745",
      licenseExpiry: "2026-11-30",
      experience: "12 years",
      address: "23 Main Street, Anuradhapura",
      joinDate: "2022-07-14",
      specializations: "Off-road, Agricultural Produce"
    }
  ],
  4: [
    {
      id: 401,
      name: "Lasith Perera",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      phone: "+94 70 432 9876",
      email: "lasith@swiftstream.lk",
      licenseNumber: "DL45671238",
      licenseExpiry: "2025-06-18",
      experience: "4 years",
      address: "90 Beach Road, Trincomalee",
      joinDate: "2022-09-20",
      specializations: "Coastal Routes, Express Delivery"
    }
  ],
  5: [
    {
      id: 501,
      name: "Ajith Silva",
      photo: "https://randomuser.me/api/portraits/men/36.jpg",
      phone: "+94 75 876 1234",
      email: "ajith@gallehaul.org",
      licenseNumber: "DL89761234",
      licenseExpiry: "2027-09-05",
      experience: "7 years",
      address: "56 Fort Street, Galle",
      joinDate: "2023-03-15",
      specializations: "Urban Delivery, Fresh Seafood"
    }
  ]
};

// Sample vehicle data
const vehiclesData = {
  1: [
    {
      id: "VEH-1001",
      type: "Refrigerated Truck",
      make: "Isuzu",
      model: "NPR-HD",
      year: 2023,
      plateNumber: "WP-CB-1234",
      capacity: "5 tonnes",
      refrigeration: "Yes",
      lastMaintenance: "2025-05-20",
      photos: [
        "https://i.ibb.co/3zKH7kh/Refrigerated-Truck.jpg",
        "https://i.ibb.co/hXLSmxp/Refrigerated-Truck-Interior.jpg"
      ]
    },
    {
      id: "VEH-1002",
      type: "Delivery Van",
      make: "Toyota",
      model: "HiAce",
      year: 2024,
      plateNumber: "WP-CAT-4567",
      capacity: "1.5 tonnes",
      refrigeration: "No",
      lastMaintenance: "2025-06-10",
      photos: [
        "https://i.ibb.co/vPB8XDk/Delivery-Van.jpg",
        "https://i.ibb.co/VTmNN5P/Delivery-Van-Interior.jpg"
      ]
    }
  ],
  2: [
    {
      id: "VEH-2001",
      type: "Electric Van",
      make: "Nissan",
      model: "e-NV200",
      year: 2025,
      plateNumber: "CP-ECO-7890",
      capacity: "700 kg",
      refrigeration: "No",
      lastMaintenance: "2025-06-05",
      photos: [
        "https://i.ibb.co/YPLmjvT/Electric-Van.jpg",
        "https://i.ibb.co/qNKxPc7/Electric-Van-Interior.jpg"
      ]
    }
  ],
  3: [
    {
      id: "VEH-3001",
      type: "All-Terrain Truck",
      make: "Mitsubishi",
      model: "Canter",
      year: 2023,
      plateNumber: "NC-KR-5678",
      capacity: "3 tonnes",
      refrigeration: "No",
      lastMaintenance: "2025-05-15",
      photos: [
        "https://i.ibb.co/CnG1cXc/All-Terrain-Truck.jpg",
        "https://i.ibb.co/hLz3S0h/All-Terrain-Truck-Interior.jpg"
      ]
    }
  ],
  4: [
    {
      id: "VEH-4001",
      type: "Medium Truck",
      make: "TATA",
      model: "LPT 1518",
      year: 2024,
      plateNumber: "EP-QS-9012",
      capacity: "8 tonnes",
      refrigeration: "Partial",
      lastMaintenance: "2025-04-30",
      photos: [
        "https://i.ibb.co/MVXvSRb/Medium-Truck.jpg",
        "https://i.ibb.co/6FsX7c3/Medium-Truck-Interior.jpg"
      ]
    }
  ],
  5: [
    {
      id: "VEH-5001",
      type: "Small Truck",
      make: "Mahindra",
      model: "Bolero Pickup",
      year: 2024,
      plateNumber: "SP-BZ-3456",
      capacity: "1.2 tonnes",
      refrigeration: "No",
      lastMaintenance: "2025-06-01",
      photos: [
        "https://i.ibb.co/HKxhQKC/Small-Truck.jpg",
        "https://i.ibb.co/NVTT7Bp/Small-Truck-Interior.jpg"
      ]
    }
  ]
};

// Sample delivery data
const deliveryData = {
  1: [
    { id: "DEL-10548", date: "2025-06-15", driver: "Rajitha Gunawardena", vehicle: "VEH-1001", route: "Colombo to Negombo", products: "Fresh Vegetables, Dairy", weight: "3.2 tonnes", status: "Completed" },
    { id: "DEL-10532", date: "2025-06-10", driver: "Pradeep Fernando", vehicle: "VEH-1002", route: "Colombo to Kandy", products: "Organic Rice, Spices", weight: "850 kg", status: "Completed" },
    { id: "DEL-10521", date: "2025-06-05", driver: "Rajitha Gunawardena", vehicle: "VEH-1001", route: "Colombo to Galle", products: "Seafood, Ice Cream", weight: "2.5 tonnes", status: "Completed" }
  ],
  2: [
    { id: "DEL-20145", date: "2025-06-18", driver: "Nimal Jayasuriya", vehicle: "VEH-2001", route: "Kandy to Nuwara Eliya", products: "Vegetables, Tea", weight: "550 kg", status: "In Progress" },
    { id: "DEL-20132", date: "2025-06-12", driver: "Nimal Jayasuriya", vehicle: "VEH-2001", route: "Kandy to Matale", products: "Fruits, Spices", weight: "480 kg", status: "Completed" }
  ],
  3: [
    { id: "DEL-30098", date: "2025-06-16", driver: "Chaminda Ratnayake", vehicle: "VEH-3001", route: "Anuradhapura to Polonnaruwa", products: "Rice, Vegetables", weight: "2.8 tonnes", status: "Completed" },
    { id: "DEL-30085", date: "2025-06-09", driver: "Chaminda Ratnayake", vehicle: "VEH-3001", route: "Anuradhapura to Dambulla", products: "Rice, Vegetables", weight: "2.4 tonnes", status: "Completed" }
  ],
  4: [
    { id: "DEL-40076", date: "2025-05-30", driver: "Lasith Perera", vehicle: "VEH-4001", route: "Trincomalee to Batticaloa", products: "Seafood, Rice", weight: "6.1 tonnes", status: "Completed" },
    { id: "DEL-40065", date: "2025-05-25", driver: "Lasith Perera", vehicle: "VEH-4001", route: "Trincomalee to Colombo", products: "Seafood, Dried Fish", weight: "5.4 tonnes", status: "Completed" }
  ],
  5: [
    { id: "DEL-50054", date: "2025-06-17", driver: "Ajith Silva", vehicle: "VEH-5001", route: "Galle to Matara", products: "Fresh Fish, Fruits", weight: "950 kg", status: "Completed" },
    { id: "DEL-50042", date: "2025-06-12", driver: "Ajith Silva", vehicle: "VEH-5001", route: "Galle to Colombo", products: "Seafood, Cinnamon", weight: "1.1 tonnes", status: "Completed" }
  ]
};

// Sample transport provider data for demonstration
const transportProviders = [
  {
    id: 1,
    name: "Lanka Express Logistics",
    contactPerson: "Kamal Perera",
    email: "dispatch@lankaexpress.lk",
    phone: "+94 77 123 4567",
    location: "Colombo Central Depot",
    fleetSize: "15 vehicles",
    vehicleTypes: "Refrigerated Trucks, Vans",
    serviceArea: "Western Province",
    certification: "HACCP Certified",
    status: "Active",
    joinDate: "2022-10-18",
    lastDelivery: "2023-06-09"
  },
  {
    id: 2,
    name: "Green Mile Lanka",
    contactPerson: "Lakshmi Jayawardena",
    email: "operations@greenmile.lk",
    phone: "+94 71 456 7890",
    location: "Kandy Hub",
    fleetSize: "8 vehicles",
    vehicleTypes: "Electric Vans, Small Trucks",
    serviceArea: "Central Province",
    certification: "Organic Certified",
    status: "Active",
    joinDate: "2023-01-05",
    lastDelivery: "2023-06-10"
  },
  {
    id: 3,
    name: "Rural Routes Sri Lanka",
    contactPerson: "Nuwan Bandara",
    email: "nuwan@ruralroutes.lk",
    phone: "+94 76 234 5678",
    location: "Anuradhapura Terminal",
    fleetSize: "12 vehicles",
    vehicleTypes: "All-Terrain Trucks",
    serviceArea: "North Central Province",
    certification: "Standard",
    status: "Active",
    joinDate: "2022-06-20",
    lastDelivery: "2023-06-07"
  },
  {
    id: 4,
    name: "Swift Stream Transport",
    contactPerson: "Amali Fernando",
    email: "dispatch@swiftstream.lk",
    phone: "+94 70 789 0123",
    location: "Trincomalee Port",
    fleetSize: "20 vehicles",
    vehicleTypes: "Mixed Fleet",
    serviceArea: "Eastern Province",
    certification: "HACCP, ISO 9001",
    status: "Inactive",
    joinDate: "2022-08-14",
    lastDelivery: "2023-04-22"
  },
  {
    id: 5,
    name: "Galle Haul Co-op",
    contactPerson: "Dinesh Gunasekara",
    email: "scheduling@gallehaul.org",
    phone: "+94 75 345 6789",
    location: "Galle City Center",
    fleetSize: "6 vehicles",
    vehicleTypes: "Small to Medium Trucks",
    serviceArea: "Southern Province",
    certification: "Community Certified",
    status: "Active",
    joinDate: "2023-03-10",
    lastDelivery: "2023-06-08"
  }
];


const TransportProviderManagement = () => {
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState('provider');

  // Handle view provider details
  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setActiveTab('provider'); // Reset to provider tab when opening modal
    setShowViewModal(true);
  };

  // Handle delete provider
  const handleDeleteProvider = (provider) => {
    setSelectedProvider(provider);
    setShowDeleteModal(true);
  };

  // Confirm delete provider
  const confirmDeleteProvider = () => {
    // Logic to delete provider would go here
    console.log(`Deleting transport provider: ${selectedProvider.name}`);
    setShowDeleteModal(false);
    // In a real app, you would update the state or call an API
  };

  // Table columns
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'email', header: 'Email' },
    { accessor: 'phone', header: 'Phone' },
    { accessor: 'serviceArea', header: 'Service Area' },
    { accessor: 'vehicleTypes', header: 'Vehicle Types' },
    {
      accessor: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      accessor: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProvider(row);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProvider(row);
            }}
          >
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
        { label: 'Western Province', value: 'Western Province' },
        { label: 'Central Province', value: 'Central Province' },
        { label: 'Southern Province', value: 'Southern Province' },
        { label: 'North Central Province', value: 'North Central Province' },
        { label: 'Eastern Province', value: 'Eastern Province' }
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

  // Custom actions for the UserManagement component
  const customActions = (
    <div className="flex items-center space-x-2">
      <button
        className="flex items-center text-sm py-1.5 px-2 rounded-md border border-dashboard-border hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="ml-1 hidden md:inline">Filter</span>
      </button>
    </div>
  );

  return (
    <>
      <UserManagement
        userType="Transport Providers"
        userTypePath="transport-providers"
        userIcon={<TransportIcon />}
        columns={columns}
        userData={transportProviders}
        filters={filters}
        actions={customActions}
        showAddButton={false}
      />

      {/* View Transport Provider Details Modal */}
      {showViewModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">Transport Provider: {selectedProvider.name}</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('provider')}
                  className={`${activeTab === 'provider'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } py-4 px-1 text-center border-b-2 font-medium text-sm flex-1`}
                >
                  Provider Details
                </button>
                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`${activeTab === 'drivers'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } py-4 px-1 text-center border-b-2 font-medium text-sm flex-1`}
                >
                  Driver Details
                </button>
                <button
                  onClick={() => setActiveTab('vehicles')}
                  className={`${activeTab === 'vehicles'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } py-4 px-1 text-center border-b-2 font-medium text-sm flex-1`}
                >
                  Vehicle Information
                </button>
                <button
                  onClick={() => setActiveTab('deliveries')}
                  className={`${activeTab === 'deliveries'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } py-4 px-1 text-center border-b-2 font-medium text-sm flex-1`}
                >
                  Delivery History
                </button>
              </nav>
            </div>

            {/* Tab Content - Scrollable container */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
              {/* Provider Details */}
              {activeTab === 'provider' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1">{selectedProvider.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Person</p>
                    <p className="mt-1">{selectedProvider.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{selectedProvider.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fleet Size</p>
                    <p className="mt-1">{selectedProvider.fleetSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle Types</p>
                    <p className="mt-1">{selectedProvider.vehicleTypes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service Area</p>
                    <p className="mt-1">{selectedProvider.serviceArea}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Certification</p>
                    <p className="mt-1">{selectedProvider.certification}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${selectedProvider.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedProvider.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="mt-1">{selectedProvider.joinDate}</p>
                  </div>
                </div>
              )}

              {/* Driver Details */}
              {activeTab === 'drivers' && (
                <div className="space-y-6">
                  {driversData[selectedProvider.id]?.map((driver) => (
                    <div key={driver.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h4 className="font-medium text-lg">{driver.name}</h4>
                        <span className="text-sm text-gray-500">ID: {driver.id}</span>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 mb-4 md:mb-0">
                            <div className="rounded-lg overflow-hidden max-w-[200px] mx-auto">
                              <img
                                src={driver.photo}
                                alt={`Driver ${driver.name}`}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                            <div className="mt-4 text-center md:text-left">
                              <h5 className="text-sm font-medium text-gray-500">Contact Information</h5>
                              <p className="mt-1">{driver.phone}</p>
                              <p className="mt-1">{driver.email}</p>
                              <p className="mt-1">{driver.address}</p>
                            </div>
                          </div>
                          <div className="md:w-2/3 md:pl-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">License Information</h5>
                                <p className="mt-1"><span className="font-medium">Number:</span> {driver.licenseNumber}</p>
                                <p className="mt-1"><span className="font-medium">Expiry:</span> {driver.licenseExpiry}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Experience</h5>
                                <p className="mt-1">{driver.experience}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Join Date</h5>
                                <p className="mt-1">{driver.joinDate}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Specializations</h5>
                                <p className="mt-1">{driver.specializations}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicle Information */}
              {activeTab === 'vehicles' && (
                <div className="space-y-6">
                  {vehiclesData[selectedProvider.id]?.map((vehicle) => (
                    <div key={vehicle.id} className="border rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <h4 className="font-medium text-lg">{vehicle.type} - {vehicle.id}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vehicle.refrigeration === 'Yes' ?
                            'bg-blue-100 text-blue-800' :
                            vehicle.refrigeration === 'Partial' ?
                              'bg-teal-100 text-teal-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {vehicle.refrigeration === 'Yes' ? 'Refrigerated' :
                            vehicle.refrigeration === 'Partial' ? 'Partially Refrigerated' :
                              'Non-Refrigerated'}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-2/5 mb-4 md:mb-0">
                            <div className="grid grid-cols-1 gap-2">
                              {vehicle.photos.map((photo, index) => (
                                <div key={index} className="rounded-lg overflow-hidden border">
                                  <img
                                    src={photo}
                                    alt={`${vehicle.type} ${index + 1}`}
                                    className="w-full h-auto object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="md:w-3/5 md:pl-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Make & Model</h5>
                                <p className="mt-1">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Plate Number</h5>
                                <p className="mt-1">{vehicle.plateNumber}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Capacity</h5>
                                <p className="mt-1">{vehicle.capacity}</p>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-500">Last Maintenance</h5>
                                <p className="mt-1">{vehicle.lastMaintenance}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery History */}
              {activeTab === 'deliveries' && (
                <div>
                  <h4 className="font-medium text-lg mb-4">Recent Deliveries</h4>
                  <div className="overflow-x-auto max-h-96 shadow border-b border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deliveryData[selectedProvider.id]?.map((delivery) => (
                          <tr key={delivery.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{delivery.id}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.date}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.driver}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.vehicle}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.route}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.products}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{delivery.weight}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${delivery.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : delivery.status === 'In Progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {delivery.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 text-right">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-farmio text-white rounded hover:bg-farmio-dark focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete transport provider <span className="font-medium">{selectedProvider.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProvider}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransportProviderManagement;