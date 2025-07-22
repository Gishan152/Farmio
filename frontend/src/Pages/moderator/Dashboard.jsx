import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatCard from '../../components/ui/StatCard';

// Icons
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

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Dummy data
const pendingOrders = [
  { id: '0124', customer: 'Kumara Dissanayake', product: 'Fresh Farm Milk', amount: 'LKR 7,100', status: 'Processing', date: '2025-06-19' },
  { id: '0126', customer: 'Fathima Nizam', product: 'Organic Eggs', amount: 'LKR 3,650', status: 'Processing', date: '2025-06-21' },
  { id: '0128', customer: 'Senaka Jayawardene', product: 'Grass-Fed Beef', amount: 'LKR 17,999', status: 'Processing', date: '2025-06-21' },
  { id: '0129', customer: 'Priyanthi Fernando', product: 'Seasonal Fruits', amount: 'LKR 6,500', status: 'Processing', date: '2025-06-21' },
];

const recentInventoryUpdates = [
  { product: 'Organic Tomatoes', action: 'Stock Update', quantity: '+50 kg', user: 'Chaminda Perera', timestamp: '2025-06-21 09:45 AM' },
  { product: 'Fresh Farm Milk', action: 'Quality Check', quantity: '200 L', user: 'Malith Gunathilaka', timestamp: '2025-06-21 08:30 AM' },
  { product: 'Organic Eggs', action: 'Stock Update', quantity: '+120 units', user: 'Wasantha Silva', timestamp: '2025-06-20 04:15 PM' },
  { product: 'Mixed Vegetables', action: 'Price Update', quantity: '300 kg', user: 'Kamala Vithanage', timestamp: '2025-06-20 02:00 PM' },
];

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <DashboardLayout 
      title="Moderator Dashboard" 
      userRole="moderator"
      breadcrumbs="Home / Dashboard"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Pending Orders"
          value="8"
          subtitle="Require attention"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products to Review"
          value="12"
          subtitle="New updates"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Tasks Completed"
          value="24"
          subtitle="Today"
          icon={<CheckIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card 
          title="Pending Orders" 
          noPadding
          color="yellow"
          icon={<OrdersIcon />}
        >
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customer' },
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
            data={pendingOrders}
            onRowClick={(row) => console.log('Clicked row:', row)}
          />
        </Card>
        
        {/* Recent Inventory Updates */}
        <Card 
          title="Recent Inventory Updates" 
          color="blue"
          icon={<ProductsIcon />}
          noPadding
        >
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Product', accessor: 'product' },
            //   { header: 'Action', accessor: 'action' },
              { header: 'Quantity', accessor: 'quantity' },
              { header: 'User', accessor: 'user' },
            //   { header: 'Time', accessor: 'timestamp' },
            ]}
            data={recentInventoryUpdates}
          />
        </Card>
      </div>
      
      {/* Task Management */}
      <div className="mt-6">
        <Card 
          title="Today's Tasks" 
          color="green"
        >
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="task1" className="w-4 h-4 rounded text-farmio focus:ring-farmio-light" />
              <label htmlFor="task1" className="ml-3 text-dashboard-text-secondary">
                Review Dambulla produce quality reports
              </label>
              <span className="ml-auto text-xs bg-pastel-yellow text-yellow-800 px-2 py-1 rounded-full">
                High Priority
              </span>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="task2" className="w-4 h-4 rounded text-farmio focus:ring-farmio-light" />
              <label htmlFor="task2" className="ml-3 text-dashboard-text-secondary">
                Process Colombo area pending orders
              </label>
              <span className="ml-auto text-xs bg-pastel-blue text-blue-800 px-2 py-1 rounded-full">
                Medium Priority
              </span>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="task3" className="w-4 h-4 rounded text-farmio focus:ring-farmio-light" />
              <label htmlFor="task3" className="ml-3 text-dashboard-text-secondary">
                Update Nuwara Eliya vegetable inventory
              </label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="task4" className="w-4 h-4 rounded text-farmio focus:ring-farmio-light" />
              <label htmlFor="task4" className="ml-3 text-dashboard-text-secondary">
                Respond to customer inquiries from Kandy
              </label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="task5" className="w-4 h-4 rounded text-farmio focus:ring-farmio-light" />
              <label htmlFor="task5" className="ml-3 text-dashboard-text-secondary">
                Review Jaffna onion supply reports
              </label>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorDashboard;