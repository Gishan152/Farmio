import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatCard from '../../components/ui/StatCard';

// Icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ProductsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const RevenueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

// Dummy data
const recentOrders = [
  { id: '0123', customer: 'Manju Perera', product: 'Organic Tomatoes', amount: 'LKR 4,998', status: 'Delivered', date: '2025-06-18' },
  { id: '0124', customer: 'Iresha Gunasekara', product: 'Fresh Farm Milk', amount: 'LKR 7,100', status: 'Processing', date: '2025-06-19' },
  { id: '0125', customer: 'Sunil Karunaratne', product: 'Mixed Vegetables', amount: 'LKR 9,550', status: 'Shipped', date: '2025-06-20' },
  { id: '0126', customer: 'Shamila Jayasinghe', product: 'Organic Eggs', amount: 'LKR 3,650', status: 'Processing', date: '2025-06-21' },
];

const topProducts = [
  { name: 'Organic Tomatoes', sales: 1245, revenue: 'LKR 1,245,000', trend: 'up' },
  { name: 'Fresh Farm Milk', sales: 986, revenue: 'LKR 986,000', trend: 'up' },
  { name: 'Organic Eggs', sales: 879, revenue: 'LKR 527,400', trend: 'down' },
  { name: 'Mixed Vegetables', sales: 734, revenue: 'LKR 734,000', trend: 'up' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Action buttons for the dashboard header
  const dashboardActions = (
    <>
      {/* "Add New Product" button removed as requested */}
    </>
  );

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      'Delivered': 'bg-pastel-green text-green-800',
      'Processing': 'bg-pastel-blue text-blue-800',
      'Shipped': 'bg-pastel-yellow text-yellow-800',
      'Cancelled': 'bg-pastel-red text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };
  
  // Product trend icon
  const ProductTrendIcon = ({ trend }) => {
    if (trend === 'up') {
      return <span className="text-green-600">↑</span>;
    } else if (trend === 'down') {
      return <span className="text-red-600">↓</span>;
    }
    return null;
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      userRole="admin"
      breadcrumbs="Home / Dashboard"
      actions={dashboardActions}
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Users"
          value="2,845"
          subtitle="125 new this month"
          icon={<UsersIcon />}
          color="blue"
          trend="up"
          trendValue="12%"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products"
          value="186"
          subtitle="15 added recently"
          icon={<ProductsIcon />}
          color="green"
          trend="up"
          trendValue="8%"
          isLoading={isLoading}
        />
        <StatCard 
          title="Orders"
          value="452"
          subtitle="45 pending deliveries"
          icon={<OrdersIcon />}
          color="yellow"
          trend="up"
          trendValue="5%"
          isLoading={isLoading}
        />
        <StatCard 
          title="Revenue"
          value="LKR 5,691,800"
          subtitle="This month"
          icon={<RevenueIcon />}
          color="purple"
          trend="up"
          trendValue="18%"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table - Takes up 2/3 of the space */}
        <Card 
          title="Recent Orders" 
          className="lg:col-span-2"
          noPadding
          color="blue"
          icon={<OrdersIcon />}
        >
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customer' },
              { header: 'Product', accessor: 'product' },
              { 
                header: 'Amount', 
                accessor: 'amount',
                cell: (row) => <span className="font-medium">{row.amount}</span>
              },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => <OrderStatusBadge status={row.status} />
              },
              { header: 'Date', accessor: 'date' },
            ]}
            data={recentOrders}
            onRowClick={(row) => console.log('Clicked row:', row)}
          />
        </Card>
        
        {/* Top Products - Takes up 1/3 of the space */}
        <Card 
          title="Top Products" 
          color="green"
          icon={<ProductsIcon />}
          noPadding
        >
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Product', accessor: 'name' },
              { 
                header: 'Sales', 
                accessor: 'sales',
                cell: (row) => (
                  <div className="flex items-center">
                    {row.sales} <ProductTrendIcon trend={row.trend} />
                  </div>
                )
              },
              { header: 'Revenue', accessor: 'revenue' },
            ]}
            data={topProducts}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;