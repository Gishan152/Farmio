import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const ProcessingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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

// Sample processing facilities data
const facilities = [
  {
    id: 'PF-001',
    name: 'Green Valley Recycling Center',
    location: 'Green Valley Industrial Zone',
    address: '123 Recycle Way, Green Valley, GV 10001',
    manager: 'John Smith',
    contact: '+1 (555) 123-4567',
    email: 'jsmith@greenvalley.com',
    processingCapacity: '50 tons daily',
    currentUtilization: '80%',
    status: 'Operational',
    wasteTypes: ['Organic', 'Packaging', 'Mixed'],
    operatingHours: 'Mon-Sat: 6:00 AM - 8:00 PM',
    outputProducts: ['Compost', 'Biogas', 'Recycled Materials'],
    facilityDetails: {
      processes: [
        { name: 'Organic Composting', capacity: '30 tons', utilization: '85%', outputType: 'Organic Compost' },
        { name: 'Material Sorting', capacity: '15 tons', utilization: '75%', outputType: 'Sorted Recyclables' },
        { name: 'Anaerobic Digestion', capacity: '5 tons', utilization: '70%', outputType: 'Biogas' }
      ],
      equipment: [
        { name: 'Industrial Composter', status: 'Operational', lastMaintenance: '2023-05-15', nextMaintenance: '2023-08-15' },
        { name: 'Sorting Line', status: 'Operational', lastMaintenance: '2023-06-01', nextMaintenance: '2023-09-01' },
        { name: 'Biodigester', status: 'Operational', lastMaintenance: '2023-04-20', nextMaintenance: '2023-07-20' }
      ],
      certifications: ['ISO 14001', 'Organic Processing Certified', 'Zero Waste Certified'],
      notes: 'Main processing facility handling the bulk of organic waste from central markets. Currently operating near capacity for organic waste processing.'
    }
  },
  {
    id: 'PF-002',
    name: 'River Basin Composting Facility',
    location: 'Riverside Agricultural Area',
    address: '456 Farm Road, Riverside, RS 20002',
    manager: 'Emma Johnson',
    contact: '+1 (555) 234-5678',
    email: 'ejohnson@riverbasin.org',
    processingCapacity: '25 tons daily',
    currentUtilization: '60%',
    status: 'Operational',
    wasteTypes: ['Organic', 'Agricultural'],
    operatingHours: 'Mon-Fri: 7:00 AM - 6:00 PM',
    outputProducts: ['Premium Compost', 'Soil Amendments'],
    facilityDetails: {
      processes: [
        { name: 'Windrow Composting', capacity: '15 tons', utilization: '65%', outputType: 'Agricultural Compost' },
        { name: 'Vermiculture', capacity: '5 tons', utilization: '50%', outputType: 'Worm Castings' },
        { name: 'Compost Tea Production', capacity: '5 tons', utilization: '60%', outputType: 'Liquid Fertilizer' }
      ],
      equipment: [
        { name: 'Compost Turner', status: 'Operational', lastMaintenance: '2023-05-10', nextMaintenance: '2023-08-10' },
        { name: 'Screening Equipment', status: 'Maintenance Required', lastMaintenance: '2023-03-15', nextMaintenance: '2023-06-15' },
        { name: 'Aeration System', status: 'Operational', lastMaintenance: '2023-05-30', nextMaintenance: '2023-08-30' }
      ],
      certifications: ['Organic Processing Certified', 'Sustainable Agriculture Partner'],
      notes: 'Specialized in agricultural waste processing. Produces premium compost sold back to local farms. Screening equipment requires maintenance soon.'
    }
  },
  {
    id: 'PF-003',
    name: 'Metro Recycling Industries',
    location: 'Metro Industrial Park',
    address: '789 Industry Blvd, Metro City, MC 30003',
    manager: 'Michael Chen',
    contact: '+1 (555) 345-6789',
    email: 'mchen@metrorecycle.com',
    processingCapacity: '70 tons daily',
    currentUtilization: '85%',
    status: 'Operational',
    wasteTypes: ['Packaging', 'Plastic', 'Cardboard', 'Paper', 'Mixed'],
    operatingHours: 'Mon-Sun: 24 hours',
    outputProducts: ['Recycled Materials', 'Raw Materials for Manufacturing'],
    facilityDetails: {
      processes: [
        { name: 'Material Sorting', capacity: '30 tons', utilization: '90%', outputType: 'Sorted Materials' },
        { name: 'Plastic Processing', capacity: '20 tons', utilization: '80%', outputType: 'Plastic Pellets' },
        { name: 'Cardboard Processing', capacity: '20 tons', utilization: '85%', outputType: 'Pulp' }
      ],
      equipment: [
        { name: 'Automated Sorting Line', status: 'Operational', lastMaintenance: '2023-06-05', nextMaintenance: '2023-09-05' },
        { name: 'Plastic Shredder', status: 'Operational', lastMaintenance: '2023-05-25', nextMaintenance: '2023-08-25' },
        { name: 'Cardboard Pulper', status: 'Operational', lastMaintenance: '2023-06-10', nextMaintenance: '2023-09-10' }
      ],
      certifications: ['ISO 9001', 'ISO 14001', 'Recycling Industry Standard'],
      notes: 'High volume industrial recycling facility. Main processor for packaging materials from distribution centers. Operating at high capacity.'
    }
  },
  {
    id: 'PF-004',
    name: 'Urban Biogas Plant',
    location: 'Urban Eastern District',
    address: '101 Energy Way, Metro City, MC 30004',
    manager: 'Sarah Williams',
    contact: '+1 (555) 456-7890',
    email: 'swilliams@urbanbiogas.com',
    processingCapacity: '20 tons daily',
    currentUtilization: '75%',
    status: 'Operational',
    wasteTypes: ['Food Waste', 'Organic'],
    operatingHours: 'Mon-Sun: 24 hours',
    outputProducts: ['Biogas', 'Electricity', 'Liquid Fertilizer'],
    facilityDetails: {
      processes: [
        { name: 'Anaerobic Digestion', capacity: '15 tons', utilization: '80%', outputType: 'Biogas' },
        { name: 'Energy Generation', capacity: '5 tons', utilization: '60%', outputType: 'Electricity' },
        { name: 'Digestate Processing', capacity: '5 tons', utilization: '70%', outputType: 'Liquid Fertilizer' }
      ],
      equipment: [
        { name: 'Biodigesters', status: 'Operational', lastMaintenance: '2023-05-20', nextMaintenance: '2023-08-20' },
        { name: 'Gas Cleaning System', status: 'Operational', lastMaintenance: '2023-06-01', nextMaintenance: '2023-09-01' },
        { name: 'Generator', status: 'Operational', lastMaintenance: '2023-05-15', nextMaintenance: '2023-08-15' }
      ],
      certifications: ['Renewable Energy Certified', 'Clean Energy Producer'],
      notes: 'Specialized facility converting food waste to energy. Supplies electricity back to the grid and produces liquid fertilizer as a byproduct.'
    }
  },
  {
    id: 'PF-005',
    name: 'Highland Recycling Cooperative',
    location: 'Highland Community',
    address: '202 Community Circle, Highland, HV 50005',
    manager: 'David Martinez',
    contact: '+1 (555) 567-8901',
    email: 'dmartinez@highlandcoop.org',
    processingCapacity: '5 tons daily',
    currentUtilization: '40%',
    status: 'Maintenance',
    wasteTypes: ['Organic', 'Recyclables', 'Mixed'],
    operatingHours: 'Mon-Fri: 8:00 AM - 4:00 PM',
    outputProducts: ['Community Compost', 'Recycled Craft Materials'],
    facilityDetails: {
      processes: [
        { name: 'Community Composting', capacity: '3 tons', utilization: '45%', outputType: 'Compost' },
        { name: 'Material Recovery', capacity: '2 tons', utilization: '30%', outputType: 'Recycled Materials' }
      ],
      equipment: [
        { name: 'Small-Scale Composter', status: 'Under Maintenance', lastMaintenance: '2023-01-15', nextMaintenance: '2023-06-25' },
        { name: 'Manual Sorting Station', status: 'Operational', lastMaintenance: '2023-05-01', nextMaintenance: '2023-08-01' }
      ],
      certifications: ['Community Supported Recycling', 'Local Sustainability Partner'],
      notes: 'Community-run cooperative recycling center. Currently undergoing maintenance and upgrades to the composting system. Limited operations until June 30.'
    }
  }
];

const WasteProcessing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedFacilityId, setExpandedFacilityId] = useState(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(facilities);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!facilities) return;

    let results = facilities.filter(facility => {
      return Object.keys(facility).some(key =>
        typeof facility[key] === 'string' && facility[key].toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
        (facility.wasteTypes && facility.wasteTypes.some(type =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (facility.outputProducts && facility.outputProducts.some(product =>
          product.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    });

    setFilteredData(results);
  }, [searchTerm, facilities]);

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Operational', value: 'Operational' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Offline', value: 'Offline' }
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
        { label: 'Cardboard', value: 'Cardboard' },
        { label: 'Paper', value: 'Paper' }
      ]
    },
    {
      name: 'outputProduct',
      label: 'Output Product',
      options: [
        { label: 'Compost', value: 'Compost' },
        { label: 'Biogas', value: 'Biogas' },
        { label: 'Recycled Materials', value: 'Recycled Materials' },
        { label: 'Electricity', value: 'Electricity' },
        { label: 'Soil Amendments', value: 'Soil Amendments' }
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
    if (!facilities || Object.keys(selectedFilters).length === 0) {
      setFilteredData(facilities);
      return;
    }

    let results = facilities.filter(facility => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;

        // Special case for wasteType
        if (key === 'wasteType') {
          return facility.wasteTypes && facility.wasteTypes.includes(value);
        }

        // Special case for outputProduct
        if (key === 'outputProduct') {
          return facility.outputProducts && facility.outputProducts.includes(value);
        }

        return facility[key] === value;
      });
    });

    setFilteredData(results);
  }, [selectedFilters, facilities]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Operational': 'bg-pastel-green text-green-800',
      'Maintenance': 'bg-pastel-yellow text-yellow-800',
      'Offline': 'bg-pastel-red text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Equipment status badge
  const EquipmentStatusBadge = ({ status }) => {
    const statusStyles = {
      'Operational': 'bg-pastel-green text-green-800',
      'Maintenance Required': 'bg-pastel-yellow text-yellow-800',
      'Under Maintenance': 'bg-pastel-yellow text-yellow-800',
      'Offline': 'bg-pastel-red text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Processing Facility Details Component
  const FacilityDetails = ({ facility }) => {
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">{facility.name} (ID: {facility.id})</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center">
                <LocationIcon />
                <span className="ml-1">{facility.address}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={facility.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">FACILITY INFORMATION</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Manager:</span>
                <span className="font-medium">{facility.manager}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contact:</span>
                <span className="font-medium">{facility.contact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{facility.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Operating Hours:</span>
                <span className="font-medium">{facility.operatingHours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Processing Capacity:</span>
                <span className="font-medium">{facility.processingCapacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Current Utilization:</span>
                <span className="font-medium">{facility.currentUtilization}</span>
              </div>
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">CERTIFICATIONS</h5>
            <div className="flex flex-wrap gap-2">
              {facility.facilityDetails.certifications.map((cert, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {cert}
                </span>
              ))}
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">WASTE TYPES PROCESSED</h5>
            <div className="flex flex-wrap gap-2">
              {facility.wasteTypes.map((type, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">OUTPUT PRODUCTS</h5>
            <div className="flex flex-wrap gap-2">
              {facility.outputProducts.map((product, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {product}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-medium text-gray-500 mb-2">NOTES</h5>
              <p className="text-sm bg-white p-3 border border-gray-200 rounded-md">{facility.facilityDetails.notes}</p>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">PROCESSING OPERATIONS</h5>
            <div className="space-y-3">
              {facility.facilityDetails.processes.map((process, index) => (
                <div key={index} className="p-3 bg-white border border-gray-200 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{process.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {process.utilization} Utilized
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Capacity:</span>
                      <span>{process.capacity} daily</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Output:</span>
                      <span>{process.outputType}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${parseInt(process.utilization) > 80 ? 'bg-red-500' : parseInt(process.utilization) > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: process.utilization }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">EQUIPMENT STATUS</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Maintenance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facility.facilityDetails.equipment.map((equip, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{equip.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <EquipmentStatusBadge status={equip.status} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{equip.nextMaintenance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex items-center text-sm py-1 px-3 rounded-md border border-farmio text-farmio hover:bg-farmio hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Schedule Maintenance
              </button>
              <button className="flex items-center text-sm py-1 px-3 rounded-md bg-farmio text-white hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Production Reports
              </button>
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
      header: 'Facility Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    { key: 'location', header: 'Location' },
    { key: 'processingCapacity', header: 'Capacity' },
    { key: 'currentUtilization', header: 'Utilization' },
    {
      key: 'outputProducts',
      header: 'Output Products',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((product, idx) => (
            <span key={idx} className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
              {product}
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
            className={`text-blue-600 hover:text-blue-800 ${expandedFacilityId === row.id ? 'text-blue-800' : ''}`}
            title={expandedFacilityId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedFacilityId(expandedFacilityId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="text-indigo-600 hover:text-indigo-800" title="Edit Facility">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Calculate totals
  const totalCapacity = "170 tons";
  const averageUtilization = "68%";

  return (
    <DashboardLayout
      title="Waste Processing Facilities"
      breadcrumbs="Waste Management / Processing"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Processing Facilities"
          value={facilities.length.toString()}
          subtitle="Total facilities"
          icon={<ProcessingIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Capacity"
          value={totalCapacity}
          subtitle="Daily processing"
          icon={<ProcessingIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Average Utilization"
          value={averageUtilization}
          subtitle="Across all facilities"
          icon={<ProcessingIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Output Products"
          value="8"
          subtitle="Types produced"
          icon={<ProcessingIcon />}
          color="purple"
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
              placeholder="Search facilities by name, location, products..."
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

          {/* Add Facility Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Facility
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Facilities</h3>
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

      {/* Processing Facilities Table */}
      <Card
        title="Waste Processing Facilities"
        color="green"
        icon={<ProcessingIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No facilities found matching your criteria."
          expandedRowRender={(row) => <FacilityDetails facility={row} />}
          expandedRowId={expandedFacilityId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default WasteProcessing;
