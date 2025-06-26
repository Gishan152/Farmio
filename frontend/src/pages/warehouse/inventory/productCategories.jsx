import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const ProductCategories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    // Mock categories data - only fruits and vegetables
    const mockCategories = [
        {
            id: 1,
            name: "Vegetables",
            icon: "🥬",
            totalItems: 3,
            totalWeight: 350,
            avgStorageDays: 15,
            items: [
                {
                    id: 1,
                    name: "Organic Tomatoes",
                    farmer: "John Smith",
                    quantity: 150,
                    location: "Section A-1",
                    status: "fresh",
                    storageDate: "2024-12-20"
                },
                {
                    id: 4,
                    name: "Fresh Lettuce",
                    farmer: "Sarah Wilson",
                    quantity: 80,
                    location: "Section A-3",
                    status: "near-expiry",
                    storageDate: "2024-12-22"
                },
                {
                    id: 5,
                    name: "Organic Carrots",
                    farmer: "Mike Davis",
                    quantity: 120,
                    location: "Section A-2",
                    status: "fresh",
                    storageDate: "2024-12-19"
                }
            ]
        },
        {
            id: 2,
            name: "Fruits",
            icon: "🍎",
            totalItems: 1,
            totalWeight: 200,
            avgStorageDays: 20,
            items: [
                {
                    id: 2,
                    name: "Fresh Apples",
                    farmer: "Mary Johnson",
                    quantity: 200,
                    location: "Section B-2",
                    status: "fresh",
                    storageDate: "2024-12-18"
                }
            ]
        }
    ];

    useEffect(() => {
        const loadCategoriesData = async () => {
            try {
                setCategories(mockCategories);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories data:", error);
                setCategories(mockCategories);
                setLoading(false);
            }
        };

        loadCategoriesData();
    }, []);

    const getTotalItems = () => {
        return categories.reduce((sum, category) => sum + category.totalItems, 0);
    };

    const getTotalWeight = () => {
        return categories.reduce((sum, category) => sum + category.totalWeight, 0);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading categories data...</p>
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
                        <div className="flex items-center gap-4 mb-4">
                            <button 
                                onClick={() => navigate('/warehouse/inventory')}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Inventory
                            </button>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-2">
                            <span className="text-3xl lg:text-4xl">🥬</span> Product Categories
                        </h1>
                        <p className="text-green-700 mt-1 text-sm">Organize and track inventory by product types and categories for better management.</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border border-green-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Categories</h3>
                            <p className="text-3xl font-bold text-green-600">{categories.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Items</h3>
                            <p className="text-3xl font-bold text-blue-600">{getTotalItems()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border border-purple-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Weight</h3>
                            <p className="text-3xl font-bold text-purple-600">{getTotalWeight()} kg</p>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {categories.map(category => (
                            <div 
                                key={category.id} 
                                onClick={() => setSelectedCategory(category)}
                                className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="text-center">
                                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{category.name}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Items:</span>
                                            <span className="font-medium">{category.totalItems}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Weight:</span>
                                            <span className="font-medium">{category.totalWeight} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Storage:</span>
                                            <span className="font-medium">{category.avgStorageDays} days</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-green-600 group-hover:text-green-700 flex items-center justify-center text-sm font-medium">
                                        View Details
                                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Category Details Modal/Section */}
                    {selectedCategory && (
                        <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{selectedCategory.icon}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h2>
                                        <p className="text-gray-600">{selectedCategory.totalItems} items stored</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {selectedCategory.items.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedCategory.items.map(item => (
                                        <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'fresh' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'near-expiry' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.status.replace('-', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Farmer:</span>
                                                    <span>{item.farmer}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Quantity:</span>
                                                    <span className="font-medium">{item.quantity} kg</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Location:</span>
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Stored:</span>
                                                    <span>{new Date(item.storageDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">{selectedCategory.icon}</div>
                                    <p className="text-gray-500 text-lg">No {selectedCategory.name.toLowerCase()} currently stored</p>
                                    <p className="text-gray-400 text-sm mt-2">Items will appear here when farmers store {selectedCategory.name.toLowerCase()} in your warehouse</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Category Statistics */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Category Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {categories.filter(cat => cat.totalItems > 0).map(category => (
                                <div key={category.id} className="text-center">
                                    <div className="text-3xl mb-2">{category.icon}</div>
                                    <h3 className="font-semibold text-gray-700 mb-2">{category.name}</h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div>Items: <span className="font-medium">{category.totalItems}</span></div>
                                        <div>Weight: <span className="font-medium">{category.totalWeight} kg</span></div>
                                        <div>Avg Days: <span className="font-medium">{category.avgStorageDays}</span></div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(category.totalWeight / getTotalWeight()) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {Math.round((category.totalWeight / getTotalWeight()) * 100)}% of total weight
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductCategories;