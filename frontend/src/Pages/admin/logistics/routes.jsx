import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { 
  fetchAllRoutes, 
  getRouteCount, 
  getTotalDistance, 
  getAverageDistance,
  formatDistance,
  formatTime,
  formatRouteDate
} from '../../../Utils/routeUtils';

// Icons
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const TransportRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalDistance: 0,
    averageDistance: 0
  });

  // Load routes from API
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch routes and stats in parallel
        const [routesData, totalDist, avgDist] = await Promise.all([
          fetchAllRoutes(),
          getTotalDistance(),
          getAverageDistance()
        ]);
        
        console.log('📍 Routes loaded:', routesData);
        
        setRoutes(routesData || []);
        setFilteredData(routesData || []);
        setStats({
          totalRoutes: routesData?.length || 0,
          totalDistance: totalDist || 0,
          averageDistance: avgDist || 0
        });
        
      } catch (error) {
        console.error('Error loading routes:', error);
        setError('Failed to load routes. Please try again.');
        setRoutes([]);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // Handle search
  useEffect(() => {
    if (!routes) return;

    let results = routes.filter(route => {
      return Object.keys(route).some(key =>
        typeof route[key] === 'string' && route[key].toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
        (route.popularProducts && route.popularProducts.some(product =>
          product.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    });

    setFilteredData(results);
  }, [searchTerm, routes]);

  // Filter options
  const filters = [
    {
      name: 'transportProvider',
      label: 'Transport Provider',
      options: [
        { label: 'Green Mile Transports', value: 'Green Mile Transports' },
        { label: 'Fast Track Logistics', value: 'Fast Track Logistics' },
        { label: 'Rural Routes Delivery', value: 'Rural Routes Delivery' },
        { label: 'Swift Stream Logistics', value: 'Swift Stream Logistics' },
        { label: 'Cool Chain Logistics', value: 'Cool Chain Logistics' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'frequency',
      label: 'Frequency',
      options: [
        { label: 'Daily', value: 'Daily' },
        { label: 'Twice Weekly', value: 'Twice Weekly' },
        { label: 'Mon-Wed-Fri', value: 'Mon-Wed-Fri' },
        { label: 'Seasonal (Summer)', value: 'Seasonal (Summer)' }
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
    if (!routes || Object.keys(selectedFilters).length === 0) {
      setFilteredData(routes);
      return;
    }

    let results = routes.filter(route => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return route[key] === value;
      });
    });

    setFilteredData(results);
  }, [selectedFilters, routes]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Active': 'bg-pastel-green text-green-800',
      'Inactive': 'bg-pastel-red text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Route Details Component
  const RouteDetails = ({ route }) => {
    return (
      <div className="p-6 bg-gray-50">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Route Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Route ID:</span>
              <span className="ml-2 text-gray-800">{route.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Route Date:</span>
              <span className="ml-2 text-gray-800">{formatRouteDate(route.routeDate)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Starting Point</h5>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{route.startingLocation || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">Origin</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Destination</h5>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{route.destination || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">Endpoint</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Route Metrics</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-lg font-semibold text-gray-900">{formatDistance(route.distance)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Estimated Time</p>
              <p className="text-lg font-semibold text-gray-900">{formatTime(route.estimatedTime)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Route Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatRouteDate(route.routeDate)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Route ID' },
    {
      key: 'startingLocation',
      header: 'Starting Location',
      render: (value) => (
        <div className="font-medium">{value || 'N/A'}</div>
      )
    },
    {
      key: 'destination',
      header: 'Destination',
      render: (value) => (
        <div className="font-medium">{value || 'N/A'}</div>
      )
    },
    { 
      key: 'distance', 
      header: 'Distance',
      render: (value) => formatDistance(value)
    },
    { 
      key: 'estimatedTime', 
      header: 'Est. Time',
      render: (value) => formatTime(value)
    },
    { 
      key: 'routeDate', 
      header: 'Route Date',
      render: (value) => formatRouteDate(value)
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedRouteId === row.id ? 'text-blue-800' : ''}`}
            title={expandedRouteId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedRouteId(expandedRouteId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {row.mapLink && (
            <a
              href={row.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="View Route Map"
            >
              <MapIcon />
            </a>
          )}
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Route">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Transport Routes"
      breadcrumbs="Logistics / Transport Routes"
      userRole="admin"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Routes"
          value={stats.totalRoutes.toString()}
          subtitle="All routes"
          icon={<MapIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Distance"
          value={formatDistance(stats.totalDistance)}
          subtitle="Combined distance"
          icon={<MapIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Average Distance"
          value={formatDistance(stats.averageDistance)}
          subtitle="Per route"
          icon={<MapIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          title="Filtered Routes"
          value={filteredData.length.toString()}
          subtitle="Current view"
          icon={<TruckIcon />}
          color="yellow"
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
              placeholder="Search routes by name, provider, products..."
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

          {/* Create Route Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Route
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Routes</h3>
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

      {/* Routes Table */}
      <Card
        title="Transport Routes"
        color="blue"
        icon={<MapIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage={
            routes.length === 0 
              ? "No routes found in the database. Routes will appear here once they are added to the transport service."
              : "No routes found matching your criteria."
          }
          expandedRowRender={(row) => <RouteDetails route={row} />}
          expandedRowId={expandedRouteId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default TransportRoutes;
