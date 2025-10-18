import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';
import { 
  fetchAllWasteListings, 
  fetchAllWasteAgents, 
  getWasteListingCountByStatus,
  formatWasteStatus,
  getWasteStatusColor
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

const WasteListings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedListingId, setExpandedListingId] = useState(null);
  const [wasteListings, setWasteListings] = useState([]);
  const [wasteAgents, setWasteAgents] = useState([]);
  const [wasteStats, setWasteStats] = useState({
    totalListings: 0,
    totalAgents: 0,
    statusCounts: {},
  });

  // Fetch waste data
  useEffect(() => {
    const fetchWasteData = async () => {
      setIsLoading(true);
      try {
        const [listings, agents, statusCounts] = await Promise.all([
          fetchAllWasteListings(),
          fetchAllWasteAgents(),
          getWasteListingCountByStatus()
        ]);
        
        setWasteListings(listings || []);
        setWasteAgents(agents || []);
        setFilteredData(listings || []);
        
        setWasteStats({
          totalListings: listings?.length || 0,
          totalAgents: agents?.length || 0,
          statusCounts: statusCounts || {},
        });
      } catch (error) {
        console.error("Error fetching waste data:", error);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWasteData();
  }, []);

  // Handle search
  useEffect(() => {
    if (!wasteListings || wasteListings.length === 0) return;

    let results = wasteListings.filter(listing => {
      return (
        (listing.wasteType && listing.wasteType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.status && listing.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (listing.requester && listing.requester.name && 
         listing.requester.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredData(results);
  }, [searchTerm, wasteListings]);

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Accepted', value: 'ACCEPTED' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELLED' }
      ]
    },
    {
      name: 'wasteType',
      label: 'Waste Type',
      options: [
        { label: 'Organic', value: 'ORGANIC' },
        { label: 'Mixed', value: 'MIXED' },
        { label: 'Recyclable', value: 'RECYCLABLE' },
        { label: 'Packaging', value: 'PACKAGING' }
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
    if (!wasteListings || wasteListings.length === 0 || Object.keys(selectedFilters).length === 0) {
      setFilteredData(wasteListings);
      return;
    }

    let results = wasteListings.filter(listing => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;

        if (key === 'wasteType') {
          return listing.wasteType === value;
        }

        return listing[key] === value;
      });
    });

    setFilteredData(results);
  }, [selectedFilters, wasteListings]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Waste Listing Details Component
  const ListingDetails = ({ listing }) => {
    if (!listing) return null;
    
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">{listing.wasteType} Waste (ID: {listing.id})</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center">
                <LocationIcon />
                <span className="ml-1">{listing.requester?.location || 'No location specified'}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={listing.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">WASTE LISTING INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Requester:</span>
                <span className="font-medium">{listing.requester?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Requester Role:</span>
                <span className="font-medium">{listing.requester?.role || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Waste Type:</span>
                <span className="font-medium">{listing.wasteType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity:</span>
                <span className="font-medium">{listing.quantity} {listing.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price Per Unit:</span>
                <span className="font-medium">${listing.pricePerUnit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Price:</span>
                <span className="font-medium">${listing.totalPrice || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time Slot:</span>
                <span className="font-medium">{listing.timeSlot || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available From:</span>
                <span className="font-medium">{listing.availableFrom || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires On:</span>
                <span className="font-medium">{listing.expiresOn || 'N/A'}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500 block mb-1">DESCRIPTION</span>
                <p className="text-sm bg-gray-100 p-2 rounded">{listing.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ACTIONS</h5>
            <div className="space-y-3">
              <div className="p-3 bg-white border border-gray-200 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Current Status</span>
                  <StatusBadge status={listing.status} />
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex items-center text-sm py-1 px-3 rounded-md border border-farmio text-farmio hover:bg-farmio hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Assign Agent
                </button>
                <button className="flex items-center text-sm py-1 px-3 rounded-md bg-farmio text-white hover:bg-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Update Status
                </button>
              </div>
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">ASSIGNED AGENT</h5>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              {listing.acceptedBy ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Agent ID:</span>
                    <span className="font-medium">{listing.acceptedBy}</span>
                  </div>
                  {/* Additional agent info would go here if available */}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No agent assigned yet</div>
              )}
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
      accessor: 'wasteType', 
      header: 'Waste Type',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { 
      accessor: 'requester', 
      header: 'Requester',
      render: (value) => (
        <div>{value?.name || 'Unknown'}</div>
      )
    },
    { 
      accessor: 'quantity', 
      header: 'Quantity',
      render: (value, row) => (
        <div>{value} {row.unit}</div>
      )
    },
    { 
      accessor: 'pricePerUnit', 
      header: 'Price',
      render: (value) => (
        <div>${value}</div>
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
            className={`text-blue-600 hover:text-blue-800 ${expandedListingId === row.id ? 'text-blue-800' : ''}`}
            title={expandedListingId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedListingId(expandedListingId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Listing">
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
      title="Waste Listings"
      breadcrumbs="Waste Management / Listings"
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
              placeholder="Search waste listings by type, description, or status..."
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

          {/* Add Waste Listing Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Waste Listing
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Waste Listings</h3>
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

      {/* Waste Listings Table */}
      <Card
        title="Waste Listings"
        color="green"
        icon={<RecycleIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No waste listings found matching your criteria."
          expandedRowRender={(row) => <ListingDetails listing={row} />}
          expandedRowId={expandedListingId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default WasteListings;