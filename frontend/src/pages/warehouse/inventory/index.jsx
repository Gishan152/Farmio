import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const InventoryIndex = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ...existing mockInventoryData...
    const mockInventoryData = [
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
            location: "Section A-1",
            temperature: "4°C",
            facilityId: 1
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
            location: "Section B-2",
            temperature: "2°C",
            facilityId: 1
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
            location: "Section C-1",
            temperature: "18°C",
            facilityId: 2
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
            location: "Section A-3",
            temperature: "4°C",
            facilityId: 1
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
            location: "Section A-2",
            temperature: "4°C",
            facilityId: 1
        }
    ];

    useEffect(() => {
        const loadInventoryData = async () => {
            try {
                setInventoryData(mockInventoryData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching inventory data:", error);
                setInventoryData(mockInventoryData);
                setLoading(false);
            }
        };

        loadInventoryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigateToInventorySection = (sectionType) => {
        navigate(`/warehouse/inventory/${sectionType}`);
    };

    // Get inventory statistics
    const getInventoryStats = () => {
        const totalWeight = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
        const capacityUsed = Math.round((totalWeight / 5000) * 100); // Assuming 5000kg capacity
        
        const stats = {
            totalItems: inventoryData.length,
            totalWeight: totalWeight,
            capacityUsed: capacityUsed,
            nearExpiry: inventoryData.filter(item => item.status === 'near-expiry').length,
            vegetables: inventoryData.filter(item => item.produceType === 'vegetables').length,
            fruits: inventoryData.filter(item => item.produceType === 'fruits').length,
            grains: inventoryData.filter(item => item.produceType === 'grains').length,
            fresh: inventoryData.filter(item => item.status === 'fresh').length
        };
        return stats;
    };

    const stats = getInventoryStats();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading inventory data...</p>
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
                    <div className="mb-8">
                        <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-3 mb-2">
                            <span className="text-2xl">📦</span>
                            Inventory Management
                        </h1>
                        <p className="text-green-700 text-base">Monitor and manage all stored agricultural products across your warehouse facilities.</p>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Total Items</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.totalItems}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Weight</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.totalWeight} kg</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Capacity Used</p>
                                    <p className="text-2xl font-bold text-purple-900">{stats.capacityUsed}%</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">Near Expiry</p>
                                    <p className="text-2xl font-bold text-orange-900">{stats.nearExpiry}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-xl">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Alert */}
                    {stats.capacityUsed >= 80 && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-800 text-lg">⚠️ Capacity Alert</h3>
                                    <p className="text-red-700">
                                        Warehouse is at {stats.capacityUsed}% capacity. Consider expanding storage or processing stored produce.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory Management Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {/* Current Inventory Card */}
                        <div 
                            onClick={() => navigateToInventorySection('current')}
                            className="bg-white rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-green-300"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-colors">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-700">{stats.totalItems}</div>
                                    <div className="text-sm text-green-600">Items Stored</div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-green-900 mb-3">Current Inventory</h3>
                            <p className="text-green-700 text-sm mb-6 leading-relaxed">
                                View and manage all currently stored agricultural products across your facilities.
                            </p>
                            
                            <div className="space-y-3 text-sm text-green-600 mb-6">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="font-medium">Total Weight:</span>
                                    <span className="font-bold text-green-800">{stats.totalWeight} kg</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="font-medium">Fresh Items:</span>
                                    <span className="font-bold text-green-800">{stats.fresh}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                    <span className="font-medium">Near Expiry:</span>
                                    <span className="font-bold text-orange-600">{stats.nearExpiry}</span>
                                </div>
                            </div>
                            
                            <div className="text-green-700 group-hover:text-green-800 flex items-center text-sm font-semibold">
                                Manage Current Stock
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Capacity Management Card */}
                        <div 
                            onClick={() => navigateToInventorySection('capacity')}
                            className="bg-white rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-green-300"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-colors">
                                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-emerald-700">{stats.capacityUsed}%</div>
                                    <div className="text-sm text-emerald-600">Capacity Used</div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-emerald-900 mb-3">Capacity Management</h3>
                            <p className="text-emerald-700 text-sm mb-6 leading-relaxed">
                                Monitor storage capacity utilization and optimize space allocation across facilities.
                            </p>
                            
                            <div className="space-y-3 text-sm text-emerald-600 mb-6">
                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                                    <span className="font-medium">Total Capacity:</span>
                                    <span className="font-bold text-emerald-800">5,000 kg</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                                    <span className="font-medium">Used Space:</span>
                                    <span className="font-bold text-emerald-800">{stats.totalWeight} kg</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                                    <span className="font-medium">Available:</span>
                                    <span className="font-bold text-emerald-800">{5000 - stats.totalWeight} kg</span>
                                </div>
                            </div>
                            
                            <div className="text-emerald-700 group-hover:text-emerald-800 flex items-center text-sm font-semibold">
                                View Capacity Details
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Product Categories Card */}
                        <div 
                            onClick={() => navigateToInventorySection('categories')}
                            className="bg-white rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-green-300"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-4 bg-lime-100 rounded-2xl group-hover:bg-lime-200 transition-colors">
                                    <svg className="w-8 h-8 text-lime-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-lime-700">3</div>
                                    <div className="text-sm text-lime-600">Categories</div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-lime-900 mb-3">Product Categories</h3>
                            <p className="text-lime-700 text-sm mb-6 leading-relaxed">
                                Organize and track inventory by product types and categories for better management.
                            </p>
                            
                            <div className="space-y-3 text-sm text-lime-600 mb-6">
                                <div className="flex justify-between items-center p-3 bg-lime-50 rounded-lg">
                                    <span className="font-medium">🥬 Vegetables:</span>
                                    <span className="font-bold text-lime-800">{stats.vegetables} items</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-lime-50 rounded-lg">
                                    <span className="font-medium">🍎 Fruits:</span>
                                    <span className="font-bold text-lime-800">{stats.fruits} items</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-lime-50 rounded-lg">
                                    <span className="font-medium">🌾 Grains:</span>
                                    <span className="font-bold text-lime-800">{stats.grains} items</span>
                                </div>
                            </div>
                            
                            <div className="text-lime-700 group-hover:text-lime-800 flex items-center text-sm font-semibold">
                                Browse by Category
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InventoryIndex;