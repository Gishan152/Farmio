import React, { useEffect, useState, useMemo } from 'react';
import { 
    // Commented out unused imports to avoid linting errors
    // fetchInventoryItems, 
    // fetchInventoryByFarmer, 
    // fetchInventoryByProduceType,
    // getCapacityAlerts,
    // generateInventoryReport
} from '../../../API/warehouse/inventory';
import CapacityIndicator from '../../../components/warehouse/CapacityIndicator';
import Sidebar from '../../../components/warehouse/Sidebar';

const InventoryIndex = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [capacity, setCapacity] = useState({
        totalCapacity: 5000,
        usedCapacity: 0,
        availableCapacity: 5000,
        utilizationPercentage: 0,
        alertThreshold: 80
    });
    const [filters, setFilters] = useState({
        farmer: '',
        produceType: '',
        status: ''
    });
    const [sortBy, setSortBy] = useState('storageDate');
    const [error, setError] = useState(null);

    // Mock data as fallback
    const mockInventoryItems = useMemo(() => [
        {
            id: 1,
            produceName: "Organic Tomatoes",
            farmerName: "John Smith",
            quantity: 150,
            unit: "kg",
            produceType: "vegetables",
            status: "fresh",
            storageDate: "2024-12-20",
            expiryDate: "2025-01-05",
            storageDuration: 15,
            location: "Section A-1",
            temperature: "4°C",
            humidity: "85%"
        },
        {
            id: 2,
            produceName: "Fresh Apples",
            farmerName: "Mary Johnson",
            quantity: 200,
            unit: "kg",
            produceType: "fruits",
            status: "fresh",
            storageDate: "2024-12-18",
            expiryDate: "2025-01-15",
            storageDuration: 28,
            location: "Section B-2",
            temperature: "2°C",
            humidity: "90%"
        },
        {
            id: 3,
            produceName: "Wheat Grain",
            farmerName: "David Brown",
            quantity: 500,
            unit: "kg",
            produceType: "grains",
            status: "fresh",
            storageDate: "2024-12-15",
            expiryDate: "2025-06-15",
            storageDuration: 180,
            location: "Section C-1",
            temperature: "18°C",
            humidity: "60%"
        },
        {
            id: 4,
            produceName: "Fresh Lettuce",
            farmerName: "Sarah Wilson",
            quantity: 80,
            unit: "kg",
            produceType: "vegetables",
            status: "near-expiry",
            storageDate: "2024-12-22",
            expiryDate: "2024-12-28",
            storageDuration: 6,
            location: "Section A-3",
            temperature: "4°C",
            humidity: "95%"
        },
        {
            id: 5,
            produceName: "Organic Carrots",
            farmerName: "Mike Davis",
            quantity: 120,
            unit: "kg",
            produceType: "vegetables",
            status: "fresh",
            storageDate: "2024-12-19",
            expiryDate: "2025-01-10",
            storageDuration: 22,
            location: "Section A-2",
            temperature: "4°C",
            humidity: "90%"
        }
    ], []);

    const mockFarmers = useMemo(() => [
        { id: 1, name: "John Smith" },
        { id: 2, name: "Mary Johnson" },
        { id: 3, name: "David Brown" },
        { id: 4, name: "Sarah Wilson" },
        { id: 5, name: "Mike Davis" }
    ], []);

    const mockAlerts = useMemo(() => [
        { message: "Lettuce in Section A-3 expires in 2 days", priority: "high", timestamp: "2024-12-26T10:00:00Z" },
        { message: "Storage capacity at 75% - consider processing", priority: "medium", timestamp: "2024-12-25T08:00:00Z" }
    ], []);

    useEffect(() => {
        const loadInventoryData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // For development, use mock data since API isn't ready
                setInventoryItems(mockInventoryItems);
                setFarmers(mockFarmers);
                setAlerts(mockAlerts);

                // Calculate capacity from mock data
                const totalQuantity = mockInventoryItems.reduce((sum, item) => sum + item.quantity, 0);
                const maxCapacity = 5000; // kg
                const usedCapacity = totalQuantity;
                const availableCapacity = maxCapacity - usedCapacity;
                const utilizationPercentage = Math.round((totalQuantity / maxCapacity) * 100);

                setCapacity({
                    totalCapacity: maxCapacity,
                    usedCapacity,
                    availableCapacity,
                    utilizationPercentage,
                    alertThreshold: 80
                });
                
                // Uncomment when API is available
                /*
                const [items, alertsData, capacityData] = await Promise.all([
                    fetchInventoryItems(),
                    getCapacityAlerts(),
                    getInventoryCapacity()
                ]);
                
                setInventoryItems(items);
                setAlerts(alertsData);
                setCapacity(capacityData);
                
                const uniqueFarmers = [...new Set(items.map(item => item.farmerName))]
                    .map((name, index) => ({ id: index + 1, name }));
                setFarmers(uniqueFarmers);
                */
                
            } catch (error) {
                console.error("Error fetching inventory data:", error);
                setError("API service unavailable. Using demo data.");
                
                setInventoryItems(mockInventoryItems);
                setFarmers(mockFarmers);
                setAlerts(mockAlerts);

                // Calculate capacity from mock data as fallback
                const totalQuantity = mockInventoryItems.reduce((sum, item) => sum + item.quantity, 0);
                const maxCapacity = 5000; // kg
                const usedCapacity = totalQuantity;
                const availableCapacity = maxCapacity - usedCapacity;
                const utilizationPercentage = Math.round((totalQuantity / maxCapacity) * 100);

                setCapacity({
                    totalCapacity: maxCapacity,
                    usedCapacity,
                    availableCapacity,
                    utilizationPercentage,
                    alertThreshold: 80
                });
            } finally {
                setLoading(false);
            }
        };

        loadInventoryData();
    }, [mockInventoryItems, mockFarmers, mockAlerts]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const handleGenerateReport = (format) => {
        try {
            // Fallback: create a simple CSV or text report from current data
            if (format === 'csv') {
                const csvData = sortedItems.map(item => 
                    `"${item.produceName}","${item.farmerName}","${item.quantity}","${item.unit}","${item.produceType}","${item.status}","${item.storageDate}","${item.expiryDate}","${item.location}","${item.temperature}","${item.humidity}"`
                ).join('\n');
                const csvHeader = '"Product Name","Farmer","Quantity","Unit","Type","Status","Storage Date","Expiry Date","Location","Temperature","Humidity"\n';
                const csvContent = csvHeader + csvData;
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `warehouse-inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            } else if (format === 'pdf') {
                // For PDF, create a simple text version for now
                const textData = sortedItems.map(item => 
                    `${item.produceName} - ${item.farmerName} - ${item.quantity} ${item.unit} - ${item.status} - ${item.location} - ${item.storageDate} - ${item.expiryDate}`
                ).join('\n');
                const blob = new Blob([textData], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `warehouse-inventory-report-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Error generating report. Please try again.");
        }
    };

    const filteredItems = inventoryItems.filter(item => {
        return (
            (filters.farmer === '' || item.farmerName === filters.farmer) &&
            (filters.produceType === '' || item.produceType === filters.produceType) &&
            (filters.status === '' || item.status === filters.status)
        );
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case 'storageDate':
                return new Date(b.storageDate) - new Date(a.storageDate);
            case 'expiryDate':
                return new Date(a.expiryDate) - new Date(b.expiryDate);
            case 'quantity':
                return b.quantity - a.quantity;
            case 'farmer':
                return a.farmerName.localeCompare(b.farmerName);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading warehouse inventory...</p>
                    </div>
                </div>
            </div>
        );
    }

    const isNearCapacity = capacity.utilizationPercentage >= capacity.alertThreshold;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Warehouse Inventory Management</h1>

                        {/* Capacity Alert */}
                        {isNearCapacity && (
                            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded">
                                <h3 className="font-semibold text-red-800">⚠️ Capacity Alert</h3>
                                <p className="text-red-700">
                                    Warehouse is at {capacity.utilizationPercentage}% capacity. 
                                    Consider expanding storage or processing stored produce.
                                </p>
                            </div>
                        )}

                        {/* Capacity Indicator */}
                        <div className="mb-8">
                            <CapacityIndicator capacity={capacity} showDetails={true} />
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow border border-green-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Items</h3>
                                <p className="text-3xl font-bold text-green-600">{inventoryItems.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-yellow-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Near Expiry</h3>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {inventoryItems.filter(item => item.status === 'near-expiry').length}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Weight</h3>
                                <p className="text-3xl font-bold text-blue-600">{capacity.usedCapacity} kg</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-purple-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Capacity Used</h3>
                                <p className="text-3xl font-bold text-purple-600">{capacity.utilizationPercentage}%</p>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded">
                                <h3 className="font-semibold text-orange-800">ℹ️ Demo Mode</h3>
                                <p className="text-orange-700">{error}</p>
                            </div>
                        )}

                        {/* Alerts Section */}
                        {alerts.length > 0 && (
                            <div className="mb-8 bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Maintenance & Alerts</h3>
                                <div className="space-y-3">
                                    {alerts.map((alert, index) => (
                                        <div 
                                            key={index} 
                                            className={`p-3 rounded border-l-4 ${
                                                alert.priority === 'high' ? 'bg-red-50 border-red-400' :
                                                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                                                'bg-blue-50 border-blue-400'
                                            }`}
                                        >
                                            <p className="font-medium">{alert.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filters and Controls */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={filters.farmer}
                                onChange={(e) => handleFilterChange('farmer', e.target.value)}
                            >
                                <option value="">All Farmers</option>
                                {farmers.map(farmer => (
                                    <option key={farmer.id} value={farmer.name}>{farmer.name}</option>
                                ))}
                            </select>
                            
                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={filters.produceType}
                                onChange={(e) => handleFilterChange('produceType', e.target.value)}
                            >
                                <option value="">All Produce Types</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                                <option value="grains">Grains</option>
                                <option value="herbs">Herbs</option>
                            </select>

                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="fresh">Fresh</option>
                                <option value="near-expiry">Near Expiry</option>
                                <option value="expired">Expired</option>
                            </select>

                            <select 
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="storageDate">Sort by Storage Date</option>
                                <option value="expiryDate">Sort by Expiry Date</option>
                                <option value="quantity">Sort by Quantity</option>
                                <option value="farmer">Sort by Farmer</option>
                            </select>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleGenerateReport('csv')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex-1 text-sm"
                                >
                                    Export CSV
                                </button>
                                <button 
                                    onClick={() => handleGenerateReport('pdf')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1 text-sm"
                                >
                                    Export TXT
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedItems.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg text-gray-800">{item.produceName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        item.status === 'fresh' ? 'bg-green-100 text-green-800' :
                                        item.status === 'near-expiry' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {item.status.replace('-', ' ').toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Farmer:</span>
                                        <span>{item.farmerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Quantity:</span>
                                        <span className="font-semibold text-gray-800">{item.quantity} {item.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Type:</span>
                                        <span className="capitalize">{item.produceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Location:</span>
                                        <span>{item.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Storage:</span>
                                        <span>{new Date(item.storageDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Expires:</span>
                                        <span className={item.status === 'near-expiry' ? 'text-orange-600 font-medium' : ''}>
                                            {new Date(item.expiryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs bg-gray-50 p-3 rounded mt-3">
                                        <span>🌡️ {item.temperature}</span>
                                        <span>💧 {item.humidity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedItems.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <p className="text-gray-500 text-lg">No inventory items found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {filters.farmer || filters.produceType || filters.status 
                                    ? "Try adjusting your search criteria" 
                                    : "Add some inventory items to get started"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryIndex;