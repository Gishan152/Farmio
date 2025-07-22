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
const UserCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// Dummy Data
const recentOrders = [
  { id: '0123', customer: 'Manju Perera', product: 'Organic Tomatoes', amount: 'LKR 4,998', status: 'Delivered', date: '2025-06-18' },
  { id: '0124', customer: 'Iresha Gunasekara', product: 'Fresh Farm Milk', amount: 'LKR 7,100', status: 'Processing', date: '2025-06-19' },
  { id: '0125', customer: 'Sunil Karunaratne', product: 'Mixed Vegetables', amount: 'LKR 9,550', status: 'Shipped', date: '2025-06-20' },
  { id: '0126', customer: 'Shamila Jayasinghe', product: 'Organic Eggs', amount: 'LKR 3,650', status: 'Processing', date: '2025-06-21' },
];

const pendingUsers = [
  { id: 'USR001', name: 'Kasun Wijeratne', email: 'kasun.w@gmail.com', role: 'Transport Manager', location: 'Colombo', experience: '5 years', appliedDate: '2025-07-15', status: 'Pending' },
  { id: 'USR002', name: 'Nimal Fernando', email: 'nimal.f@yahoo.com', role: 'Warehouse Manager', location: 'Kandy', experience: '8 years', appliedDate: '2025-07-16', status: 'Pending' },
  { id: 'USR003', name: 'Saman Perera', email: 'saman.p@gmail.com', role: 'Waste Manager', location: 'Galle', experience: '3 years', appliedDate: '2025-07-17', status: 'Pending' },
  { id: 'USR004', name: 'Chamara Silva', email: 'chamara.s@outlook.com', role: 'Transport Manager', location: 'Matara', experience: '6 years', appliedDate: '2025-07-18', status: 'Pending' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState(pendingUsers);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmType, setConfirmType] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleApproveUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmMessage(`Are you sure you want to approve ${user?.name}?`);
    setConfirmType('approve');
    setConfirmAction(() => () => {
      setUsers(prevUsers =>
        prevUsers
          .map(u => (u.id === userId ? { ...u, status: 'Approved' } : u))
          .filter(u => u.status === 'Pending')
      );
      setShowUserModal(false);
      setShowConfirmModal(false);
      console.log('User approved:', userId);
    });
    setShowConfirmModal(true);
  };

  const handleRejectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmMessage(`Are you sure you want to reject ${user?.name}?`);
    setConfirmType('reject');
    setConfirmAction(() => () => {
      setUsers(prevUsers =>
        prevUsers
          .map(u => (u.id === userId ? { ...u, status: 'Rejected' } : u))
          .filter(u => u.status === 'Pending')
      );
      setShowUserModal(false);
      setShowConfirmModal(false);
      console.log('User rejected:', userId);
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
    setConfirmType('');
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      Delivered: 'bg-pastel-green text-green-800',
      Processing: 'bg-pastel-blue text-blue-800',
      Shipped: 'bg-pastel-yellow text-yellow-800',
      Cancelled: 'bg-pastel-red text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const UserRoleBadge = ({ role }) => {
    const roleStyles = {
      'Transport Manager': 'bg-blue-100 text-blue-800',
      'Warehouse Manager': 'bg-green-100 text-green-800',
      'Waste Manager': 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${roleStyles[role] || 'bg-gray-200 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  const UserActionButtons = ({ user }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewUser(user);
        }}
        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        title="View Details"
      >
        <EyeIcon />
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Dashboard" userRole="admin" breadcrumbs="Home / Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value="2,845" subtitle="125 new this month" icon={<UsersIcon />} color="blue" trend="up" trendValue="12%" isLoading={isLoading} />
        <StatCard title="Pending Approvals" value={users.length.toString()} subtitle="Users awaiting approval" icon={<UserCheckIcon />} color="orange" trend="up" trendValue="3" isLoading={isLoading} />
        <StatCard title="Orders" value="452" subtitle="45 pending deliveries" icon={<OrdersIcon />} color="yellow" trend="up" trendValue="5%" isLoading={isLoading} />
        <StatCard title="Revenue" value="LKR 5,691,800" subtitle="This month" icon={<RevenueIcon />} color="purple" trend="up" trendValue="18%" isLoading={isLoading} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card title="Recent Orders" className="lg:col-span-2" noPadding color="blue" icon={<OrdersIcon />}>
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customer' },
              { header: 'Product', accessor: 'product' },
              { header: 'Amount', accessor: 'amount', cell: (row) => <span className="font-medium">{row.amount}</span> },
              { header: 'Status', accessor: 'status', cell: (row) => <OrderStatusBadge status={row.status} /> },
              { header: 'Date', accessor: 'date' },
            ]}
            data={recentOrders}
            onRowClick={(row) => console.log('Order clicked:', row)}
          />
        </Card>

        {/* Approve Users */}
        <Card title="Approve Users" color="purple" icon={<UserCheckIcon />} noPadding>
          <Table
            isLoading={isLoading}
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Actions', accessor: 'actions', cell: (row) => <UserActionButtons user={row} /> },
            ]}
            data={users}
          />
        </Card>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0  bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">User Details</h3>
                <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XIcon />
                </button>
              </div>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="text-sm text-gray-900">
                    <UserRoleBadge role={selectedUser.role} />
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedUser.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-sm text-gray-900">{selectedUser.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                  <p className="text-sm text-gray-900">{selectedUser.appliedDate}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditUser(selectedUser)}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <EditIcon />
                  <span className="ml-2">Edit</span>
                </button>
                <button
                  onClick={() => handleApproveUser(selectedUser.id)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckIcon />
                  <span className="ml-2">Approve</span>
                </button>
                <button
                  onClick={() => handleRejectUser(selectedUser.id)}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <XIcon />
                  <span className="ml-2">Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0  bg-opacity-20 backdrop-filter backdrop-blur-sm" onClick={handleCancelAction}></div>
          <div className="relative flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${confirmType === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {confirmType === 'approve' ? <CheckIcon className="h-6 w-6 text-green-600" /> : <XIcon className="h-6 w-6 text-red-600" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {confirmType === 'approve' ? 'Approve User' : 'Reject User'}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{confirmMessage}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelAction}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                      confirmType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {confirmType === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;