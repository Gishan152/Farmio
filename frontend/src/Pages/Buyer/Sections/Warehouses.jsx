import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckBadgeIcon, MapPinIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import warehouseAPI from "../../../API/warehouse";



export default function Warehouses() {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredWarehouses, setFilteredWarehouses] = useState([]);

    useEffect(() => {
        const loadWarehousesOnMount = async () => {
            try {
                setLoading(true);
                // Use the public endpoint for buyers - load all warehouses initially
                const response = await warehouseAPI.getPublicWarehouses({
                    verifiedOnly: true // Only show verified warehouses
                });
                setWarehouses(response.data || []);
                setFilteredWarehouses(response.data || []);
            } catch (err) {
                console.error('Error loading warehouses:', err);
                setError('Failed to load warehouses');
            } finally {
                setLoading(false);
            }
        };
        
        loadWarehousesOnMount();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = warehouses.filter(w => 
                w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                w.storageType.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredWarehouses(filtered);
        } else {
            setFilteredWarehouses(warehouses);
        }
    }, [searchTerm, warehouses]);

    const loadWarehouses = async () => {
        try {
            setLoading(true);
            // Use the public endpoint for buyers
            const response = await warehouseAPI.getPublicWarehouses({
                search: searchTerm || undefined,
                verifiedOnly: true // Only show verified warehouses
            });
            setWarehouses(response.data || []);
            setFilteredWarehouses(response.data || []);
        } catch (err) {
            console.error('Error loading warehouses:', err);
            setError('Failed to load warehouses');
        } finally {
            setLoading(false);
        }
    };

    const getStorageTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'cold_storage': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            case 'dry_storage': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'temperature_controlled': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
        }
    };

    const formatStorageType = (type) => {
        return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
    };

    const calculateAvailableCapacity = (warehouse) => {
        const totalCapacity = warehouse.totalCapacityKg || warehouse.totalCapacity || 0;
        const used = warehouse.usedCapacityKg || 0;
        return Math.max(0, totalCapacity - used);
    };

    if (loading) {
        return (
            <section className="p-6">
                <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Storage Warehouses</h1>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow animate-pulse">
                            <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="p-4 space-y-2">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="p-6">
                <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Storage Warehouses</h1>
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-200">{error}</p>
                    <button 
                        onClick={loadWarehouses}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-semibold dark:text-gray-100 flex items-center gap-2">
                    <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
                    Storage Warehouses
                </h1>
                <div className="mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="Search warehouses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {filteredWarehouses.length === 0 ? (
                <div className="text-center py-12">
                    <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No warehouses found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? 'Try adjusting your search terms' : 'No warehouses are currently available'}
                    </p>
                </div>
            ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWarehouses.map(w => (
                    <div
                        key={w.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <div className="relative h-40 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BuildingStorefrontIcon className="h-16 w-16 text-green-600 dark:text-green-400 opacity-60" />
                            </div>
                            <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStorageTypeColor(w.storageType)}`}>
                                    {formatStorageType(w.storageType)}
                                </span>
                            </div>
                            {w.verified && (
                                <div className="absolute top-2 right-2 bg-white p-1 border-none rounded-full shadow">
                                    <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <h2 className="text-xl font-bold dark:text-gray-100 truncate">{w.name}</h2>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    <span className="truncate">{w.city}, {w.address}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600 dark:text-gray-300">
                                    <p className="font-medium">Available Capacity</p>
                                    <p className="text-green-600 font-semibold">{(calculateAvailableCapacity(w) / 1000).toFixed(1)}T</p>
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    <p className="font-medium">Temperature</p>
                                    <p>{w.temperatureMin}°C - {w.temperatureMax}°C</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">Owner: </span>
                                    <span>Warehouse #{w.id}</span>
                                </div>
                                {calculateAvailableCapacity(w) > 0 ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-800 dark:text-green-100">
                                        Available
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full dark:bg-red-800 dark:text-red-100">
                                        Full
                                    </span>
                                )}
                            </div>

                            <Link 
                                to={`./${w.id}`} 
                                className="block text-center mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
                            >
                                {calculateAvailableCapacity(w) > 0 ? 'Book Storage' : 'View Details'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </section>
    );
}
