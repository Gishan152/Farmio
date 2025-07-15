import { useState, useEffect } from 'react';
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

// Sri Lankan orders data
const orders = [
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

const OrdersPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique statuses
  const statuses = ['All', ...new Set(orders.map(order => order.status))];

  // Filter orders based on search query and status
  useEffect(() => {
    let result = orders;
    
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(lowerCaseQuery) || 
        order.customer.toLowerCase().includes(lowerCaseQuery) ||
        order.email.toLowerCase().includes(lowerCaseQuery) ||
        order.products.some(product => product.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    if (selectedStatus !== 'All') {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(result);
  }, [searchQuery, selectedStatus]);

  // Calculate order statistics
  const orderStats = {
    processing: orders.filter(order => order.status === 'Processing').length,
    shipped: orders.filter(order => order.status === 'Shipped').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    cancelled: orders.filter(order => order.status === 'Cancelled').length
  };

  // Order status badge component
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      'Processing': 'bg-pastel-blue text-blue-800',
      'Confirmed': 'bg-pastel-yellow text-yellow-800',
      'Shipped': 'bg-pastel-purple text-purple-800',
      'Delivered': 'bg-pastel-green text-green-800',
      'Cancelled': 'bg-pastel-red text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
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

  // Expanded row component
  const ExpandedRow = ({ order }) => (
    <div className="p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Customer Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {order.customer}</p>
            <p><span className="font-medium">Email:</span> {order.email}</p>
            <p><span className="font-medium">Order Date:</span> {order.orderDate}</p>
            <p><span className="font-medium">Expected Delivery:</span> {order.deliveryDate}</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Products</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {order.products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded hover:bg-blue-200">
          View Details
        </button>
        <button className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded hover:bg-yellow-200">
          Update Status
        </button>
        <button className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded hover:bg-green-200">
          Send Notification
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Order Management" 
      userRole="moderator"
      breadcrumbs="Orders / All Orders"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Processing"
          value={orderStats.processing.toString()}
          subtitle="Orders being processed"
          icon={<OrdersIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Shipped"
          value={orderStats.shipped.toString()}
          subtitle="Orders on the way"
          icon={<OrdersIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard 
          title="Delivered"
          value={orderStats.delivered.toString()}
          subtitle="Successfully delivered"
          icon={<OrdersIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Issues"
          value={orderStats.cancelled.toString()}
          subtitle="Cancelled orders"
          icon={<AlertIcon />}
          color="red"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content */}
      <Card 
        title="All Orders" 
        noPadding
        color="blue"
        icon={<OrdersIcon />}
      >
        {/* Search and Filter */}
        <div className="p-4 border-b border-dashboard-border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full pl-10 p-2.5"
                  placeholder="Search by order ID, customer name, or product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                className="bg-gray-50 border border-gray-300 text-dashboard-text-primary text-sm rounded-lg focus:ring-farmio focus:border-farmio block w-full p-2.5"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-farmio text-white text-sm font-medium rounded-lg hover:bg-farmio-dark focus:ring-2 focus:ring-farmio-light">
                Print Orders
              </button>
              <button className="px-4 py-2 bg-gray-100 text-dashboard-text-primary text-sm font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-200">
                Export Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="w-full">
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customer' },
              { header: 'Amount', accessor: 'amount' },
              { header: 'Order Date', accessor: 'orderDate' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => <OrderStatusBadge status={row.status} />
              },
              { 
                header: 'Payment', 
                accessor: 'paymentStatus',
                cell: (row) => <PaymentStatusBadge status={row.paymentStatus} />
              },
              {
                header: '',
                accessor: 'expand',
                cell: (row) => (
                  <button 
                    className="p-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedRowId(expandedRowId === row.id ? null : row.id);
                    }}
                  >
                    {expandedRowId === row.id ? 'Hide Details' : 'View Details'}
                  </button>
                )
              }
            ]}
            data={filteredOrders}
            expandedRowRender={(order) => <ExpandedRow order={order} />}
            expandedRowId={expandedRowId}
          />
        </div>
        
        {/* Pagination */}
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-dashboard-text-light">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-farmio text-white hover:bg-farmio-dark">
              1
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              2
            </button>
            <button className="px-3 py-1 rounded bg-gray-100 text-dashboard-text-secondary hover:bg-gray-200">
              Next
            </button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default OrdersPage;