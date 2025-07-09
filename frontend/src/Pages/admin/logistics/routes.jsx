import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  // Sample routes data
  const routes = [
    {
      id: 'RT-1001',
      name: 'Farmville to Central Market',
      origin: 'Farmville Production Hub',
      destination: 'Central City Market',
      distance: '45 km',
      estimatedTime: '1h 15m',
      transportProvider: 'Green Mile Transports',
      activeDrivers: 5,
      averageLoad: '2.5 tons',
      status: 'Active',
      frequency: 'Daily',
      popularProducts: ['Tomatoes', 'Lettuce', 'Carrots'],
      routeDetails: [
        { checkpoint: 'Farmville Loading Bay', time: '06:00 AM', activities: ['Loading', 'Quality Check'] },
        { checkpoint: 'Highway 101 Junction', time: '06:45 AM', activities: ['Transit'] },
        { checkpoint: 'Riverside Checkpoint', time: '07:15 AM', activities: ['Document Verification'] },
        { checkpoint: 'Central City Entry', time: '07:30 AM', activities: ['Transit'] },
        { checkpoint: 'Central Market Unloading', time: '07:45 AM', activities: ['Unloading', 'Delivery Confirmation'] }
      ],
      mapLink: 'https://maps.example.com/route/RT-1001'
    },
    {
      id: 'RT-1002',
      name: 'Greenfield to Urban Restaurants',
      origin: 'Greenfield Farms Collective',
      destination: 'Urban Restaurant District',
      distance: '65 km',
      estimatedTime: '1h 45m',
      transportProvider: 'Fast Track Logistics',
      activeDrivers: 3,
      averageLoad: '1.8 tons',
      status: 'Active',
      frequency: 'Mon-Wed-Fri',
      popularProducts: ['Organic Vegetables', 'Fresh Herbs', 'Specialty Greens'],
      routeDetails: [
        { checkpoint: 'Greenfield Collection Center', time: '05:30 AM', activities: ['Loading', 'Temperature Check'] },
        { checkpoint: 'Highway 202 Junction', time: '06:15 AM', activities: ['Transit'] },
        { checkpoint: 'Mountain Pass', time: '06:45 AM', activities: ['Rest Stop'] },
        { checkpoint: 'Urban Perimeter', time: '07:15 AM', activities: ['Traffic Management'] },
        { checkpoint: 'Restaurant District Hub', time: '07:45 AM', activities: ['Unloading', 'Delivery Confirmation'] }
      ],
      mapLink: 'https://maps.example.com/route/RT-1002'
    },
    {
      id: 'RT-1003',
      name: 'Orchard Hills to Processing Plant',
      origin: 'Orchard Hills Fruit Farms',
      destination: 'Valley Processing Facility',
      distance: '30 km',
      estimatedTime: '50m',
      transportProvider: 'Rural Routes Delivery',
      activeDrivers: 2,
      averageLoad: '3.2 tons',
      status: 'Inactive',
      frequency: 'Seasonal (Summer)',
      popularProducts: ['Apples', 'Pears', 'Peaches'],
      routeDetails: [
        { checkpoint: 'Orchard Collection Point', time: '07:00 AM', activities: ['Loading', 'Quality Inspection'] },
        { checkpoint: 'Country Road 15', time: '07:30 AM', activities: ['Transit'] },
        { checkpoint: 'Valley Entrance', time: '07:45 AM', activities: ['Transit'] },
        { checkpoint: 'Processing Plant Delivery', time: '08:00 AM', activities: ['Unloading', 'Weight Verification'] }
      ],
      mapLink: 'https://maps.example.com/route/RT-1003'
    },
    {
      id: 'RT-1004',
      name: 'Riverside Farms to Wholesale Market',
      origin: 'Riverside Agricultural Cooperative',
      destination: 'Metropolitan Wholesale Market',
      distance: '80 km',
      estimatedTime: '2h 15m',
      transportProvider: 'Swift Stream Logistics',
      activeDrivers: 4,
      averageLoad: '5.5 tons',
      status: 'Active',
      frequency: 'Twice Weekly',
      popularProducts: ['Mixed Vegetables', 'Root Crops', 'Leafy Greens'],
      routeDetails: [
        { checkpoint: 'Riverside Collection Center', time: '04:00 AM', activities: ['Loading', 'Documentation'] },
        { checkpoint: 'Highway 405 Entrance', time: '04:45 AM', activities: ['Transit'] },
        { checkpoint: 'Rest Area 27', time: '05:45 AM', activities: ['Driver Break', 'Vehicle Inspection'] },
        { checkpoint: 'Metropolitan Bypass', time: '06:15 AM', activities: ['Transit'] },
        { checkpoint: 'Wholesale Market Entry', time: '06:45 AM', activities: ['Queue for Unloading'] },
        { checkpoint: 'Wholesale Market Bay 12', time: '07:15 AM', activities: ['Unloading', 'Quality Verification'] }
      ],
      mapLink: 'https://maps.example.com/route/RT-1004'
    },
    {
      id: 'RT-1005',
      name: 'Highland Dairy to Urban Markets',
      origin: 'Highland Dairy Cooperative',
      destination: 'Multiple Urban Markets',
      distance: '55 km',
      estimatedTime: '1h 30m',
      transportProvider: 'Cool Chain Logistics',
      activeDrivers: 6,
      averageLoad: '2.0 tons',
      status: 'Active',
      frequency: 'Daily',
      popularProducts: ['Fresh Milk', 'Yogurt', 'Cheese'],
      routeDetails: [
        { checkpoint: 'Highland Dairy Cold Storage', time: '03:30 AM', activities: ['Loading', 'Temperature Verification'] },
        { checkpoint: 'Mountain Highway', time: '04:00 AM', activities: ['Transit'] },
        { checkpoint: 'Valley Junction', time: '04:30 AM', activities: ['Transit'] },
        { checkpoint: 'Urban Market 1', time: '04:45 AM', activities: ['Partial Unloading'] },
        { checkpoint: 'Urban Market 2', time: '05:15 AM', activities: ['Partial Unloading'] },
        { checkpoint: 'Urban Market 3', time: '05:45 AM', activities: ['Final Unloading'] }
      ],
      mapLink: 'https://maps.example.com/route/RT-1005'
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(routes);
    }, 1000);
    return () => clearTimeout(timer);
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
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">{route.name} (ID: {route.id})</h4>
            <p className="text-xs text-gray-500">{route.origin} to {route.destination} | {route.distance}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={route.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ROUTE CHECKPOINTS</h5>
            <div className="relative">
              {route.routeDetails.map((checkpoint, index) => (
                <div key={index} className="mb-4 pl-6 border-l-2 border-farmio relative">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-farmio"></div>
                  <div className="text-sm font-medium">{checkpoint.checkpoint}</div>
                  <div className="text-xs text-gray-500">{checkpoint.time}</div>
                  <div className="text-xs mt-1">
                    {checkpoint.activities.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ROUTE INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transport Provider:</span>
                <span className="font-medium">{route.transportProvider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frequency:</span>
                <span className="font-medium">{route.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Drivers:</span>
                <span className="font-medium">{route.activeDrivers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Average Load:</span>
                <span className="font-medium">{route.averageLoad}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Time:</span>
                <span className="font-medium">{route.estimatedTime}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500 block mb-1">POPULAR PRODUCTS</span>
                <div className="flex flex-wrap gap-1">
                  {route.popularProducts.map((product, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {route.mapLink && (
              <a 
                href={route.mapLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-3 py-1 text-sm text-white bg-farmio rounded-md hover:bg-green-600"
              >
                <MapIcon />
                <span className="ml-2">View Route Map</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Route ID' },
    { 
      key: 'name', 
      header: 'Route Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { key: 'distance', header: 'Distance' },
    { key: 'estimatedTime', header: 'Est. Time' },
    { key: 'transportProvider', header: 'Provider' },
    { key: 'frequency', header: 'Frequency' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => <StatusBadge status={value} />
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
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Active Routes"
          value={routes.filter(r => r.status === 'Active').length.toString()}
          subtitle="Operational"
          icon={<MapIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Distance"
          value="275 km"
          subtitle="All routes"
          icon={<MapIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Transport Providers"
          value={new Set(routes.map(r => r.transportProvider)).size.toString()}
          subtitle="Partners"
          icon={<TruckIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Drivers"
          value={routes.reduce((sum, route) => sum + route.activeDrivers, 0).toString()}
          subtitle="On routes"
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
          emptyMessage="No routes found matching your criteria."
          expandedRowRender={(row) => <RouteDetails route={row} />}
          expandedRowId={expandedRouteId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default TransportRoutes;
