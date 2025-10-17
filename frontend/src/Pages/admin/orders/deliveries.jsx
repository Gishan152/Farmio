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
  getDetailedCropInfoFromOrder
} from '../../../Utils/cropUtils';
import {
  fetchAllUsers,
  createUserLookupMap,
  getBuyerNameFromOrder
} from '../../../Utils/userUtils';

// Icons
const DeliveryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const Deliveries = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [error, setError] = useState(null);
  const [crops, setCrops] = useState([]);
  const [cropLookupMap, setCropLookupMap] = useState({});
  const [users, setUsers] = useState([]);
  const [userLookupMap, setUserLookupMap] = useState({});

  // Load orders, crops, and users from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load all data in parallel
        const [ordersData, cropsData, usersData] = await Promise.all([
          fetchAllOrders(),
          fetchAllCrops(),
          fetchAllUsers()
        ]);
        
        // Filter delivery-related orders (IN_TRANSPORT, DELIVERED, AWAITING_PICKUP)
        const deliveryOrders = ordersData.filter(order => 
          order.status && ['IN_TRANSPORT', 'DELIVERED', 'AWAITING_PICKUP'].includes(order.status.toUpperCase())
        );
        
        setOrders(deliveryOrders);
        setFilteredData(deliveryOrders);
        setCrops(cropsData);
        setUsers(usersData);
        
        // Create lookup maps for quick access
        const cropLookup = createCropLookupMap(cropsData);
        const userLookup = createUserLookupMap(usersData);
        setCropLookupMap(cropLookup);
        setUserLookupMap(userLookup);
        
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
    if (!orders || orders.length === 0) return;

    let results = orders.filter(order => {
      // Get product names for search
      const productNames = getProductNamesFromOrder(order.items || [], cropLookupMap);
      const buyerName = getBuyerNameFromOrder(order.buyerId, userLookupMap);
      
      // Search in various fields
      const searchFields = [
        order.orderId,
        order.buyerId,
        buyerName,
        productNames,
        order.transport ? 'available' : 'not available',
        order.status,
        formatOrderStatus(order.status)
      ].filter(Boolean).join(' ').toLowerCase();

      return searchFields.includes(searchTerm.toLowerCase());
    });

    // Apply tab filtering based on order status
    if (selectedTab !== 'all') {
      const statusMapping = {
        'in-transit': 'IN_TRANSPORT',
        'delivered': 'DELIVERED',
        'awaiting-pickup': 'AWAITING_PICKUP'
      };
      
      const targetStatus = statusMapping[selectedTab];
      if (targetStatus) {
        results = results.filter(order => 
          order.status && order.status.toUpperCase() === targetStatus
        );
      }
    }

    setFilteredData(results);
  }, [searchTerm, selectedTab, orders, cropLookupMap, userLookupMap]);

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      'in-transit': orders.filter(o => o.status && o.status.toUpperCase() === 'IN_TRANSPORT').length,
      'awaiting-pickup': orders.filter(o => o.status && o.status.toUpperCase() === 'AWAITING_PICKUP').length,
      delivered: orders.filter(o => o.status && o.status.toUpperCase() === 'DELIVERED').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

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
        const statusMapping = {
          'in-transit': 'IN_TRANSPORT',
          'delivered': 'DELIVERED',
          'awaiting-pickup': 'AWAITING_PICKUP'
        };
        
        const targetStatus = statusMapping[selectedTab];
        if (targetStatus) {
          filtered = orders?.filter(order => 
            order.status && order.status.toUpperCase() === targetStatus
          );
        }
      }
      setFilteredData(filtered);
      return;
    }

    let results = orders.filter(order => {
      const statusFilter = selectedTab === 'all' || (() => {
        const statusMapping = {
          'in-transit': 'IN_TRANSPORT',
          'delivered': 'DELIVERED',
          'awaiting-pickup': 'AWAITING_PICKUP'
        };
        const targetStatus = statusMapping[selectedTab];
        return targetStatus && order.status && order.status.toUpperCase() === targetStatus;
      })();

      const otherFilters = Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        // Handle transport filter
        if (key === 'transport') {
          return value === 'true' ? order.transport : !order.transport;
        }
        
        return order[key] === value;
      });

      return statusFilter && otherFilters;
    });

    setFilteredData(results);
  }, [selectedFilters, selectedTab, orders]);

  // Order status badge (adapted for delivery statuses)
  const DeliveryStatusBadge = ({ status }) => {
    const statusStyles = {
      'DELIVERED': 'bg-pastel-green text-green-800',
      'IN_TRANSPORT': 'bg-pastel-blue text-blue-800',
      'AWAITING_PICKUP': 'bg-purple-100 text-purple-800',
    };

    const displayStatus = {
      'DELIVERED': 'Delivered',
      'IN_TRANSPORT': 'In Transit',
      'AWAITING_PICKUP': 'Awaiting Pickup'
    };

    const normalizedStatus = status?.toUpperCase();
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[normalizedStatus] || 'bg-gray-200 text-gray-800'}`}>
        {displayStatus[normalizedStatus] || status}
      </span>
    );
  };

  // Order Details Component (adapted for deliveries)
  const DeliveryDetails = ({ order }) => {
    if (!order.items || order.items.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No order items available for this delivery.
        </div>
      );
    }

    // Get detailed crop information and buyer info
    const detailedItems = getDetailedCropInfoFromOrder(order.items, crops);
    const buyerName = getBuyerNameFromOrder(order.buyerId, userLookupMap);

    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Delivery Details - #{order.orderId}</h4>
            <p className="text-xs text-gray-500">Buyer: {buyerName || `Buyer #${order.buyerId}`} | Payment: {order.paymentId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <DeliveryStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">DELIVERY INFO</h5>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Transport:</td>
                  <td className="py-1 font-medium">{order.transport ? 'Available' : 'Not Available'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Order Date:</td>
                  <td className="py-1 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Total Value:</td>
                  <td className="py-1 font-medium">LKR {order.total ? order.total.toFixed(2) : '0.00'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Payment ID:</td>
                  <td className="py-1 font-medium">{order.paymentId}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ORDER ITEMS</h5>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-xs text-left text-gray-500 bg-gray-100">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {detailedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="px-4 py-2 font-medium">{item.productName}</td>
                    <td className="px-4 py-2">{item.quantity} {item.unitMeasurement || 'units'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
              <p className="text-xs text-gray-500">Buyer Information:</p>
              <p className="text-sm font-medium">{buyerName || `Buyer #${order.buyerId}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { accessor: 'orderId', header: 'Order ID' },
    { 
      accessor: 'buyerName', 
      header: 'Buyer',
      cell: (row) => {
        const buyerName = getBuyerNameFromOrder(row.buyerId, userLookupMap);
        return (
          <div className="font-medium">
            {buyerName || `Buyer #${row.buyerId}`}
          </div>
        );
      }
    },
    { 
      accessor: 'productName', 
      header: 'Products',
      cell: (row) => {
        const productNames = getProductNamesFromOrder(row.items || [], cropLookupMap);
        return (
          <div className="max-w-xs">
            <div className="font-medium truncate" title={productNames}>
              {productNames || 'No products'}
            </div>
            <div className="text-xs text-dashboard-text-light">
              {row.items ? row.items.length : 0} item(s)
            </div>
          </div>
        );
      }
    },
    { 
      accessor: 'transport', 
      header: 'Transport',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.transport ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.transport ? 'Available' : 'Not Available'}
        </span>
      )
    },
    { 
      accessor: 'createdAt', 
      header: 'Order Date',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    { 
      accessor: 'total', 
      header: 'Total Value',
      cell: (row) => (
        <span className="font-medium">
          LKR {row.total ? row.total.toFixed(2) : '0.00'}
        </span>
      )
    },
    { 
      accessor: 'status', 
      header: 'Status',
      cell: (row) => <DeliveryStatusBadge status={row.status} />
    },
    { 
      accessor: 'actions', 
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedOrderId === row.orderId ? 'text-blue-800' : ''}`}
            title={expandedOrderId === row.orderId ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedOrderId(expandedOrderId === row.orderId ? null : row.orderId);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Deliveries Management"
      breadcrumbs="Orders / Deliveries"
      userRole="admin"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Deliveries"
          value={statusCounts.all.toString()}
          subtitle="All delivery orders"
          icon={<TruckIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="In Transit"
          value={statusCounts['in-transit'].toString()}
          subtitle="Currently shipping"
          icon={<DeliveryIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Awaiting Pickup"
          value={statusCounts['awaiting-pickup'].toString()}
          subtitle="Ready for pickup"
          icon={<DeliveryIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          title="Delivered"
          value={statusCounts.delivered.toString()}
          subtitle="Completed"
          icon={<DeliveryIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-dashboard-border mb-6">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'all'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          All Deliveries ({statusCounts.all})
        </button>
        <button
          onClick={() => setSelectedTab('in-transit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'in-transit'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          In Transit ({statusCounts['in-transit']})
        </button>
        <button
          onClick={() => setSelectedTab('awaiting-pickup')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'awaiting-pickup'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          Awaiting Pickup ({statusCounts['awaiting-pickup']})
        </button>
        <button
          onClick={() => setSelectedTab('delivered')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'delivered'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          Delivered ({statusCounts.delivered})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search deliveries by ID, customer, driver..."
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
            <FilterIcon />
            <span className="ml-2">Filter</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Deliveries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-dashboard-text-secondary">Transport Availability</label>
                <select
                  className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                  value={selectedFilters.transport || 'all'}
                  onChange={(e) => handleFilterChange('transport', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
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

      {/* Deliveries Table */}
      <Card
        title={`${selectedTab === 'all' ? 'All Deliveries' :
          selectedTab === 'in-transit' ? 'In Transit Orders' :
            selectedTab === 'awaiting-pickup' ? 'Awaiting Pickup Orders' :
              selectedTab === 'delivered' ? 'Delivered Orders' : 'Delivery Orders'}`}
        color={
          selectedTab === 'in-transit' ? 'blue' :
            selectedTab === 'awaiting-pickup' ? 'purple' :
              selectedTab === 'delivered' ? 'green' : 'blue'
        }
        icon={<TruckIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No delivery orders found matching your criteria."
          expandedRowRender={(row) => <DeliveryDetails order={row} />}
          expandedRowId={expandedOrderId}
          rowKey="orderId"
        />
      </Card>
    </DashboardLayout>
  );
};

export default Deliveries;
