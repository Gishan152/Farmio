import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';
import Chart from '../../../components/ui/Chart';

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


// Mock data for Sri Lankan agricultural platform - Small system with 20 users
const activityData = {
  totalActiveUsers: '20',
  newUsers: '5',
  avgSessionTime: '7m 15s',
  retentionRate: '75.0%',
  bounceRate: '25.0%'
};

const activeUsersData = {
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: {
      activeUsers: [15, 17, 18, 20],
      newUsers: [1, 2, 1, 1]
    }
  },
  quarter: {
    labels: ['Aug', 'Sep', 'Oct'],
    datasets: {
      activeUsers: [12, 16, 20],
      newUsers: [3, 4, 5]
    }
  },
  year: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: {
      activeUsers: [8, 12, 17, 20],
      newUsers: [5, 4, 5, 6]
    }
  }
};

const userTypesData = [
  { type: 'Farmers', count: '8', percentage: '40%', active: '87.5%', newUsers: '2' },
  { type: 'Buyers', count: '6', percentage: '30%', active: '83.3%', newUsers: '2' },
  { type: 'Warehouse Owners', count: '2', percentage: '10%', active: '100%', newUsers: '0' },
  { type: 'Transport Providers', count: '3', percentage: '15%', active: '66.7%', newUsers: '1' },
  { type: 'Waste Mgmt. Agents', count: '1', percentage: '5%', active: '100%', newUsers: '0' }
];

const topFeaturesUsed = [
  { feature: 'Crop Browsing', usageCount: '142', userPercentage: '85%', trend: '+15%' },
  { feature: 'Order Placement', usageCount: '48', userPercentage: '60%', trend: '+20%' },
  { feature: 'Price Inquiry', usageCount: '67', userPercentage: '70%', trend: '+10%' },
  { feature: 'Storage Booking', usageCount: '18', userPercentage: '30%', trend: '+50%' },
  { feature: 'Waste Collection Request', usageCount: '12', userPercentage: '25%', trend: '+33%' }
];

const userJourney = [
  { step: 'Registration', completionRate: '100%', avgTime: '2m 30s', dropOff: '0%' },
  { step: 'Mobile Verification', completionRate: '90%', avgTime: '1m 45s', dropOff: '10%' },
  { step: 'Profile Setup', completionRate: '80%', avgTime: '4m 50s', dropOff: '10%' },
  { step: 'Crop Browsing', completionRate: '75%', avgTime: '6m 30s', dropOff: '5%' },
  { step: 'Inquiry/Cart Addition', completionRate: '50%', avgTime: '3m 40s', dropOff: '25%' },
  { step: 'Order Completion', completionRate: '40%', avgTime: '3m 15s', dropOff: '10%' }
];

const recentUserActivities = [
  { id: 1, user: 'Sunil Perera', type: 'Farmer', action: 'Listed new crop: Tomatoes (50kg)', location: 'Anuradhapura', time: '8 min ago', status: 'active' },
  { id: 2, user: 'Nimal Silva', type: 'Buyer', action: 'Placed order for Bell Pepper', location: 'Colombo', time: '15 min ago', status: 'active' },
  { id: 3, user: 'Kamala Jayawardena', type: 'Farmer', action: 'Updated wheat pricing', location: 'Kurunegala', time: '25 min ago', status: 'active' },
  { id: 4, user: 'Ranjith Fernando', type: 'Transport Provider', action: 'Accepted delivery to Kandy', location: 'Gampaha', time: '42 min ago', status: 'active' },
  { id: 5, user: 'Malini Dissanayake', type: 'Buyer', action: 'Browsing coconut listings', location: 'Kandy', time: '1 hour ago', status: 'active' },
  { id: 6, user: 'Pradeep Bandara', type: 'Warehouse Owner', action: 'Added 200kg storage space', location: 'Matara', time: '2 hours ago', status: 'completed' },
  { id: 7, user: 'Chandani Rathnayake', type: 'Waste Mgmt. Agent', action: 'Completed waste collection', location: 'Galle', time: '3 hours ago', status: 'completed' },
  { id: 8, user: 'Saman Wijesinghe', type: 'Farmer', action: 'Listed rice harvest (100kg)', location: 'Polonnaruwa', time: '4 hours ago', status: 'completed' }
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
            trendValue="+33%" 
            trendLabel="vs previous period"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard 
            title="New Users" 
            value={activityData.newUsers} 
            icon={<UserIcon />} 
            trend="up" 
            trendValue="+25%" 
            trendLabel="this month"
            color="bg-green-100 text-green-800"
          />
          <StatCard 
            title="Avg. Session Time" 
            value={activityData.avgSessionTime} 
            icon={<TimeIcon />} 
            trend="up" 
            trendValue="+8%" 
            trendLabel="vs previous period"
            color="bg-purple-100 text-purple-800"
          />
          <StatCard 
            title="Retention Rate" 
            value={activityData.retentionRate} 
            icon={<UserIcon />} 
            trend="up" 
            trendValue="+5%" 
            trendLabel="vs previous period"
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard 
            title="Bounce Rate" 
            value={activityData.bounceRate} 
            icon={<UserIcon />} 
            trend="down" 
            trendValue="-10%" 
            trendLabel="vs previous period"
            color="bg-red-100 text-red-800"
          />
        </div>
        
        {/* User Activity Chart */}
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">User Activity Overview</h2>
              <div className="h-64">
                <Chart 
                  data={{
                    labels: activeUsersData[timeRange].labels,
                    datasets: [
                      {
                        label: 'Active Users',
                        data: activeUsersData[timeRange].datasets.activeUsers
                      },
                      {
                        label: 'New Users',
                        data: activeUsersData[timeRange].datasets.newUsers
                      }
                    ]
                  }}
                  type="bar"
                  height="100%"
                  colors={['#3B82F6', '#10B981']}
                />
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
              <h3 className="text-md font-medium text-dashboard-text-primary mb-3">Completion Funnel</h3>
              <div className="space-y-2">
                {userJourney.map((step, index) => {
                  const percentage = parseFloat(step.completionRate);
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-32 text-sm text-gray-700 font-medium">{step.step}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: step.completionRate }}
                        >
                          <span className="text-xs text-white font-semibold">{step.completionRate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mobile</span>
                      <span className="text-sm font-medium text-gray-900">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Desktop</span>
                      <span className="text-sm font-medium text-gray-900">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tablet</span>
                      <span className="text-sm font-medium text-gray-900">6%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-dashboard-text-primary mb-2">Platform Usage</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Android</span>
                      <span className="text-sm font-medium text-gray-900">54%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">iOS</span>
                      <span className="text-sm font-medium text-gray-900">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Windows</span>
                      <span className="text-sm font-medium text-gray-900">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="text-sm font-medium text-gray-900">8%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent User Activities */}
        <div className="mt-6">
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-dashboard-text-primary">Recent User Activities</h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 mr-1 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUserActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {activity.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.type === 'Farmer' ? 'bg-green-100 text-green-800' :
                            activity.type === 'Buyer' ? 'bg-blue-100 text-blue-800' :
                            activity.type === 'Transport Provider' ? 'bg-purple-100 text-purple-800' :
                            activity.type === 'Warehouse Owner' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{activity.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserActivity;