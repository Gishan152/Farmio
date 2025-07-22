import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

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

// Sample order data - only pending orders
const orders = [
  {
    id: 'ORD-10045',
    customer: 'Fresh Foods Market',
    buyer: 'Emily Clark',
    date: '2023-06-20',
    total: '$1,245.80',
    items: 8,
    status: 'Pending',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-25',
    transport: 'Fast Track Logistics',
    orderDetails: [
      { product: 'Organic Tomatoes', quantity: 50, unit: 'kg', price: '$4.50/kg', total: '$225.00' },
      { product: 'Fresh Lettuce', quantity: 40, unit: 'kg', price: '$3.20/kg', total: '$128.00' },
      { product: 'Carrots', quantity: 60, unit: 'kg', price: '$2.75/kg', total: '$165.00' },
      { product: 'Red Onions', quantity: 45, unit: 'kg', price: '$3.10/kg', total: '$139.50' },
      { product: 'Bell Peppers', quantity: 35, unit: 'kg', price: '$4.80/kg', total: '$168.00' },
      { product: 'Cucumbers', quantity: 55, unit: 'kg', price: '$2.90/kg', total: '$159.50' },
      { product: 'Potatoes', quantity: 80, unit: 'kg', price: '$1.95/kg', total: '$156.00' },
      { product: 'Green Beans', quantity: 30, unit: 'kg', price: '$3.50/kg', total: '$105.00' }
    ],
    priority: 'High',
    expectedProcessingDate: '2023-06-21'
  },
  {
    id: 'ORD-10046',
    customer: 'Green Market Co-op',
    buyer: 'Michael Johnson',
    date: '2023-06-20',
    total: '$876.40',
    items: 6,
    status: 'Pending',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-26',
    transport: 'Rural Routes Delivery',
    orderDetails: [
      { product: 'Organic Apples', quantity: 40, unit: 'kg', price: '$3.80/kg', total: '$152.00' },
      { product: 'Organic Bananas', quantity: 35, unit: 'kg', price: '$2.95/kg', total: '$103.25' },
      { product: 'Organic Oranges', quantity: 45, unit: 'kg', price: '$3.50/kg', total: '$157.50' },
      { product: 'Organic Grapes', quantity: 30, unit: 'kg', price: '$4.95/kg', total: '$148.50' },
      { product: 'Organic Berries', quantity: 25, unit: 'kg', price: '$7.80/kg', total: '$195.00' },
      { product: 'Organic Melons', quantity: 30, unit: 'kg', price: '$4.00/kg', total: '$120.00' }
    ],
    priority: 'Medium',
    expectedProcessingDate: '2023-06-22'
  },
  {
    id: 'ORD-10047',
    customer: 'Healthy Eats Cafe',
    buyer: 'Sarah Williams',
    date: '2023-06-21',
    total: '$436.25',
    items: 4,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    deliveryDate: '2023-06-25',
    transport: 'Swift Stream Logistics',
    orderDetails: [
      { product: 'Organic Spinach', quantity: 15, unit: 'kg', price: '$5.50/kg', total: '$82.50' },
      { product: 'Organic Kale', quantity: 12, unit: 'kg', price: '$6.25/kg', total: '$75.00' },
      { product: 'Organic Arugula', quantity: 10, unit: 'kg', price: '$7.80/kg', total: '$78.00' },
      { product: 'Organic Mixed Greens', quantity: 25, unit: 'kg', price: '$8.00/kg', total: '$200.00' }
    ],
    priority: 'Low',
    expectedProcessingDate: '2023-06-22'
  }
];


const PendingOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(orders);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!orders) return;

    let results = orders.filter(order => {
      return Object.keys(order).some(key =>
        order[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(results);
  }, [searchTerm, orders]);

  // Filter options
  const filters = [
    {
      name: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Unpaid', value: 'Unpaid' }
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
    },
    {
      name: 'priority',
      label: 'Priority',
      options: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
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
    if (!order.orderDetails || order.orderDetails.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No order details available for this order.
        </div>
      );
    }

    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Order Details - {order.id}</h4>
            <p className="text-xs text-gray-500">Customer: {order.customer} | Ordered: {order.date}</p>
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
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.orderDetails.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2 font-medium">{item.product}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.unit}</td>
                  <td className="px-4 py-2">{item.price}</td>
                  <td className="px-4 py-2 font-medium">{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-medium text-gray-700 bg-gray-100">
                <td colSpan="4" className="px-4 py-2 text-right">Total:</td>
                <td className="px-4 py-2">{order.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Order ID' },
    {
      key: 'customer',
      header: 'Customer',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-dashboard-text-light">{row.buyer}</div>
        </div>
      )
    },
    { key: 'date', header: 'Order Date' },
    {
      key: 'total',
      header: 'Total',
      render: (value) => <span className="font-medium">{value}</span>
    },
    { key: 'items', header: 'Items' },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => {
        const priorityStyles = {
          'High': 'bg-red-100 text-red-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-blue-100 text-blue-800',
        };

        return (
          <span className={`px-2 py-1 text-xs rounded-full ${priorityStyles[value] || 'bg-gray-200 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'paymentStatus', header: 'Payment' },
    { key: 'expectedProcessingDate', header: 'Process By' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedOrderId === row.id ? 'text-blue-800' : ''}`}
            title={expandedOrderId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedOrderId(expandedOrderId === row.id ? null : row.id);
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
          <button className="text-indigo-600 hover:text-indigo-800" title="Print Invoice">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
          title="High Priority"
          value={orders.filter(o => o.priority === 'High').length.toString()}
          subtitle="Need immediate attention"
          icon={<OrdersIcon />}
          color="red"
          isLoading={isLoading}
        />
        <StatCard
          title="Average Processing Time"
          value="1.2 days"
          subtitle="For this month"
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
        />
      </Card>
    </DashboardLayout>
  );
};

export default PendingOrders;
