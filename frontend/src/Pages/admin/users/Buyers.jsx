import React, { useState, useEffect } from 'react';
import UserManagement from '../../../components/templates/UserManagement';
import { fetchUsersByRole, transformApiUsers, getSampleDataByRole, ROLES, deactivateUser } from '../../../Utils/roleUtils';

// Buyer icon
const BuyerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// Sample transaction data for buyers
const buyerTransactions = [
  { id: 'TRX-5821', date: '2025-06-20', farmer: 'Sunil Rathnayake', products: 'Organic Rice, Vegetables', amount: 'LKR 65,500', status: 'Complete' },
  { id: 'TRX-5743', date: '2025-06-15', farmer: 'Priyanka Dissanayake', products: 'Premium Tea, Organic Vegetables', amount: 'LKR 32,800', status: 'Complete' },
  { id: 'TRX-5689', date: '2025-06-08', farmer: 'Kumari Rajapakse', products: 'Fresh Herbs, Organic Vegetables', amount: 'LKR 18,500', status: 'Complete' },
  { id: 'TRX-5612', date: '2025-05-25', farmer: 'Asanka Weerasinghe', products: 'Rice, Coconut', amount: 'LKR 42,000', status: 'Complete' },
  { id: 'TRX-5598', date: '2025-05-18', farmer: 'Malith Fernando', products: 'Maize, Rice', amount: 'LKR 29,500', status: 'Complete' }
];

// Sample buyer activities
const buyerActivities = [
  { type: 'order', description: 'Placed bulk order for organic rice', date: '2025-06-20', time: '10:15 AM' },
  { type: 'payment', description: 'Payment completed for order #TRX-5821', date: '2025-06-20', time: '10:30 AM' },
  { type: 'delivery', description: 'Scheduled delivery for order #TRX-5821', date: '2025-06-22', time: '09:00 AM' },
  { type: 'order', description: 'Placed order for premium tea', date: '2025-06-15', time: '02:45 PM' },
  { type: 'payment', description: 'Payment completed for order #TRX-5743', date: '2025-06-15', time: '03:00 PM' },
  { type: 'delivery', description: 'Received delivery for order #TRX-5743', date: '2025-06-17', time: '11:30 AM' },
  { type: 'review', description: 'Left 5-star review for Kumari Rajapakse', date: '2025-06-10', time: '04:15 PM' }
];

// Sample buyer data for demonstration
const buyers = [
  {
    id: 1,
    name: "Colombo Fresh Foods Market",
    contactPerson: "Dilshan Silva",
    email: "orders@freshfoods.lk",
    phone: "+94 77 222 3333",
    location: "Colombo",
    type: "Retailer",
    purchaseVolume: "High",
    preferredProducts: "Organic Vegetables",
    status: "Active",
    joinDate: "2022-09-15",
    lastPurchase: "2023-06-05"
  },
  {
    id: 2,
    name: "Ceylon Table Restaurants",
    contactPerson: "Thilini Gunawardena",
    email: "purchasing@ceylontable.lk",
    phone: "+94 71 444 5555",
    location: "Negombo",
    type: "Restaurant Chain",
    purchaseVolume: "Medium",
    preferredProducts: "Premium Fruits, Herbs",
    status: "Active",
    joinDate: "2023-02-20",
    lastPurchase: "2023-06-08"
  },
  {
    id: 3,
    name: "Kandy Wholesome Foods Co-op",
    contactPerson: "Samanthi Perera",
    email: "sam@wholesomecoop.lk",
    phone: "+94 76 666 7777",
    location: "Kandy",
    type: "Cooperative",
    purchaseVolume: "Medium",
    preferredProducts: "Mixed Produce",
    status: "Active",
    joinDate: "2022-07-11",
    lastPurchase: "2023-06-02"
  },
  {
    id: 4,
    name: "Ella Green Smoothie Cafes",
    contactPerson: "Danushka Rajapakse",
    email: "supplies@greensmoothie.lk",
    phone: "+94 70 888 9999",
    location: "Ella",
    type: "Cafe Chain",
    purchaseVolume: "Low",
    preferredProducts: "Leafy Greens, Fruits",
    status: "Inactive",
    joinDate: "2022-11-05",
    lastPurchase: "2023-03-15"
  },
  {
    id: 5,
    name: "Galle Sunrise Grocery Store",
    contactPerson: "Jeevani Wickramasinghe",
    email: "jeevani@sunrisegrocery.lk",
    phone: "+94 75 111 2222",
    location: "Galle",
    type: "Grocery Store",
    purchaseVolume: "High",
    preferredProducts: "Full Range",
    status: "Active",
    joinDate: "2022-05-30",
    lastPurchase: "2023-06-09"
  }
];

const BuyerManagement = () => {
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for API data
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch buyers data from API
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const usersData = await fetchUsersByRole(ROLES.BUYER);
        const transformedBuyers = transformApiUsers(usersData);
        
        setBuyers(transformedBuyers);
      } catch (err) {
        console.error('Error fetching buyers:', err);
        setError(err.message);
        // Fallback to sample data on error
        setBuyers(getSampleDataByRole(ROLES.BUYER));
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  // Handle view buyer details
  const handleViewBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setActiveTab('profile'); // Reset to profile tab when opening modal
    setShowViewModal(true);
  };

  // Handle delete buyer
  const handleDeleteBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setShowDeleteModal(true);
  };

  // Confirm delete buyer
  const confirmDeleteBuyer = async () => {
    try {
      console.log(`Deactivating buyer: ${selectedBuyer.name} (ID: ${selectedBuyer.id})`);
      
      await deactivateUser(selectedBuyer.id);
      
      // Update the local state to reflect the change
      setBuyers(prevBuyers => 
        prevBuyers.map(buyer => 
          buyer.id === selectedBuyer.id 
            ? { ...buyer, status: 'REJECTED' }
            : buyer
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
              handleViewBuyer(row);
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
              handleDeleteBuyer(row);
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

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-farmio"></div>
      </div>
    );
  }

  if (error && buyers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load buyers data</h3>
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
      {error && buyers.length > 0 && (
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
        userType="Buyers"
        userTypePath="buyers"
        userIcon={<BuyerIcon />}
        columns={columns}
        userData={buyers}
        filters={filters}
        actions={customActions}
        showAddButton={false}
      />

      {/* View Buyer Details Modal */}
      {showViewModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">Buyer Details: {selectedBuyer.name}</h3>
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
                  className={`${activeTab === 'profile'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`${activeTab === 'transactions'
                      ? 'border-farmio text-farmio'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                >
                  Transactions & Activities
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-14rem)]">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1">{selectedBuyer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1">{selectedBuyer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1">{selectedBuyer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{selectedBuyer.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Products</p>
                    <p className="mt-1">{selectedBuyer.preferredProducts}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${selectedBuyer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedBuyer.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Join Date</p>
                    <p className="mt-1">{selectedBuyer.joinDate}</p>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <h4 className="font-medium text-lg mb-4">Transaction History</h4>
                  <div className="overflow-x-auto max-h-64 shadow border-b border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {buyerTransactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{transaction.id}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{transaction.date}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{transaction.farmer}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">{transaction.products}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{transaction.amount}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {transaction.status}
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
                      {buyerActivities.map((activity, index) => (
                        <div key={index} className="flex items-start border-b border-gray-100 pb-2">
                          <div className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${activity.type === 'order' ? 'bg-blue-500' :
                              activity.type === 'payment' ? 'bg-green-500' :
                                activity.type === 'delivery' ? 'bg-yellow-500' :
                                  activity.type === 'review' ? 'bg-purple-500' :
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
      {showDeleteModal && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete buyer <span className="font-medium">{selectedBuyer.name}</span>? This action cannot be undone.
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
                onClick={confirmDeleteBuyer}
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

export default BuyerManagement;