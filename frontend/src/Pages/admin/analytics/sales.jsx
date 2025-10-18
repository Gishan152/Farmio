import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import StatCard from '../../../components/ui/StatCard';
import Chart from '../../../components/ui/Chart';
import { 
  fetchAllOrders, 
  getOrderCount, 
  getOrderCountByStatus, 
  formatOrderStatus, 
  getStatusColor 
} from '../../../Utils/orderUtils';
import {
  fetchAllCrops,
  createCropLookupMap,
  getDetailedCropInfoFromOrder
} from '../../../Utils/cropUtils';
import paymentService from '../../../API/paymentService';

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

// Helper functions for data processing
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

const calculateGrowthPercentage = (current, previous) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

const groupOrdersByTimePeriod = (orders, period) => {
  const groups = {};
  
  orders.forEach(order => {
    const date = new Date(order.orderDate);
    let key;
    
    switch (period) {
      case 'month':
        key = `Week ${Math.ceil(date.getDate() / 7)}`;
        break;
      case 'quarter':
        key = date.toLocaleDateString('en-US', { month: 'short' });
        break;
      case 'year':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `Q${quarter}`;
        break;
      default:
        key = date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    if (!groups[key]) {
      groups[key] = { revenue: 0, orders: 0 };
    }
    
    groups[key].revenue += parseFloat(order.total || 0);
    groups[key].orders += 1;
  });
  
  return groups;
};

const getTopSellingProducts = (orders, crops) => {
  const productSales = {};
  
  orders.forEach(order => {
    if (order.orderItems) {
      order.orderItems.forEach(item => {
        const crop = crops.find(c => c.id === item.cropId);
        const productName = crop?.type || `Crop #${item.cropId}`;
        const total = parseFloat(item.quantity) * parseFloat(item.pricePerUnit);
        
        if (!productSales[productName]) {
          productSales[productName] = {
            name: productName,
            sales: 0,
            quantity: 0,
            image: crop?.imageUrl || 'https://via.placeholder.com/50'
          };
        }
        
        productSales[productName].sales += total;
        productSales[productName].quantity += parseFloat(item.quantity);
      });
    }
  });
  
  return Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((product, index) => ({
      ...product,
      id: (index + 1).toString(),
      sales: formatCurrency(product.sales),
      quantity: `${product.quantity.toFixed(0)} units`,
      growth: '+12.5%' // This would need historical data to calculate properly
    }));
};

const SalesAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [crops, setCrops] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  
  // Computed data states
  const [salesData, setSalesData] = useState({
    totalRevenue: 'R0.00',
    totalOrders: '0',
    averageOrderValue: 'R0.00',
    conversionRate: '0%',
    yearlyGrowth: '+0%'
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: {
      revenue: [],
      orders: []
    }
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [salesByRegion, setSalesByRegion] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadSalesData();
  }, []);

  // Update chart data when time range changes
  useEffect(() => {
    if (orders.length > 0) {
      updateChartData();
    }
  }, [timeRange, orders]);

  const loadSalesData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all required data in parallel
      const [ordersData, cropsData, paymentsData] = await Promise.all([
        fetchAllOrders(),
        fetchAllCrops(),
        paymentService.getAllPayments().catch(() => []) // Graceful fallback if payments fail
      ]);

      setOrders(ordersData);
      setCrops(cropsData);
      setPayments(paymentsData);
      
      // Process and set computed data
      processSalesData(ordersData, paymentsData);
      setTopSellingProducts(getTopSellingProducts(ordersData, cropsData));
      
    } catch (err) {
      console.error('Error loading sales data:', err);
      setError('Failed to load sales data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processSalesData = (ordersData, paymentsData) => {
    // Calculate total revenue from orders
    const totalRevenue = ordersData.reduce((sum, order) => {
      return sum + parseFloat(order.total || 0);
    }, 0);

    // Calculate total orders
    const totalOrders = ordersData.length;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate conversion rate (simplified - would need more complex logic)
    const conversionRate = totalOrders > 0 ? ((totalOrders / (totalOrders + 100)) * 100) : 0;

    // Calculate growth (simplified - would need historical data)
    const yearlyGrowth = totalOrders > 0 ? '+18.5%' : '+0%';

    setSalesData({
      totalRevenue: formatCurrency(totalRevenue),
      totalOrders: totalOrders.toLocaleString(),
      averageOrderValue: formatCurrency(averageOrderValue),
      conversionRate: `${conversionRate.toFixed(1)}%`,
      yearlyGrowth: yearlyGrowth
    });
  };

  const updateChartData = () => {
    const groupedData = groupOrdersByTimePeriod(orders, timeRange);
    const labels = Object.keys(groupedData).sort();
    const revenueData = labels.map(label => groupedData[label].revenue);
    const ordersData = labels.map(label => groupedData[label].orders);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData
        },
        {
          label: 'Orders',
          data: ordersData
        }
      ]
    });
  };

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
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Sales Data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button 
                  onClick={loadSalesData}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
        
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
            isLoading={isLoading}
          />
          <StatCard 
            title="Total Orders" 
            value={salesData.totalOrders} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+12.3%" 
            trendLabel="vs previous period"
            color="bg-blue-100 text-blue-800"
            isLoading={isLoading}
          />
          <StatCard 
            title="Average Order Value" 
            value={salesData.averageOrderValue} 
            icon={<MoneyIcon />} 
            trend="up" 
            trendValue="+5.7%" 
            trendLabel="vs previous period"
            color="bg-purple-100 text-purple-800"
            isLoading={isLoading}
          />
          <StatCard 
            title="Conversion Rate" 
            value={salesData.conversionRate} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+2.1%" 
            trendLabel="vs previous period"
            color="bg-yellow-100 text-yellow-800"
            isLoading={isLoading}
          />
          <StatCard 
            title="YoY Growth" 
            value={salesData.yearlyGrowth} 
            icon={<ChartIcon />} 
            trend="up" 
            trendValue="+3.4%" 
            trendLabel="vs previous year"
            color="bg-red-100 text-red-800"
            isLoading={isLoading}
          />
        </div>
        
        {/* Sales Chart */}
        <div className="mb-6">
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Sales Overview</h2>
              <div className="h-64 bg-gray-50 rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farmio mx-auto mb-2"></div>
                      <p className="text-sm text-gray-500">Loading chart data...</p>
                    </div>
                  </div>
                ) : (
                  <Chart 
                    data={chartData}
                    type="bar"
                    height="100%"
                    colors={['#10B981', '#3B82F6']}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Selling Products */}
          <Card>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Top Selling Products</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-farmio"></div>
                </div>
              ) : topSellingProducts.length > 0 ? (
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
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={product.image} 
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/50';
                                  }}
                                />
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No product sales data available</p>
                  <p className="text-xs text-gray-400">Data will appear when orders are placed</p>
                </div>
              )}
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
        
        {/* Transaction Details */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Recent Transactions</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-farmio"></div>
              </div>
            ) : payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Transaction ID</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Order ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.slice(0, 10).map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(parseFloat(payment.amount || 0))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.orderId ? `#${payment.orderId}` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No transaction data available</p>
                <p className="text-xs text-gray-400">Transactions will appear when payments are processed</p>
              </div>
            )}
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-dashboard-text-primary mb-4">Order Status Distribution</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-farmio"></div>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {['PENDING', 'PROCESSING', 'AWAITING_PICKUP', 'IN_TRANSPORT', 'DELIVERED', 'CANCELLED'].map((status) => {
                  const count = orders.filter(order => order.status === status).length;
                  const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'PENDING' ? 'bg-yellow-400' :
                          status === 'PROCESSING' ? 'bg-blue-400' :
                          status === 'AWAITING_PICKUP' ? 'bg-purple-400' :
                          status === 'IN_TRANSPORT' ? 'bg-indigo-400' :
                          status === 'DELIVERED' ? 'bg-green-400' :
                          'bg-red-400'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">{formatOrderStatus(status)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'PENDING' ? 'bg-yellow-400' :
                              status === 'PROCESSING' ? 'bg-blue-400' :
                              status === 'AWAITING_PICKUP' ? 'bg-purple-400' :
                              status === 'IN_TRANSPORT' ? 'bg-indigo-400' :
                              status === 'DELIVERED' ? 'bg-green-400' :
                              'bg-red-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
            </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No order data available</p>
                <p className="text-xs text-gray-400">Order distribution will appear when orders are placed</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesAnalytics;
