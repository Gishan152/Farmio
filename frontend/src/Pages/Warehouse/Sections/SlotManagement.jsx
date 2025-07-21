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
            storageType: "Cold Storage (0°C to 14°C)",
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
            storageType: "Dry Storage",
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
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-4">
                    {/* Compact Header with Back Button */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleBackToWarehouses}
                                    className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{selectedWarehouse.name}</h1>
                                    <p className="text-gray-500 text-sm mt-1">{selectedWarehouse.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewType('table')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewType === 'table' 
                                            ? 'bg-green-500 text-white shadow-sm' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Table View
                                </button>
                                <button
                                    onClick={() => setViewType('calendar')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        viewType === 'calendar' 
                                            ? 'bg-green-500 text-white shadow-sm' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Calendar View
                                </button>
                            </div>
                        </div>

                        {/* Compact Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
                                <div className="text-xl font-bold text-green-700">{selectedWarehouse.totalSlots}</div>
                                <div className="text-xs text-green-600 font-medium">Total Slots</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
                                <div className="text-xl font-bold text-gray-700">{selectedWarehouse.totalCapacity}</div>
                                <div className="text-xs text-gray-600 font-medium">Capacity (kg)</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center">
                                <div className="text-xl font-bold text-gray-700">{selectedWarehouse.occupiedCapacity}</div>
                                <div className="text-xs text-gray-600 font-medium">Used (kg)</div>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3 border border-green-200 text-center">
                                <div className="text-xl font-bold text-green-800">{occupancyRate}%</div>
                                <div className="text-xs text-green-700 font-medium">Occupancy</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                    <div 
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            occupancyRate > 90 ? 'bg-red-500' :
                                            occupancyRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                        style={{ width: `${occupancyRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slot ID</label>
                                <input
                                    type="text"
                                    value={slotFilter}
                                    onChange={(e) => setSlotFilter(e.target.value)}
                                    placeholder="Filter by slot..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold">Showing:</span> {filteredSlots.length} of {selectedWarehouse.slots.length}
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

    // Main warehouse selection view - compact style like facility management
    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-4">
                {/* Compact Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Slot Management</h1>
                            <p className="text-gray-500 text-sm mt-1">Select a warehouse to manage its slots</p>
                        </div>
                    </div>
                </div>

                {/* Wide Warehouse Cards */}
                <div className="space-y-4">
                    {displayWarehouses.map((warehouse) => {
                        const occupancyRate = getOccupancyRate(warehouse);
                        const availableSlots = warehouse.slots?.filter(slot => slot.status === 'available').length || 0;
                        const bookedSlots = warehouse.slots?.filter(slot => slot.status === 'booked').length || 0;

                        return (
                            <div key={warehouse.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                                <div className="flex">
                                    {/* Left Header Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-green text-green-700 p-4 flex-shrink-0 w-64">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">📦</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                                warehouse.status === 'operational' 
                                                    ? 'bg-emerald-400 text-emerald-900' 
                                                    : warehouse.status === 'maintenance'
                                                    ? 'bg-yellow-400 text-yellow-900'
                                                    : 'bg-red-400 text-red-900'
                                            }`}>
                                                {warehouse.status.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-bold text-lg mb-2 truncate">
                                            {warehouse.name}
                                        </h3>
                                        <p className="text-green-700 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="truncate">{warehouse.address}</span>
                                        </p>
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 p-4 flex items-center">
                                        <div className="grid grid-cols-5 gap-4 w-full items-center">
                                            {/* Storage Type */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                                                    <span className="text-base">
                                                        {warehouse.storageType?.includes('Cold') ? '❄️' : '🌡️'}
                                                    </span>
                                                    <span>{warehouse.storageType?.includes('Cold') ? 'Cold' : 'Dry'}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1 font-medium">
                                                    {occupancyRate}% Occupied
                                                </span>
                                            </div>

                                            {/* Total Slots */}
                                            <div className="text-center">
                                                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                                    <div className="text-2xl font-bold text-green-700">{warehouse.totalSlots}</div>
                                                    <div className="text-xs text-green-600 font-medium">Total Slots</div>
                                                </div>
                                            </div>

                                            {/* Available Slots */}
                                            <div className="text-center">
                                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                    <div className="text-2xl font-bold text-gray-700">{availableSlots}</div>
                                                    <div className="text-xs text-gray-600 font-medium">Available</div>
                                                </div>
                                            </div>

                                            {/* Booked Slots */}
                                            <div className="text-center">
                                                <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                                                    <div className="text-2xl font-bold text-green-800">{bookedSlots}</div>
                                                    <div className="text-xs text-green-700 font-medium">Booked</div>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleWarehouseSelect(warehouse)}
                                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center space-x-1 w-full justify-center"
                                                    title="Manage Slots"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                    <span>Manage</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Compact Empty State */}
                {displayWarehouses.length === 0 && (
                    <div className="text-center py-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="text-4xl mb-3">📦</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Warehouses Found</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Add warehouses in Facility Management to manage their slots
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}