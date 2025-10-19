import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import StatCard from '../../components/ui/StatCard';
import { 
  fetchModeratorStats, 
  fetchRecentOrders, 
  fetchPendingOrders, 
  fetchProductsForReview,
  fetchRecentInventoryUpdates,
  formatOrderStatus,
  formatCurrency,
  formatDate
} from '../../Utils/moderatorUtils';

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


const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    productsForReview: 0,
    tasksCompleted: 0
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentInventoryUpdates, setRecentInventoryUpdates] = useState([]);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load all data in parallel
        const [statsData, pendingOrdersData, inventoryUpdatesData] = await Promise.all([
          fetchModeratorStats(),
          fetchPendingOrders(),
          fetchRecentInventoryUpdates()
        ]);
        
        setStats(statsData);
        setPendingOrders(pendingOrdersData);
        setRecentInventoryUpdates(inventoryUpdatesData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // Set fallback data
        setStats({
          pendingOrders: 0,
          productsForReview: 0,
          tasksCompleted: 0
        });
        setPendingOrders([]);
        setRecentInventoryUpdates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      'DELIVERED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'IN_TRANSPORT': 'bg-purple-100 text-purple-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'AWAITING_PICKUP': 'bg-indigo-100 text-indigo-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {formatOrderStatus(status)}
      </span>
    );
  };

  return (
    <DashboardLayout 
      title="Moderator Dashboard" 
      userRole="moderator"
      breadcrumbs="Home / Dashboard"
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertIcon />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          subtitle="Require attention"
          icon={<AlertIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Products to Review"
          value={stats.productsForReview.toString()}
          subtitle="New updates"
          icon={<ProductsIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Tasks Completed"
          value={stats.tasksCompleted.toString()}
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
              { header: 'Order ID', accessor: 'orderId' },
              { 
                header: 'Customer', 
                accessor: 'buyerId',
                cell: (row) => (
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Customer #{row.buyerId}</div>
                    <div className="text-xs text-gray-500">ID: {row.buyerId}</div>
                  </div>
                )
              },
              { 
                header: 'Amount', 
                accessor: 'total',
                cell: (row) => <span className="font-medium">{formatCurrency(row.total)}</span>
              },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => <OrderStatusBadge status={row.status} />
              },
              { 
                header: 'Date', 
                accessor: 'createdAt',
                cell: (row) => formatDate(row.createdAt)
              },
            ]}
            data={pendingOrders}
            onRowClick={(row) => navigate(`/moderator/orders/${row.orderId}`)}
            emptyMessage="No pending orders found."
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
              { 
                header: 'Product', 
                accessor: 'productName',
                cell: (row) => (
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{row.productName || 'Unknown Product'}</div>
                    <div className="text-xs text-gray-500">{row.location || 'Unknown Location'}</div>
                  </div>
                )
              },
              { 
                header: 'Action', 
                accessor: 'action',
                cell: (row) => (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {row.action || 'Update'}
                  </span>
                )
              },
              { 
                header: 'Stock', 
                accessor: 'availableStock',
                cell: (row) => (
                  <span className="font-medium">
                    {row.availableStock || 0} {row.measurement || 'units'}
                  </span>
                )
              },
              { 
                header: 'Updated', 
                accessor: 'updatedAt',
                cell: (row) => formatDate(row.updatedAt || row.createdAt)
              },
            ]}
            data={recentInventoryUpdates}
            emptyMessage="No recent inventory updates found."
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