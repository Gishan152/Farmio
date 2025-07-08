import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icons (we'll use inline SVGs since we may not have react-icons installed)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

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

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Sidebar = ({ userRole = 'admin' }) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(3);
  const [collapsed, setCollapsed] = useState({});
    // Define menu items based on role
  const menuItems = {
    admin: [
      { name: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },      { 
        name: 'User Management', 
        icon: <UsersIcon />, 
        path: '/admin/users',
        submenu: [
          { name: 'All Users', path: '/admin/users' },
          { name: 'Farmers', path: '/admin/users/farmers' },
          { name: 'Buyers', path: '/admin/users/buyers' },
          { name: 'Transport Providers', path: '/admin/users/transport-providers' },
          { name: 'Warehouse Owners', path: '/admin/users/warehouse-owners' },
          { name: 'Waste Management Agents', path: '/admin/users/waste-management-agents' },
          { name: 'Moderators', path: '/admin/users/moderators' },
          { name: 'Admins', path: '/admin/users/admins' }
        ]
      },
      { 
        name: 'Products', 
        icon: <ProductsIcon />, 
        path: '/admin/products',
        submenu: [
          { name: 'All Products', path: '/admin/products' },
          { name: 'Categories', path: '/admin/products/categories' },
          { name: 'Inventory', path: '/admin/products/inventory' },
          { name: 'Quality Control', path: '/admin/products/quality' }
        ]
      },
      { 
        name: 'Orders & Deliveries', 
        icon: <OrdersIcon />, 
        path: '/admin/orders',
        submenu: [
          { name: 'All Orders', path: '/admin/orders' },
          { name: 'Pending Orders', path: '/admin/orders/pending' },
          { name: 'Deliveries', path: '/admin/orders/deliveries' },
          { name: 'Issues', path: '/admin/orders/issues' }
        ]
      },
      { 
        name: 'Logistics', 
        icon: <ReportsIcon />, 
        path: '/admin/logistics',
        submenu: [
          { name: 'Transport Routes', path: '/admin/logistics/routes' },
          { name: 'Warehouses', path: '/admin/logistics/warehouses' },
          { name: 'Shipping', path: '/admin/logistics/shipping' }
        ]
      },
      { 
        name: 'Waste Management', 
        icon: <ReportsIcon />, 
        path: '/admin/waste',
        submenu: [
          { name: 'Collection Points', path: '/admin/waste/collection' },
          { name: 'Processing', path: '/admin/waste/processing' },
          { name: 'Recycling Stats', path: '/admin/waste/stats' }
        ]
      },
      { 
        name: 'Analytics', 
        icon: <ReportsIcon />, 
        path: '/admin/analytics',
        submenu: [
          { name: 'Sales', path: '/admin/analytics/sales' },
          { name: 'User Activity', path: '/admin/analytics/activity' },
          { name: 'Supply Chain', path: '/admin/analytics/supply-chain' },
          { name: 'Sustainability', path: '/admin/analytics/sustainability' }
        ]
      },
      { name: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    ],
    moderator: [
      { name: 'Dashboard', icon: <DashboardIcon />, path: '/moderator/dashboard' },
      { 
        name: 'Products', 
        icon: <ProductsIcon />, 
        path: '/moderator/products',
        submenu: [
          { name: 'All Products', path: '/moderator/products' },
          { name: 'Review Submissions', path: '/moderator/products/review' },
          { name: 'Quality Control', path: '/moderator/products/quality' }
        ] 
      },
      { name: 'Orders', icon: <OrdersIcon />, path: '/moderator/orders' },
      { name: 'User Support', icon: <UsersIcon />, path: '/moderator/support' },
      { name: 'Settings', icon: <SettingsIcon />, path: '/moderator/settings' },
    ]
  };

  // Toggle submenu collapse state
  const toggleCollapse = (name) => {
    setCollapsed(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Determine if a menu item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get menu items based on user role
  const items = menuItems[userRole] || [];

  return (
    <div className="flex flex-col h-screen bg-white border-r border-dashboard-border w-64">
      {/* Logo and branding */}
      <div className="p-4 border-b border-dashboard-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-farmio flex items-center justify-center mr-2">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="text-lg font-semibold text-dashboard-text-primary">
            Farmio
          </span>
        </div>
        <div className="text-xs text-dashboard-text-light mt-1">
          {userRole === 'admin' ? 'Admin Portal' : 'Moderator Portal'}
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-dashboard-border flex items-center">
        <div className="w-10 h-10 rounded-full bg-pastel-green flex items-center justify-center">
          <span className="text-farmio-dark font-medium">
            {userRole === 'admin' ? 'A' : 'M'}
          </span>
        </div>
        <div className="ml-3">
          <div className="font-medium text-sm text-dashboard-text-primary">
            {userRole === 'admin' ? 'Admin User' : 'Moderator User'}
          </div>
          <div className="text-xs text-dashboard-text-light">
            user@farmio.com
          </div>
        </div>
        <div className="ml-auto relative">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <NotificationIcon />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-pastel-red text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleCollapse(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                      isActive(item.path)
                        ? 'bg-pastel-green text-farmio-dark font-medium'
                        : 'text-dashboard-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {collapsed[item.name] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  </button>
                  
                  {collapsed[item.name] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <li key={subitem.name}>
                          <Link
                            to={subitem.path}
                            className={`block px-3 py-2 rounded-md text-sm ${
                              isActive(subitem.path)
                                ? 'bg-pastel-green text-farmio-dark font-medium'
                                : 'text-dashboard-text-secondary hover:bg-gray-100'
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    isActive(item.path)
                      ? 'bg-pastel-green text-farmio-dark font-medium'
                      : 'text-dashboard-text-secondary hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-dashboard-border">
        <button
          className="flex w-full items-center px-3 py-2 text-sm text-dashboard-text-secondary hover:bg-gray-100 rounded-md"
          onClick={() => console.log('Logout')}
        >
          <span className="mr-3"><LogoutIcon /></span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;