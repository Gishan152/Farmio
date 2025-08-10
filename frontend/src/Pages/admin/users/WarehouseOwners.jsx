import React, { useState, useEffect } from 'react';
import UserManagement from '../../../components/templates/UserManagement';
import { fetchUsersByRole, transformApiUsers, getSampleDataByRole, ROLES, deactivateUser } from '../../../Utils/roleUtils';

// Warehouse icon
const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

// Sample warehouse photos data
const warehousePhotos = {
  1: [
    "https://i.ibb.co/3BnCPb1/warehouse-exterior.jpg",
    "https://i.ibb.co/CPtm2X5/warehouse-interior.jpg",
    "https://i.ibb.co/wCYkFcM/cold-storage.jpg"
  ],
  2: [
    "https://i.ibb.co/MGcmDB6/dambulla-warehouse.jpg",
    "https://i.ibb.co/dJXPVTJ/humidity-control.jpg"
  ],
  3: [
    "https://i.ibb.co/Gd8bS7M/port-storage.jpg",
    "https://i.ibb.co/6YSG2bL/freezer-room.jpg",
    "https://i.ibb.co/RQjQT8g/blast-chiller.jpg"
  ],
  4: [
    "https://i.ibb.co/Qm6pY8w/distribution-center.jpg",
    "https://i.ibb.co/ww8k2fK/loading-dock.jpg"
  ],
  5: [
    "https://i.ibb.co/8zS287h/eco-warehouse.jpg",
    "https://i.ibb.co/BjcxDwf/solar-panels.jpg"
  ]
};

// Sample warehouse keepers data
const warehouseKeepers = {
  1: [
    { name: "Anura Perera", position: "Head Supervisor", experience: "10 years", phone: "+94 77 234 5678" },
    { name: "Chaminda Silva", position: "Inventory Manager", experience: "8 years", phone: "+94 71 345 6789" },
    { name: "Kushani Fernando", position: "Cold Storage Specialist", experience: "6 years", phone: "+94 76 456 7890" },
    { name: "Prasad Jayawardena", position: "Security Supervisor", experience: "12 years", phone: "+94 70 567 8901" }
  ],
  2: [
    { name: "Indika Gunaratne", position: "Facility Manager", experience: "7 years", phone: "+94 77 678 9012" },
    { name: "Samanthi Perera", position: "Agricultural Specialist", experience: "5 years", phone: "+94 71 789 0123" }
  ],
  3: [
    { name: "Ruwan Senanayake", position: "Cold Chain Manager", experience: "9 years", phone: "+94 76 890 1234" },
    { name: "Nilanthi Dissanayake", position: "Quality Control", experience: "8 years", phone: "+94 70 901 2345" },
    { name: "Jagath Bandara", position: "Shift Supervisor", experience: "6 years", phone: "+94 77 012 3456" }
  ],
  4: [
    { name: "Duminda Ratnayake", position: "Operations Director", experience: "15 years", phone: "+94 71 123 4567" },
    { name: "Surangi Jayasuriya", position: "Logistics Coordinator", experience: "7 years", phone: "+94 76 234 5678" },
    { name: "Lahiru Perera", position: "Dock Manager", experience: "5 years", phone: "+94 70 345 6789" },
    { name: "Thilini Weerasinghe", position: "Inventory Control", experience: "6 years", phone: "+94 77 456 7890" }
  ],
  5: [
    { name: "Upul Abeysekera", position: "Sustainability Manager", experience: "8 years", phone: "+94 71 567 8901" },
    { name: "Dilhani Jayamaha", position: "Inventory Specialist", experience: "4 years", phone: "+94 76 678 9012" }
  ]
};

// Sample warehouse facilities data
const warehouseFacilities = {
  1: [
    { type: "Cold Storage", capacity: "10,000 sq ft", temperature: "-5°C to +4°C", products: "Dairy, Meat, Fruits" },
    { type: "Climate Controlled", capacity: "12,000 sq ft", temperature: "15°C to 20°C", products: "Vegetables, Grains" },
    { type: "Loading Bay", capacity: "3,000 sq ft", features: "4 Docks, Automated Doors", vehicles: "Up to 6 trucks simultaneously" }
  ],
  2: [
    { type: "Humidity Controlled", capacity: "8,000 sq ft", humidity: "60-65%", products: "Fresh Produce, Spices" },
    { type: "Standard Storage", capacity: "4,500 sq ft", features: "Racking System", products: "Packaged Goods" }
  ],
  3: [
    { type: "Freezer Storage", capacity: "7,500 sq ft", temperature: "-20°C", products: "Seafood, Ice Cream" },
    { type: "Blast Chillers", capacity: "2,500 sq ft", features: "Rapid cooling", products: "Fresh Catch, Hot Prepared Foods" },
    { type: "Dry Storage", capacity: "8,000 sq ft", features: "Temperature Controlled", products: "Packaged Goods, Spices" }
  ],
  4: [
    { type: "Loading Docks", capacity: "5,000 sq ft", features: "8 Docks with Levelers", vehicles: "Up to 10 trucks simultaneously" },
    { type: "Sorting Area", capacity: "10,000 sq ft", features: "Automated Conveyor System", throughput: "5,000 packages per hour" },
    { type: "Standard Storage", capacity: "15,000 sq ft", features: "High Bay Racking", products: "Mixed Goods" }
  ],
  5: [
    { type: "Solar Powered Storage", capacity: "5,000 sq ft", features: "Off-Grid Capability", products: "Mixed Goods" },
    { type: "Waste Management", capacity: "3,000 sq ft", features: "Composting, Recycling", sustainability: "Zero-waste certified" }
  ]
};

const WarehouseOwnerManagement = () => {
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // State for API data
  const [warehouseOwners, setWarehouseOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch warehouse owners data from API
  useEffect(() => {
    const fetchWarehouseOwners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const usersData = await fetchUsersByRole(ROLES.WAREHOUSE);
        const transformedWarehouseOwners = transformApiUsers(usersData);
        
        setWarehouseOwners(transformedWarehouseOwners);
      } catch (err) {
        console.error('Error fetching warehouse owners:', err);
        setError(err.message);
        // Fallback to sample data on error
        setWarehouseOwners(getSampleDataByRole(ROLES.WAREHOUSE));
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouseOwners();
  }, []);

  // Handle view warehouse details
  const handleViewWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setActiveTab('details');
    setShowViewModal(true);
  };

  // Handle delete warehouse
  const handleDeleteWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDeleteModal(true);
  };

  // Confirm delete warehouse
  const confirmDeleteWarehouse = async () => {
    try {
      console.log(`Deactivating warehouse: ${selectedWarehouse.name} (ID: ${selectedWarehouse.id})`);
      
      await deactivateUser(selectedWarehouse.id);
      
      // Update the local state to reflect the change
      setWarehouseOwners(prevOwners => 
        prevOwners.map(owner => 
          owner.id === selectedWarehouse.id 
            ? { ...owner, status: 'REJECTED' }
            : owner
        )
      );
      
      setShowDeleteModal(false);
      console.log('User deactivated successfully');
      
      // Optionally show a success message
      alert('User deactivated successfully');
      
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      alert('Failed to deactivate user. Please try again.');
    }
  };

  // Table columns - updated to show API data
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'email', header: 'Email' },
    { accessor: 'phone', header: 'Phone' },
    { accessor: 'nic', header: 'NIC' },
    
    {
      accessor: 'status',
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
          row.status === 'APPROVED' || row.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'PENDING' 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
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
              handleViewWarehouse(row);
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
              handleDeleteWarehouse(row);
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

  // Filter options - updated for API data
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Rejected', value: 'REJECTED' }
      ]
    }
  ];

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-farmio"></div>
      </div>
    );
  }

  if (error && warehouseOwners.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load warehouse owners data</h3>
        <p className="text-gray-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-farmio text-white px-4 py-2 rounded hover:bg-farmio-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* API Status Notification */}
      {error && warehouseOwners.length > 0 && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                API connection failed. Showing sample data. Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <UserManagement
        userType="Warehouse Owners"
        userTypePath="warehouse-owners"
        userIcon={<WarehouseIcon />}
        columns={columns}
        userData={warehouseOwners}
        filters={filters}
        showAddButton={false}
      />

      {/* View Warehouse Details Modal */}
      {showViewModal && selectedWarehouse && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Warehouse Details: {selectedWarehouse.name}</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'photos'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Photos ({warehousePhotos[selectedWarehouse.id]?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'facilities'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Facilities ({warehouseFacilities[selectedWarehouse.id]?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('keepers')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'keepers'
                        ? 'border-b-2 border-farmio text-farmio-dark'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Keepers ({warehouseKeepers[selectedWarehouse.id]?.length || 0})
                  </button>
                </nav>
              </div>

              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Facility Name</p>
                      <p className="mt-1">{selectedWarehouse.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Person</p>
                      <p className="mt-1">{selectedWarehouse.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{selectedWarehouse.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{selectedWarehouse.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="mt-1">{selectedWarehouse.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Warehouse Size</p>
                      <p className="mt-1">{selectedWarehouse.warehouseSize}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Special Features</p>
                      <p className="mt-1">{selectedWarehouse.specialFeatures}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Certification</p>
                      <p className="mt-1">{selectedWarehouse.certification}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capacity Used</p>
                      <p className="mt-1">{selectedWarehouse.capacityUsed}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                          selectedWarehouse.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedWarehouse.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Join Date</p>
                      <p className="mt-1">{selectedWarehouse.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Update</p>
                      <p className="mt-1">{selectedWarehouse.lastUpdate}</p>
                    </div>
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Warehouse Photos</h4>
                    {warehousePhotos[selectedWarehouse.id]?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {warehousePhotos[selectedWarehouse.id]?.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                              <img src={photo} alt={`Warehouse Photo ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-tr-md rounded-bl-lg">
                              Photo {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No photos available for this warehouse.</p>
                    )}
                  </div>
                )}

                {/* Facilities Tab */}
                {activeTab === 'facilities' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Warehouse Facilities</h4>
                    {warehouseFacilities[selectedWarehouse.id]?.length > 0 ? (
                      <div className="space-y-4">
                        {warehouseFacilities[selectedWarehouse.id]?.map((facility, index) => (
                          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h5 className="text-md font-medium text-gray-800">{facility.type}</h5>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="text-sm font-medium text-gray-600">Capacity</p>
                                <p className="text-sm text-gray-700">{facility.capacity}</p>
                              </div>
                              {facility.temperature && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Temperature Range</p>
                                  <p className="text-sm text-gray-700">{facility.temperature}</p>
                                </div>
                              )}
                              {facility.humidity && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Humidity</p>
                                  <p className="text-sm text-gray-700">{facility.humidity}</p>
                                </div>
                              )}
                              {facility.features && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Features</p>
                                  <p className="text-sm text-gray-700">{facility.features}</p>
                                </div>
                              )}
                              {facility.vehicles && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Vehicle Capacity</p>
                                  <p className="text-sm text-gray-700">{facility.vehicles}</p>
                                </div>
                              )}
                              {facility.products && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Suitable Products</p>
                                  <p className="text-sm text-gray-700">{facility.products}</p>
                                </div>
                              )}
                              {facility.sustainability && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Sustainability</p>
                                  <p className="text-sm text-gray-700">{facility.sustainability}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No facility information available.</p>
                    )}
                  </div>
                )}

                {/* Keepers Tab */}
                {activeTab === 'keepers' && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Warehouse Keepers & Staff</h4>
                    {warehouseKeepers[selectedWarehouse.id]?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {warehouseKeepers[selectedWarehouse.id]?.map((keeper, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <h5 className="text-sm font-medium text-gray-800">{keeper.name}</h5>
                                <p className="text-xs text-green-600 font-medium">{keeper.position}</p>
                                <div className="mt-2 space-y-1">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Experience:</span> {keeper.experience}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Contact:</span> {keeper.phone}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No keeper information available.</p>
                    )}
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedWarehouse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete warehouse <span className="font-medium">{selectedWarehouse.name}</span>? This action cannot be undone.
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
                onClick={confirmDeleteWarehouse}
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

export default WarehouseOwnerManagement;