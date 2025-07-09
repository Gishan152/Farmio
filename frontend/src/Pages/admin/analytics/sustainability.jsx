import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const WaterDropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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

const SustainabilityAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock sustainability metrics
  const metrics = {
    wasteRecycled: '78.4%',
    waterConservation: '345,670 liters',
    carbonFootprint: '-18.5%',
    organicPractices: '84.2%',
    sustainableFarms: '142'
  };

  // Mock waste management data
  const wasteData = [
    {
      id: 1,
      category: 'Organic Waste',
      totalAmount: '12,450 kg',
      recycledAmount: '11,205 kg',
      recyclingRate: '90%',
      trend: '+5.2%'
    },
    {
      id: 2,
      category: 'Packaging',
      totalAmount: '8,320 kg',
      recycledAmount: '5,824 kg',
      recyclingRate: '70%',
      trend: '+12.8%'
    },
    {
      id: 3,
      category: 'Plastics',
      totalAmount: '4,570 kg',
      recycledAmount: '2,742 kg',
      recyclingRate: '60%',
      trend: '+8.4%'
    },
    {
      id: 4,
      category: 'Paper/Cardboard',
      totalAmount: '6,890 kg',
      recycledAmount: '6,339 kg',
      recyclingRate: '92%',
      trend: '+3.1%'
    }
  ];

  // Mock water usage data
  const waterUsageData = [
    {
      id: 1,
      farm: 'Highveld Organics',
      location: 'Mpumalanga',
      cropType: 'Mixed Vegetables',
      waterUsage: '237,450 liters',
      efficiency: '92%',
      savings: '+18.4%'
    },
    {
      id: 2,
      farm: 'Green Valley Farm',
      location: 'Western Cape',
      cropType: 'Fruit Trees',
      waterUsage: '342,780 liters',
      efficiency: '85%',
      savings: '+12.7%'
    },
    {
      id: 3,
      farm: 'Sunrise Farms',
      location: 'KwaZulu-Natal',
      cropType: 'Root Vegetables',
      waterUsage: '185,320 liters',
      efficiency: '94%',
      savings: '+22.3%'
    }
  ];

  // Mock sustainable practices data
  const sustainablePractices = [
    {
      id: 1,
      practice: 'Organic Farming',
      adoption: '78%',
      impact: 'High',
      farmCount: '112',
      growth: '+14.5%'
    },
    {
      id: 2,
      practice: 'Water Conservation',
      adoption: '84%',
      impact: 'High',
      farmCount: '128',
      growth: '+9.2%'
    },
    {
      id: 3,
      practice: 'Renewable Energy',
      adoption: '52%',
      impact: 'Medium',
      farmCount: '74',
      growth: '+22.8%'
    },
    {
      id: 4,
      practice: 'Biodiversity Preservation',
      adoption: '67%',
      impact: 'High',
      farmCount: '96',
      growth: '+8.4%'
    },
    {
      id: 5,
      practice: 'No-Till Farming',
      adoption: '45%',
      impact: 'Medium',
      farmCount: '64',
      growth: '+15.2%'
    }
  ];

  return (
    <DashboardLayout title="Sustainability Analytics">
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
                  Category
                </label>
                <select 
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="waste">Waste Management</option>
                  <option value="water">Water Conservation</option>
                  <option value="energy">Energy Usage</option>
                </select>
              </div>
              {/* Add more filter options as needed */}
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Waste Recycled" 
            value={metrics.wasteRecycled} 
            icon={<RecycleIcon />} 
            change="+8.2%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="Water Conserved" 
            value={metrics.waterConservation} 
            icon={<WaterDropIcon />} 
            change="+12.3%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="Carbon Footprint" 
            value={metrics.carbonFootprint} 
            icon={<LeafIcon />} 
            change="-5.8%"
            changeType="decrease"
            isPositive={true}
          />
          <StatCard 
            title="Organic Practices" 
            value={metrics.organicPractices} 
            icon={<LeafIcon />} 
            change="+4.5%"
            changeType="increase"
            isPositive={true}
          />
          <StatCard 
            title="Sustainable Farms" 
            value={metrics.sustainableFarms} 
            icon={<LeafIcon />} 
            change="+15"
            changeType="increase"
            isPositive={true}
          />
        </div>

        {/* Waste Management Overview */}
        <Card title="Waste Management Overview">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waste Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recycled Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recycling Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    YoY Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wasteData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.recycledAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{item.recyclingRate}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              parseFloat(item.recyclingRate) >= 90 ? 'bg-green-600' : 
                              parseFloat(item.recyclingRate) >= 70 ? 'bg-yellow-400' : 'bg-red-600'
                            }`} 
                            style={{ width: item.recyclingRate }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {item.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Water Usage Efficiency */}
        <Card title="Water Usage Efficiency">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crop Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water Usage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    YoY Savings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waterUsageData.map((farm) => (
                  <tr key={farm.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {farm.farm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farm.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farm.cropType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farm.waterUsage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{farm.efficiency}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full bg-green-600" style={{ width: farm.efficiency }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {farm.savings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Sustainable Practices Adoption */}
        <Card title="Sustainable Practices Adoption">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Practice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adoption Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Environmental Impact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farms Implementing
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sustainablePractices.map((practice) => (
                  <tr key={practice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {practice.practice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{practice.adoption}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              parseFloat(practice.adoption) >= 70 ? 'bg-green-600' : 
                              parseFloat(practice.adoption) >= 50 ? 'bg-yellow-400' : 'bg-red-600'
                            }`} 
                            style={{ width: practice.adoption }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${practice.impact === 'High' ? 'bg-green-100 text-green-800' : 
                          practice.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {practice.impact}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {practice.farmCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {practice.growth}
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

export default SustainabilityAnalytics;
