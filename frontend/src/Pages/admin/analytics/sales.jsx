import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

// Static mock data moved outside component to prevent re-render issues
const salesData = {
  totalRevenue: 'R528,945.00',
  totalOrders: '1,245',
  averageOrderValue: 'R425.00',
  conversionRate: '4.2%',
  yearlyGrowth: '+18.5%'
};

const chartData = {
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: {
      revenue: [125450, 132780, 141230, 129485],
      orders: [289, 312, 345, 299]
    }
  },
  quarter: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: {
      revenue: [385450, 412780, 528945],
      orders: [875, 952, 1245]
    }
  },
  year: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: {
      revenue: [1385450, 1512780, 1628945, 1728950],
      orders: [3275, 3652, 3845, 4125]
    }
  }
};

const topSellingProducts = [
  {
    id: '1',
    name: 'Organic Potatoes (5kg)',
    sales: 'R45,680.00',
    quantity: '845 units',
    growth: '+12.5%',
    image: 'https://via.placeholder.com/50'
  },
  {
    id: '2',
    name: 'Fresh Farm Tomatoes (2kg)',
    sales: 'R38,450.00',
    quantity: '785 units',
    growth: '+8.3%',
    image: 'https://via.placeholder.com/50'
  },
  {
    id: '3',
    name: 'Organic Carrots (3kg)',
    sales: 'R32,780.00',
    quantity: '654 units',
    growth: '+15.7%',
    image: 'https://via.placeholder.com/50'
  },
  {
    id: '4',
    name: 'Free Range Eggs (Dozen)',
    sales: 'R28,950.00',
    quantity: '578 units',
    growth: '+6.2%',
    image: 'https://via.placeholder.com/50'
  },
  {
    id: '5',
    name: 'Grass-Fed Beef (1kg)',
    sales: 'R25,680.00',
    quantity: '345 units',
    growth: '+9.8%',
    image: 'https://via.placeholder.com/50'
  }
];

const salesByRegion = [
  { region: 'Western Cape', revenue: 'R185,450.00', percentage: '35%', growth: '+14.2%' },
  { region: 'Gauteng', revenue: 'R158,680.00', percentage: '30%', growth: '+18.7%' },
  { region: 'KwaZulu-Natal', revenue: 'R95,210.00', percentage: '18%', growth: '+10.5%' },
  { region: 'Eastern Cape', revenue: 'R52,895.00', percentage: '10%', growth: '+7.8%' },
  { region: 'Other Provinces', revenue: 'R36,710.00', percentage: '7%', growth: '+5.4%' }
];

const SalesAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  return (
    <DashboardLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-dashboard-text-primary">Sales Analytics</h1>
          
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="dairy">Dairy</option>
                      <option value="meat">Meat</option>
                      <option value="grains">Grains</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>All Regions</option>
                      <option>Western Cape</option>
                      <option>Gauteng</option>
                      <option>KwaZulu-Natal</option>
                      <option>Eastern Cape</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="flex space-x-2">
                      <input type="number" placeholder="Min" className="w-1/2 border border-gray-300 rounded-md px-3 py-2" />
                      <input type="number" placeholder="Max" className="w-1/2 border border-gray-300 rounded-md px-3 py-2" />
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
            title="Total Revenue" 
            value={salesData.totalRevenue} 
            icon={<MoneyIcon />} 
            trend="up" 
            trendValue={salesData.yearlyGrowth} 
            trendLabel="vs previous period"
            color="bg-green-100 text-green-800"
          />
          <StatCard 
            title="Total Orders" 
            value={salesData.totalOrders} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+12.3%" 
            trendLabel="vs previous period"
            color="bg-blue-100 text-blue-800"
          />
          <StatCard 
            title="Average Order Value" 
            value={salesData.averageOrderValue} 
            icon={<MoneyIcon />} 
            trend="up" 
            trendValue="+5.7%" 
            trendLabel="vs previous period"
            color="bg-purple-100 text-purple-800"
          />
          <StatCard 
            title="Conversion Rate" 
            value={salesData.conversionRate} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+2.1%" 
            trendLabel="vs previous period"
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard 
            title="YoY Growth" 
            value={salesData.yearlyGrowth} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+3.4%" 
            trendLabel="vs previous year"
            color="bg-red-100 text-red-800"
          />
        </div>
        
        {/* Sales Chart */}
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Sales Overview</h2>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <p className="text-sm text-gray-500">Chart visualization would go here</p>
                <p className="text-xs text-gray-400">Using data for {timeRange} view</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Selling Products */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Top Selling Products</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Sales</th>
                      <th className="px-6 py-3">Quantity</th>
                      <th className="px-6 py-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSellingProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={product.image} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{product.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          
          {/* Sales by Region */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Sales by Region</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Region</th>
                      <th className="px-6 py-3">Revenue</th>
                      <th className="px-6 py-3">Percentage</th>
                      <th className="px-6 py-3">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesByRegion.map((region, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.percentage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{region.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Sales Trends */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Sales Trends</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-sm text-gray-500">Sales trend visualization would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesAnalytics;
