import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const DeliveryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

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

// Sample delivery data
const deliveries = [
  {
    id: 'DEL-5023',
    orderId: 'ORD-10043',
    customer: 'Wholesome Foods Co-op',
    customerLocation: '123 Green St, Farmville',
    driver: 'John Smith',
    transport: 'Rural Routes Delivery',
    vehicle: 'TRK-104 (Ford F-150)',
    scheduledDate: '2023-06-22',
    estimatedArrival: '10:30 AM',
    status: 'In Transit',
    trackingLink: 'https://track.ruralroutes.com/DEL-5023',
    orderItems: [
      { product: 'Strawberries', quantity: '20 kg' },
      { product: 'Blueberries', quantity: '15 kg' },
      { product: 'Blackberries', quantity: '10 kg' },
      { product: 'Raspberries', quantity: '8 kg' }
    ],
    notes: 'Customer requested delivery at back entrance.'
  },
  {
    id: 'DEL-5022',
    orderId: 'ORD-10042',
    customer: 'Green Smoothie Cafes',
    customerLocation: '456 Orchard Ave, Greenfield',
    driver: 'Maria Rodriguez',
    transport: 'Fast Track Logistics',
    vehicle: 'TRK-078 (Mercedes Sprinter)',
    scheduledDate: '2023-06-21',
    estimatedArrival: '9:15 AM',
    status: 'Delivered',
    trackingLink: 'https://track.fasttrack.com/DEL-5022',
    orderItems: [
      { product: 'Organic Spinach', quantity: '25 kg' },
      { product: 'Kale', quantity: '15 kg' },
      { product: 'Fresh Mint', quantity: '10 kg' }
    ],
    notes: 'Delivery confirmed and signed by manager Alex.'
  },
  {
    id: 'DEL-5021',
    orderId: 'ORD-10041',
    customer: 'Sunrise Grocery Store',
    customerLocation: '789 Market St, Harvest Hills',
    driver: 'David Wilson',
    transport: 'Swift Stream Logistics',
    vehicle: 'TRK-112 (Isuzu NPR)',
    scheduledDate: '2023-06-20',
    estimatedArrival: '8:45 AM',
    status: 'Delivered',
    trackingLink: 'https://track.swiftstream.com/DEL-5021',
    orderItems: [
      { product: 'Various Vegetables', quantity: '15 items, 500 kg total' }
    ],
    notes: 'Delivery completed ahead of schedule. All items accepted.'
  },
  {
    id: 'DEL-5024',
    orderId: 'ORD-10044',
    customer: 'Farm to Table Restaurants',
    customerLocation: '321 Culinary Blvd, Tastytown',
    driver: 'Robert Chen',
    transport: 'Green Mile Transports',
    vehicle: 'TRK-089 (Refrigerated Van)',
    scheduledDate: '2023-06-24',
    estimatedArrival: '11:00 AM',
    status: 'Scheduled',
    trackingLink: 'https://track.greenmile.com/DEL-5024',
    orderItems: [
      { product: 'Various Fresh Products', quantity: '7 items, 185 kg total' }
    ],
    notes: 'Temperature-controlled delivery required. Call customer 15 minutes before arrival.'
  },
  {
    id: 'DEL-5025',
    orderId: 'ORD-10045',
    customer: 'Fresh Foods Market',
    customerLocation: '567 Produce Lane, Freshville',
    driver: 'To be assigned',
    transport: 'Fast Track Logistics',
    vehicle: 'Not assigned yet',
    scheduledDate: '2023-06-25',
    estimatedArrival: 'TBD',
    status: 'Preparing',
    trackingLink: 'https://track.fasttrack.com/DEL-5025',
    orderItems: [
      { product: 'Various Produce', quantity: '8 items, 395 kg total' }
    ],
    notes: 'Large order requires special handling. Waiting for warehouse confirmation.'
  }
];

// Filter options
const filters = [
  {
    name: 'transport',
    label: 'Transport Provider',
    options: [
      { label: 'Fast Track Logistics', value: 'Fast Track Logistics' },
      { label: 'Green Mile Transports', value: 'Green Mile Transports' },
      { label: 'Rural Routes Delivery', value: 'Rural Routes Delivery' },
      { label: 'Swift Stream Logistics', value: 'Swift Stream Logistics' }
    ]
  },
  {
    name: 'scheduledDate',
    label: 'Delivery Date',
    options: [
      { label: '2023-06-20', value: '2023-06-20' },
      { label: '2023-06-21', value: '2023-06-21' },
      { label: '2023-06-22', value: '2023-06-22' },
      { label: '2023-06-24', value: '2023-06-24' },
      { label: '2023-06-25', value: '2023-06-25' }
    ]
  }
];

const Deliveries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedDeliveryId, setExpandedDeliveryId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(deliveries);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!deliveries) return;

    let results = deliveries.filter(delivery => {
      return Object.keys(delivery).some(key =>
        typeof delivery[key] === 'string' && delivery[key].toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Apply tab filtering
    if (selectedTab !== 'all') {
      results = results.filter(delivery => delivery.status.toLowerCase().replace(' ', '-') === selectedTab);
    }

    setFilteredData(results);
  }, [searchTerm, selectedTab, deliveries]);

  // Get counts for different statuses
  const getStatusCounts = () => {
    const counts = {
      all: deliveries.length,
      'in-transit': deliveries.filter(d => d.status === 'In Transit').length,
      scheduled: deliveries.filter(d => d.status === 'Scheduled').length,
      preparing: deliveries.filter(d => d.status === 'Preparing').length,
      delivered: deliveries.filter(d => d.status === 'Delivered').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  useEffect(() => {
    if (!deliveries || Object.keys(selectedFilters).length === 0) {
      let filtered = deliveries;
      if (selectedTab !== 'all') {
        filtered = deliveries?.filter(delivery => delivery.status.toLowerCase().replace(' ', '-') === selectedTab);
      }
      setFilteredData(filtered);
      return;
    }

    let results = deliveries.filter(delivery => {
      const statusFilter = selectedTab === 'all' || delivery.status.toLowerCase().replace(' ', '-') === selectedTab;

      const otherFilters = Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return delivery[key] === value;
      });

      return statusFilter && otherFilters;
    });

    setFilteredData(results);
  }, [selectedFilters, selectedTab, deliveries]);

  // Delivery status badge
  const DeliveryStatusBadge = ({ status }) => {
    const statusStyles = {
      'Delivered': 'bg-pastel-green text-green-800',
      'In Transit': 'bg-pastel-blue text-blue-800',
      'Scheduled': 'bg-purple-100 text-purple-800',
      'Preparing': 'bg-pastel-yellow text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Delivery Details Component
  const DeliveryDetails = ({ delivery }) => {
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Delivery Details - {delivery.id}</h4>
            <p className="text-xs text-gray-500">Order: {delivery.orderId} | Customer: {delivery.customer}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">DELIVERY INFO</h5>
            <table className="text-sm">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Transport:</td>
                  <td className="py-1 font-medium">{delivery.transport}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Driver:</td>
                  <td className="py-1 font-medium">{delivery.driver}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Vehicle:</td>
                  <td className="py-1 font-medium">{delivery.vehicle}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Scheduled:</td>
                  <td className="py-1 font-medium">{delivery.scheduledDate} at {delivery.estimatedArrival}</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-gray-500">Notes:</td>
                  <td className="py-1 font-medium">{delivery.notes}</td>
                </tr>
              </tbody>
            </table>

            {delivery.trackingLink && (
              <a
                href={delivery.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center px-3 py-1 text-sm text-white bg-farmio rounded-md hover:bg-green-600"
              >
                <MapIcon />
                <span className="ml-2">Track Delivery</span>
              </a>
            )}
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">ORDER ITEMS</h5>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-xs text-left text-gray-500 bg-gray-100">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {delivery.orderItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="px-4 py-2 font-medium">{item.product}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
              <p className="text-xs text-gray-500">Delivery Address:</p>
              <p className="text-sm font-medium">{delivery.customerLocation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Delivery ID' },
    { key: 'orderId', header: 'Order ID' },
    {
      key: 'customer',
      header: 'Customer',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { key: 'transport', header: 'Transport' },
    { key: 'scheduledDate', header: 'Delivery Date' },
    { key: 'estimatedArrival', header: 'ETA' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <DeliveryStatusBadge status={value} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className={`text-blue-600 hover:text-blue-800 ${expandedDeliveryId === row.id ? 'text-blue-800' : ''}`}
            title={expandedDeliveryId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedDeliveryId(expandedDeliveryId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {row.trackingLink && (
            <a
              href={row.trackingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Track Delivery"
            >
              <MapIcon />
            </a>
          )}
          <button className="text-indigo-600 hover:text-indigo-800" title="Print Delivery Note">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Deliveries Management"
      breadcrumbs="Orders / Deliveries"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Deliveries"
          value={statusCounts.all.toString()}
          subtitle="This month"
          icon={<TruckIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="In Transit"
          value={statusCounts['in-transit'].toString()}
          subtitle="On the road"
          icon={<DeliveryIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Scheduled"
          value={statusCounts.scheduled.toString()}
          subtitle="Coming up"
          icon={<DeliveryIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard
          title="Delivered"
          value={statusCounts.delivered.toString()}
          subtitle="Completed"
          icon={<DeliveryIcon />}
          color="green"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-dashboard-border mb-6">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'all'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          All Deliveries ({statusCounts.all})
        </button>
        <button
          onClick={() => setSelectedTab('in-transit')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'in-transit'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          In Transit ({statusCounts['in-transit']})
        </button>
        <button
          onClick={() => setSelectedTab('scheduled')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'scheduled'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          Scheduled ({statusCounts.scheduled})
        </button>
        <button
          onClick={() => setSelectedTab('preparing')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'preparing'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          Preparing ({statusCounts.preparing})
        </button>
        <button
          onClick={() => setSelectedTab('delivered')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${selectedTab === 'delivered'
            ? 'border-farmio text-farmio'
            : 'border-transparent text-dashboard-text-secondary hover:text-dashboard-text-primary'
            }`}
        >
          Delivered ({statusCounts.delivered})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search deliveries by ID, customer, driver..."
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

          {/* Create Delivery Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Delivery
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Deliveries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Deliveries Table */}
      <Card
        title={`${selectedTab === 'all' ? 'All Deliveries' :
          selectedTab === 'in-transit' ? 'In Transit Deliveries' :
            selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1) + ' Deliveries'}`}
        color={
          selectedTab === 'in-transit' ? 'blue' :
            selectedTab === 'scheduled' ? 'purple' :
              selectedTab === 'preparing' ? 'yellow' :
                selectedTab === 'delivered' ? 'green' : 'blue'
        }
        icon={<TruckIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No deliveries found matching your criteria."
          expandedRowRender={(row) => <DeliveryDetails delivery={row} />}
          expandedRowId={expandedDeliveryId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default Deliveries;
