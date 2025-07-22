import { useState, useEffect } from 'react';
import { useWarehouseContext } from '../../../Contexts/Warehouse/WarehouseContext';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import SlotsTable from '../../../Components/Warehouse/SlotsTable';
import BookingCalendar from '../../../Components/Warehouse/BookingCalendar';

export default function SlotManagement() {
    const { warehouses = [], user = {} } = useWarehouseContext();
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [viewType, setViewType] = useState('table');
    const [dateFilter, setDateFilter] = useState('');
    const [slotFilter, setSlotFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [produceWeight, setProduceWeight] = useState('');
    const [produceType, setProduceType] = useState('Grains');
    const [densityResult, setDensityResult] = useState({ area: '', density: '' });

    // Sample warehouses with updated structure
    const sampleWarehouses = [
        {
            id: 1,
            name: "Colombo Cold Storage A",
            address: "Industrial Zone, Colombo 15",
            totalSlots: 50,
            totalArea: 5000,
            occupiedArea: 3500,
            pricingPerSqft: 320, // Rs.
            status: "operational",
            storageType: "Cold Storage (0°C to 14°C)",
            slots: Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                areaSqft: 100,
                usedArea: Math.floor(Math.random() * 100),
                maxWeightKg: 120,
                usedWeight: Math.floor(Math.random() * 120),
                price: 100 * 320,
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
            totalArea: 3000,
            occupiedArea: 2100,
            pricingPerSqft: 250, // Rs.
            status: "operational",
            storageType: "Dry Storage",
            slots: Array.from({ length: 30 }, (_, i) => ({
                id: i + 1,
                areaSqft: 100,
                usedArea: Math.floor(Math.random() * 100),
                maxWeightKg: 150,
                usedWeight: Math.floor(Math.random() * 150),
                price: 100 * 250,
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

    // Keeper restriction: only show assigned warehouse
    const accessibleWarehouses = user.role === 'keeper'
        ? displayWarehouses.filter(w => w.id === user.assignedWarehouseId)
        : displayWarehouses;

    // Pre-select keeper's warehouse
    useEffect(() => {
        if (user.role === 'keeper') {
            const keeperWarehouse = accessibleWarehouses[0];
            setSelectedWarehouse(keeperWarehouse || null);
        }
    }, [user, warehouses]);

    const handleWarehouseSelect = (warehouse) => {
        if (user.role !== 'keeper') setSelectedWarehouse(warehouse);
    };

    const handleBackToWarehouses = () => {
        if (user.role !== 'keeper') setSelectedWarehouse(null);
    };

    // Calculate occupancy rate by area
    const getOccupancyRate = (warehouse) => {
        return warehouse.totalArea
            ? Math.round((warehouse.occupiedArea / warehouse.totalArea) * 100)
            : 0;
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

    // Get usage percentage (by area)
    const getUsagePercentage = (slot) => {
        return slot.areaSqft
            ? Math.round((slot.usedArea / slot.areaSqft) * 100)
            : 0;
    };

    // Density guidelines calculator
    const handleDensityCalc = () => {
        // Example densities (sqft per kg)
        const densities = {
            Grains: 0.22,
            Vegetables: 0.3,
            Fruits: 0.25,
            Other: 0.2
        };
        const density = densities[produceType] || 0.22;
        if (produceWeight && !isNaN(produceWeight)) {
            setDensityResult({
                area: (produceWeight * density).toFixed(2),
                density: density
            });
        } else {
            setDensityResult({ area: '', density: '' });
        }
    };

    // Booking handler
    const handleBookSlot = (slot) => {
        if (slot.status !== 'available') {
            alert('Slot is not available.');
            return;
        }
        if (!densityResult.area || !produceWeight) {
            alert('Please use the density calculator to estimate area.');
            return;
        }
        if (parseFloat(densityResult.area) > slot.areaSqft) {
            alert('Required area exceeds slot size.');
            return;
        }
        if (parseFloat(produceWeight) > slot.maxWeightKg) {
            alert('Produce weight exceeds slot max weight.');
            return;
        }
        // Simulate booking update
        slot.status = 'booked';
        slot.usedArea = parseFloat(densityResult.area);
        slot.usedWeight = parseFloat(produceWeight);
        slot.bookedBy = user.role === 'keeper'
            ? `Keeper for ${selectedWarehouse.name}`
            : 'Current User';
        slot.bookedUntil = new Date().toISOString().slice(0, 10);
        slot.produce = produceType;
        alert(
            `Booking Confirmed!\nArea Booked: ${slot.usedArea} sqft\nEstimated Weight: ${slot.usedWeight} kg\nCost: Rs. ${slot.price}`
        );
    };

    if (selectedWarehouse) {
        const filteredSlots = getFilteredSlots(selectedWarehouse.slots);
        const occupancyRate = getOccupancyRate(selectedWarehouse);
        // const avgSlotArea = selectedWarehouse.totalArea / selectedWarehouse.totalSlots;
        // const avgMaxWeight = selectedWarehouse.slots.length
        //     ? Math.round(selectedWarehouse.slots.reduce((sum, s) => sum + (s.maxWeightKg || 0), 0) / selectedWarehouse.slots.length)
        //     : 0;

        return (
            <div className="p-4  bg-white min-h-screen">
                <div className="max-w-6xl mx-auto space-y-4">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                {user.role !== 'keeper' && (
                                    <button
                                        onClick={handleBackToWarehouses}
                                        className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                                    >
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        <span className="text-sm">Back</span>
                                    </button>
                                )}
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">
                                        {selectedWarehouse.name}
                                        {user.role === 'keeper' && (
                                            <span className="ml-2 px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">
                                                (Keeper Mode)
                                            </span>
                                        )}
                                    </h1>
                                    <p className="text-gray-500 text-xs mt-1">{selectedWarehouse.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewType('table')}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                        viewType === 'table' 
                                            ? 'bg-green-500 text-white shadow-sm' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Table View
                                </button>
                                <button
                                    onClick={() => setViewType('calendar')}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                        viewType === 'calendar' 
                                            ? 'bg-green-500 text-white shadow-sm' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Calendar View
                                </button>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            <div className="bg-green-50 rounded-lg p-2 border border-green-100 text-center">
                                <div className="text-base font-bold text-green-700">{selectedWarehouse.totalSlots}</div>
                                <div className="text-[11px] text-green-600 font-medium">Total Slots</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                <div className="text-base font-bold text-gray-700">{selectedWarehouse.totalArea} sqft</div>
                                <div className="text-[11px] text-gray-600 font-medium">Total Area</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                <div className="text-base font-bold text-gray-700">{selectedWarehouse.occupiedArea} sqft</div>
                                <div className="text-[11px] text-gray-600 font-medium">Used Area</div>
                            </div>
                            <div className="bg-green-100 rounded-lg p-2 border border-green-200 text-center">
                                <div className="text-base font-bold text-green-800">{occupancyRate}%</div>
                                <div className="text-[11px] text-green-700 font-medium">Occupancy</div>
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                    <div 
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            occupancyRate > 90 ? 'bg-red-500' :
                                            occupancyRate > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                        style={{ width: `${occupancyRate}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
                                <div className="text-base font-bold text-blue-700">Rs. {selectedWarehouse.pricingPerSqft}/sqft</div>
                                <div className="text-[11px] text-blue-600 font-medium">Pricing</div>
                            </div>
                        </div>
                        {/* Density Calculator */}
                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-2">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Estimate Required Area</h4>
                            <div className="grid grid-cols-4 gap-2 items-center">
                                <input
                                    type="number"
                                    value={produceWeight}
                                    onChange={e => setProduceWeight(e.target.value)}
                                    placeholder="Produce weight (kg)"
                                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs"
                                />
                                <select
                                    value={produceType}
                                    onChange={e => setProduceType(e.target.value)}
                                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs"
                                >
                                    <option value="Grains">Grains</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button
                                    onClick={handleDensityCalc}
                                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium"
                                >
                                    Calculate Area
                                </button>
                                {densityResult.area && (
                                    <span className="text-green-700 font-semibold ml-2 text-xs">
                                        Estimated Area: {densityResult.area} sqft
                                    </span>
                                )}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-2">
                                Typical conversion: <b>1 kg ≈ {densityResult.density || '0.22'} sqft</b> (adjust for produce type)
                            </div>
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="grid grid-cols-4 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Slot ID</label>
                                <input
                                    type="text"
                                    value={slotFilter}
                                    onChange={(e) => setSlotFilter(e.target.value)}
                                    placeholder="Filter by slot..."
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-xs"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-xs"
                                />
                            </div>
                            <div className="flex items-end">
                                <div className="text-xs text-gray-500">
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
                            showArea={true}
                            showMaxWeight={true}
                            showPrice={true}
                            onBookSlot={handleBookSlot}
                        />
                    ) : (
                        <BookingCalendar
                            slots={selectedWarehouse.slots}
                            onBookSlot={handleBookSlot}
                        />
                    )}
                </div>
            </div>
        );
    }

    // Keeper: no warehouse assigned
    if (user.role === 'keeper' && accessibleWarehouses.length === 0) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No warehouse assigned to you</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        Please contact your administrator to be assigned a warehouse.
                    </p>
                </div>
            </div>
        );
    }

    // Main warehouse selection view (owners only)
    return (
        <div className="p-4 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Slot Management</h1>
                            <p className="text-gray-500 text-xs mt-1">Select a warehouse to manage its slots</p>
                        </div>
                    </div>
                </div>
                {/* Warehouse Cards */}
                <div className="space-y-4">
                    {accessibleWarehouses.map((warehouse) => {
                        const occupancyRate = getOccupancyRate(warehouse);
                        const avgSlotArea = warehouse.totalArea / warehouse.totalSlots;
                        const avgMaxWeight = warehouse.slots?.length ? Math.round(
                            warehouse.slots.reduce((sum, s) => sum + (s.maxWeightKg || 0), 0) / warehouse.slots.length
                        ) : 0;
                        return (
                            <div key={warehouse.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
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
                                        <h3 className="font-bold text-base mb-2 truncate">
                                            {warehouse.name}
                                        </h3>
                                        <p className="text-green-700 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="truncate">{warehouse.address}</span>
                                        </p>
                                    </div>
                                    {/* Main Content Area */}
                                    <div className="flex-1 p-4 flex items-center">
                                        <div className="grid grid-cols-6 gap-2 w-full items-center">
                                            {/* Storage Type */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                                    <span className="text-base">
                                                        {warehouse.storageType?.includes('Cold') ? '❄️' : '🌡️'}
                                                    </span>
                                                    <span>{warehouse.storageType?.includes('Cold') ? 'Cold' : 'Dry'}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-500 mt-1 font-medium">
                                                    {occupancyRate}% Occupied
                                                </span>
                                            </div>
                                            {/* Total Area */}
                                            <div className="text-center">
                                                <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                                                    <div className="text-base font-bold text-green-700">{warehouse.totalArea} sqft</div>
                                                    <div className="text-[11px] text-green-600 font-medium">Total Area</div>
                                                </div>
                                            </div>
                                            {/* Avg Slot Area */}
                                            <div className="text-center">
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                                    <div className="text-base font-bold text-gray-700">{avgSlotArea} sqft</div>
                                                    <div className="text-[11px] text-gray-600 font-medium">Avg Slot Size</div>
                                                </div>
                                            </div>
                                            {/* Avg Max Weight */}
                                            <div className="text-center">
                                                <div className="bg-green-100 rounded-lg p-2 border border-green-200">
                                                    <div className="text-base font-bold text-green-800">{avgMaxWeight} kg</div>
                                                    <div className="text-[11px] text-green-700 font-medium">Max Weight/Slot</div>
                                                </div>
                                            </div>
                                            {/* Pricing */}
                                            <div className="text-center">
                                                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                                                    <div className="text-base font-bold text-blue-700">Rs. {warehouse.pricingPerSqft}/sqft</div>
                                                    <div className="text-[11px] text-blue-600 font-medium">Pricing</div>
                                                </div>
                                            </div>
                                            {/* Action */}
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleWarehouseSelect(warehouse)}
                                                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-xs font-medium flex items-center space-x-1 w-full justify-center"
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
                {/* Empty State */}
                {accessibleWarehouses.length === 0 && (
                    <div className="text-center py-8">
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
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