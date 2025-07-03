import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faChartBar } from '@fortawesome/free-solid-svg-icons';

const facilities = [
    { id: 1, name: "Cold Storage Unit" },
    { id: 2, name: "Dry Storage Unit" }
];

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
        id: 4,
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
    },
    {
        id: 5,
        produceName: "Fresh Bananas",
        farmerName: "Anna Lee",
        quantity: 180,
        unit: "kg",
        produceType: "fruits",
        status: "fresh",
        storageDate: "2024-12-21",
        expiryDate: "2025-01-08",
        location: "Section D-1",
        temperature: "7°C",
        facilityId: 2
    }
];

const getFacilityStats = (facilityId, inventoryData) => {
    const filtered = inventoryData.filter(item => item.facilityId === facilityId);
    const totalWeight = filtered.reduce((sum, item) => sum + item.quantity, 0);
    const capacityUsed = Math.round((totalWeight / 5000) * 100); // Example: 5000kg per facility
    return {
        totalItems: filtered.length,
        totalWeight,
        capacityUsed,
        nearExpiry: filtered.filter(item => item.status === 'near-expiry').length,
        vegetables: filtered.filter(item => item.produceType === 'vegetables').length,
        fruits: filtered.filter(item => item.produceType === 'fruits').length,
        fresh: filtered.filter(item => item.status === 'fresh').length
    };
};

const InventoryIndex = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadInventoryData = async () => {
            setInventoryData(mockInventoryData);
            setLoading(false);
        };
        loadInventoryData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex">
                <div className="fixed top-0 left-0 h-screen w-64 z-30">
                    <Sidebar />
                </div>
                <div className="flex-1 ml-64 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading inventory data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
            <div className="fixed top-0 left-0 h-screen w-64 z-30">
                <Sidebar />
            </div>
            <main className="ml-64 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-green-900 flex items-center gap-3 mb-2 tracking-tight">
                            <span className="text-3xl">🏭</span>
                            Warehouse Inventory Overview
                        </h1>
                        <p className="text-green-700 text-base">
                            Select a storage unit to manage its inventory and view detailed statistics for fruits and vegetables.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {facilities.map(facility => {
                            const stats = getFacilityStats(facility.id, inventoryData);
                            return (
                                <div
                                    key={facility.id}
                                    className="bg-white rounded-2xl p-8 border border-green-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-4 rounded-2xl ${facility.name.includes('Cold') ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                                            {facility.name.includes('Cold') ? (
                                                <span className="text-3xl" role="img" aria-label="cold">❄️</span>
                                            ) : (
                                                <span className="text-3xl" role="img" aria-label="dry">🌾</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-green-800">{facility.name}</div>
                                            <div className="text-xs text-gray-400">ID: {facility.id}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <div className="text-xs text-gray-500">Total Items</div>
                                            <div className="text-lg font-bold text-green-900">{stats.totalItems}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Total Weight</div>
                                            <div className="text-lg font-bold text-blue-900">{stats.totalWeight} kg</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Capacity Used</div>
                                            <div className={`text-lg font-bold ${stats.capacityUsed >= 80 ? 'text-red-600' : 'text-purple-900'}`}>{stats.capacityUsed}%</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Near Expiry</div>
                                            <div className="text-lg font-bold text-orange-600">{stats.nearExpiry}</div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg mb-1">
                                            <span className="font-medium">Vegetables:</span>
                                            <span className="font-bold text-green-800">{stats.vegetables} items</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                                            <span className="font-medium">Fruits:</span>
                                            <span className="font-bold text-green-800">{stats.fruits} items</span>
                                        </div>
                                    </div>
                                     <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                                        <button
                                            onClick={() => navigate(`/warehouse/inventory/current?facility=${facility.id}`)}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition text-base sm:text-sm"
                                            style={{
                                                boxShadow: '0 2px 8px 0 rgba(34,197,94,0.10)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faBoxOpen} className="text-white" />
                                            <span>Manage Inventory</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/warehouse/inventory/capacity?facility=${facility.id}`)}
                                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow transition text-base sm:text-sm"
                                            style={{
                                                boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faChartBar} className="text-white" />
                                            <span>View Capacity</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InventoryIndex;