import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { 
  fetchAllOrders, 
  getOrderCount, 
  getOrderCountByStatus, 
  getOrdersByStatus,
  formatOrderStatus, 
  getStatusColor 
} from '../../../Utils/orderUtils';
import {
  fetchAllCrops,
  createCropLookupMap,
  getProductNamesFromOrder,
  getProductDetailsFromOrder,
  getFarmNameFromOrder,
  getFarmerDetailsFromOrder,
  getDetailedCropInfoFromOrder
} from '../../../Utils/cropUtils';
import {
  fetchAllUsers,
  createUserLookupMap,
  getBuyerInfo
} from '../../../Utils/userUtils';

// Icons
const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Fallback data for when API fails
const fallbackOrders = [
  { 
    id: 'ORD-2025-001', 
    customer: 'Kumara Perera',
    email: 'kumara.perera@email.com',
    products: ['Ceylon Black Tea', 'Free-Range Eggs', 'Gotukola Leaves'],
    amount: 'Rs. 3,250',
    orderDate: '2025-06-19 09:30 AM',
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-22'
  },
  { 
    id: 'ORD-2025-002', 
    customer: 'Amali Fernando',
    email: 'amali.f@email.com',
    products: ['Free-Range Eggs', 'Kithul Treacle', 'Ceylon Cinnamon'],
    amount: 'Rs. 2,470',
    orderDate: '2025-06-20 11:45 AM',
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-23'
  },
  {
    id: 'ORD-2025-003',
    customer: 'Dinesh Jayawardena',
    email: 'dinesh.j@email.com',
    products: ['Red Rice', 'Coconut Oil', 'Buffalo Curd'],
    amount: 'Rs. 1,850',
    orderDate: '2025-06-18 10:15 AM',
    status: 'Shipped',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-21'
  },
  {
    id: 'ORD-2025-004',
    customer: 'Nimal Gunaratne',
    email: 'nimal.g@email.com',
    products: ['King Coconuts', 'Green Chillies', 'Jak Fruit Curry'],
    amount: 'Rs. 1,250',
    orderDate: '2025-06-20 09:00 AM',
    status: 'Processing',
    paymentStatus: 'Pending',
    deliveryDate: '2025-06-23'
  },
  { 
    id: 'ORD-2025-005', 
    customer: 'Pradeep Silva',
    email: 'pradeep.s@email.com',
    products: ['Fresh Prawns', 'Cashew Nuts', 'Coconut Oil'],
    amount: 'Rs. 4,950',
    orderDate: '2025-06-20 02:15 PM',
    status: 'Confirmed',
    paymentStatus: 'Pending',
    deliveryDate: '2025-06-24'
  },
  { 
    id: 'ORD-2025-006', 
    customer: 'Chaminda Bandara',
    email: 'chaminda.b@email.com',
    products: ['Jackfruit', 'Bee Honey'],
    amount: 'Rs. 1,650',
    orderDate: '2025-06-20 04:20 PM',
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-23'
  },
  { 
    id: 'ORD-2025-007', 
    customer: 'Lakshmi Gooneratne',
    email: 'lakshmi.g@email.com',
    products: ['Gotukola Leaves', 'Buffalo Curd', 'Free-Range Eggs'],
    amount: 'Rs. 1,120',
    orderDate: '2025-06-21 09:10 AM',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-24'
  },
  { 
    id: 'ORD-2025-008', 
    customer: 'Tharaka Dissanayake',
    email: 'tharaka.d@email.com',
    products: ['Bee Honey', 'King Coconuts'],
    amount: 'Rs. 1,800',
    orderDate: '2025-06-21 10:40 AM',
    status: 'Shipped',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-22'
  },
  { 
    id: 'ORD-2025-009', 
    customer: 'Malini Seneviratne',
    email: 'malini.s@email.com',
    products: ['Green Chillies', 'Red Rice', 'Free-Range Eggs'],
    amount: 'Rs. 1,550',
    orderDate: '2025-06-19 03:30 PM',
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: '2025-06-21'
  },
  { 
    id: 'ORD-2025-010', 
    customer: 'Sanjaya Wickramasinghe',
    email: 'sanjaya.w@email.com',
    products: ['Buffalo Curd', 'Kithul Treacle'],
    amount: 'Rs. 1,100',
    orderDate: '2025-06-18 11:15 AM',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    deliveryDate: 'N/A'
  },
];

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [crops, setCrops] = useState([]);
  const [cropLookupMap, setCropLookupMap] = useState({});
  const [users, setUsers] = useState([]);
  const [userLookupMap, setUserLookupMap] = useState({});

  // Load orders and crops from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load orders, crops, and users in parallel
        const [ordersData, cropsData, usersData] = await Promise.all([
          fetchAllOrders(),
          fetchAllCrops(),
          fetchAllUsers()
        ]);
        
        setOrders(ordersData);
        setFilteredData(ordersData);
        setCrops(cropsData);
        setUsers(usersData);
        
        // Create lookup maps for quick access
        const cropLookupMap = createCropLookupMap(cropsData);
        const userLookupMap = createUserLookupMap(usersData);
        setCropLookupMap(cropLookupMap);
        setUserLookupMap(userLookupMap);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again.');
        setOrders([]);
        setFilteredData([]);
        setCrops([]);
        setUsers([]);
        setCropLookupMap({});
        setUserLookupMap({});
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search
  useEffect(() => {
    if (orders && orders.length > 0) {
      let results = orders.filter(order => {
        const searchableFields = [
          order.orderId?.toString() || '',
          order.paymentId || '',
          order.status || '',
          order.total?.toString() || '',
          order.farmerId?.toString() || '',
          order.buyerId?.toString() || ''
        ];
        
        return searchableFields.some(field => 
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  
      // Apply tab filtering
      if (selectedTab !== 'all') {
        // Map frontend tab names to backend enum values
        const statusMapping = {
          'pending': 'PENDING',
          'processing': 'PROCESSING',
          'shipped': 'IN_TRANSPORT',
          'delivered': 'DELIVERED',
          'cancelled': 'CANCELLED'
        };
        const backendStatus = statusMapping[selectedTab];
        if (backendStatus) {
          results = results.filter(order => order.status === backendStatus);
        }
      }
      
      setFilteredData(results);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, selectedTab, orders]);

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      shipped: orders.filter(o => o.status === 'IN_TRANSPORT').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
      cancelled: orders.filter(o => o.status === 'CANCELLED').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' }
      ]
    },
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Unpaid', value: 'Unpaid' },
        { label: 'Refunded', value: 'Refunded' }
      ]
    },
    {
      name: 'transport',
      label: 'Transport Provider',
      options: [
        { label: 'Fast Track Logistics', value: 'Fast Track Logistics' },
        { label: 'Green Mile Transports', value: 'Green Mile Transports' },
        { label: 'Rural Routes Delivery', value: 'Rural Routes Delivery' },
        { label: 'Swift Stream Logistics', value: 'Swift Stream Logistics' },
        { label: 'Local Haul Co-op', value: 'Local Haul Co-op' }
      ]
    }
  ];

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!orders || Object.keys(selectedFilters).length === 0) {
      let filtered = orders;
      if (selectedTab !== 'all') {
        filtered = orders?.filter(order => order.status.toLowerCase() === selectedTab);
      }
      setFilteredData(filtered);
      return;
    }
    
    let results = orders.filter(order => {
      const statusFilter = selectedTab === 'all' || order.status.toLowerCase() === selectedTab;
      
      const otherFilters = Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return order[key] === value;
      });
      
      return statusFilter && otherFilters;
    });
    
    setFilteredData(results);
  }, [selectedFilters, selectedTab, orders]);

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      'DELIVERED': 'bg-pastel-green text-green-800',
      'PROCESSING': 'bg-pastel-blue text-blue-800',
      'IN_TRANSPORT': 'bg-purple-100 text-purple-800',
      'AWAITING_PICKUP': 'bg-indigo-100 text-indigo-800',
      'PENDING': 'bg-pastel-yellow text-yellow-800',
      'CANCELLED': 'bg-pastel-red text-red-800',
    };
    
    const displayStatus = formatOrderStatus(status);
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }) => {
    const statusStyles = {
      'Paid': 'bg-pastel-green text-green-800',
      'Pending': 'bg-pastel-yellow text-yellow-800',
      'Failed': 'bg-pastel-red text-red-800',
      'Refunded': 'bg-pastel-gray text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };


  // Order Details Component
  const OrderDetails = ({ order }) => {
    if (!order.items || order.items.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No order items available for this order.
        </div>
      );
    }

    // Get detailed crop information for all order items
    const detailedItems = getDetailedCropInfoFromOrder(order.items, crops);

    return (
      <div className="p-6 bg-gray-50 max-h-96 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-gray-700">Order Details - #{order.orderId}</h4>
            <p className="text-sm text-gray-500">Payment ID: {order.paymentId} | Buyer ID: {order.buyerId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status:</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Items with Detailed Information */}
        <div className="space-y-4">
          {detailedItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTggMTdIMTJNOCAxM0gxNk04IDlIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">{item.productName}</h5>
                      <p className="text-sm text-gray-600">{item.farm}</p>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        LKR {(item.quantity * item.pricePerUnit).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} {item.unitMeasurement} × LKR {item.pricePerUnit?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Farm Information Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Farmer ID:</span>
                      <p className="font-medium">{item.cropInfo?.farmerId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating:</span>
                      <p className="font-medium flex items-center">
                        {item.rating ? (
                          <>
                            <span className="text-yellow-500 mr-1">★</span>
                            {item.rating}/5
                          </>
                        ) : 'Not rated'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Verified:</span>
                      <p className={`font-medium ${item.verified ? 'text-green-600' : 'text-red-600'}`}>
                        {item.verified ? '✓ Verified' : '✗ Not verified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Transport:</span>
                      <p className={`font-medium ${item.transportationAvailable ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.transportationAvailable ? 'Available' : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500">Returns:</span>
                      <span className={`ml-1 text-xs font-medium ${item.returnsAccepted ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.returnsAccepted ? 'Accepted' : 'Not accepted'}
                      </span>
                    </div>
                    
                    {/* Badges */}
                    {item.badges && item.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.badges.map((badge, badgeIdx) => (
                          <span key={badgeIdx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h5 className="text-lg font-semibold text-gray-700">Order Summary</h5>
              <p className="text-sm text-gray-500">Transport: {order.transport || 'Not specified'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                LKR {order.total ? order.total.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <DashboardLayout
      title="Orders Management"
      breadcrumbs="Orders / All Orders"
      userRole="moderator"
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Orders</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="New Orders"
          value={orders.filter(o => o.status === 'PENDING').length.toString()}
          subtitle="Awaiting processing"
          icon={<OrdersIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Processing"
          value={orders.filter(o => o.status === 'PROCESSING').length.toString()}
          subtitle="Being prepared"
          icon={<OrdersIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Out for Delivery"
          value={orders.filter(o => o.status === 'IN_TRANSPORT').length.toString()}
          subtitle="On the way"
          icon={<OrdersIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard 
          title="Delivered"
          value={orders.filter(o => o.status === 'DELIVERED').length.toString()}
          subtitle="This week"
          icon={<OrdersIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-dashboard-border mb-6">
        <button 
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'all' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          All Orders ({statusCounts.all})
        </button>
        <button 
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'pending' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Pending ({statusCounts.pending})
        </button>
        <button 
          onClick={() => setSelectedTab('processing')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'processing' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Processing ({statusCounts.processing})
        </button>
        <button 
          onClick={() => setSelectedTab('shipped')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'shipped' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Shipped ({statusCounts.shipped})
        </button>
        <button 
          onClick={() => setSelectedTab('delivered')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'delivered' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Delivered ({statusCounts.delivered})
        </button>
        <button 
          onClick={() => setSelectedTab('cancelled')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            selectedTab === 'cancelled' 
              ? 'border-farmio text-farmio' 
              : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
          }`}
        >
          Cancelled ({statusCounts.cancelled})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or status..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-dashboard-border focus:outline-none focus:ring-2 focus:ring-farmio focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          {/* Filter Button */}
          <button
            className="flex items-center text-sm py-2 px-4 rounded-md border border-dashboard-border hover:bg-gray-100"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="ml-2">Filter</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filters.map((filter, index) => (
                <div key={index} className="space-y-1">
                  <label className="block text-xs font-medium text-dashboard-text-secondary">{filter.label}</label>
                  <select
                    className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                    value={selectedFilters[filter.name] || 'all'}
                    onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                  >
                    <option value="all">All</option>
                    {filter.options.map((option, idx) => (
                      <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                className="px-3 py-1 text-sm text-gray-600 border border-dashboard-border rounded-md hover:bg-gray-100"
                onClick={() => setSelectedFilters({})}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <Card
        title={`${selectedTab === 'all' ? 'All Orders' : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) + ' Orders'}`}
        color={
          selectedTab === 'pending' ? 'yellow' : 
          selectedTab === 'processing' ? 'blue' : 
          selectedTab === 'shipped' ? 'purple' : 
          selectedTab === 'delivered' ? 'green' : 
          selectedTab === 'cancelled' ? 'red' : 'blue'
        }
        icon={<OrdersIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={[
            { accessor: 'orderId', header: 'Order ID' },
            { 
              accessor: 'productName', 
              header: 'Product(s)',
              cell: (row) => (
                <div className="max-w-xs">
                  <span className="text-sm font-medium text-gray-900">
                    {getProductNamesFromOrder(row.items, cropLookupMap)}
                  </span>
                </div>
              )
            },
            { 
              accessor: 'farm', 
              header: 'Farmer',
              cell: (row) => (
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {getFarmNameFromOrder(row.items, cropLookupMap)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {row.farmerId || 'N/A'}
                  </div>
                </div>
              )
            },
            { 
              accessor: 'buyerId', 
              header: 'Buyer',
              cell: (row) => {
                const buyerInfo = getBuyerInfo(row.buyerId, userLookupMap);
                return (
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {buyerInfo.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {buyerInfo.email}
                    </div>
                  </div>
                );
              }
            },
            { 
              accessor: 'total', 
              header: 'Total',
              cell: (row) => <span className="font-medium">LKR {row.total ? row.total.toFixed(2) : '0.00'}</span>
            },
            { 
              accessor: 'items', 
              header: 'Items',
              cell: (row) => row.items ? row.items.length : 0
            },
            { 
              accessor: 'status', 
              header: 'Status',
              cell: (row) => <OrderStatusBadge status={row.status} />
            },
            { 
              accessor: 'transport', 
              header: 'Transport',
              cell: (row) => row.transport || 'N/A'
            },
            { 
              accessor: 'actions', 
              header: 'Actions',
              cell: (row) => (
                <div className="flex space-x-2">
                  <button
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="View Details"
                    onClick={e => { e.stopPropagation(); handleViewOrder(row); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              )
            }
          ]}
          data={filteredData}
          onRowClick={(row) => console.log('View order details:', row)}
          emptyMessage="No orders found matching your criteria."
          expandedRowRender={(row) => <OrderDetails order={row} />}
          expandedRowId={expandedOrderId}
        />
      </Card>
      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <OrderDetails order={selectedOrder} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrdersManagement;