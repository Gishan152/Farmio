import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatCard from '../../../components/ui/StatCard';

// Icons
const ShippingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShippingManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedShipmentId, setExpandedShipmentId] = useState(null);

  // Sample shipping data
  const shipments = [
    {
      id: 'SHP-2023-1001',
      orderId: 'ORD-10045',
      customer: 'Fresh Foods Market',
      origin: 'Farmville Production Hub',
      destination: 'Central City Market',
      carrier: 'Fast Track Logistics',
      vehicle: 'Refrigerated Truck (M)',
      shipDate: '2023-06-22',
      estimatedDelivery: '2023-06-25',
      status: 'In Transit',
      distance: '45 km',
      weight: '1.2 tons',
      packageCount: 24,
      temperature: '4°C',
      trackingUrl: 'https://tracking.example.com/SHP-2023-1001',
      shipmentDetails: {
        items: [
          { product: 'Organic Tomatoes', quantity: '50 kg', packaging: 'Crates' },
          { product: 'Fresh Lettuce', quantity: '40 kg', packaging: 'Boxes' },
          { product: 'Carrots', quantity: '60 kg', packaging: 'Bags' },
          { product: 'Red Onions', quantity: '45 kg', packaging: 'Mesh Bags' },
          { product: 'Bell Peppers', quantity: '35 kg', packaging: 'Crates' },
          { product: 'Cucumbers', quantity: '55 kg', packaging: 'Boxes' },
          { product: 'Potatoes', quantity: '80 kg', packaging: 'Bags' },
          { product: 'Green Beans', quantity: '30 kg', packaging: 'Trays' }
        ],
        milestones: [
          { name: 'Order Received', time: '2023-06-20 10:30 AM', completed: true },
          { name: 'Processing Started', time: '2023-06-21 08:15 AM', completed: true },
          { name: 'Packaging Complete', time: '2023-06-21 04:45 PM', completed: true },
          { name: 'Loaded for Shipping', time: '2023-06-22 06:30 AM', completed: true },
          { name: 'In Transit', time: '2023-06-22 07:15 AM', completed: true },
          { name: 'Arrived at Distribution', time: 'Pending', completed: false },
          { name: 'Out for Delivery', time: 'Pending', completed: false },
          { name: 'Delivered', time: 'Pending', completed: false }
        ],
        driver: {
          name: 'Michael Johnson',
          phone: '+1 (555) 123-7890',
          licenseNumber: 'DL-78901234'
        },
        notes: 'Handle with care. Temperature sensitive produce.'
      }
    },
    {
      id: 'SHP-2023-1002',
      orderId: 'ORD-10046',
      customer: 'Green Market Co-op',
      origin: 'Orchard Hills Fruit Farms',
      destination: 'Green Market Co-op Store',
      carrier: 'Rural Routes Delivery',
      vehicle: 'Refrigerated Van',
      shipDate: '2023-06-21',
      estimatedDelivery: '2023-06-26',
      status: 'Processing',
      distance: '30 km',
      weight: '0.8 tons',
      packageCount: 16,
      temperature: '6°C',
      trackingUrl: 'https://tracking.example.com/SHP-2023-1002',
      shipmentDetails: {
        items: [
          { product: 'Organic Apples', quantity: '40 kg', packaging: 'Boxes' },
          { product: 'Organic Bananas', quantity: '35 kg', packaging: 'Crates' },
          { product: 'Organic Oranges', quantity: '45 kg', packaging: 'Boxes' },
          { product: 'Organic Grapes', quantity: '30 kg', packaging: 'Crates' },
          { product: 'Organic Berries', quantity: '25 kg', packaging: 'Trays' },
          { product: 'Organic Melons', quantity: '30 kg', packaging: 'Boxes' }
        ],
        milestones: [
          { name: 'Order Received', time: '2023-06-20 11:45 AM', completed: true },
          { name: 'Processing Started', time: '2023-06-21 09:30 AM', completed: true },
          { name: 'Packaging Complete', time: 'Pending', completed: false },
          { name: 'Loaded for Shipping', time: 'Pending', completed: false },
          { name: 'In Transit', time: 'Pending', completed: false },
          { name: 'Arrived at Distribution', time: 'Pending', completed: false },
          { name: 'Out for Delivery', time: 'Pending', completed: false },
          { name: 'Delivered', time: 'Pending', completed: false }
        ],
        driver: {
          name: 'David Lee',
          phone: '+1 (555) 234-5678',
          licenseNumber: 'DL-56781234'
        },
        notes: 'Organic certified products. Keep separated from non-organic items.'
      }
    },
    {
      id: 'SHP-2023-1003',
      orderId: 'ORD-10047',
      customer: 'Healthy Eats Cafe',
      origin: 'Riverside Agricultural Cooperative',
      destination: 'Healthy Eats Cafe',
      carrier: 'Swift Stream Logistics',
      vehicle: 'Electric Delivery Van',
      shipDate: '2023-06-22',
      estimatedDelivery: '2023-06-25',
      status: 'Scheduled',
      distance: '15 km',
      weight: '0.4 tons',
      packageCount: 8,
      temperature: '5°C',
      trackingUrl: 'https://tracking.example.com/SHP-2023-1003',
      shipmentDetails: {
        items: [
          { product: 'Organic Spinach', quantity: '15 kg', packaging: 'Boxes' },
          { product: 'Organic Kale', quantity: '12 kg', packaging: 'Crates' },
          { product: 'Organic Arugula', quantity: '10 kg', packaging: 'Boxes' },
          { product: 'Organic Mixed Greens', quantity: '25 kg', packaging: 'Trays' }
        ],
        milestones: [
          { name: 'Order Received', time: '2023-06-21 10:15 AM', completed: true },
          { name: 'Processing Started', time: 'Scheduled for 2023-06-22', completed: false },
          { name: 'Packaging Complete', time: 'Pending', completed: false },
          { name: 'Loaded for Shipping', time: 'Pending', completed: false },
          { name: 'In Transit', time: 'Pending', completed: false },
          { name: 'Arrived at Distribution', time: 'Pending', completed: false },
          { name: 'Out for Delivery', time: 'Pending', completed: false },
          { name: 'Delivered', time: 'Pending', completed: false }
        ],
        driver: {
          name: 'Sarah Williams',
          phone: '+1 (555) 345-6789',
          licenseNumber: 'DL-34567890'
        },
        notes: 'Priority delivery for fresh greens. Maintain temperature at 5°C.'
      }
    },
    {
      id: 'SHP-2023-1000',
      orderId: 'ORD-10044',
      customer: 'Urban Grocery Alliance',
      origin: 'Highland Dairy Cooperative',
      destination: 'Urban Grocery Distribution Center',
      carrier: 'Cool Chain Logistics',
      vehicle: 'Refrigerated Truck (L)',
      shipDate: '2023-06-19',
      estimatedDelivery: '2023-06-22',
      status: 'Delivered',
      distance: '55 km',
      weight: '2.0 tons',
      packageCount: 40,
      temperature: '2°C',
      trackingUrl: 'https://tracking.example.com/SHP-2023-1000',
      shipmentDetails: {
        items: [
          { product: 'Fresh Milk', quantity: '500 L', packaging: 'Containers' },
          { product: 'Yogurt', quantity: '300 L', packaging: 'Boxes' },
          { product: 'Cheese', quantity: '200 kg', packaging: 'Vacuum Sealed' }
        ],
        milestones: [
          { name: 'Order Received', time: '2023-06-18 08:30 AM', completed: true },
          { name: 'Processing Started', time: '2023-06-18 11:15 AM', completed: true },
          { name: 'Packaging Complete', time: '2023-06-18 05:45 PM', completed: true },
          { name: 'Loaded for Shipping', time: '2023-06-19 03:30 AM', completed: true },
          { name: 'In Transit', time: '2023-06-19 04:15 AM', completed: true },
          { name: 'Arrived at Distribution', time: '2023-06-19 06:45 AM', completed: true },
          { name: 'Out for Delivery', time: '2023-06-22 05:15 AM', completed: true },
          { name: 'Delivered', time: '2023-06-22 09:30 AM', completed: true }
        ],
        driver: {
          name: 'Robert Chen',
          phone: '+1 (555) 456-7890',
          licenseNumber: 'DL-45678901'
        },
        notes: 'Delivered on time. All items in good condition.'
      }
    },
    {
      id: 'SHP-2023-1004',
      orderId: 'ORD-10048',
      customer: 'Farm to Table Restaurant',
      origin: 'Greenfield Farms Collective',
      destination: 'Farm to Table Restaurant',
      carrier: 'Local Haul Co-op',
      vehicle: 'Hybrid Delivery Van',
      shipDate: '2023-06-23',
      estimatedDelivery: '2023-06-23',
      status: 'Scheduled',
      distance: '8 km',
      weight: '0.3 tons',
      packageCount: 10,
      temperature: 'Ambient',
      trackingUrl: 'https://tracking.example.com/SHP-2023-1004',
      shipmentDetails: {
        items: [
          { product: 'Fresh Herbs', quantity: '5 kg', packaging: 'Crates' },
          { product: 'Specialty Greens', quantity: '8 kg', packaging: 'Boxes' },
          { product: 'Edible Flowers', quantity: '2 kg', packaging: 'Trays' },
          { product: 'Heirloom Vegetables', quantity: '15 kg', packaging: 'Baskets' }
        ],
        milestones: [
          { name: 'Order Received', time: '2023-06-22 02:00 PM', completed: true },
          { name: 'Processing Started', time: 'Scheduled for 2023-06-23 05:00 AM', completed: false },
          { name: 'Packaging Complete', time: 'Pending', completed: false },
          { name: 'Loaded for Shipping', time: 'Pending', completed: false },
          { name: 'In Transit', time: 'Pending', completed: false },
          { name: 'Delivered', time: 'Pending', completed: false }
        ],
        driver: {
          name: 'Elena Martinez',
          phone: '+1 (555) 567-8901',
          licenseNumber: 'DL-56789012'
        },
        notes: 'Same day delivery for restaurant. Fresh-picked morning of delivery.'
      }
    }
  ];

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredData(shipments);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  useEffect(() => {
    if (!shipments) return;
    
    let results = shipments.filter(shipment => {
      return Object.keys(shipment).some(key => 
        typeof shipment[key] === 'string' && shipment[key].toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredData(results);
  }, [searchTerm, shipments]);

  // Filter options
  const filters = [
    {
      name: 'status',
      label: 'Status',
      options: [
        { label: 'Scheduled', value: 'Scheduled' },
        { label: 'Processing', value: 'Processing' },
        { label: 'In Transit', value: 'In Transit' },
        { label: 'Delivered', value: 'Delivered' }
      ]
    },
    {
      name: 'carrier',
      label: 'Carrier',
      options: [
        { label: 'Fast Track Logistics', value: 'Fast Track Logistics' },
        { label: 'Rural Routes Delivery', value: 'Rural Routes Delivery' },
        { label: 'Swift Stream Logistics', value: 'Swift Stream Logistics' },
        { label: 'Cool Chain Logistics', value: 'Cool Chain Logistics' },
        { label: 'Local Haul Co-op', value: 'Local Haul Co-op' }
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
    if (!shipments || Object.keys(selectedFilters).length === 0) {
      setFilteredData(shipments);
      return;
    }
    
    let results = shipments.filter(shipment => {
      return Object.entries(selectedFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        return shipment[key] === value;
      });
    });
    
    setFilteredData(results);
  }, [selectedFilters, shipments]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'In Transit': 'bg-pastel-green text-green-800',
      'Delivered': 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // Shipment Details Component
  const ShipmentDetails = ({ shipment }) => {
    return (
      <div className="p-4 bg-gray-50">
        <div className="mb-3 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Shipment {shipment.id} for Order {shipment.orderId}</h4>
            <p className="text-xs text-gray-500">
              <span className="inline-flex items-center mr-3">
                <LocationIcon />
                <span className="ml-1">{shipment.origin} to {shipment.destination}</span>
              </span>
              <span className="inline-flex items-center">
                <CalendarIcon />
                <span className="ml-1">Ship: {shipment.shipDate} | Delivery: {shipment.estimatedDelivery}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Status:</span>
            <StatusBadge status={shipment.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">SHIPMENT MILESTONES</h5>
            <div className="relative">
              {shipment.shipmentDetails.milestones.map((milestone, index) => (
                <div key={index} className="mb-4 pl-6 border-l-2 border-gray-300 relative">
                  <div className={`absolute left-[-8px] top-0 w-4 h-4 rounded-full ${milestone.completed ? 'bg-farmio' : 'bg-gray-300'}`}></div>
                  <div className="text-sm font-medium">{milestone.name}</div>
                  <div className={`text-xs ${milestone.completed ? 'text-gray-500' : 'text-gray-400'}`}>{milestone.time}</div>
                </div>
              ))}
            </div>
            
            <h5 className="text-xs font-medium text-gray-500 mt-6 mb-2">DRIVER INFORMATION</h5>
            <div className="p-3 bg-white border border-gray-200 rounded-md">
              <div className="text-sm font-medium">{shipment.shipmentDetails.driver.name}</div>
              <div className="text-xs text-gray-500">Phone: {shipment.shipmentDetails.driver.phone}</div>
              <div className="text-xs text-gray-500">License: {shipment.shipmentDetails.driver.licenseNumber}</div>
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-500 mb-2">SHIPMENT DETAILS</h5>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Carrier:</span>
                <span className="font-medium">{shipment.carrier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Vehicle:</span>
                <span className="font-medium">{shipment.vehicle}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance:</span>
                <span className="font-medium">{shipment.distance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Weight:</span>
                <span className="font-medium">{shipment.weight}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Package Count:</span>
                <span className="font-medium">{shipment.packageCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Temperature:</span>
                <span className="font-medium">{shipment.temperature}</span>
              </div>
              
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-500 block mb-1">NOTES</span>
                <p className="text-sm bg-gray-100 p-2 rounded">{shipment.shipmentDetails.notes}</p>
              </div>
            </div>
            
            <h5 className="text-xs font-medium text-gray-500 mt-4 mb-2">ITEMS</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packaging</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipment.shipmentDetails.items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{item.product}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{item.packaging}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {shipment.trackingUrl && (
              <a 
                href={shipment.trackingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-3 py-1 text-sm text-white bg-farmio rounded-md hover:bg-green-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2">Track Shipment</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Table columns
  const columns = [
    { key: 'id', header: 'Shipment ID' },
    { key: 'orderId', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { 
      key: 'shipDate', 
      header: 'Ship Date',
      render: (value) => <span>{value}</span>
    },
    { 
      key: 'estimatedDelivery', 
      header: 'Est. Delivery',
      render: (value) => <span>{value}</span>
    },
    { key: 'carrier', header: 'Carrier' },
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
            className={`text-blue-600 hover:text-blue-800 ${expandedShipmentId === row.id ? 'text-blue-800' : ''}`}
            title={expandedShipmentId === row.id ? "Hide Details" : "View Details"}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedShipmentId(expandedShipmentId === row.id ? null : row.id);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {row.trackingUrl && (
            <a 
              href={row.trackingUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800"
              title="Track Shipment"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
          <button className="text-indigo-600 hover:text-indigo-800" title="Update Shipment">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // Count by status
  const countByStatus = {
    Scheduled: shipments.filter(s => s.status === 'Scheduled').length,
    Processing: shipments.filter(s => s.status === 'Processing').length,
    InTransit: shipments.filter(s => s.status === 'In Transit').length,
    Delivered: shipments.filter(s => s.status === 'Delivered').length
  };

  return (
    <DashboardLayout
      title="Shipping Management"
      breadcrumbs="Logistics / Shipping"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Shipments"
          value={shipments.length.toString()}
          subtitle="All shipments"
          icon={<ShippingIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="In Transit"
          value={countByStatus.InTransit.toString()}
          subtitle="Currently shipping"
          icon={<ShippingIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Processing"
          value={(countByStatus.Scheduled + countByStatus.Processing).toString()}
          subtitle="Preparing for shipping"
          icon={<ShippingIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard 
          title="Delivered"
          value={countByStatus.Delivered.toString()}
          subtitle="Completed shipments"
          icon={<ShippingIcon />}
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
              placeholder="Search shipments by ID, customer, carrier..."
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

          {/* Create Shipment Button */}
          <button className="flex items-center text-sm py-2 px-4 rounded-md bg-farmio text-white hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Shipment
          </button>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mt-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Shipments</h3>
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

      {/* Shipments Table */}
      <Card
        title="Active Shipments"
        color="blue"
        icon={<ShippingIcon />}
        noPadding
      >
        <Table
          isLoading={isLoading}
          columns={columns}
          data={filteredData}
          emptyMessage="No shipments found matching your criteria."
          expandedRowRender={(row) => <ShipmentDetails shipment={row} />}
          expandedRowId={expandedShipmentId}
        />
      </Card>
    </DashboardLayout>
  );
};

export default ShippingManagement;
