import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistoryPage = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('30days');

  // Load products data
  useEffect(() => {
    // Simulated data - would fetch from API in real app
    const sriLankanProducts = [
      { id: 1, name: 'Rice (White)', category: 'Grains' },
      { id: 2, name: 'Rice (Red)', category: 'Grains' },
      { id: 3, name: 'Rice (Basmati)', category: 'Grains' },
      { id: 4, name: 'Coconut', category: 'Fruits' },
      { id: 5, name: 'Mango', category: 'Fruits' },
      { id: 6, name: 'Banana', category: 'Fruits' },
      { id: 7, name: 'Pineapple', category: 'Fruits' },
      { id: 8, name: 'Carrot', category: 'Vegetables' },
      { id: 9, name: 'Potato', category: 'Vegetables' },
      { id: 10, name: 'Onion', category: 'Vegetables' },
      { id: 11, name: 'Green Chili', category: 'Vegetables' },
      { id: 12, name: 'Tomato', category: 'Vegetables' },
      { id: 13, name: 'Chicken', category: 'Meat' },
      { id: 14, name: 'Beef', category: 'Meat' },
      { id: 15, name: 'Pork', category: 'Meat' },
      { id: 16, name: 'Fish (Thalapath)', category: 'Seafood' },
      { id: 17, name: 'Prawn', category: 'Seafood' },
      { id: 18, name: 'Crab', category: 'Seafood' },
      { id: 19, name: 'Tea', category: 'Beverages' },
      { id: 20, name: 'Coconut Oil', category: 'Oil' }
    ];

    setProducts(sriLankanProducts);
    
    if (sriLankanProducts.length > 0) {
      setSelectedProduct(sriLankanProducts[0].id.toString());
    }
    
    setLoading(false);
  }, []);

  // Generate chart data when product or period filter changes
  useEffect(() => {
    if (!selectedProduct) return;

    const generateChartData = () => {
      // Get dates for the x-axis
      const dates = [];
      const now = new Date();
      let daysToShow = 30;
      
      // Set days based on period filter
      if (periodFilter === '7days') daysToShow = 7;
      if (periodFilter === '30days') daysToShow = 30;
      if (periodFilter === '90days') daysToShow = 90;
      if (periodFilter === '180days') daysToShow = 180;
      if (periodFilter === '365days') daysToShow = 365;
      
      for (let i = daysToShow; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        dates.push(formattedDate);
      }

      // Generate random data points with some seasonal trends
      const govPrices = [];
      const marketPrices = [];
      
      // Get base price from product ID to make it realistic
      const basePrice = parseInt(selectedProduct) * 20 + 50;
      
      // Add a seasonal fluctuation
      for (let i = 0; i <= daysToShow; i++) {
        // Add some seasonality with sine wave
        const seasonalFactor = Math.sin((i / daysToShow) * Math.PI) * 0.2;
        // Add some randomness
        const randomGov = Math.random() * 0.1 - 0.05;
        const randomMarket = Math.random() * 0.15 - 0.05;
        
        // Calculate the prices with seasonal and random components
        const govPrice = basePrice * (1 + seasonalFactor + randomGov);
        const marketPrice = govPrice * (1.15 + randomMarket); // Market price is usually higher
        
        govPrices.push(govPrice.toFixed(2));
        marketPrices.push(marketPrice.toFixed(2));
      }

      return {
        labels: dates,
        datasets: [
          {
            label: 'Government Price (LKR)',
            data: govPrices,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Market Price (LKR)',
            data: marketPrices,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.3,
          },
        ],
      };
    };

    setChartData(generateChartData());
  }, [selectedProduct, periodFilter]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setPeriodFilter(e.target.value);
  };

  const getProductName = (id) => {
    const product = products.find(p => p.id.toString() === id);
    return product ? product.name : '';
  };

  return (
    <DashboardLayout
      title="Price History"
      userRole="moderator"
      breadcrumbs="Pricing / Price History"
    >
      <div className="mb-6">
        <p className="text-gray-600">
          Track and analyze historical price trends for agricultural products.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>            <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-pastel-blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product
                  </label>
                  <select
                    id="product"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    className="w-full p-2 border border-pastel-blue rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>                  <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Period
                  </label>
                  <select
                    id="period"
                    value={periodFilter}
                    onChange={handlePeriodChange}
                    className="w-full p-2 border border-pastel-blue rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 3 months</option>
                  <option value="180days">Last 6 months</option>
                  <option value="365days">Last year</option>
                </select>
              </div>
            </div>
            
            {chartData && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Price Trends for {getProductName(selectedProduct)}
                </h2>
                <div className="h-96">
                  <Line 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
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
                      },
                      scales: {
                        y: {
                          ticks: {
                            callback: function(value) {
                              return 'LKR ' + value;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pastel-green">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Key Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 bg-pastel-blue bg-opacity-30">
                <div className="text-sm text-gray-600 mb-1">Current Government Price</div>
                <div className="text-2xl font-bold text-blue-800">
                  LKR {(parseInt(selectedProduct) * 20 + 50).toFixed(2)}
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-pastel-green bg-opacity-30">
                <div className="text-sm text-gray-600 mb-1">Current Market Price</div>
                <div className="text-2xl font-bold text-farmio-dark">
                  LKR {(parseInt(selectedProduct) * 20 + 50 * 1.15).toFixed(2)}
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-pastel-yellow bg-opacity-30">
                <div className="text-sm text-gray-600 mb-1">Price Differential</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {(15).toFixed(2)}%
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-pastel-purple bg-opacity-30">
                <div className="text-sm text-gray-600 mb-1">30-Day Price Change</div>
                <div className="text-2xl font-bold text-purple-800">
                  +{(Math.random() * 8 + 2).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default PriceHistoryPage;
