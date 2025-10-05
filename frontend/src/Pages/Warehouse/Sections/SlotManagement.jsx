import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../../../Contexts/UserContext';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import SlotsTable from '../../../Components/Warehouse/SlotsTable';
import BookingCalendar from '../../../Components/Warehouse/BookingCalendar';
import warehouseAPI from '../../../API/warehouse';
import slotsAPI from '../../../API/slots';

export default function SlotManagement() {
    const { user = {} } = useUserContext();
    
    // Independent state management for SlotManagement
    const [localWarehouses, setLocalWarehouses] = useState([]);
    const [warehousesLoading, setWarehousesLoading] = useState(false);
    const [warehousesError, setWarehousesError] = useState(null);
    
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouseSlots, setWarehouseSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [viewType, setViewType] = useState('table');
    const [dateFilter, setDateFilter] = useState('');
    const [slotFilter, setSlotFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Independent warehouse loading function
    const loadWarehousesIndependently = useCallback(async () => {
        setWarehousesLoading(true);
        setWarehousesError(null);
        try {
            console.log('SlotManagement: Starting warehouse loading...');
            console.log('SlotManagement: API Base URL:', import.meta.env.VITE_API_GATEWAY_URL);
            
            // First, try a health check
            try {
                const healthResponse = await warehouseAPI.healthCheck();
                console.log('SlotManagement: Health check passed:', healthResponse.status);
            } catch (healthError) {
                console.warn('SlotManagement: Health check failed:', healthError.message);
            }
            
            const response = await warehouseAPI.getWarehouses();
            
            console.log('SlotManagement: Raw API response:', response);
            console.log('SlotManagement: Response status:', response.status);
            console.log('SlotManagement: Response data:', response.data);
            console.log('SlotManagement: Data type:', typeof response.data);
            console.log('SlotManagement: Is array:', Array.isArray(response.data));
            
            const warehouses = response.data || [];
            setLocalWarehouses(warehouses);
            
            if (warehouses.length === 0) {
                console.warn('SlotManagement: No warehouses returned from API');
                setWarehousesError('No warehouses found. Please add warehouses in Facility Management first.');
            } else {
                console.log('SlotManagement: Successfully loaded warehouses:', warehouses.map(w => ({ id: w.id, name: w.name })));
            }
            
        } catch (error) {
            console.error('SlotManagement: Failed to load warehouses - Full error:', error);
            console.error('SlotManagement: Error message:', error.message);
            console.error('SlotManagement: Error response:', error.response);
            console.error('SlotManagement: Error status:', error.response?.status);
            console.error('SlotManagement: Error data:', error.response?.data);
            
            let errorMessage = 'Failed to load warehouses. ';
            if (error.response?.status === 404) {
                errorMessage += 'Warehouse service not found. Check if backend is running.';
            } else if (error.response?.status === 500) {
                errorMessage += 'Server error. Check backend logs.';
            } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
                errorMessage += 'Cannot connect to backend. Ensure API gateway is running on ' + (import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080');
            } else {
                errorMessage += error.message || 'Unknown error occurred.';
            }
            
            setWarehousesError(errorMessage);
            setLocalWarehouses([]);
        } finally {
            setWarehousesLoading(false);
        }
    }, []);

    // Generate all slots including available ones with comprehensive booking data
    const generateAllSlots = (totalSlots, existingSlots, warehouse) => {
        const slots = [];
        const existingSlotsMap = new Map();
        
        // Map existing slots by slot number
        existingSlots.forEach(slot => {
            existingSlotsMap.set(slot.slotNumber || slot.id, slot);
        });
        
        // Generate all slots from 1 to totalSlots
        for (let i = 1; i <= totalSlots; i++) {
            const existingSlot = existingSlotsMap.get(i);
            
            if (existingSlot) {
                // Use existing slot data with enhanced booking information
                slots.push({
                    ...existingSlot,
                    slotNumber: i,
                    status: existingSlot.status || (existingSlot.isOccupied ? 'occupied' : 'available'),
                    // Enhanced booking details
                    scheduledDate: existingSlot.scheduledDate || existingSlot.bookedUntil,
                    scheduledTime: existingSlot.scheduledTime || '09:00',
                    supplierName: existingSlot.supplierName || existingSlot.bookedBy,
                    transporterName: existingSlot.transporterName || 'Direct Delivery',
                    vehicleAssigned: existingSlot.vehicleAssigned || 'TRK-001',
                    contactNumber: existingSlot.contactNumber || existingSlot.farmerContact || '+94 77 123 4567',
                    goodsType: existingSlot.goodsType || existingSlot.produce || 'Mixed Produce',
                    quantity: existingSlot.quantity || existingSlot.usedWeight || 0,
                    quantityUnit: existingSlot.quantityUnit || 'kg',
                    deliveryType: existingSlot.deliveryType || (Math.random() > 0.5 ? 'delivery' : 'collection'),
                    specialInstructions: existingSlot.specialInstructions || 'Handle with care',
                    assignedTeam: existingSlot.assignedTeam || ['John Doe', 'Jane Smith'],
                    teamLead: existingSlot.teamLead || 'John Doe',
                    realTimeStatus: existingSlot.realTimeStatus || 'upcoming',
                    estimatedDuration: existingSlot.estimatedDuration || '2 hours',
                    priority: existingSlot.priority || 'normal',
                    temperatureRequirement: existingSlot.temperatureRequirement || existingSlot.temperature || 20,
                    notifications: existingSlot.notifications || {
                        reminderSent: false,
                        statusChanged: false,
                        lateArrival: false
                    }
                });
            } else {
                // Generate available slot placeholder with booking structure
                slots.push({
                    id: `${warehouse.id}-${i}`,
                    slotNumber: i,
                    warehouseId: warehouse.id,
                    status: 'available',
                    capacity: warehouse.capacityPerSlot || 100,
                    maxWeightKg: warehouse.capacityPerSlot || 100,
                    areaSqft: warehouse.capacityPerSlot || 100,
                    usedCapacity: 0,
                    usedWeight: 0,
                    usedArea: 0,
                    price: warehouse.pricePerKg ? (warehouse.pricePerKg * (warehouse.capacityPerSlot || 100)) : 0,
                    pricePerKg: warehouse.pricePerKg || 0,
                    temperature: warehouse.temperatureMin || 20,
                    isGenerated: true,
                    // Default booking structure for available slots
                    scheduledDate: null,
                    scheduledTime: null,
                    supplierName: null,
                    transporterName: null,
                    vehicleAssigned: null,
                    contactNumber: null,
                    goodsType: null,
                    quantity: 0,
                    quantityUnit: 'kg',
                    deliveryType: null,
                    specialInstructions: null,
                    assignedTeam: [],
                    teamLead: null,
                    realTimeStatus: 'available',
                    estimatedDuration: null,
                    priority: 'normal',
                    temperatureRequirement: warehouse.temperatureMin || 20,
                    notifications: {
                        reminderSent: false,
                        statusChanged: false,
                        lateArrival: false
                    }
                });
            }
        }
        
        return slots;
    };

    const loadSlotsForWarehouse = useCallback(async (warehouseId) => {
        setSlotsLoading(true);
        setSlotsError(null);
        try {
            console.log('SlotManagement: Loading slots for warehouse:', warehouseId);
            
            // Get the selected warehouse info to know total slots
            const warehouse = localWarehouses.find(w => w.id === warehouseId);
            const totalSlots = warehouse?.totalSlots || 0;
            
            console.log('SlotManagement: Expected total slots:', totalSlots);
            
            // Fetch existing slots from API
            const response = await slotsAPI.getSlotsByWarehouse(warehouseId);
            const existingSlots = response.data || [];
            
            console.log('SlotManagement: Existing slots from API:', existingSlots.length);
            
            // Generate all slots (both existing and placeholder slots)
            const allSlots = generateAllSlots(totalSlots, existingSlots, warehouse);
            
            setWarehouseSlots(allSlots);
            console.log('SlotManagement: Total slots generated:', allSlots.length);
            
        } catch (error) {
            console.error('SlotManagement: Failed to load slots:', error);
            setSlotsError('Failed to load slots for this warehouse');
            setWarehouseSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, [localWarehouses]);

    // Load warehouses on component mount
    useEffect(() => {
        loadWarehousesIndependently();
    }, [loadWarehousesIndependently]);

    // Load slots when a warehouse is selected
    useEffect(() => {
        if (selectedWarehouse?.id) {
            loadSlotsForWarehouse(selectedWarehouse.id);
        }
    }, [selectedWarehouse, loadSlotsForWarehouse]);
    
    // Keeper restriction: only show assigned warehouse
    const accessibleWarehouses = user.role === 'keeper'
        ? localWarehouses.filter(w => w.id === user.assignedWarehouseId)
        : localWarehouses;

    // Pre-select keeper's warehouse
    useEffect(() => {
        if (user.role === 'keeper') {
            const keeperWarehouse = accessibleWarehouses[0];
            setSelectedWarehouse(keeperWarehouse || null);
        }
    }, [user, accessibleWarehouses]);

    const handleWarehouseSelect = (warehouse) => {
        if (user.role !== 'keeper') setSelectedWarehouse(warehouse);
    };

    const handleBackToWarehouses = () => {
        if (user.role !== 'keeper') setSelectedWarehouse(null);
    };

    // Calculate occupancy rate by area (use backend utilization data if available)
    const getOccupancyRate = (warehouse) => {
        if (warehouse?.utilization?.utilizationPercentage !== undefined) {
            return Math.round(warehouse.utilization.utilizationPercentage);
        }
        // Fallback calculation if utilization data is not available
        return (warehouse?.totalCapacity && warehouse?.occupiedCapacity)
            ? Math.round((warehouse.occupiedCapacity / warehouse.totalCapacity) * 100)
            : 0;
    };

    // Filter slots based on criteria including real-time status
    const getFilteredSlots = (slots) => {
        if (!slots || !Array.isArray(slots)) return [];
        return slots.filter(slot => {
            // Filter by slot ID or slot number
            if (slotFilter && 
                !slot.id.toString().includes(slotFilter) && 
                !(slot.slotNumber && slot.slotNumber.toString().includes(slotFilter))) {
                return false;
            }
            // Filter by real-time status or fallback to regular status
            const currentStatus = slot.realTimeStatus || slot.status;
            if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
            
            // Filter by scheduled date
            if (dateFilter && slot.scheduledDate && slot.scheduledDate !== dateFilter) return false;
            
            return true;
        });
    };

    // Get filtered slots from warehouseSlots state
    const filteredSlots = getFilteredSlots(warehouseSlots);

    // Get slot status color based on real-time status
    const getSlotStatusColor = (slot) => {
        const status = slot.realTimeStatus || slot.status;
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'occupied':
            case 'completed': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'delayed': return 'bg-orange-100 text-orange-800';
            case 'booked': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get usage percentage (by capacity or area)
    const getUsagePercentage = (slot) => {
        // Try capacity first, then fall back to area
        if (slot.capacity || slot.maxWeightKg) {
            const maxCapacity = slot.capacity || slot.maxWeightKg;
            const usedCapacity = slot.usedCapacity || slot.usedWeight || 0;
            return Math.round((usedCapacity / maxCapacity) * 100);
        }
        if (slot.areaSqft) {
            return Math.round(((slot.usedArea || 0) / slot.areaSqft) * 100);
        }
        return 0;
    };

    // Format storage type from API enum to readable format
    const formatStorageType = (storageType, temperatureMin, temperatureMax) => {
        if (!storageType) return null;
        
        switch (storageType) {
            case 'COLD_STORAGE': {
                const coldTemp = temperatureMin !== undefined && temperatureMax !== undefined 
                    ? `(${temperatureMin}°C to ${temperatureMax}°C)` 
                    : '(0°C to 14°C)';
                return `Cold Storage ${coldTemp}`;
            }
            case 'DRY_STORAGE': {
                const dryTemp = temperatureMin !== undefined && temperatureMax !== undefined 
                    ? `(${temperatureMin}°C to ${temperatureMax}°C)` 
                    : '(14°C to 28°C)';
                return `Dry Storage ${dryTemp}`;
            }
            case 'FROZEN_STORAGE': {
                const frozenTemp = temperatureMin !== undefined && temperatureMax !== undefined 
                    ? `(${temperatureMin}°C to ${temperatureMax}°C)` 
                    : '(-18°C to 0°C)';
                return `Frozen Storage ${frozenTemp}`;
            }
            case 'AMBIENT_STORAGE': {
                return 'Ambient Storage (Room Temperature)';
            }
            default: {
                return storageType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            }
        }
    };



    // Show loading state while warehouses are being loaded
    if (warehousesLoading && localWarehouses.length === 0) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Warehouses</h3>
                    <p className="text-gray-500 text-sm">Please wait while we load warehouse data...</p>
                </div>
            </div>
        );
    }

    // Show error state if there's an error loading warehouses
    if (warehousesError && localWarehouses.length === 0) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center max-w-md">
                    <div className="text-4xl mb-4">❌</div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Warehouses</h3>
                    <p className="text-red-600 text-sm mb-4 whitespace-pre-line">{warehousesError}</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => loadWarehousesIndependently()}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <div className="text-xs text-gray-500 mt-2">
                            If this persists, check:
                            <br />• Backend services are running
                            <br />• Database contains warehouses
                            <br />• API gateway is accessible
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedWarehouse) {
        const occupancyRate = getOccupancyRate(selectedWarehouse);

        return (
            <div className="p-4 bg-white min-h-screen">
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
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewType === 'table'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <EyeIcon className="w-4 h-4 inline mr-1" />
                                    Table View
                                </button>
                                <button
                                    onClick={() => setViewType('calendar')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewType === 'calendar'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    📅 Calendar
                                </button>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
                            <div className="bg-green-50 rounded-lg p-2 border border-green-100 text-center">
                                <div className="text-base font-bold text-green-700">{selectedWarehouse.totalSlots || 0}</div>
                                <div className="text-[11px] text-green-600 font-medium">Total Slots</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
                                <div className="text-base font-bold text-blue-700">{filteredSlots.filter(s => s.status === 'available').length}</div>
                                <div className="text-[11px] text-blue-600 font-medium">Available</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-2 border border-purple-100 text-center">
                                <div className="text-base font-bold text-purple-700">{filteredSlots.filter(s => s.status === 'occupied' || s.status === 'booked').length}</div>
                                <div className="text-[11px] text-purple-600 font-medium">Occupied</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-2 border border-orange-100 text-center">
                                <div className="text-base font-bold text-orange-700">{occupancyRate}%</div>
                                <div className="text-[11px] text-orange-600 font-medium">Utilization</div>
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
                            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
                                <div className="text-base font-bold text-gray-700">{selectedWarehouse.totalArea || selectedWarehouse.totalCapacity || 'N/A'}</div>
                                <div className="text-[11px] text-gray-600 font-medium">{selectedWarehouse.totalArea ? 'Total Area (sqft)' : 'Total Capacity (kg)'}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 text-center">
                                <div className="text-base font-bold text-indigo-700">Rs. {selectedWarehouse.pricePerKg || selectedWarehouse.pricingPerSqft || 0}</div>
                                <div className="text-[11px] text-indigo-600 font-medium">{selectedWarehouse.pricePerKg ? 'Price/kg' : 'Price/sqft'}</div>
                            </div>
                        </div>
                        
                        {/* Additional Warehouse Details */}
                        {(selectedWarehouse.storageType || selectedWarehouse.status) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedWarehouse.storageType && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        🌡️ {formatStorageType(selectedWarehouse.storageType, selectedWarehouse.temperatureMin, selectedWarehouse.temperatureMax)}
                                    </span>
                                )}
                                {selectedWarehouse.status && (
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        selectedWarehouse.status === 'OPEN' || selectedWarehouse.status === 'operational' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        📊 {selectedWarehouse.status === 'OPEN' ? 'Operational' : selectedWarehouse.status.charAt(0).toUpperCase() + selectedWarehouse.status.slice(1).toLowerCase()}
                                    </span>
                                )}
                                {selectedWarehouse.certifications && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                        🏆 {selectedWarehouse.certifications}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
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
                                    <option value="upcoming">Upcoming</option>
                                    <option value="pending">Pending</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="delayed">Delayed</option>
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
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Type</label>
                                <select
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-xs"
                                >
                                    <option value="all">All Types</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="collection">Collection</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Team</label>
                                <select
                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 text-xs"
                                >
                                    <option value="all">All Teams</option>
                                    <option value="team-a">Team A</option>
                                    <option value="team-b">Team B</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="text-xs text-gray-500">
                                    <span className="font-semibold">Showing:</span> {filteredSlots.length} of {warehouseSlots.length}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Slots Display */}
                    {/* Show slots loading state */}
                    {slotsLoading && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full mr-3"></div>
                                <span className="text-gray-600">Loading slots...</span>
                            </div>
                        </div>
                    )}

                    {/* Show slots error state */}
                    {slotsError && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <span className="text-red-500 mr-2">⚠️</span>
                                    <span className="text-red-700">{slotsError}</span>
                                    <button
                                        onClick={() => loadSlotsForWarehouse(selectedWarehouse.id)}
                                        className="ml-auto bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show slots data when not loading and no error */}
                    {!slotsLoading && !slotsError && (
                        <>
                            {/* Show message when no slots are available */}
                            {filteredSlots.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p className="text-lg font-medium mb-1">No slots found</p>
                                        <p className="text-sm">
                                            {warehouseSlots.length === 0 
                                                ? "This warehouse doesn't have any slots configured yet."
                                                : "No slots match your current filters."
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {viewType === 'table' ? (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="p-4 border-b border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            All Warehouse Slots ({filteredSlots.length} of {warehouseSlots.length} slots)
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Complete view of all slots including available and occupied
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-600">
                                                        <div>Available: {filteredSlots.filter(s => s.status === 'available').length}</div>
                                                        <div>Occupied: {filteredSlots.filter(s => s.status === 'occupied' || s.status === 'booked').length}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Slots Grid */}
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {filteredSlots.map((slot) => {
                                                        const usagePercentage = getUsagePercentage(slot);
                                                        const statusColor = getSlotStatusColor(slot);
                                                        const isOccupied = slot.status === 'occupied' || slot.status === 'booked';
                                                        const isGenerated = slot.isGenerated;
                                                        
                                                        return (
                                                            <div 
                                                                key={slot.id || `slot-${slot.slotNumber}`} 
                                                                className={`border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                                                                    slot.status === 'available' 
                                                                        ? 'border-green-200 bg-green-50 hover:border-green-300' 
                                                                        : isOccupied
                                                                        ? 'border-blue-200 bg-blue-50 hover:border-blue-300'
                                                                        : 'border-red-200 bg-red-50 hover:border-red-300'
                                                                } ${isGenerated ? 'border-dashed' : ''}`}
                                                            >
                                                        {/* Slot Header */}
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-gray-800">
                                                                    Slot #{slot.slotNumber || slot.id}
                                                                    {isGenerated && <span className="text-xs text-gray-500 ml-2">(Available)</span>}
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                                        {(slot.realTimeStatus || slot.status)?.toUpperCase() || 'AVAILABLE'}
                                                                    </span>
                                                                    {slot.priority && slot.priority !== 'normal' && (
                                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                                            slot.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                            {slot.priority.toUpperCase()} PRIORITY
                                                                        </span>
                                                                    )}
                                                                    {slot.deliveryType && (
                                                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {slot.deliveryType === 'delivery' ? '📦 DELIVERY' : '📤 COLLECTION'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium text-gray-600">Usage</div>
                                                                <div className="text-lg font-bold text-blue-600">{usagePercentage}%</div>
                                                            </div>
                                                        </div>

                                                        {/* Scheduling Information */}
                                                        {(slot.scheduledDate || slot.scheduledTime) && (
                                                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 mb-3">
                                                                <div className="text-xs text-indigo-600 font-medium mb-2">📅 SCHEDULING DETAILS</div>
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                                    {slot.scheduledDate && (
                                                                        <div>
                                                                            <span className="text-gray-600">Date:</span>
                                                                            <div className="font-medium text-gray-800">{slot.scheduledDate}</div>
                                                                        </div>
                                                                    )}
                                                                    {slot.scheduledTime && (
                                                                        <div>
                                                                            <span className="text-gray-600">Time:</span>
                                                                            <div className="font-medium text-gray-800">{slot.scheduledTime}</div>
                                                                        </div>
                                                                    )}
                                                                    {slot.estimatedDuration && (
                                                                        <div className="col-span-2">
                                                                            <span className="text-gray-600">Duration:</span>
                                                                            <div className="font-medium text-gray-800">{slot.estimatedDuration}</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Supplier & Transport Information */}
                                                        {(slot.supplierName || slot.transporterName || slot.vehicleAssigned) && (
                                                            <div className="bg-green-50 rounded-lg p-3 border border-green-100 mb-3">
                                                                <div className="text-xs text-green-600 font-medium mb-2">🚚 LOGISTICS DETAILS</div>
                                                                <div className="space-y-1 text-sm">
                                                                    {slot.supplierName && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Supplier:</span>
                                                                            <span className="font-medium text-gray-800">{slot.supplierName}</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.transporterName && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Transporter:</span>
                                                                            <span className="font-medium text-gray-800">{slot.transporterName}</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.vehicleAssigned && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Vehicle:</span>
                                                                            <span className="font-medium text-gray-800">{slot.vehicleAssigned}</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.contactNumber && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Contact:</span>
                                                                            <span className="font-medium text-blue-600">{slot.contactNumber}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Goods Information */}
                                                        {(slot.goodsType || slot.quantity) && (
                                                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100 mb-3">
                                                                <div className="text-xs text-yellow-600 font-medium mb-2">📦 GOODS DETAILS</div>
                                                                <div className="space-y-1 text-sm">
                                                                    {slot.goodsType && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Type:</span>
                                                                            <span className="font-medium text-gray-800">{slot.goodsType}</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.quantity > 0 && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Quantity:</span>
                                                                            <span className="font-medium text-gray-800">{slot.quantity} {slot.quantityUnit}</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.temperatureRequirement && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Temperature:</span>
                                                                            <span className="font-medium text-gray-800">{slot.temperatureRequirement}°C</span>
                                                                        </div>
                                                                    )}
                                                                    {slot.specialInstructions && (
                                                                        <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
                                                                            <span className="font-medium">Special Instructions:</span><br/>
                                                                            {slot.specialInstructions}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Team Assignment */}
                                                        {(slot.assignedTeam && slot.assignedTeam.length > 0) && (
                                                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 mb-3">
                                                                <div className="text-xs text-purple-600 font-medium mb-2">👥 TEAM ASSIGNMENT</div>
                                                                <div className="space-y-1 text-sm">
                                                                    {slot.teamLead && (
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">Team Lead:</span>
                                                                            <span className="font-medium text-gray-800">{slot.teamLead}</span>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <span className="text-gray-600">Team Members:</span>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {slot.assignedTeam.map((member, index) => (
                                                                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                                                    {member}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Notifications & Alerts */}
                                                        {slot.notifications && Object.values(slot.notifications).some(val => val) && (
                                                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 mb-3">
                                                                <div className="text-xs text-orange-600 font-medium mb-2">🔔 NOTIFICATIONS</div>
                                                                <div className="space-y-1 text-xs">
                                                                    {slot.notifications.reminderSent && (
                                                                        <div className="text-green-600">✅ Reminder sent</div>
                                                                    )}
                                                                    {slot.notifications.statusChanged && (
                                                                        <div className="text-blue-600">📝 Status updated</div>
                                                                    )}
                                                                    {slot.notifications.lateArrival && (
                                                                        <div className="text-red-600">⚠️ Late arrival alert</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}                                                                {/* Capacity Information */}
                                                                <div className="space-y-3 mb-4">
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                                            <div className="text-xs text-gray-500 mb-1">Capacity</div>
                                                                            <div className="text-sm font-semibold text-gray-800">
                                                                                {slot.usedCapacity || slot.usedWeight || 0} / {slot.capacity || slot.maxWeightKg || 0} kg
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                                                <div 
                                                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                                                                    style={{ width: `${Math.min(((slot.usedCapacity || slot.usedWeight || 0) / (slot.capacity || slot.maxWeightKg || 1)) * 100, 100)}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                                            <div className="text-xs text-gray-500 mb-1">Area</div>
                                                                            <div className="text-sm font-semibold text-gray-800">
                                                                                {slot.usedArea || 0} / {slot.areaSqft || slot.capacity || 100} sqft
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                                                <div 
                                                                                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                                                                                    style={{ width: `${Math.min(((slot.usedArea || 0) / (slot.areaSqft || slot.capacity || 1)) * 100, 100)}%` }}
                                                                                ></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Pricing */}
                                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-xs text-gray-500">Price</span>
                                                                            <span className="text-lg font-bold text-green-600">
                                                                                Rs. {(slot.price || (slot.pricePerKg * (slot.capacity || 100)) || 0).toLocaleString()}
                                                                            </span>
                                                                        </div>
                                                                        {slot.pricePerKg && (
                                                                            <div className="text-xs text-gray-500 mt-1">
                                                                                Rs. {slot.pricePerKg}/kg
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Booking/Occupancy Information */}
                                                                {(slot.status === 'occupied' || slot.status === 'booked' || slot.bookedBy) && (
                                                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-3">
                                                                        <div className="text-xs text-blue-600 font-medium mb-2">
                                                                            {slot.status === 'occupied' ? 'OCCUPANCY DETAILS' : 'BOOKING DETAILS'}
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {slot.bookedBy && (
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">{slot.status === 'occupied' ? 'Occupied by:' : 'Booked by:'}</span>
                                                                                    <span className="font-medium text-gray-800">{slot.bookedBy}</span>
                                                                                </div>
                                                                            )}
                                                                            {slot.bookedUntil && (
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Until:</span>
                                                                                    <span className="font-medium text-gray-800">{slot.bookedUntil}</span>
                                                                                </div>
                                                                            )}
                                                                            {slot.produce && (
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Produce:</span>
                                                                                    <span className="font-medium text-gray-800">{slot.produce}</span>
                                                                                </div>
                                                                            )}
                                                                            {slot.temperature && (
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Temperature:</span>
                                                                                    <span className="font-medium text-gray-800">{slot.temperature}°C</span>
                                                                                </div>
                                                                            )}
                                                                            {slot.farmerContact && (
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Contact:</span>
                                                                                    <span className="font-medium text-gray-800">{slot.farmerContact}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <BookingCalendar
                                            slots={warehouseSlots}
                                            warehouse={selectedWarehouse}
                                            readOnly={true}
                                        />
                                    )}
                                </>
                            )}
                        </>
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
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Slot Management</h1>
                        <p className="text-gray-500 text-xs mt-1">Select a warehouse to manage its slots</p>
                    </div>
                </div>
                {/* Warehouse Cards */}
                <div className="space-y-4">
                    {accessibleWarehouses.length === 0 ? (
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🏢</div>
                                <p className="text-lg font-medium mb-1">No warehouses available</p>
                                <p className="text-sm">
                                    {user.role === 'keeper' 
                                        ? "You haven't been assigned to any warehouse yet."
                                        : "No warehouses have been created yet. Create a warehouse to start managing slots."
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        accessibleWarehouses.map((warehouse) => {
                        const occupancyRate = getOccupancyRate(warehouse);
                        return (
                            <div key={warehouse.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                                <div className="flex">
                                    {/* Left Header Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 text-green-700 p-4 flex-shrink-0 w-64">
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
                                                {(warehouse.status || 'unknown').toUpperCase()}
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
                                                        {warehouse.storageType?.includes('COLD') ? '❄️' : '🌡️'}
                                                    </span>
                                                    <span>{warehouse.storageType?.includes('COLD') ? 'Cold' : warehouse.storageType?.includes('DRY') ? 'Dry' : 'Storage'}</span>
                                                    {warehouse.temperatureMin !== undefined && warehouse.temperatureMax !== undefined && (
                                                        <span className="text-[10px]">({warehouse.temperatureMin}°C - {warehouse.temperatureMax}°C)</span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-gray-500 mt-1 font-medium">
                                                    {occupancyRate}% Occupied
                                                </span>
                                            </div>
                                            {/* Total Capacity */}
                                            <div className="text-center">
                                                <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                                                    <div className="text-base font-bold text-green-700">{warehouse.totalCapacity || 0} kg</div>
                                                    <div className="text-[11px] text-green-600 font-medium">Total Capacity</div>
                                                </div>
                                            </div>
                                            {/* Total Slots */}
                                            <div className="text-center">
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                                    <div className="text-base font-bold text-gray-700">{warehouse.totalSlots || 0}</div>
                                                    <div className="text-[11px] text-gray-600 font-medium">Total Slots</div>
                                                </div>
                                            </div>
                                            {/* Occupied Capacity */}
                                            <div className="text-center">
                                                <div className="bg-green-100 rounded-lg p-2 border border-green-200">
                                                    <div className="text-base font-bold text-green-800">{warehouse.occupiedCapacity || 0} kg</div>
                                                    <div className="text-[11px] text-green-700 font-medium">Used Capacity</div>
                                                </div>
                                            </div>
                                            {/* Pricing */}
                                            <div className="text-center">
                                                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                                                    <div className="text-base font-bold text-blue-700">Rs. {warehouse.pricePerKg || 0}/kg</div>
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
                    })
                    )}
                </div>
            </div>
        </div>
    );
}