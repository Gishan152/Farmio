import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const GrowthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const RecycleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Mock Chart Component
const MockChart = ({ type, height, color }) => {
  return (
    <div 
      className={`w-full ${height || 'h-64'} bg-${color || 'blue'}-50 rounded-md flex items-center justify-center`}
      style={{ minHeight: height || '16rem' }}
    >
      <div className="text-center p-4">
        <div className={`text-${color || 'blue'}-500 mb-2`}>
          {type === 'bar' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )}
          {type === 'line' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
          {type === 'pie' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          )}
          {type === 'donut' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          {type === 'bar' && 'Bar Chart'}
          {type === 'line' && 'Line Chart'}
          {type === 'pie' && 'Pie Chart'}
          {type === 'donut' && 'Donut Chart'}
          <br />
          <span className="text-xs">(Chart representation would appear here)</span>
        </p>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState('week');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Generate some mock data based on the timeframe
  const salesData = {
    week: '$24,586.45',
    month: '$102,345.78',
    year: '$1,245,675.90'
  };

  const growthData = {
    week: '+8.2%',
    month: '+12.5%',
    year: '+32.8%'
  };

  const ordersData = {
    week: '184',
    month: '723',
    year: '9,584'
  };

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      breadcrumbs="Analytics / Overview"
      userRole="admin"
    >
      {/* Time Frame Selector */}
      <div className="mb-6">
        <div className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm w-fit">
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${
              timeFrame === 'week' ? 'bg-farmio text-white' : 'text-dashboard-text-secondary hover:bg-gray-100'
            }`}
            onClick={() => setTimeFrame('week')}
          >
            Weekly
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${
              timeFrame === 'month' ? 'bg-farmio text-white' : 'text-dashboard-text-secondary hover:bg-gray-100'
            }`}
            onClick={() => setTimeFrame('month')}
          >
            Monthly
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-md ${
              timeFrame === 'year' ? 'bg-farmio text-white' : 'text-dashboard-text-secondary hover:bg-gray-100'
            }`}
            onClick={() => setTimeFrame('year')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Sales"
          value={salesData[timeFrame]}
          subtitle={`For current ${timeFrame}`}
          icon={<ChartIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Growth"
          value={growthData[timeFrame]}
          subtitle={`Compared to previous ${timeFrame}`}
          icon={<GrowthIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard 
          title="Orders"
          value={ordersData[timeFrame]}
          subtitle={`Total orders this ${timeFrame}`}
          icon={<ChartIcon />}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card
          title="Revenue Overview"
          subtitle={`Sales performance for the ${timeFrame}`}
          color="blue"
          icon={<ChartIcon />}
        >
          <MockChart type="line" color="blue" />
        </Card>
        
        <Card
          title="Order Statistics"
          subtitle={`Order metrics for the ${timeFrame}`}
          color="purple"
          icon={<ChartIcon />}
        >
          <MockChart type="bar" color="purple" />
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card
          title="Products by Category"
          subtitle="Distribution of product inventory"
          color="green"
        >
          <MockChart type="pie" color="green" height="h-56" />
        </Card>
        
        <Card
          title="User Demographics"
          subtitle="User types distribution"
          color="yellow"
          icon={<UsersIcon />}
        >
          <MockChart type="donut" color="yellow" height="h-56" />
        </Card>
        
        <Card
          title="Sustainability Metrics"
          subtitle="Environmental impact indicators"
          color="teal"
          icon={<RecycleIcon />}
        >
          <div className="space-y-4 p-4">
            <div>
              <h4 className="text-xs font-medium text-dashboard-text-secondary mb-1">Carbon Footprint Saved</h4>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-teal-500 rounded-full" style={{width: '68%'}}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-dashboard-text-light">Target: 10K kg CO₂</span>
                <span className="text-teal-600 font-medium">6.8K kg CO₂ (68%)</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-dashboard-text-secondary mb-1">Waste Recycling</h4>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-teal-500 rounded-full" style={{width: '82%'}}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-dashboard-text-light">Target: 90%</span>
                <span className="text-teal-600 font-medium">82%</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-dashboard-text-secondary mb-1">Water Consumption</h4>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-teal-500 rounded-full" style={{width: '45%'}}></div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-dashboard-text-light">Target: 50% reduction</span>
                <span className="text-teal-600 font-medium">45%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products and Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Top Selling Products"
          subtitle={`Best performers this ${timeFrame}`}
          color="blue"
        >
          <div className="space-y-4 p-4">
            {[
              { name: 'Organic Tomatoes', category: 'Vegetables', sales: '$12,450', percentage: '85%' },
              { name: 'Fresh Farm Eggs', category: 'Dairy & Eggs', sales: '$9,876', percentage: '72%' },
              { name: 'Grass-Fed Beef', category: 'Meat', sales: '$8,540', percentage: '65%' },
              { name: 'Artisanal Honey', category: 'Specialty', sales: '$6,290', percentage: '58%' },
              { name: 'Organic Baby Spinach', category: 'Vegetables', sales: '$5,860', percentage: '45%' }
            ].map((product, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="font-semibold text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-dashboard-text-light">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{product.sales}</div>
                      <div className="text-xs text-green-600">{product.percentage}</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-100 mt-1">
                    <div 
                      className="h-1 bg-farmio" 
                      style={{ width: product.percentage }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Top Performing Farmers"
          subtitle={`Based on sales this ${timeFrame}`}
          color="green"
          icon={<UsersIcon />}
        >
          <div className="space-y-4 p-4">
            {[
              { name: 'John Smith', products: 'Organic Vegetables', sales: '$24,580', percentage: '92%' },
              { name: 'Maria Rodriguez', products: 'Free-range Eggs', sales: '$19,840', percentage: '87%' },
              { name: 'Robert Johnson', products: 'Grass-fed Meat', sales: '$18,760', percentage: '81%' },
              { name: 'Sarah Williams', products: 'Artisanal Products', sales: '$15,920', percentage: '73%' },
              { name: 'Michael Chen', products: 'Rice, Beans', sales: '$14,350', percentage: '68%' }
            ].map((farmer, index) => (
              <div key={index} className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="font-semibold text-green-600">{index + 1}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{farmer.name}</h4>
                      <p className="text-xs text-dashboard-text-light">{farmer.products}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{farmer.sales}</div>
                      <div className="text-xs text-green-600">{farmer.percentage}</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-100 mt-1">
                    <div 
                      className="h-1 bg-green-500" 
                      style={{ width: farmer.percentage }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;