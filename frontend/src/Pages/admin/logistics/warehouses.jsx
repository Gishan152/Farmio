import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
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

const WarehouseManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedWarehouseId, setExpandedWarehouseId] = useState(null);

  // Sample warehouses data
  const warehouses = [
    {
      id: 'WH-001',
      name: 'Central Distribution Warehouse',
      location: 'Central City Industrial Park',
      address: '123 Logistics Way, Central City, CC 10001',
      owner: 'Farmio Logistics LLC',
      contactPerson: 'James Wilson',
      contactEmail: 'jwilson@farmio.com',
      contactPhone: '+1 (555) 123-4567',
      totalCapacity: '5,000 tons',
      currentUtilization: '65%',
      temperatureZones: ['Ambient', 'Refrigerated', 'Freezer'],
      specialFeatures: ['HACCP Certified', 'Organic Certified', 'Solar Powered'],
      status: 'Active',
      warehouseDetails: {
        temperatureZones: [
          { type: 'Ambient', capacity: '2,000 tons', utilization: '70%', products: 'Dry goods, Root vegetables' },
          { type: 'Refrigerated', capacity: '2,500 tons', utilization: '55%', products: 'Fresh produce, Dairy' },
          { type: 'Freezer', capacity: '500 tons', utilization: '85%', products: 'Frozen fruits, Ice cream' }
        ],
        certifications: [
          { name: 'HACCP', validUntil: '2024-06-30', status: 'Valid' },
          { name: 'Organic', validUntil: '2024-03-15', status: 'Valid' },
          { name: 'ISO 22000', validUntil: '2024-05-22', status: 'Valid' }
        ],
        operatingHours: 'Monday-Saturday: 6:00 AM - 10:00 PM, Sunday: 8:00 AM - 4:00 PM',
        staffCount: 45,
        avgDailyIntake: '120 tons',
        avgDailyOutflow: '115 tons'
      }
    },
    {
      id: 'WH-002',
      name: 'Riverside Cold Storage',
      location: 'Riverside Industrial Zone',
      address: '456 River Road, Riverside, RS 20002',
      owner: 'CoolStore Partners',
      contactPerson: 'Elena Rodriguez',
      contactEmail: 'erodriguez@coolstore.com',
      contactPhone: '+1 (555) 234-5678',
      totalCapacity: '2,200 tons',
      currentUtilization: '78%',
      temperatureZones: ['Refrigerated', 'Freezer'],
      specialFeatures: ['Advanced Cold Chain', 'Energy Efficient', '24/7 Monitoring'],
      status: 'Active',
      warehouseDetails: {
        temperatureZones: [
          { type: 'Refrigerated', capacity: '1,500 tons', utilization: '82%', products: 'Dairy, Meat, Seafood' },
          { type: 'Freezer', capacity: '700 tons', utilization: '70%', products: 'Frozen products, Ice' }
        ],
        certifications: [
          { name: 'HACCP', validUntil: '2025-01-15', status: 'Valid' },
          { name: 'BRC', validUntil: '2024-09-30', status: 'Valid' }
        ],
        operatingHours: '24/7 Operation',
        staffCount: 28,
        avgDailyIntake: '85 tons',
        avgDailyOutflow: '80 tons'
      }
    },
    {
      id: 'WH-003',
      name: 'Greenfield Organic Storage',
      location: 'Greenfield Agricultural Zone',
      address: '789 Organic Lane, Greenfield, GF 30003',
      owner: 'Eco Storage Solutions',
      contactPerson: 'David Greenway',
      contactEmail: 'dgreenway@ecostorage.com',
      contactPhone: '+1 (555) 345-6789',
      totalCapacity: '1,800 tons',
      currentUtilization: '45%',
      temperatureZones: ['Ambient', 'Refrigerated'],
      specialFeatures: ['100% Renewable Energy', 'Organic Certified', 'Zero Waste'],
      status: 'Active',
      warehouseDetails: {
        temperatureZones: [
          { type: 'Ambient', capacity: '1,200 tons', utilization: '40%', products: 'Grains, Dried fruits, Nuts' },
          { type: 'Refrigerated', capacity: '600 tons', utilization: '55%', products: 'Organic produce, Fresh herbs' }
        ],
        certifications: [
          { name: 'Organic', validUntil: '2024-11-12', status: 'Valid' },
          { name: 'LEED Platinum', validUntil: '2030-01-01', status: 'Valid' },
          { name: 'Regenerative Organic', validUntil: '2024-08-18', status: 'Valid' }
        ],
        operatingHours: 'Monday-Friday: 7:00 AM - 8:00 PM',
        staffCount: 22,
        avgDailyIntake: '40 tons',
        avgDailyOutflow: '35 tons'
      }
    },
    {
      id: 'WH-004',
      name: 'Mountain Valley Storage',
      location: 'Mountain Valley Region',
      address: '101 Mountain Way, Valley Town, VT 40004',
      owner: 'Highland Storage Co.',
      contactPerson: 'Maria Lopez',
      contactEmail: 'mlopez@highland.com',
      contactPhone: '+1 (555) 456-7890',
      totalCapacity: '1,500 tons',
      currentUtilization: '90%',
      temperatureZones: ['Ambient', 'Climate Controlled'],
      specialFeatures: ['Altitude Optimized', 'Humidity Control', 'Local Farm Focus'],
      status: 'Maintenance',
      warehouseDetails: {
        temperatureZones: [
          { type: 'Ambient', capacity: '900 tons', utilization: '95%', products: 'Root vegetables, Local produce' },
          { type: 'Climate Controlled', capacity: '600 tons', utilization: '82%', products: 'Specialty products, Apples' }
        ],
        certifications: [
          { name: 'Local Farm Alliance', validUntil: '2024-12-31', status: 'Valid' },
          { name: 'HACCP', validUntil: '2023-12-20', status: 'Expiring Soon' }
        ],
        operatingHours: 'Monday-Saturday: 6:00 AM - 9:00 PM',
        staffCount: 18,
        avgDailyIntake: '30 tons',
        avgDailyOutflow: '28 tons'
      }
    },
    {
      id: 'WH-005',
      name: 'Metro Express Distribution',
      location: 'Metropolitan Area',
      address: '202 Urban Blvd, Metro City, MC 50005',
      owner: 'MetroEx Partners',
      contactPerson: 'Robert Zhang',
      contactEmail: 'rzhang@metroex.com',
      contactPhone: '+1 (555) 567-8901',
      totalCapacity: '3,800 tons',
      currentUtilization: '85%',
      temperatureZones: ['Ambient', 'Refrigerated', 'Freezer'],
      specialFeatures: ['Rapid Distribution', 'Urban Last Mile', '24/7 Operation'],
      status: 'Active',
      warehouseDetails: {
        temperatureZones: [
          { type: 'Ambient', capacity: '1,800 tons', utilization: '90%', products: 'Packaged goods, Non-perishables' },
          { type: 'Refrigerated', capacity: '1,500 tons', utilization: '80%', products: 'Urban market produce, Prepared foods' },
          { type: 'Freezer', capacity: '500 tons', utilization: '85%', products: 'Frozen meals, Ice cream' }
        ],
        certifications: [
          { name: 'HACCP', validUntil: '2024-09-15', status: 'Valid' },
          { name: 'ISO 9001', validUntil: '2024-05-28', status: 'Valid' }
        ],
        operatingHours: '24/7 Operation',
        staffCount: 65,
        avgDailyIntake: '200 tons',
        avgDailyOutflow: '195 tons'
      }
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(warehouses);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!warehouses) return;
    
    let results = warehouses.filter(warehouse => {
      return Object.keys(warehouse).some(key => 
        typeof warehouse[key] === 'string' && warehouse[key].toLowerCase().includes(searchTerm.toLowerCase())
      ) || 
      (warehouse.temperatureZones && warehouse.temperatureZones.some(zone => 
        zone.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      (warehouse.specialFeatures && warehouse.specialFeatures.some(feature => 
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    });
    
    setFilteredData(results);
  }, [searchTerm, warehouses]);

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Inactive', value: 'Inactive' }
      ]
    },
    {
      name: 'temperatureZone',
      label: 'Temperature Zone',
      options: [
        { label: 'Ambient', value: 'Ambient' },
        { label: 'Refrigerated', value: 'Refrigerated' },
        { label: 'Freezer', value: 'Freezer' },
        { label: 'Climate Controlled', value: 'Climate Controlled' }
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
    if (!warehouses || Object.keys(selectedFilters).length === 0) {
      setFilteredData(warehouses);
      return;
    }
    
    let results = warehouses.filter(warehouse => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        // Special case for temperatureZone
        if (key === 'temperatureZone') {
          return warehouse.temperatureZones && warehouse.temperatureZones.includes(value);
        }
        
        return warehouse[key] === value;
      });
    });
    
    setFilteredData(results);
  }, [selectedFilters, warehouses]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Active': 'bg-pastel-green text-green-800',
      'Maintenance': 'bg-pastel-yellow text-yellow-800',
      'Inactive': 'bg-pastel-red text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Warehouse Details Component
  const WarehouseDetails = ({ warehouse }) => {
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">{warehouse.name} (ID: {warehouse.id})</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center">
                <LocationIcon />
                <span className="ml-1">{warehouse.location}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={warehouse.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">WAREHOUSE INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium">{warehouse.address}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Owner:</span>
                <span className="font-medium">{warehouse.owner}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact Person:</span>
                <span className="font-medium">{warehouse.contactPerson}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{warehouse.contactEmail}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{warehouse.contactPhone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Capacity:</span>
                <span className="font-medium">{warehouse.totalCapacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Utilization:</span>
                <span className="font-medium">{warehouse.currentUtilization}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Operating Hours:</span>
                <span className="font-medium">{warehouse.warehouseDetails.operatingHours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Staff Count:</span>
                <span className="font-medium">{warehouse.warehouseDetails.staffCount}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">TEMPERATURE ZONES</h5>
            <div className="space-y-3">
              {warehouse.warehouseDetails.temperatureZones.map((zone, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{zone.type}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{zone.utilization} Used</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Capacity: {zone.capacity}</div>
                  <div className="mt-1 text-xs text-gray-500">Products: {zone.products}</div>
                </div>
              ))}
            </div>
            
            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">CERTIFICATIONS</h5>
            <div className="space-y-2">
              {warehouse.warehouseDetails.certifications.map((cert, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{cert.name}</span>
                  <span className={`${cert.status === 'Valid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {cert.status} until {cert.validUntil}
                  </span>
                </div>
              ))}
            </div>
            
            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">SPECIAL FEATURES</h5>
            <div className="flex flex-wrap gap-2">
              {warehouse.specialFeatures.map((feature, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'ID' },
    { 
      key: 'name', 
      header: 'Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { key: 'location', header: 'Location' },
    { key: 'totalCapacity', header: 'Capacity' },
    { key: 'currentUtilization', header: 'Utilization' },
    { 
      key: 'temperatureZones', 
      header: 'Temp. Zones',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.map((zone, idx) => (
            <span key={idx} className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              {zone}
            </span>
          ))}
        </div>
      )
    },
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
            className={`text-blue-600 hover:text-blue-800 ${expandedWarehouseId === row.id ? 'text-blue-800' : ''}`}
            title={expandedWarehouseId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedWarehouseId(expandedWarehouseId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Warehouse">
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
      title="Warehouse Management"
      breadcrumbs="Logistics / Warehouses"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Warehouses"
          value={warehouses.length.toString()}
          subtitle="All locations"
          icon={<WarehouseIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Capacity"
          value="14,300 tons"
          subtitle="Combined storage"
          icon={<WarehouseIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Average Utilization"
          value="72.6%"
          subtitle="Across all warehouses"
          icon={<WarehouseIcon />}
          color="purple"
          isLoading={isLoading}
        />
        <StatCard 
          title="Cold Storage"
          value="5,800 tons"
          subtitle="Refrigerated & freezer"
          icon={<WarehouseIcon />}
          color="cyan"
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
              placeholder="Search warehouses by name, location, features..."
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

          {/* Add Warehouse Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Warehouse
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Warehouses</h3>
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

      {/* Warehouses Table */}
      <Card
        title="Warehouse Facilities"
        color="blue"
        icon={<WarehouseIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No warehouses found matching your criteria."
          expandedRowRender={(row) => <WarehouseDetails warehouse={row} />}
          expandedRowId={expandedWarehouseId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default WarehouseManagement;
