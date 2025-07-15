import { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import Card from '../ui/Card';
import Table from '../ui/Table';

// Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);  // User management component for all types of users
const UserManagement = ({
  userType = 'All Users',
  userTypePath = 'users',
  userIcon = <UserIcon />,
  columns,
  userData,
  filters = [],
  actions = [],
  showAddButton = true,
  onAddClick
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(userData);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!userData) return;
    
    const results = userData.filter(user => {
      // Search through all properties
      return Object.keys(user).some(key => 
        user[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredData(results);
  }, [searchTerm, userData]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!userData || Object.keys(selectedFilters).length === 0) {
      setFilteredData(userData);
      return;
    }
    
    const results = userData.filter(user => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return user[key] === value;
      });
    });
    
    setFilteredData(results);
  }, [selectedFilters, userData]);

  // Default actions
  const defaultActions = (
    <div className="flex items-center space-x-2">
      <button
        className="flex items-center text-sm py-1.5 px-2 rounded-md border border-dashboard-border hover:bg-gray-100"
        onClick={() => setShowFilterPanel(!showFilterPanel)}
      >
        <FilterIcon />
        <span className="ml-1 hidden md:inline">Filter</span>
      </button>
      {showAddButton && (
        <button
          className="flex items-center text-sm py-1.5 px-2 rounded-md bg-farmio text-white hover:bg-farmio-dark"
          onClick={onAddClick}
        >
          <AddIcon />
          <span className="ml-1 hidden md:inline">Add {userType.slice(0, -1)}</span>
        </button>
      )}
    </div>
  );

  return (
    <DashboardLayout
      title={userType}
      breadcrumbs={`User Management / ${userType}`}
      actions={actions.length > 0 ? actions : defaultActions}
      userRole="admin"
    >
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={`Search ${userType}...`}
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
        </div>

        {/* Filter panel */}
        {showFilterPanel && filters.length > 0 && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {/* User Table */}
      <Card
        title={userType}
        color="blue"
        icon={userIcon}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked row:', row)}
          emptyMessage={`No ${userType.toLowerCase()} found.`}
        />
      </Card>
    </DashboardLayout>
  );
};

export default UserManagement;