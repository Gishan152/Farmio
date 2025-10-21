import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { 
  fetchAllWasteListings, 
  fetchAllWasteAgents,
  getWasteListingCountByStatus,
  getWasteListingCountByType 
} from '../../../Utils/wasteUtils';

// Icons
const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Mock data for Sri Lankan waste collection points - Small system with 20 users
const collectionPoints = [
  {
    id: 'CP-001',
    name: 'Pettah Market Collection Hub',
    location: 'Pettah, Colombo',
    address: '45 Main Street, Pettah, Colombo 11',
    manager: 'Sunil Perera',
    contact: '+94 77 123 4567',
    email: 'sperera@wastesolutions.lk',
    capacity: '500 kg daily',
    currentLoad: '65%',
    status: 'Active',
    wasteTypes: ['Organic', 'Packaging', 'Mixed'],
    operatingHours: 'Mon-Sat: 6:00 AM - 6:00 PM',
    pointDetails: {
      containers: [
        { type: 'Organic', capacity: '300 kg', currentFill: '70%', nextPickup: '2025-10-22' },
        { type: 'Packaging', capacity: '150 kg', currentFill: '55%', nextPickup: '2025-10-23' },
        { type: 'Mixed', capacity: '50 kg', currentFill: '45%', nextPickup: '2025-10-23' }
      ],
      pickupSchedule: 'Daily for organic waste, every other day for packaging',
      processingFacility: 'Colombo Composting Center',
      transportProvider: 'Green Lanka Waste Management',
      notes: 'High-volume location serving the Pettah market district. Priority for organic waste collection.'
    }
  },
  {
    id: 'CP-002',
    name: 'Anuradhapura Farm Collective',
    location: 'Anuradhapura Agricultural Zone',
    address: 'Galkulama Road, Anuradhapura',
    manager: 'Kamala Jayawardena',
    contact: '+94 77 234 5678',
    email: 'kjayawardena@greenfarms.lk',
    capacity: '400 kg daily',
    currentLoad: '40%',
    status: 'Active',
    wasteTypes: ['Organic', 'Agricultural'],
    operatingHours: 'Mon-Fri: 7:00 AM - 5:00 PM',
    pointDetails: {
      containers: [
        { type: 'Organic', capacity: '250 kg', currentFill: '45%', nextPickup: '2025-10-22' },
        { type: 'Agricultural', capacity: '150 kg', currentFill: '30%', nextPickup: '2025-10-24' }
      ],
      pickupSchedule: 'Three times weekly',
      processingFacility: 'North Central Composting Facility',
      transportProvider: 'Farm Waste Lanka',
      notes: 'Collection point serving local organic farms. Specialized in agricultural waste for composting.'
    }
  },
  {
    id: 'CP-003',
    name: 'Gampaha Warehouse Hub',
    location: 'Gampaha Industrial Zone',
    address: 'Industrial Estate, Gampaha',
    manager: 'Pradeep Bandara',
    contact: '+94 77 345 6789',
    email: 'pbandara@warehouse.lk',
    capacity: '350 kg daily',
    currentLoad: '75%',
    status: 'Active',
    wasteTypes: ['Packaging', 'Cardboard', 'Mixed'],
    operatingHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    pointDetails: {
      containers: [
        { type: 'Packaging', capacity: '150 kg', currentFill: '80%', nextPickup: '2025-10-22' },
        { type: 'Cardboard', capacity: '150 kg', currentFill: '75%', nextPickup: '2025-10-22' },
        { type: 'Mixed', capacity: '50 kg', currentFill: '60%', nextPickup: '2025-10-23' }
      ],
      pickupSchedule: 'Daily pickups for packaging materials',
      processingFacility: 'Gampaha Recycling Center',
      transportProvider: 'RecycleLanka Ltd.',
      notes: 'Warehouse district with high packaging waste volume. Regular pickups maintained.'
    }
  }
];

const CollectionPoints = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedPointId, setExpandedPointId] = useState(null);
  const [wasteListings, setWasteListings] = useState([]);
  const [wasteAgents, setWasteAgents] = useState([]);
  const [wasteStats, setWasteStats] = useState({
    totalListings: 0,
    totalAgents: 0,
    statusCounts: {},
    typeCounts: {}
  });

  // Fetch waste data
  useEffect(() => {
    const fetchWasteData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching waste data for collection points dashboard...');
        
        // Use Promise.allSettled to continue even if some requests fail
        const [listings, agents, statusCounts, typeCounts] = await Promise.allSettled([
          fetchAllWasteListings(),
          fetchAllWasteAgents(),
          getWasteListingCountByStatus(),
          getWasteListingCountByType()
        ]);
        
        // Process results, using mock data as fallback
        const listingsData = listings.status === 'fulfilled' && listings.value.length > 0 
          ? listings.value 
          : [];
        const agentsData = agents.status === 'fulfilled' && agents.value.length > 0 
          ? agents.value 
          : [];
        const statusCountsData = statusCounts.status === 'fulfilled' 
          ? statusCounts.value 
          : { 'COMPLETED': 2, 'ACCEPTED': 2, 'PENDING': 2, 'CANCELLED': 0 };
        const typeCountsData = typeCounts.status === 'fulfilled' 
          ? typeCounts.value 
          : { 'Organic': 3, 'Mixed': 2, 'Packaging': 2 };
        
        console.log(`Successfully processed: ${listingsData.length} listings, ${agentsData.length} agents`);
        
        setWasteListings(listingsData);
        setWasteAgents(agentsData);
        
        setWasteStats({
          totalListings: listingsData.length || 6,
          totalAgents: agentsData.length || 3,
          statusCounts: statusCountsData,
          typeCounts: typeCountsData
        });
        
        // Always use collection points data
        setFilteredData(collectionPoints);
      } catch (error) {
        console.error("Error fetching waste data, using mock data:", error);
        // Use mock data as fallback
        setFilteredData(collectionPoints);
        setWasteStats({
          totalListings: 6,
          totalAgents: 3,
          statusCounts: { 'COMPLETED': 2, 'ACCEPTED': 2, 'PENDING': 2, 'CANCELLED': 0 },
          typeCounts: { 'Organic': 3, 'Mixed': 2, 'Packaging': 2 }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWasteData();
  }, []);

  // Handle search
  useEffect(() => {
    if (!collectionPoints) return;

    let results = collectionPoints.filter(point => {
      return Object.keys(point).some(key =>
        typeof point[key] === 'string' && point[key].toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
        (point.wasteTypes && point.wasteTypes.some(type =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    });

    setFilteredData(results);
  }, [searchTerm, collectionPoints]);

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'At Capacity', value: 'At Capacity' },
        { label: 'Maintenance', value: 'Maintenance' }
      ]
    },
    {
      name: 'wasteType',
      label: 'Waste Type',
      options: [
        { label: 'Organic', value: 'Organic' },
        { label: 'Food Waste', value: 'Food Waste' },
        { label: 'Packaging', value: 'Packaging' },
        { label: 'Agricultural', value: 'Agricultural' },
        { label: 'Mixed', value: 'Mixed' },
        { label: 'Recyclables', value: 'Recyclables' },
        { label: 'Plastic', value: 'Plastic' },
        { label: 'Cardboard', value: 'Cardboard' }
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
    if (!collectionPoints || Object.keys(selectedFilters).length === 0) {
      setFilteredData(collectionPoints);
      return;
    }

    let results = collectionPoints.filter(point => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;

        // Special case for wasteType
        if (key === 'wasteType') {
          return point.wasteTypes && point.wasteTypes.includes(value);
        }

        return point[key] === value;
      });
    });

    setFilteredData(results);
  }, [selectedFilters, collectionPoints]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Active': 'bg-pastel-green text-green-800',
      'At Capacity': 'bg-pastel-yellow text-yellow-800',
      'Maintenance': 'bg-pastel-red text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Collection Point Details Component
  const PointDetails = ({ point }) => {
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">{point.name} (ID: {point.id})</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center">
                <LocationIcon />
                <span className="ml-1">{point.address}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={point.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">COLLECTION POINT INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Manager:</span>
                <span className="font-medium">{point.manager}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium">{point.contact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{point.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Operating Hours:</span>
                <span className="font-medium">{point.operatingHours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Capacity:</span>
                <span className="font-medium">{point.capacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Load:</span>
                <span className="font-medium">{point.currentLoad}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pickup Schedule:</span>
                <span className="font-medium">{point.pointDetails.pickupSchedule}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Processing Facility:</span>
                <span className="font-medium">{point.pointDetails.processingFacility}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transport Provider:</span>
                <span className="font-medium">{point.pointDetails.transportProvider}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500 block mb-1">NOTES</span>
                <p className="text-sm bg-gray-100 p-2 rounded">{point.pointDetails.notes}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">WASTE CONTAINERS</h5>
            <div className="space-y-3">
              {point.pointDetails.containers.map((container, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{container.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${parseInt(container.currentFill) > 80 ? 'bg-pastel-red text-red-800' : parseInt(container.currentFill) > 50 ? 'bg-pastel-yellow text-yellow-800' : 'bg-pastel-green text-green-800'}`}>
                      {container.currentFill} Full
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Capacity:</span>
                      <span>{container.capacity}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Next Pickup:</span>
                      <span>{container.nextPickup}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${parseInt(container.currentFill) > 80 ? 'bg-red-500' : parseInt(container.currentFill) > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: container.currentFill }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">WASTE TYPES ACCEPTED</h5>
            <div className="flex flex-wrap gap-2">
              {point.wasteTypes.map((type, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex items-center text-sm py-1 px-3 rounded-md border border-farmio text-farmio hover:bg-farmio hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Schedule Pickup
              </button>
              <button className="flex items-center text-sm py-1 px-3 rounded-md bg-farmio text-white hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { accessor: 'id', header: 'ID' },
    { 
      accessor: 'name', 
      header: 'Collection Point',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { accessor: 'location', header: 'Location' },
    { accessor: 'capacity', header: 'Capacity' },
    { accessor: 'currentLoad', header: 'Current Load' },
    { 
      accessor: 'wasteTypes', 
      header: 'Waste Types',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((type, idx) => (
            <span key={idx} className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              {type}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    { 
      accessor: 'status', 
      header: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    { 
      accessor: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedPointId === row.id ? 'text-blue-800' : ''}`}
            title={expandedPointId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedPointId(expandedPointId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Collection Point">
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
      title="Waste Collection Points"
      breadcrumbs="Waste Management / Collection Points"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Waste Listings"
          value={wasteStats.totalListings.toString()}
          subtitle="Total waste listings"
          icon={<RecycleIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Waste Agents"
          value={wasteStats.totalAgents.toString()}
          subtitle="Available agents"
          icon={<RecycleIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Completed Listings"
          value={(wasteStats.statusCounts['COMPLETED'] || 0).toString()}
          subtitle="Successfully processed"
          icon={<RecycleIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Pending Listings"
          value={(wasteStats.statusCounts['PENDING'] || 0).toString()}
          subtitle="Needs attention"
          icon={<RecycleIcon />}
          color="red"
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
              placeholder="Search collection points by name, location, waste types..."
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

          {/* Add Collection Point Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Collection Point
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Collection Points</h3>
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

      {/* Collection Points Table */}
      <Card
        title="Waste Collection Points"
        color="green"
        icon={<RecycleIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No collection points found matching your criteria."
          expandedRowRender={(row) => <PointDetails point={row} />}
          expandedRowId={expandedPointId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default CollectionPoints;