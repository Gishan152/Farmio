import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';

// Icons
const RecyclingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

// Mock chart data
const chartData = {
  month: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: {
      organic: [45, 52, 49, 60],
      packaging: [32, 29, 33, 35],
      mixed: [18, 21, 19, 22]
    }
  },
  quarter: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: {
      organic: [150, 165, 180],
      packaging: [95, 100, 110],
      mixed: [60, 65, 70]
    }
  },
  year: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: {
      organic: [520, 580, 540, 600],
      packaging: [310, 330, 325, 350],
      mixed: [190, 210, 200, 220]
    }
  }
};

// Mock recycling categories data
const recyclingCategories = [
  {
    name: 'Organic Waste',
    totalAmount: '206 tons',
    percentage: '48%',
    trend: '+5%',
    trendDirection: 'up',
    products: [
      { name: 'Compost', amount: '140 tons', percentage: '68%' },
      { name: 'Biogas', amount: '45 tons', percentage: '22%' },
      { name: 'Liquid Fertilizer', amount: '21 tons', percentage: '10%' }
    ]
  },
  {
    name: 'Packaging Materials',
    totalAmount: '129 tons',
    percentage: '30%',
    trend: '+3%',
    trendDirection: 'up',
    products: [
      { name: 'Recycled Cardboard', amount: '65 tons', percentage: '50%' },
      { name: 'Recycled Plastic', amount: '45 tons', percentage: '35%' },
      { name: 'Other Materials', amount: '19 tons', percentage: '15%' }
    ]
  },
  {
    name: 'Mixed Waste',
    totalAmount: '80 tons',
    percentage: '19%',
    trend: '-2%',
    trendDirection: 'down',
    products: [
      { name: 'Sorted Recyclables', amount: '40 tons', percentage: '50%' },
      { name: 'Energy Recovery', amount: '25 tons', percentage: '31%' },
      { name: 'Landfill', amount: '15 tons', percentage: '19%' }
    ]
  },
  {
    name: 'Food Waste',
    totalAmount: '15 tons',
    percentage: '3%',
    trend: '+1%',
    trendDirection: 'up',
    products: [
      { name: 'Animal Feed', amount: '8 tons', percentage: '53%' },
      { name: 'Biogas', amount: '7 tons', percentage: '47%' }
    ]
  }
];

// Mock impact metrics
const impactMetrics = [
  {
    name: 'CO₂ Emissions Avoided',
    value: '285',
    unit: 'tons',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    )
  },
  {
    name: 'Trees Saved',
    value: '1,450',
    unit: '',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  {
    name: 'Water Saved',
    value: '750,000',
    unit: 'gallons',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    name: 'Landfill Space Saved',
    value: '1,200',
    unit: 'cubic meters',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
];

// Mock sustainability reports
const sustainabilityReports = [
  {
    title: 'Q2 2023 Recycling Impact Report',
    date: 'June 15, 2023',
    description: 'Comprehensive analysis of waste management achievements and sustainability metrics for Q2 2023.',
    downloadUrl: '#'
  },
  {
    title: 'Monthly Sustainability Highlights - May 2023',
    date: 'June 5, 2023',
    description: 'Summary of key recycling metrics and sustainability achievements for May 2023.',
    downloadUrl: '#'
  },
  {
    title: 'Food Waste Reduction Initiative Results',
    date: 'May 20, 2023',
    description: 'Results and impact of our focused initiative to reduce food waste in the supply chain.',
    downloadUrl: '#'
  },
  {
    title: 'Q1 2023 Recycling Impact Report',
    date: 'April 10, 2023',
    description: 'Comprehensive analysis of waste management achievements and sustainability metrics for Q1 2023.',
    downloadUrl: '#'
  }
];

const RecyclingStats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Function to render a basic chart (in a real app, you would use a charting library)
  const renderChart = (data, labels) => {
    // This is a placeholder for where a real chart would be rendered
    // In a real application, you would use a library like Chart.js or Recharts

    return (
      <div className="p-4 bg-white rounded-md border border-gray-200">
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Waste Recycling Volumes</h3>
          <div className="flex space-x-2">
            <button
              className={`px-2 py-1 text-xs rounded-md ${timeRange === 'month' ? 'bg-farmio text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-md ${timeRange === 'quarter' ? 'bg-farmio text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-md ${timeRange === 'year' ? 'bg-farmio text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Placeholder for chart - in a real app, replace with actual chart component */}
        <div className="h-64 bg-gray-50 border border-dashed border-gray-300 rounded-md flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Chart Visualization</div>
            <div className="text-xs text-gray-400">
              Time Period: {timeRange} <br />
              Data Series: Organic Waste, Packaging Materials, Mixed Waste <br />
              Labels: {labels.join(', ')}
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Organic Waste</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Packaging Materials</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Mixed Waste</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Recycling Statistics"
      breadcrumbs="Waste Management / Recycling Stats"
      userRole="admin"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Waste Processed"
          value="430"
          subtitle="tons this month"
          icon={<RecyclingIcon />}
          color="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Recycling Rate"
          value="81%"
          subtitle="+3% from last month"
          icon={<RecyclingIcon />}
          color="green"
          isLoading={isLoading}
        />
        <StatCard
          title="Organic Waste"
          value="48%"
          subtitle="of total waste"
          icon={<RecyclingIcon />}
          color="yellow"
          isLoading={isLoading}
        />
        <StatCard
          title="Landfill Diversion"
          value="96.5%"
          subtitle="Diversion rate"
          icon={<RecyclingIcon />}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h2 className="text-lg font-medium text-gray-700">Recycling Trends</h2>

          <div className="ml-auto">
            {/* Filter Button */}
            <button
              className="flex items-center text-sm py-2 px-4 rounded-md border border-dashboard-border hover:bg-gray-100"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <FilterIcon />
              <span className="ml-2">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilterPanel && (
          <div className="mb-4 p-4 bg-white border border-dashboard-border rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-3 text-dashboard-text-primary">Filter Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-dashboard-text-secondary">Date Range</label>
                <select
                  className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                >
                  <option>Last 30 days</option>
                  <option>Last Quarter</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-dashboard-text-secondary">Waste Type</label>
                <select
                  className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                >
                  <option>All Types</option>
                  <option>Organic</option>
                  <option>Packaging</option>
                  <option>Mixed</option>
                  <option>Food Waste</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-dashboard-text-secondary">Processing Facility</label>
                <select
                  className="w-full rounded-md border border-dashboard-border py-1.5 pl-3 pr-8 text-sm"
                >
                  <option>All Facilities</option>
                  <option>Green Valley Recycling Center</option>
                  <option>River Basin Composting Facility</option>
                  <option>Metro Recycling Industries</option>
                  <option>Urban Biogas Plant</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-3 py-1 text-sm text-gray-600 border border-dashboard-border rounded-md hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                className="px-3 py-1 text-sm bg-farmio text-white rounded-md hover:bg-green-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="mb-6">
          {renderChart(chartData[timeRange], chartData[timeRange].labels)}
        </div>
      </div>

      {/* Recycling Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Recycling Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recyclingCategories.map((category, index) => (
            <Card key={index} title={category.name} noPadding={false} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-2xl font-bold">{category.totalAmount}</div>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">{category.percentage} of total</span>
                    <span className={`text-xs ${category.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {category.trend}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-grow">
                  {category.products.map((product, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{product.name}</span>
                        <span>{product.percentage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-farmio"
                          style={{ width: product.percentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Environmental Impact</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {impactMetrics.map((metric, index) => (
            <Card key={index} className="text-center p-4">
              <div className="flex flex-col items-center">
                <div className="mb-2">{metric.icon}</div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.unit}</div>
                <div className="text-sm font-medium mt-1">{metric.name}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sustainability Reports */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Sustainability Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sustainabilityReports.map((report, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{report.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarIcon />
                    <span className="ml-1">{report.date}</span>
                  </div>
                </div>
                <a
                  href={report.downloadUrl}
                  className="p-2 text-farmio hover:bg-green-50 rounded-full"
                  title="Download Report"
                >
                  <DownloadIcon />
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">{report.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecyclingStats;
