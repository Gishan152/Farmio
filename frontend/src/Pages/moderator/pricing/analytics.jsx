import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const PriceAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [priceDeviationData, setPriceDeviationData] = useState(null);
  const [priceComparisonData, setPriceComparisonData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('May 2023');

  // Load data
  useEffect(() => {
    // Simulated data loading - would fetch from API in a real app
    setTimeout(() => {
      generateChartData();
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!loading) {
      generateChartData();
    }
  }, [selectedMonth]);

  const generateChartData = () => {
    // Generate data for Category Average Prices
    const categories = ['Grains', 'Vegetables', 'Fruits', 'Meat', 'Seafood', 'Dairy', 'Oil'];
    const govPrices = categories.map(() => Math.floor(Math.random() * 400) + 100);
    const marketPrices = govPrices.map(price => Math.floor(price * (1 + Math.random() * 0.3)));
    
    setCategoryData({
      labels: categories,
      datasets: [
        {
          label: 'Government Price (LKR)',
          data: govPrices,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'Market Price (LKR)',
          data: marketPrices,
          backgroundColor: 'rgba(53, 162, 235, 0.7)',
        },
      ],
    });

    // Generate data for Price Deviation by Product
    const products = ['Rice', 'Potatoes', 'Onions', 'Coconut', 'Bananas', 'Tomatoes'];
    const deviations = products.map(() => Math.floor(Math.random() * 30) + 5);
    
    setPriceDeviationData({
      labels: products,
      datasets: [
        {
          label: 'Price Deviation (%)',
          data: deviations,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    });

    // Generate data for Regional Price Comparison
    const regions = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
    
    // Generate random data for each region, keeping values between 60-140 (percentage of national average)
    const regionalData = regions.map(() => {
      return {
        rice: Math.floor(Math.random() * 40) + 80,
        vegetables: Math.floor(Math.random() * 40) + 80,
        fruits: Math.floor(Math.random() * 40) + 80,
        meat: Math.floor(Math.random() * 40) + 80,
        seafood: Math.floor(Math.random() * 40) + 80
      };
    });
    
    setPriceComparisonData({
      labels: ['Rice', 'Vegetables', 'Fruits', 'Meat', 'Seafood'],
      datasets: regions.map((region, index) => ({
        label: region,
        data: [
          regionalData[index].rice,
          regionalData[index].vegetables,
          regionalData[index].fruits,
          regionalData[index].meat,
          regionalData[index].seafood
        ],
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        pointBackgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      })),
    });
  };

  const monthOptions = [
    'May 2023', 'April 2023', 'March 2023', 'February 2023', 'January 2023',
    'December 2022', 'November 2022', 'October 2022'
  ];

  return (
    <DashboardLayout
      title="Price Analytics"
      userRole="moderator"
      breadcrumbs="Pricing / Price Analytics"
    >
      <div className="mb-6">
        <p className="text-gray-600">
          Advanced analytics and insights for agricultural product pricing.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="w-64">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Select Month
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border border-pastel-purple rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <button className="bg-pastel-purple hover:bg-purple-300 text-farmio-dark font-medium py-2 px-4 rounded transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pastel-blue">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Price Difference</h3>
              <p className="text-3xl font-bold text-blue-600">18.7%</p>
              <p className="text-sm text-gray-500 mt-1">Between government and market prices</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pastel-orange">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Most Volatile Category</h3>
              <p className="text-3xl font-bold text-orange-600">Vegetables</p>
              <p className="text-sm text-gray-500 mt-1">24.3% price fluctuation in last 30 days</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pastel-purple">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Regional Price Variance</h3>
              <p className="text-3xl font-bold text-purple-600">32.1%</p>
              <p className="text-sm text-gray-500 mt-1">Difference between highest and lowest regions</p>
            </div>
          </div>
          
          {/* Category Average Prices */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Category Average Prices - {selectedMonth}
            </h2>
            <div className="h-80">
              {categoryData && <Bar 
                data={categoryData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'LKR ' + value;
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.dataset.label}: LKR ${context.parsed.y}`;
                        }
                      }
                    }
                  }
                }}
              />}
            </div>
          </div>
          
          {/* Price Deviation and Regional Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Deviation by Product */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Price Deviation by Product
              </h2>
              <div className="h-80 flex items-center justify-center">
                {priceDeviationData && <Pie 
                  data={priceDeviationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed}% deviation`;
                          }
                        }
                      }
                    }
                  }}
                />}
              </div>
            </div>
            
            {/* Regional Price Comparison */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Regional Price Comparison (% of National Average)
              </h2>
              <div className="h-80 flex items-center justify-center">
                {priceComparisonData && <Radar 
                  data={priceComparisonData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        angleLines: {
                          display: true
                        },
                        min: 60,
                        max: 140,
                        ticks: {
                          stepSize: 20,
                          callback: function(value) {
                            return value + '%';
                          }
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r}% of national average`;
                          }
                        }
                      }
                    }
                  }}
                />}
              </div>
            </div>
          </div>
          
          {/* Insights & Recommendations */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pastel-green">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Insights & Recommendations
            </h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-pastel-blue bg-pastel-blue bg-opacity-20">
                <h3 className="font-semibold text-blue-800">Price Gap Analysis</h3>
                <p className="text-gray-700">The average price gap between government and market prices is 18.7%. This suggests potential for improved price controls in certain categories.</p>
              </div>
              <div className="p-4 border-l-4 border-pastel-orange bg-pastel-orange bg-opacity-20">
                <h3 className="font-semibold text-orange-800">Seasonal Trends</h3>
                <p className="text-gray-700">Vegetable prices show the highest volatility, suggesting a need for improved supply chain management during seasonal transitions.</p>
              </div>
              <div className="p-4 border-l-4 border-pastel-green bg-pastel-green bg-opacity-20">
                <h3 className="font-semibold text-green-800">Regional Disparities</h3>
                <p className="text-gray-700">Northern and Eastern provinces show consistently higher prices across all categories, indicating transportation or distribution issues that should be addressed.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PriceAnalyticsPage;
