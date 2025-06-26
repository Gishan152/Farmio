import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/warehouse/Sidebar';

const ReportsAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState('30');
    const [selectedReport, setSelectedReport] = useState('overview');
   
    // Mock reports data
    const mockReportData = {
        overview: {
            totalRevenue: 125000,
            totalItems: 1050,
            averageStorage: 18,
            turnoverRate: 85,
            wastePercentage: 3.2,
            customerSatisfaction: 4.6
        },
        inventory: {
            totalReceived: 2450,
            totalDispatched: 2080,
            currentStock: 370,
            perishableItems: 280,
            nonPerishableItems: 90
        },
        financial: {
            storageRevenue: 98000,
            serviceCharges: 27000,
            operatingCosts: 45000,
            netProfit: 80000,
            profitMargin: 64
        },
        trends: [
            { month: 'Jun', received: 180, dispatched: 165, revenue: 18500 },
            { month: 'Jul', received: 220, dispatched: 210, revenue: 22000 },
            { month: 'Aug', received: 190, dispatched: 185, revenue: 19500 },
            { month: 'Sep', received: 240, dispatched: 225, revenue: 24500 },
            { month: 'Oct', received: 210, dispatched: 195, revenue: 21000 },
            { month: 'Nov', received: 250, dispatched: 240, revenue: 25500 },
            { month: 'Dec', received: 200, dispatched: 190, revenue: 20000 }
        ]
    };

    useEffect(() => {
        const loadReportData = async () => {
            try {
                setReportData(mockReportData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report data:", error);
                setReportData(mockReportData);
                setLoading(false);
            }
        };

        loadReportData();
    }, [selectedPeriod]);

    const generateReport = (type) => {
        const reportContent = `Warehouse Report - ${type.toUpperCase()}\nGenerated: ${new Date().toLocaleDateString()}\nPeriod: Last ${selectedPeriod} days\n\n${JSON.stringify(reportData, null, 2)}`;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warehouse-${type}-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading reports data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-green-50">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2">
                            <span className="text-3xl lg:text-4xl">📊</span> Reports & Analytics
                        </h1>
                        <p className="text-green-700 mt-1 text-sm">Generate detailed reports and analyze inventory trends for better decision making.</p>
                    </div>

                    {/* Controls */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 3 months</option>
                                <option value="365">Last year</option>
                            </select>
                            
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                            >
                                <option value="overview">Overview Report</option>
                                <option value="inventory">Inventory Report</option>
                                <option value="financial">Financial Report</option>
                                <option value="trends">Trends Analysis</option>
                            </select>

                            <button 
                                onClick={() => generateReport(selectedReport)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Export Report
                            </button>
                        </div>
                    </div>

                    {/* Overview Stats */}
                    {selectedReport === 'overview' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow border border-green-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                                        <span className="text-2xl">💰</span>
                                    </div>
                                    <p className="text-3xl font-bold text-green-600">Rs. {reportData.overview?.totalRevenue?.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600 mt-1">Last {selectedPeriod} days</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Items Processed</h3>
                                        <span className="text-2xl">📦</span>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">{reportData.overview?.totalItems}</p>
                                    <p className="text-sm text-gray-600 mt-1">Total items handled</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-purple-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Avg Storage Days</h3>
                                        <span className="text-2xl">⏱️</span>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-600">{reportData.overview?.averageStorage}</p>
                                    <p className="text-sm text-gray-600 mt-1">Days per item</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Turnover Rate</h3>
                                        <span className="text-2xl">🔄</span>
                                    </div>
                                    <p className="text-3xl font-bold text-yellow-600">{reportData.overview?.turnoverRate}%</p>
                                    <p className="text-sm text-gray-600 mt-1">Efficiency rate</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-red-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Waste Percentage</h3>
                                        <span className="text-2xl">🗑️</span>
                                    </div>
                                    <p className="text-3xl font-bold text-red-600">{reportData.overview?.wastePercentage}%</p>
                                    <p className="text-sm text-gray-600 mt-1">Items wasted</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-orange-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Customer Rating</h3>
                                        <span className="text-2xl">⭐</span>
                                    </div>
                                    <p className="text-3xl font-bold text-orange-600">{reportData.overview?.customerSatisfaction}/5</p>
                                    <p className="text-sm text-gray-600 mt-1">Average rating</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory Report */}
                    <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Inventory Analysis</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Received vs Dispatched</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Total Received:</span>
                                            <span className="font-bold text-green-600">{reportData.inventory?.totalReceived} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Dispatched:</span>
                                            <span className="font-bold text-blue-600">{reportData.inventory?.totalDispatched} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Current Stock:</span>
                                            <span className="font-bold text-purple-600">{reportData.inventory?.currentStock} kg</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Stock Composition</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Perishable:</span>
                                            <span className="font-bold text-red-600">{reportData.inventory?.perishableItems} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Non-Perishable:</span>
                                            <span className="font-bold text-green-600">{reportData.inventory?.nonPerishableItems} kg</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-red-500 h-3 rounded-l-full" 
                                                style={{ width: `${(reportData.inventory?.perishableItems / reportData.inventory?.currentStock) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {Math.round((reportData.inventory?.perishableItems / reportData.inventory?.currentStock) * 100)}% perishable
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>                

                    {/* Financial Report */}
                    {selectedReport === 'financial' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Financial Performance</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow border border-green-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Storage Revenue</h3>
                                    <p className="text-2xl font-bold text-green-600">Rs. {reportData.financial?.storageRevenue?.toLocaleString()}</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Service Charges</h3>
                                    <p className="text-2xl font-bold text-blue-600">Rs. {reportData.financial?.serviceCharges?.toLocaleString()}</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-red-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Operating Costs</h3>
                                    <p className="text-2xl font-bold text-red-600">Rs. {reportData.financial?.operatingCosts?.toLocaleString()}</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow border border-purple-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Profit</h3>
                                    <p className="text-2xl font-bold text-purple-600">Rs. {reportData.financial?.netProfit?.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Profit Margin Analysis</h3>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                        className="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium" 
                                        style={{ width: `${reportData.financial?.profitMargin}%` }}
                                    >
                                        {reportData.financial?.profitMargin}%
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Excellent profit margin - Industry average is 25-35%
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Trends Analysis */}
                    {selectedReport === 'trends' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Trends Analysis</h2>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Performance Trends</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">Month</th>
                                                <th className="text-left py-3 px-4">Items Received</th>
                                                <th className="text-left py-3 px-4">Items Dispatched</th>
                                                <th className="text-left py-3 px-4">Revenue (Rs.)</th>
                                                <th className="text-left py-3 px-4">Efficiency</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.trends?.map((trend, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">{trend.month}</td>
                                                    <td className="py-3 px-4">{trend.received} kg</td>
                                                    <td className="py-3 px-4">{trend.dispatched} kg</td>
                                                    <td className="py-3 px-4">Rs. {trend.revenue.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            (trend.dispatched / trend.received) >= 0.9 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : (trend.dispatched / trend.received) >= 0.8 
                                                                ? 'bg-yellow-100 text-yellow-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {Math.round((trend.dispatched / trend.received) * 100)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Peak Season</h3>
                                    <p className="text-3xl font-bold text-green-600">November</p>
                                    <p className="text-sm text-gray-600 mt-1">Highest volume month</p>
                                    <p className="text-sm text-gray-500">250 kg received, Rs. 25,500 revenue</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Growth Rate</h3>
                                    <p className="text-3xl font-bold text-blue-600">+12%</p>
                                    <p className="text-sm text-gray-600 mt-1">Month-over-month avg</p>
                                    <p className="text-sm text-gray-500">Consistent growth trend</p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Best Performance</h3>
                                    <p className="text-3xl font-bold text-purple-600">95%</p>
                                    <p className="text-sm text-gray-600 mt-1">Efficiency rate</p>
                                    <p className="text-sm text-gray-500">September performance</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReportsAnalytics;