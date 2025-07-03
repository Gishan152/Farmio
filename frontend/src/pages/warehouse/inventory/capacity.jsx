import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/warehouse/Sidebar';

const CapacityManagement = () => {
    const [loading, setLoading] = useState(true);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilityId, setSelectedFacilityId] = useState('all');
    const navigate = useNavigate();

    // Mock facilities data
    const mockFacilities = [
        {
            id: 1,
            name: "Main Cold Storage",
            type: "cold_storage",
            totalCapacity: 2000,
            usedCapacity: 1450,
            temperatureRange: "0°C - 8°C",
            sections: ["Section A-1", "Section A-2", "Section A-3"],
            status: "active",
            lastMaintenance: "2024-12-15"
        },
        {
            id: 2,
            name: "Grain Storage Unit",
            type: "dry_storage",
            totalCapacity: 3000,
            usedCapacity: 500,
            temperatureRange: "15°C - 25°C",
            sections: ["Section C-1", "Section C-2"],
            status: "active",
            lastMaintenance: "2024-12-10"
        },
        {
            id: 3,
            name: "Secondary Cold Storage",
            type: "cold_storage",
            totalCapacity: 1500,
            usedCapacity: 900,
            temperatureRange: "2°C - 6°C",
            sections: ["Section B-1", "Section B-2"],
            status: "maintenance",
            lastMaintenance: "2024-12-20"
        }
    ];

    useEffect(() => {
        const loadCapacityData = async () => {
            try {
                setFacilities(mockFacilities);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching capacity data:", error);
                setFacilities(mockFacilities);
                setLoading(false);
            }
        };

        loadCapacityData();
    }, []);

    // Filtered facilities based on selection
    const filteredFacilities = selectedFacilityId === 'all'
        ? facilities
        : facilities.filter(f => f.id === Number(selectedFacilityId));

    const getTotalCapacity = () => {
        return filteredFacilities.reduce((sum, facility) => sum + facility.totalCapacity, 0);
    };

    const getTotalUsed = () => {
        return filteredFacilities.reduce((sum, facility) => sum + facility.usedCapacity, 0);
    };

    const getUtilizationPercentage = (facility) => {
        return Math.round((facility.usedCapacity / facility.totalCapacity) * 100);
    };

    const getOverallUtilization = () => {
        const totalCapacity = getTotalCapacity();
        if (totalCapacity === 0) return 0;
        return Math.round((getTotalUsed() / totalCapacity) * 100);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <Sidebar />
                <div className="flex justify-center items-center flex-1">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading capacity data...</p>
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
                            <span className="text-3xl lg:text-4xl">🏭</span> Capacity Management
                        </h1>
                        <p className="text-green-700 mt-1 text-sm">Monitor storage capacity utilization and optimize space allocation across facilities.</p>
                    </div>

                    {/* Facility Selector */}
                    <div className="mb-6 flex items-center gap-4">
                        <label className="font-medium text-green-900">Select Facility:</label>
                        <select
                            className="border border-green-300 rounded px-3 py-2"
                            value={selectedFacilityId}
                            onChange={e => setSelectedFacilityId(e.target.value)}
                        >
                            <option value="all">All Facilities</option>
                            {facilities.map(facility => (
                                <option key={facility.id} value={facility.id}>{facility.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Overall Capacity Overview */}
                    <div className="mb-8 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {selectedFacilityId === 'all' ? 'Overall Capacity Overview' : 'Facility Capacity Overview'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{getTotalCapacity()} kg</div>
                                <div className="text-gray-600">Total Capacity</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">{getTotalUsed()} kg</div>
                                <div className="text-gray-600">Used Capacity</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600">{getTotalCapacity() - getTotalUsed()} kg</div>
                                <div className="text-gray-600">Available Space</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-3xl font-bold ${getOverallUtilization() >= 80 ? 'text-red-600' : 'text-green-600'}`}>
                                    {getOverallUtilization()}%
                                </div>
                                <div className="text-gray-600">Utilization</div>
                            </div>
                        </div>
                        
                        {/* Overall Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Overall Capacity</span>
                                <span>{getOverallUtilization()}% utilized</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`h-4 rounded-full transition-all duration-300 ${
                                        getOverallUtilization() >= 90 ? 'bg-red-500' :
                                        getOverallUtilization() >= 80 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}
                                    style={{ width: `${getOverallUtilization()}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Alert */}
                    {getOverallUtilization() >= 80 && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
                            <h3 className="font-semibold text-red-800">⚠️ High Capacity Alert</h3>
                            <p className="text-red-700">
                                Overall warehouse capacity is at {getOverallUtilization()}%. Consider processing stored produce or expanding storage capacity.
                            </p>
                        </div>
                    )}

                    {/* Facility Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredFacilities.map(facility => {
                            const utilization = getUtilizationPercentage(facility);
                            return (
                                <div key={facility.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">{facility.name}</h3>
                                            <p className="text-sm text-gray-600 capitalize">{facility.type.replace('_', ' ')}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            facility.status === 'active' ? 'bg-green-100 text-green-800' :
                                            facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {facility.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    {/* Capacity Meter */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Capacity Utilization</span>
                                            <span>{utilization}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className={`h-3 rounded-full transition-all duration-300 ${
                                                    utilization >= 90 ? 'bg-red-500' :
                                                    utilization >= 80 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${utilization}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Total Capacity:</span>
                                            <span>{facility.totalCapacity} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Used:</span>
                                            <span className="font-semibold text-gray-800">{facility.usedCapacity} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Available:</span>
                                            <span className="text-green-600">{facility.totalCapacity - facility.usedCapacity} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Temperature:</span>
                                            <span>{facility.temperatureRange}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Sections:</span>
                                            <span>{facility.sections.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Last Maintenance:</span>
                                            <span>{new Date(facility.lastMaintenance).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Sections */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="font-medium text-gray-700 mb-2">Sections:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {facility.sections.map(section => (
                                                <span 
                                                    key={section} 
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                >
                                                    {section}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Capacity Recommendations */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Capacity Optimization Recommendations</h2>
                        <div className="space-y-4">
                            {getOverallUtilization() >= 80 && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h3 className="font-medium text-red-800">🚨 Critical: High Capacity Usage</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        Consider immediate action: process near-expiry items, expand storage, or negotiate with buyers for urgent pickup.
                                    </p>
                                </div>
                            )}
                            
                            {filteredFacilities.some(f => f.status === 'maintenance') && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h3 className="font-medium text-yellow-800">🔧 Maintenance Required</h3>
                                    <p className="text-yellow-700 text-sm mt-1">
                                        Some facilities are under maintenance. Plan capacity distribution accordingly.
                                    </p>
                                </div>
                            )}
                            
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="font-medium text-green-800">💡 Optimization Tips</h3>
                                <ul className="text-green-700 text-sm mt-1 space-y-1">
                                    <li>• Monitor daily capacity changes to predict peak usage</li>
                                    <li>• Implement FIFO (First In, First Out) to reduce waste</li>
                                    <li>• Consider seasonal patterns for better capacity planning</li>
                                    <li>• Regular maintenance prevents unexpected capacity loss</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CapacityManagement;