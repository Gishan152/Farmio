import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TimeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DeviceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


// Move static data outside the component to avoid new reference on every render
const activityData = {
  totalActiveUsers: '8,452',
  newUsers: '1,245',
  avgSessionTime: '8m 32s',
  retentionRate: '68.5%',
  bounceRate: '32.4%'
};
const activeUsersData = {
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: {
      activeUsers: [7850, 8125, 8290, 8452],
      newUsers: [320, 295, 310, 320]
    }
  },
  quarter: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: {
      activeUsers: [7450, 7820, 8452],
      newUsers: [850, 915, 1245]
    }
  },
  year: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: {
      activeUsers: [6850, 7250, 7895, 8452],
      newUsers: [2450, 2180, 2320, 2780]
    }
  }
};
const userTypesData = [
  { type: 'Farmers', count: '2,854', percentage: '33.8%', active: '78.5%', newUsers: '345' },
  { type: 'Buyers', count: '3,125', percentage: '37.0%', active: '82.3%', newUsers: '520' },
  { type: 'Warehouse Owners', count: '845', percentage: '10.0%', active: '74.8%', newUsers: '126' },
  { type: 'Transport Providers', count: '956', percentage: '11.3%', active: '68.2%', newUsers: '152' },
  { type: 'Waste Mgmt. Agents', count: '672', percentage: '7.9%', active: '71.4%', newUsers: '102' }
];
const topFeaturesUsed = [
  { feature: 'Product Search', usageCount: '45,680', userPercentage: '85.2%', trend: '+12.5%' },
  { feature: 'Order Placement', usageCount: '28,945', userPercentage: '72.8%', trend: '+8.3%' },
  { feature: 'Storage Booking', usageCount: '18,540', userPercentage: '54.6%', trend: '+15.7%' },
  { feature: 'Transport Scheduling', usageCount: '12,835', userPercentage: '42.3%', trend: '+6.2%' },
  { feature: 'Waste Collection Request', usageCount: '9,745', userPercentage: '32.8%', trend: '+9.8%' }
];
const userJourney = [
  { step: 'Registration', completionRate: '100%', avgTime: '2m 15s', dropOff: '0%' },
  { step: 'Profile Completion', completionRate: '82.5%', avgTime: '4m 35s', dropOff: '17.5%' },
  { step: 'Product Browsing', completionRate: '76.8%', avgTime: '8m 45s', dropOff: '5.7%' },
  { step: 'Cart Addition', completionRate: '58.4%', avgTime: '3m 20s', dropOff: '18.4%' },
  { step: 'Checkout Process', completionRate: '42.3%', avgTime: '5m 10s', dropOff: '16.1%' },
  { step: 'Order Completion', completionRate: '38.7%', avgTime: '2m 30s', dropOff: '3.6%' }
];

const UserActivity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  return (
    <DashboardLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-dashboard-text-primary">User Activity Analytics</h1>
          
          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-3 py-2 bg-white border border-dashboard-border rounded-md flex items-center space-x-2 text-sm hover:bg-gray-50"
              >
                <FilterIcon />
                <span>Filters</span>
              </button>
              
              {showFilterPanel && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-dashboard-border rounded-md shadow-lg z-10 p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={userTypeFilter}
                      onChange={(e) => setUserTypeFilter(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="farmers">Farmers</option>
                      <option value="buyers">Buyers</option>
                      <option value="warehouse">Warehouse Owners</option>
                      <option value="transport">Transport Providers</option>
                      <option value="waste">Waste Management Agents</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>All Activity Levels</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Period</label>
                    <div className="flex space-x-2">
                      <input type="date" className="w-1/2 border border-gray-300 rounded-md px-3 py-2" />
                      <input type="date" className="w-1/2 border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-3 py-2 bg-farmio text-white rounded-md text-sm hover:bg-farmio-dark">Apply Filters</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex border border-dashboard-border rounded-md">
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-3 py-2 text-sm ${timeRange === 'month' ? 'bg-farmio text-white' : 'bg-white text-dashboard-text-light'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeRange('quarter')}
                className={`px-3 py-2 text-sm ${timeRange === 'quarter' ? 'bg-farmio text-white' : 'bg-white text-dashboard-text-light'}`}
              >
                Quarter
              </button>
              <button 
                onClick={() => setTimeRange('year')}
                className={`px-3 py-2 text-sm ${timeRange === 'year' ? 'bg-farmio text-white' : 'bg-white text-dashboard-text-light'}`}
              >
                Year
              </button>
            </div>
            
            <button className="px-3 py-2 bg-white border border-dashboard-border rounded-md flex items-center space-x-2 text-sm hover:bg-gray-50">
              <CalendarIcon />
              <span>Date Range</span>
            </button>
            
            <button className="px-3 py-2 bg-farmio text-white rounded-md flex items-center space-x-2 text-sm hover:bg-farmio-dark">
              <DownloadIcon />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <StatCard 
            title="Total Active Users" 
            value={activityData.totalActiveUsers} 
            icon={<UserIcon />} 
            trend="up" 
            trendValue="+15.3%" 
            trendLabel="vs previous period"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard 
            title="New Users" 
            value={activityData.newUsers} 
            icon={<UserIcon />} 
            trend="up" 
            trendValue="+12.3%" 
            trendLabel="vs previous period"
            color="bg-green-100 text-green-800"
          />
          <StatCard 
            title="Avg. Session Time" 
            value={activityData.avgSessionTime} 
            icon={<TimeIcon />} 
            trend="up" 
            trendValue="+5.7%" 
            trendLabel="vs previous period"
            color="bg-purple-100 text-purple-800"
          />
          <StatCard 
            title="Retention Rate" 
            value={activityData.retentionRate} 
            icon={<UserIcon />} 
            trend="up" 
            trendValue="+2.1%" 
            trendLabel="vs previous period"
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard 
            title="Bounce Rate" 
            value={activityData.bounceRate} 
            icon={<UserIcon />} 
            trend="down" 
            trendValue="-3.4%" 
            trendLabel="vs previous period"
            color="bg-red-100 text-red-800"
          />
        </div>
        
        {/* User Activity Chart */}
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">User Activity Overview</h2>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-sm text-gray-500">User activity chart visualization would go here</p>
                <p className="text-xs text-gray-400">Using data for {timeRange} view</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Types */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">User Types Distribution</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">User Type</th>
                      <th className="px-6 py-3">Count</th>
                      <th className="px-6 py-3">Percentage</th>
                      <th className="px-6 py-3">Active</th>
                      <th className="px-6 py-3">New Users</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userTypesData.map((type, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.percentage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{type.active}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{type.newUsers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          
          {/* Top Features Used */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Top Features Used</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Feature</th>
                      <th className="px-6 py-3">Usage Count</th>
                      <th className="px-6 py-3">User %</th>
                      <th className="px-6 py-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topFeaturesUsed.map((feature, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature.feature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.usageCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.userPercentage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{feature.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        {/* User Journey */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">User Journey Funnel</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Journey Step</th>
                    <th className="px-6 py-3">Completion Rate</th>
                    <th className="px-6 py-3">Avg. Time</th>
                    <th className="px-6 py-3">Drop-off</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userJourney.map((step, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{step.step}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{step.completionRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{step.avgTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{step.dropOff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-sm text-gray-500">User journey funnel visualization would go here</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Device and Platform Usage */}
        <div className="mt-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Device & Platform Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-dashboard-text-primary mb-2">Device Usage</h3>
                  <div className="h-40 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-sm text-gray-500">Device usage pie chart would go here</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Mobile: 65%</span>
                      <span>Desktop: 28%</span>
                      <span>Tablet: 7%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-dashboard-text-primary mb-2">Platform Usage</h3>
                  <div className="h-40 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-sm text-gray-500">Platform usage pie chart would go here</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Android: 48%</span>
                      <span>iOS: 32%</span>
                      <span>Windows: 15%</span>
                      <span>Other: 5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserActivity;
