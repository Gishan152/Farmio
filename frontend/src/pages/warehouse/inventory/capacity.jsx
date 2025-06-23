import React, { useState, useEffect } from 'react';
import CapacityIndicator from '../../../components/warehouse/CapacityIndicator';
import { getInventoryCapacity, getCapacityAlerts } from '../../../API/warehouse/inventory';

const Capacity = () => {
    const [capacity, setCapacity] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCapacityData = async () => {
            try {
                const [capacityData, alertsData] = await Promise.all([
                    getInventoryCapacity(),
                    getCapacityAlerts()
                ]);
                setCapacity(capacityData);
                setAlerts(alertsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCapacityData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-600 text-center py-8">Error: {error}</div>;
    }

    const isNearCapacity = capacity.utilizationPercentage >= capacity.alertThreshold;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Warehouse Capacity Management</h1>
            
            {/* Alert Banner */}
            {isNearCapacity && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded">
                    <h3 className="font-semibold text-red-800">⚠️ Capacity Alert</h3>
                    <p className="text-red-700">
                        Warehouse is at {capacity.utilizationPercentage}% capacity. 
                        Consider expanding storage or processing stored produce.
                    </p>
                </div>
            )}

            {/* Capacity Indicator
            <div className="mb-8">
                <CapacityIndicator capacity={capacity} showDetails={true} />
            </div> */}

            {/* Capacity Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Capacity</h3>
                    <p className="text-3xl font-bold text-blue-600">{capacity.totalCapacity}</p>
                    <p className="text-gray-500">cubic meters</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Used Capacity</h3>
                    <p className="text-3xl font-bold text-orange-600">{capacity.usedCapacity}</p>
                    <p className="text-gray-500">cubic meters</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Capacity</h3>
                    <p className="text-3xl font-bold text-green-600">{capacity.availableCapacity}</p>
                    <p className="text-gray-500">cubic meters</p>
                </div>
            </div>

            {/* Maintenance Alerts */}
            {alerts.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
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
                                <p className="font-medium">{alert.title}</p>
                                <p className="text-sm text-gray-600">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(alert.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Capacity;