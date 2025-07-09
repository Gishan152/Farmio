import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6h8m-8 0l-4 4m4-4l-4-4" />
  </svg>
);

const WarehouseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SupplyChainAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [regionFilter, setRegionFilter] = useState('all');

  // Mock supply chain metrics
  const metrics = {
    averageDeliveryTime: '2.4 days',
    warehouseUtilization: '78.5%',
    transportEfficiency: '83.2%',
    onTimeDelivery: '92.3%',
    inventoryTurnover: '8.4x'
  };

  // Mock bottleneck data
  const bottlenecks = [
    {
      id: 1,
      stage: 'Packaging',
      impactLevel: 'High',
      avgDelay: '6 hours',
      affectedOrders: '18%'
    },
    {
      id: 2,
      stage: 'Rural Transport',
      impactLevel: 'Medium',
      avgDelay: '12 hours',
      affectedOrders: '12%'
    },
    {
      id: 3,
      stage: 'Warehouse Processing',
      impactLevel: 'Low',
      avgDelay: '3 hours',
      affectedOrders: '8%'
    }
  ];

  // Mock transport provider efficiency
  const transportProviders = [
    {
      id: 1,
      name: 'FastTrack Logistics',
      reliability: '95.2%',
      averageTime: '1.8 days',
      costEfficiency: 'High',
      region: 'National'
    },
    {
      id: 2,
      name: 'Rural Routes Co.',
      reliability: '89.7%',
      averageTime: '2.4 days',
      costEfficiency: 'Medium',
      region: 'Eastern Cape'
    },
    {
      id: 3,
      name: 'Farm2City Delivery',
      reliability: '93.8%',
      averageTime: '2.1 days',
      costEfficiency: 'High',
      region: 'Western Cape'
    },
    {
      id: 4,
      name: 'GreenMile Transports',
      reliability: '91.5%',
      averageTime: '2.3 days',
      costEfficiency: 'Medium',
      region: 'Gauteng'
    }
  ];

  // Mock warehouse data
  const warehousePerformance = [
    {
      id: 1,
      name: 'Johannesburg Central Hub',
      utilization: '92%',
      processingTime: '4.2 hours',
      capacity: '2500 tons',
      efficiency: 'High'
    },
    {
      id: 2,
      name: 'Cape Town Distribution Center',
      utilization: '78%',
      processingTime: '5.8 hours',
      capacity: '1800 tons',
      efficiency: 'Medium'
    },
    {
      id: 3,
      name: 'Durban Coastal Facility',
      utilization: '85%',
      processingTime: '5.1 hours',
      capacity: '2200 tons',
      efficiency: 'High'
    }
  ];

  return (
    <DashboardLayout title="Supply Chain Analytics">
      <div className="flex flex-col space-y-6">
        {/* Control Panel */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-md border-gray-300 shadow-sm px-3 py-2 text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <button 
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farmio"
            >
              <FilterIcon />
              <span className="ml-2">Filter</span>
            </button>
          </div>
          
          <button 
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-farmio hover:bg-farmio-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farmio"
          >
            <DownloadIcon />
            <span className="ml-2">Export Report</span>
          </button>
        </div>
        
        {/* Filter Panel (conditionally rendered) */}
        {showFilterPanel && (
          <div className="bg-white p-4 rounded-md shadow mb-4">
            <h3 className="font-medium mb-3">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select 
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="gauteng">Gauteng</option>
                  <option value="western-cape">Western Cape</option>
                  <option value="eastern-cape">Eastern Cape</option>
                  <option value="kwazulu-natal">KwaZulu-Natal</option>
                </select>
              </div>
              {/* Add more filter options as needed */}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Avg. Delivery Time" 
            value={metrics.averageDeliveryTime} 
            icon={<ClockIcon />} 
            change="-8.2%"
            changeType="decrease"
            isPositive={true}
          />
          <StatCard 
            title="Warehouse Utilization" 
            value={metrics.warehouseUtilization} 
            icon={<WarehouseIcon />} 
            change="+5.3%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="Transport Efficiency" 
            value={metrics.transportEfficiency} 
            icon={<TruckIcon />} 
            change="+2.8%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="On-Time Delivery" 
            value={metrics.onTimeDelivery} 
            icon={<ClockIcon />} 
            change="+1.5%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="Inventory Turnover" 
            value={metrics.inventoryTurnover} 
            icon={<WarehouseIcon />} 
            change="+0.6x"
            changeType="increase"
            isPositive={true}
          />
        </div>

        {/* Supply Chain Bottlenecks */}
        <Card title="Supply Chain Bottlenecks">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Delay
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affected Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bottlenecks.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.stage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${item.impactLevel === 'High' ? 'bg-red-100 text-red-800' : 
                          item.impactLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}
                      >
                        {item.impactLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.avgDelay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.affectedOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-farmio hover:text-farmio-dark">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Transport Provider Efficiency */}
        <Card title="Transport Provider Efficiency">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reliability
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost Efficiency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transportProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {provider.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`mr-2 ${parseFloat(provider.reliability) > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {provider.reliability}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${parseFloat(provider.reliability) > 90 ? 'bg-green-600' : 'bg-yellow-400'}`} style={{ width: provider.reliability }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.averageTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${provider.costEfficiency === 'High' ? 'bg-green-100 text-green-800' : 
                          provider.costEfficiency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {provider.costEfficiency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {provider.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Warehouse Performance */}
        <Card title="Warehouse Performance">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warehousePerformance.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {warehouse.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{warehouse.utilization}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              parseFloat(warehouse.utilization) > 90 ? 'bg-red-600' : 
                              parseFloat(warehouse.utilization) > 80 ? 'bg-green-600' : 'bg-yellow-400'
                            }`} 
                            style={{ width: warehouse.utilization }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {warehouse.processingTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {warehouse.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${warehouse.efficiency === 'High' ? 'bg-green-100 text-green-800' : 
                          warehouse.efficiency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {warehouse.efficiency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupplyChainAnalytics;
