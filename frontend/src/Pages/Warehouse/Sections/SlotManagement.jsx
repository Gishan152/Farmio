import { useState } from 'react';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import SlotsTable from '../../../Components/Warehouse/SlotsTable';
import BookingCalendar from '../../../Components/Warehouse/BookingCalendar';

export default function SlotManagement() {
    const { warehouses } = useWarehouseContext();
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [viewType, setViewType] = useState('table'); // 'table' or 'calendar'
    const [dateFilter, setDateFilter] = useState('');
    const [slotFilter, setSlotFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Sample warehouses with slots data
    const sampleWarehouses = [
        {
            id: 1,
            name: "Colombo Cold Storage A",
            address: "Industrial Zone, Colombo 15",
            totalSlots: 50,
            totalCapacity: 5000,
            occupiedCapacity: 3500,
            status: "operational",
            slots: Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                capacity: 100,
                used: Math.floor(Math.random() * 100),
                status: Math.random() > 0.3 ? 'available' : 'booked',
                bookedBy: Math.random() > 0.5 ? 'Farmer Silva' : 'Green Valley Co-op',
                bookedUntil: '2024-02-15',
                produce: Math.random() > 0.5 ? 'Rice' : 'Vegetables',
                temperature: 8
            }))
        },
        {
            id: 2,
            name: "Kandy Dry Storage Facility",
            address: "Peradeniya Road, Kandy",
            totalSlots: 30,
            totalCapacity: 4500,
            occupiedCapacity: 2100,
            status: "operational",
            slots: Array.from({ length: 30 }, (_, i) => ({
                id: i + 1,
                capacity: 150,
                used: Math.floor(Math.random() * 150),
                status: Math.random() > 0.4 ? 'available' : 'booked',
                bookedBy: Math.random() > 0.5 ? 'Farmer Kumara' : 'Agri Exports Ltd',
                bookedUntil: '2024-02-20',
                produce: Math.random() > 0.5 ? 'Grains' : 'Dried Fruits',
                temperature: 22
            }))
        }
    ];

    // Use sample data if no real warehouses
    const displayWarehouses = warehouses.length > 0 ? warehouses : sampleWarehouses;

    const handleWarehouseSelect = (warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    const handleBackToWarehouses = () => {
        setSelectedWarehouse(null);
    };

    // Calculate occupancy rate
    const getOccupancyRate = (warehouse) => {
        return Math.round((warehouse.occupiedCapacity / warehouse.totalCapacity) * 100);
    };

    // Filter slots based on criteria
    const getFilteredSlots = (slots) => {
        return slots.filter(slot => {
            if (slotFilter && !slot.id.toString().includes(slotFilter)) return false;
            if (statusFilter !== 'all' && slot.status !== statusFilter) return false;
            return true;
        });
    };

    // Get slot status color
    const getSlotStatusColor = (slot) => {
        if (slot.status === 'available') return 'bg-green-100 text-green-800';
        if (slot.status === 'booked') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    // Get usage percentage
    const getUsagePercentage = (slot) => {
        return Math.round((slot.used / slot.capacity) * 100);
    };

    if (selectedWarehouse) {
        const filteredSlots = getFilteredSlots(selectedWarehouse.slots);
        const occupancyRate = getOccupancyRate(selectedWarehouse);

        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header with Back Button */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBackToWarehouses}
                                className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                Back to Warehouses
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedWarehouse.name}</h1>
                                <p className="text-gray-500 mt-1">{selectedWarehouse.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewType('table')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    viewType === 'table' 
                                        ? 'bg-green-600 text-white shadow-md hover:shadow-lg' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Table View
                            </button>
                            <button
                                onClick={() => setViewType('calendar')}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                    viewType === 'calendar' 
                                        ? 'bg-green-600 text-white shadow-md hover:shadow-lg' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Calendar View
                            </button>
                        </div>
                    </div>

                    {/* Warehouse Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Slots</h3>
                            <p className="text-3xl font-bold text-gray-900">{selectedWarehouse.totalSlots}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Capacity</h3>
                            <p className="text-3xl font-bold text-gray-900">{selectedWarehouse.totalCapacity} kg</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Used Capacity</h3>
                            <p className="text-3xl font-bold text-gray-900">{selectedWarehouse.occupiedCapacity} kg</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Occupancy Rate</h3>
                            <p className="text-3xl font-bold text-green-600">{occupancyRate}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        occupancyRate > 90 ? 'bg-red-500' :
                                        occupancyRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${occupancyRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Slot ID</label>
                                <input
                                    type="text"
                                    value={slotFilter}
                                    onChange={(e) => setSlotFilter(e.target.value)}
                                    placeholder="Enter slot number..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                />
                            </div>
                            <div className="flex items-end">
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold">Showing:</span> {filteredSlots.length} of {selectedWarehouse.slots.length} slots
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slots Display */}
                    {viewType === 'table' ? (
                        <SlotsTable 
                            slots={filteredSlots}
                            getSlotStatusColor={getSlotStatusColor}
                            getUsagePercentage={getUsagePercentage}
                        />
                    ) : (
                        <BookingCalendar slots={selectedWarehouse.slots} />
                    )}
                </div>
            </div>
        );
    }

    // Main warehouse selection view
    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Slot Management</h1>
                        <p className="text-gray-500 mt-1">Select a warehouse to manage its slots and capacity</p>
                    </div>
                </div>

                {/* Warehouse Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayWarehouses.map((warehouse) => {
                        const occupancyRate = getOccupancyRate(warehouse);
                        const availableSlots = warehouse.slots?.filter(slot => slot.status === 'available').length || 0;
                        const bookedSlots = warehouse.slots?.filter(slot => slot.status === 'booked').length || 0;

                        return (
                            <div key={warehouse.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{warehouse.name}</h3>
                                            <p className="text-green-100 text-sm flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {warehouse.address}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            warehouse.status === 'operational' 
                                                ? 'bg-green-400 text-white' 
                                                : warehouse.status === 'maintenance'
                                                ? 'bg-yellow-400 text-white'
                                                : 'bg-red-400 text-white'
                                        }`}>
                                            {warehouse.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-3">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-gray-50 rounded-md border border-gray-100">
                                            <p className="text-xl font-semibold text-gray-800">{warehouse.totalSlots}</p>
                                            <p className="text-xs text-gray-500">Total Slots</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-md border border-green-100">
                                            <p className="text-xl font-semibold text-green-600">{availableSlots}</p>
                                            <p className="text-xs text-green-500">Available</p>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 rounded-md border border-red-100">
                                            <p className="text-xl font-semibold text-red-600">{bookedSlots}</p>
                                            <p className="text-xs text-red-500">Booked</p>
                                        </div>
                                        <div className="text-center p-3 bg-blue-50 rounded-md border border-blue-100">
                                            <p className="text-xl font-semibold text-blue-600">{occupancyRate}%</p>
                                            <p className="text-xs text-blue-500">Occupancy</p>
                                        </div>
                                    </div>

                                    {/* Capacity Usage Progress */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Capacity Usage</span>
                                            <span>{warehouse.occupiedCapacity}/{warehouse.totalCapacity} kg</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    occupancyRate > 90 ? 'bg-red-500' :
                                                    occupancyRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${occupancyRate}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-center pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleWarehouseSelect(warehouse)}
                                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                        >
                                            <EyeIcon className="h-4 w-4 mr-2" />
                                            Manage Slots
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {displayWarehouses.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-10">
                            <div className="text-5xl mb-4 animate-pulse">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Warehouses Found</h3>
                            <p className="text-gray-500 mb-6">Add warehouses in Facility Management to manage their slots</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}