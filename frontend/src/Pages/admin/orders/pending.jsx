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
const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// Filter options


const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
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
        
        // Filter only pending orders
        const pendingOrders = ordersData.filter(order => 
          order.status && order.status.toUpperCase() === 'PENDING'
        );
        
        setOrders(pendingOrders);
        setFilteredData(pendingOrders);
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
        order.transport,
        order.status,
        formatOrderStatus(order.status)
      ].filter(Boolean).join(' ').toLowerCase();

      return searchFields.includes(searchTerm.toLowerCase());
    });

    setFilteredData(results);
  }, [searchTerm, orders, cropLookupMap, userLookupMap]);

  // Filter options
const filters = [
  {
    name: 'transport',
    label: 'Transport Provider',
    options: [
      { label: 'Available', value: 'true' },
      { label: 'Not Available', value: 'false' }
    ]
  }
];  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!orders || Object.keys(selectedFilters).length === 0) {
      setFilteredData(orders);
      return;
    }

    let results = orders.filter(order => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return order[key] === value;
      });
    });

    setFilteredData(results);
  }, [selectedFilters, orders]);

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    return (
      <span className={`px-2 py-1 text-xs rounded-full bg-pastel-yellow text-yellow-800`}>
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
    const buyerName = getBuyerNameFromOrder(order.buyerId, userLookupMap);

    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Order Details - #{order.orderId}</h4>
            <p className="text-xs text-gray-500">Buyer: {buyerName || `Buyer #${order.buyerId}`} | Payment ID: {order.paymentId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs text-left text-gray-500 bg-gray-100">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Price/Unit</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {detailedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2 font-medium">{item.productName}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.unitMeasurement || 'units'}</td>
                  <td className="px-4 py-2">LKR {item.pricePerUnit ? item.pricePerUnit.toFixed(2) : '0.00'}</td>
                  <td className="px-4 py-2 font-medium">LKR {(item.quantity * (item.pricePerUnit || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-medium text-gray-700 bg-gray-100">
                <td colSpan="4" className="px-4 py-2 text-right">Total:</td>
                <td className="px-4 py-2">LKR {order.total ? order.total.toFixed(2) : '0.00'}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Additional Order Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ORDER INFO</h5>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Transport Available:</td>
                  <td className="py-1 font-medium">{order.transport ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Order Date:</td>
                  <td className="py-1 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Payment ID:</td>
                  <td className="py-1 font-medium">{order.paymentId}</td>
                </tr>
              </tbody>
            </table>
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
          <div>
            <div className="font-medium">{buyerName || `Buyer #${row.buyerId}`}</div>
            <div className="text-xs text-dashboard-text-light">ID: {row.buyerId}</div>
          </div>
        );
      }
    },
    { 
      accessor: 'productName', 
      header: 'Product(s)',
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
      accessor: 'createdAt', 
      header: 'Order Date',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    { 
      accessor: 'total', 
      header: 'Total',
      cell: (row) => (
        <span className="font-medium">
          LKR {row.total ? row.total.toFixed(2) : '0.00'}
        </span>
      )
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
      accessor: 'status', 
      header: 'Status',
      cell: (row) => <OrderStatusBadge status={row.status} />
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
          <button className="text-green-600 hover:text-green-800" title="Process Order">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Pending Orders"
      breadcrumbs="Orders / Pending Orders"
      userRole="admin"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Pending Orders"
          value={orders.length.toString()}
          subtitle="Awaiting processing"
          icon={<OrdersIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="With Transport"
          value={orders.filter(o => o.transport).length.toString()}
          subtitle="Transportation available"
          icon={<OrdersIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Average Value"
          value={`LKR ${orders.length > 0 ? (orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length).toFixed(0) : '0'}`}
          subtitle="Per order"
          icon={<OrdersIcon />}
          color="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search pending orders by ID, customer name..."
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

          {/* Process All Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Process Selected
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Pending Orders</h3>
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
        title="Pending Orders"
        color="yellow"
        icon={<OrdersIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No pending orders found matching your criteria."
          expandedRowRender={(row) => <OrderDetails order={row} />}
          expandedRowId={expandedOrderId}
          rowKey="orderId"
        />
      </Card>
    </DashboardLayout>
  );
};

export default PendingOrders;
