import React, { useState } from 'react';
import UserManagement from '../../../components/templates/UserManagement';

// Farmer icon
const FarmerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const FarmerManagement = () => {
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Sample data for farmer's listing history
  const farmerListingHistory = [
    { product: 'Organic Rice', date: '2025-06-15', quantity: '250 kg', price: 'LKR 45,000', status: 'Active' },
    { product: 'Fresh Vegetables Mix', date: '2025-06-10', quantity: '100 kg', price: 'LKR 18,000', status: 'Sold Out' },
    { product: 'Organic Onions', date: '2025-06-01', quantity: '75 kg', price: 'LKR 11,250', status: 'Active' },
    { product: 'Banana', date: '2025-05-25', quantity: '120 kg', price: 'LKR 18,000', status: 'Active' },
    { product: 'Fresh Coconut', date: '2025-05-20', quantity: '200 units', price: 'LKR 40,000', status: 'Sold Out' }
  ];
  
  // Sample data for farmer's activities
  const farmerActivities = [
    { type: 'listing', description: 'Added new listing for Organic Rice', date: '2025-06-15', time: '09:45 AM' },
    { type: 'price', description: 'Updated price for Fresh Vegetables Mix', date: '2025-06-12', time: '03:20 PM' },
    { type: 'order', description: 'Received order #ORD-2546 for Fresh Vegetables Mix', date: '2025-06-11', time: '10:15 AM' },
    { type: 'listing', description: 'Added new listing for Organic Onions', date: '2025-06-01', time: '02:30 PM' },
    { type: 'order', description: 'Completed delivery for order #ORD-2498', date: '2025-05-28', time: '04:45 PM' },
    { type: 'listing', description: 'Added new listing for Banana', date: '2025-05-25', time: '11:20 AM' }
  ];

  // Sample farmer data for demonstration
  const farmers = [
    {
      id: 1,
      name: "Sunil Rathnayake",
      email: "sunil.rathnayake@farm.lk",
      phone: "+94 77 234 5678",
      location: "Anuradhapura",
      farmSize: "15 acres",
      crops: "Rice, Vegetables",
      status: "Active",
      joinDate: "2023-01-15",
      lastActive: "2023-06-10"
    },
    {
      id: 2,
      name: "Priyanka Dissanayake",
      email: "priyanka@greenvalley.lk",
      phone: "+94 71 987 6543",
      location: "Nuwara Eliya",
      farmSize: "8 acres",
      crops: "Tea, Vegetables",
      status: "Active",
      joinDate: "2022-08-22",
      lastActive: "2023-06-08"
    },
    {
      id: 3,
      name: "Malith Fernando",
      email: "malith@fernandofarms.lk",
      phone: "+94 76 555 1234",
      location: "Polonnaruwa",
      farmSize: "20 acres",
      crops: "Rice, Maize",
      status: "Inactive",
      joinDate: "2022-03-10",
      lastActive: "2023-02-15"
    },
    {
      id: 4,
      name: "Kumari Rajapakse",
      email: "kumari@organicfarms.lk",
      phone: "+94 70 876 5432",
      location: "Kandy",
      farmSize: "5 acres",
      crops: "Organic Vegetables, Herbs",
      status: "Active",
      joinDate: "2023-04-02",
      lastActive: "2023-06-09"
     
    },
    {
      id: 5,
      name: "Asanka Weerasinghe",
      email: "asanka@familyfarm.lk",
      phone: "+94 75 345 6789",
      location: "Hambantota",
      farmSize: "12 acres",
      crops: "Rice, Beans, Coconut",
      status: "Active",
      joinDate: "2022-11-30",
      lastActive: "2023-06-07"
    }
  ];

  // Handle view farmer details
  const handleViewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setActiveTab('profile'); // Reset to profile tab when opening modal
    setShowViewModal(true);
  };

  // Handle delete farmer
  const handleDeleteFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowDeleteModal(true);
  };

  // Confirm delete farmer
  const confirmDeleteFarmer = () => {
    // Logic to delete farmer would go here
    console.log(`Deleting farmer: ${selectedFarmer.name}`);
    setShowDeleteModal(false);
    // In a real app, you would update the state or call an API
  };
  // Table columns
  const columns = [
    { accessor: 'name', header: 'Name' },
    { accessor: 'email', header: 'Email' },
    { accessor: 'phone', header: 'Phone' },
    { accessor: 'location', header: 'Location' },
   
    { accessor: 'crops', header: 'Crops' },
    { 
      accessor: 'status', 
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
          row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    
    { 
      accessor: 'actions',      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleViewFarmer(row);
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
              handleDeleteFarmer(row);
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
      name: 'location',
      label: 'Location',
      options: [
        { label: 'Anuradhapura', value: 'Anuradhapura' },
        { label: 'Nuwara Eliya', value: 'Nuwara Eliya' },
        { label: 'Polonnaruwa', value: 'Polonnaruwa' },
        { label: 'Kandy', value: 'Kandy' },
        { label: 'Hambantota', value: 'Hambantota' }
      ]
    }
  ];

  return (
    <>
      <UserManagement
        userType="Farmers"
        userTypePath="farmers"
        userIcon={<FarmerIcon />}
        columns={columns}
        userData={farmers}
        filters={filters}
        showAddButton={false}
      />

      {/* View Farmer Details Modal */}
      {showViewModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">Farmer Details: {selectedFarmer.name}</h3>
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
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile' 
                      ? 'border-farmio text-farmio' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`${
                    activeTab === 'history' 
                      ? 'border-farmio text-farmio' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Listing History & Activities
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1">{selectedFarmer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{selectedFarmer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{selectedFarmer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{selectedFarmer.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Farm Size</p>
                    <p className="mt-1">{selectedFarmer.farmSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Crops</p>
                    <p className="mt-1">{selectedFarmer.crops}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        selectedFarmer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedFarmer.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="mt-1">{selectedFarmer.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Active</p>
                    <p className="mt-1">{selectedFarmer.lastActive}</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h4 className="font-medium text-lg mb-4">Product Listings</h4>
                  <div className="overflow-x-auto max-h-64 shadow border-b border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {farmerListingHistory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{item.product}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{item.date}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{item.price}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Sold Out' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="font-medium text-lg mb-4 mt-8">Recent Activities</h4>
                  <div className="overflow-y-auto max-h-64 pr-2">
                    <div className="space-y-3">
                      {farmerActivities.map((activity, index) => (
                        <div key={index} className="flex items-start border-b border-gray-100 pb-2">
                          <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                            activity.type === 'listing' ? 'bg-green-500' : 
                            activity.type === 'order' ? 'bg-blue-500' : 
                            activity.type === 'price' ? 'bg-yellow-500' : 
                            'bg-gray-500'
                          }`}></div>
                          <div className="ml-3">
                            <p className="text-sm text-gray-700">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.date} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
      {showDeleteModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete farmer <span className="font-medium">{selectedFarmer.name}</span>? This action cannot be undone.
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
                onClick={confirmDeleteFarmer}
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

export default FarmerManagement;
