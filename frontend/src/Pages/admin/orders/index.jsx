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

const DeliveryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);


// Move orders array outside the component to avoid new reference on every render
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
    ]
  },
  {
    id: 'ORD-10044',
    customer: 'Farm to Table Restaurants',
    buyer: 'Thomas Wright',
    date: '2023-06-20',
    total: '$876.25',
    items: 12,
    status: 'Processing',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-24',
    transport: 'Green Mile Transports',
    orderDetails: [
      { product: 'Organic Apples', quantity: 35, unit: 'kg', price: '$3.75/kg', total: '$131.25' },
      { product: 'Free-Range Eggs', quantity: 40, unit: 'dozen', price: '$4.50/dozen', total: '$180.00' },
      { product: 'Honey', quantity: 15, unit: 'liter', price: '$12.00/liter', total: '$180.00' },
      { product: 'Fresh Basil', quantity: 10, unit: 'kg', price: '$8.50/kg', total: '$85.00' },
      { product: 'Cherry Tomatoes', quantity: 20, unit: 'kg', price: '$5.20/kg', total: '$104.00' },
      { product: 'Zucchini', quantity: 25, unit: 'kg', price: '$3.10/kg', total: '$77.50' },
      { product: 'Sweet Corn', quantity: 30, unit: 'dozen', price: '$3.95/dozen', total: '$118.50' }
    ]
  },
  {
    id: 'ORD-10043',
    customer: 'Wholesome Foods Co-op',
    buyer: 'Samantha Green',
    date: '2023-06-19',
    total: '$412.60',
    items: 5,
    status: 'Shipped',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-22',
    transport: 'Rural Routes Delivery',
    orderDetails: [
      { product: 'Strawberries', quantity: 20, unit: 'kg', price: '$6.80/kg', total: '$136.00' },
      { product: 'Blueberries', quantity: 15, unit: 'kg', price: '$8.50/kg', total: '$127.50' },
      { product: 'Blackberries', quantity: 10, unit: 'kg', price: '$7.90/kg', total: '$79.00' },
      { product: 'Raspberries', quantity: 8, unit: 'kg', price: '$8.75/kg', total: '$70.00' }
    ]
  },
  {
    id: 'ORD-10042',
    customer: 'Green Smoothie Cafes',
    buyer: 'Daniel Brown',
    date: '2023-06-19',
    total: '$198.75',
    items: 3,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-21',
    transport: 'Fast Track Logistics',
    orderDetails: [
      { product: 'Organic Spinach', quantity: 25, unit: 'kg', price: '$4.25/kg', total: '$106.25' },
      { product: 'Kale', quantity: 15, unit: 'kg', price: '$3.50/kg', total: '$52.50' },
      { product: 'Fresh Mint', quantity: 10, unit: 'kg', price: '$4.00/kg', total: '$40.00' }
    ]
  },
  {
    id: 'ORD-10041',
    customer: 'Sunrise Grocery Store',
    buyer: 'Jennifer Lee',
    date: '2023-06-18',
    total: '$1,567.90',
    items: 15,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-20',
    transport: 'Swift Stream Logistics',
    orderDetails: [
      { product: 'Organic Potatoes', quantity: 100, unit: 'kg', price: '$2.10/kg', total: '$210.00' },
      { product: 'Onions', quantity: 80, unit: 'kg', price: '$1.75/kg', total: '$140.00' },
      { product: 'Garlic', quantity: 30, unit: 'kg', price: '$5.50/kg', total: '$165.00' },
      { product: 'Sweet Potatoes', quantity: 70, unit: 'kg', price: '$2.80/kg', total: '$196.00' },
      { product: 'Broccoli', quantity: 50, unit: 'kg', price: '$3.40/kg', total: '$170.00' },
      { product: 'Cauliflower', quantity: 40, unit: 'kg', price: '$3.60/kg', total: '$144.00' },
      { product: 'Cabbage', quantity: 60, unit: 'kg', price: '$2.20/kg', total: '$132.00' },
      { product: 'Eggplant', quantity: 35, unit: 'kg', price: '$3.30/kg', total: '$115.50' },
      { product: 'Squash', quantity: 45, unit: 'kg', price: '$2.90/kg', total: '$130.50' },
      { product: 'Mushrooms', quantity: 25, unit: 'kg', price: '$6.60/kg', total: '$165.00' }
    ]
  },
  {
    id: 'ORD-10040',
    customer: 'Fresh Foods Market',
    buyer: 'Emily Clark',
    date: '2023-06-17',
    total: '$920.45',
    items: 7,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    deliveryDate: 'N/A',
    transport: 'N/A',
    orderDetails: [
      { product: 'Organic Apples', quantity: 60, unit: 'kg', price: '$3.75/kg', total: '$225.00' },
      { product: 'Organic Pears', quantity: 45, unit: 'kg', price: '$4.10/kg', total: '$184.50' },
      { product: 'Organic Bananas', quantity: 55, unit: 'kg', price: '$2.95/kg', total: '$162.25' },
      { product: 'Organic Oranges', quantity: 50, unit: 'kg', price: '$3.50/kg', total: '$175.00' },
      { product: 'Organic Grapes', quantity: 35, unit: 'kg', price: '$4.95/kg', total: '$173.25' }
    ]
  },
  {
    id: 'ORD-10039',
    customer: 'Farm to Table Restaurants',
    buyer: 'Thomas Wright',
    date: '2023-06-17',
    total: '$634.15',
    items: 9,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-19',
    transport: 'Local Haul Co-op',
    orderDetails: [
      { product: 'Fresh Rosemary', quantity: 8, unit: 'kg', price: '$9.50/kg', total: '$76.00' },
      { product: 'Fresh Thyme', quantity: 7, unit: 'kg', price: '$8.75/kg', total: '$61.25' },
      { product: 'Fresh Sage', quantity: 5, unit: 'kg', price: '$9.20/kg', total: '$46.00' },
      { product: 'Fresh Oregano', quantity: 6, unit: 'kg', price: '$8.90/kg', total: '$53.40' },
      { product: 'Fresh Parsley', quantity: 10, unit: 'kg', price: '$7.50/kg', total: '$75.00' },
      { product: 'Fresh Cilantro', quantity: 9, unit: 'kg', price: '$7.80/kg', total: '$70.20' },
      { product: 'Fresh Chives', quantity: 7, unit: 'kg', price: '$8.60/kg', total: '$60.20' },
      { product: 'Fresh Mint', quantity: 12, unit: 'kg', price: '$8.10/kg', total: '$97.20' },
      { product: 'Fresh Dill', quantity: 10, unit: 'kg', price: '$9.50/kg', total: '$95.00' }
    ]
  },
  {
    id: 'ORD-10038',
    customer: 'Wholesome Foods Co-op',
    buyer: 'Samantha Green',
    date: '2023-06-16',
    total: '$362.30',
    items: 4,
    status: 'Delivered',
    paymentStatus: 'Paid',
    deliveryDate: '2023-06-18',
    transport: 'Rural Routes Delivery',
    orderDetails: [
      { product: 'Local Honey', quantity: 15, unit: 'liter', price: '$12.50/liter', total: '$187.50' },
      { product: 'Maple Syrup', quantity: 10, unit: 'liter', price: '$14.80/liter', total: '$148.00' },
      { product: 'Beeswax', quantity: 5, unit: 'kg', price: '$5.40/kg', total: '$27.00' }
    ]
  }
];

const OrdersManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
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
    if (orders) {
      let results = orders.filter(order => {
        return Object.keys(order).some(key => 
          order[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  
      // Apply tab filtering
      if (selectedTab !== 'all') {
        results = results.filter(order => order.status.toLowerCase() === selectedTab);
      }
      
      setFilteredData(results);
    }
  }, [searchTerm, selectedTab, orders]);

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === 'Pending').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      shipped: orders.filter(o => o.status === 'Shipped').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length
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

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      'Delivered': 'bg-pastel-green text-green-800',
      'Processing': 'bg-pastel-blue text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-pastel-yellow text-yellow-800',
      'Cancelled': 'bg-pastel-red text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
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

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };
  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };
  // Handle delete order
  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  // Table columns
  const columns = [
    { accessor: 'id', header: 'Order ID' },
    { 
      accessor: 'customer', 
      header: 'Customer',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.customer}</div>
          <div className="text-xs text-dashboard-text-light">{row.buyer}</div>
        </div>
      )
    },
    { accessor: 'date', header: 'Order Date' },
    { 
      accessor: 'total', 
      header: 'Total',
      cell: (row) => <span className="font-medium">{row.total}</span>
    },
    { accessor: 'items', header: 'Items' },
    { 
      accessor: 'status', 
      header: 'Status',
      cell: (row) => <OrderStatusBadge status={row.status} />
    },
    { accessor: 'paymentStatus', header: 'Payment' },
    { accessor: 'deliveryDate', header: 'Delivery Date' },
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
          <button
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Edit Order"
            onClick={e => { e.stopPropagation(); handleEditOrder(row); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Order"
            onClick={e => { e.stopPropagation(); handleDeleteOrder(row); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Orders Management"
      breadcrumbs="Orders / All Orders"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="New Orders"
          value={orders.filter(o => o.status === 'Pending').length.toString()}
          subtitle="Awaiting processing"
          icon={<OrdersIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Processing"
          value={orders.filter(o => o.status === 'Processing').length.toString()}
          subtitle="Being prepared"
          icon={<OrdersIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Out for Delivery"
          value={orders.filter(o => o.status === 'Shipped').length.toString()}
          subtitle="On the way"
          icon={<DeliveryIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard 
          title="Delivered"
          value={orders.filter(o => o.status === 'Delivered').length.toString()}
          subtitle="This week"
          icon={<CheckIcon />}
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
            <FilterIcon />
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
          columns={columns}
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
      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Order</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {/* You can add an edit form here if needed */}
              <OrderDetails order={selectedOrder} />
              <div className="mt-4 flex justify-end">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Order Modal */}
      {showDeleteModal && selectedOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-red-600">Delete Order</h3>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="mb-6 text-gray-700">Are you sure you want to delete order <span className="font-semibold">{selectedOrder.id}</span>? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => { setShowDeleteModal(false); /* Add delete logic here */ }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrdersManagement;