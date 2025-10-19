import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../../../Contexts/UserContext';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import SlotBookingPanel from '../../../Components/Warehouse/SlotBookingPanel';
import SlotsTable from '../../../Components/Warehouse/SlotsTable';
import warehouseAPI from '../../../API/warehouse';
import slotsAPI from '../../../API/slots';
import { formatSlotId } from '../../../Utils/slotUtils';

export default function SlotManagement() {
  const { user = {} } = useUserContext();

  /* ----------  state  ---------- */
  const [localWarehouses, setLocalWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [warehousesError, setWarehousesError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseSlots, setWarehouseSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [slotFilter, setSlotFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slotMode, setSlotMode] = useState('booked');

  /* ----------  data loaders  ---------- */
  const loadWarehousesIndependently = useCallback(async (retryAttempt = 0) => {
    setWarehousesLoading(true);
    setWarehousesError(null);
    setIsRetrying(retryAttempt > 0);
    
    try {
      const response = await warehouseAPI.getWarehouses();
      setLocalWarehouses(response.data || []);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error loading warehouses:', error);
      
      const errorMessage = error.response?.status === 503 
        ? 'Service temporarily unavailable. Please check your connection and try again.'
        : error.response?.data?.message || error.message || 'Failed to load warehouses';
      
      setWarehousesError(errorMessage);
      
      // Auto-retry for 503 errors with exponential backoff
      if (error.response?.status === 503 && retryAttempt < 3) {
        const delay = Math.pow(2, retryAttempt) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          loadWarehousesIndependently(retryAttempt + 1);
        }, delay);
        return;
      }
      
      setRetryCount(retryAttempt);
    } finally {
      setWarehousesLoading(false);
      setIsRetrying(false);
    }
  }, []);

  const loadSlotsForWarehouse = useCallback(async (warehouseId, retryAttempt = 0) => {
    setSlotsLoading(true);
    setSlotsError(null);
    
    try {
      let response;
      // Use different API endpoints based on slot mode
      if (slotMode === 'all') {
        response = await slotsAPI.getAllSlotsForWarehouse(warehouseId);
      } else {
        response = await slotsAPI.getSlotsByWarehouse(warehouseId);
      }
      setWarehouseSlots(response.data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      
      const errorMessage = error.response?.status === 503 
        ? 'Service temporarily unavailable. Please try again.'
        : error.response?.data?.message || error.message || 'Failed to load slots';
      
      setSlotsError(errorMessage);
      
      // Auto-retry for 503 errors
      if (error.response?.status === 503 && retryAttempt < 2) {
        const delay = Math.pow(2, retryAttempt) * 1000;
        setTimeout(() => {
          loadSlotsForWarehouse(warehouseId, retryAttempt + 1);
        }, delay);
      }
    } finally {
      setSlotsLoading(false);
    }
  }, [slotMode]);

  useEffect(() => {
    loadWarehousesIndependently();
  }, [loadWarehousesIndependently]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      loadSlotsForWarehouse(selectedWarehouse.id);
    }
  }, [selectedWarehouse, loadSlotsForWarehouse]);

  /* ----------  keeper logic  ---------- */
  const accessibleWarehouses = user.role === 'keeper' 
    ? localWarehouses.filter(w => w.id === user.assignedWarehouseId) 
    : localWarehouses;

  useEffect(() => {
    if (user.role === 'keeper' && accessibleWarehouses.length > 0) {
      setSelectedWarehouse(accessibleWarehouses[0]);
    }
  }, [user.role, accessibleWarehouses]);

  const handleWarehouseSelect = (w) => {
    if (user.role !== 'keeper') {
      setSelectedWarehouse(w);
    }
  };

  const handleBackToWarehouses = () => {
    if (user.role !== 'keeper') {
      setSelectedWarehouse(null);
    }
  };

  /* ----------  helper functions  ---------- */
  const getOccupancyRate = (warehouse) => {
    if (!warehouse || !warehouse.totalSlots || warehouse.totalSlots === 0) return 0;
    const occupiedSlots = warehouseSlots.filter(s => s.status === 'OCCUPIED' || s.status === 'RESERVED').length;
    return Math.round((occupiedSlots / warehouse.totalSlots) * 100);
  };

  const getFilteredSlots = (slots) => {
    return slots.filter(slot => {
      const matchesSlot = !slotFilter || formatSlotId(slot.slotNumber).toLowerCase().includes(slotFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
      const matchesDate = !dateFilter || (slot.bookedDate && slot.bookedDate.startsWith(dateFilter));
      return matchesSlot && matchesStatus && matchesDate;
    });
  };

  // Filter slots based on slotMode
  const getDisplaySlots = () => {
    if (slotMode === 'all') {
      return getFilteredSlots(warehouseSlots);
    }
    // Default to booked slots
    return [];
  };

  // Helper function for slot status colors
  const getSlotStatusColor = (slot) => {
    switch (slot.status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-orange-100 text-orange-800';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_ORDER':
        return 'bg-gray-100 text-gray-800';
      case 'CLEANING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function for usage percentage
  const getUsagePercentage = (slot) => {
    if (!slot.capacityKg || slot.capacityKg === 0) return 0;
    return Math.round((slot.totalStoredKg || 0) / slot.capacityKg * 100);
  };

  /* ----------  loading / error screens  ---------- */
  if (warehousesLoading && localWarehouses.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isRetrying ? `Retrying... (Attempt ${retryCount + 1})` : 'Loading Warehouses'}
          </h3>
          <p className="text-gray-500 text-sm">Please wait while we load warehouse data...</p>
          {isRetrying && (
            <p className="text-orange-600 text-xs mt-2">
              Service temporarily unavailable, retrying automatically...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (warehousesError && localWarehouses.length === 0) {
    const isServiceUnavailable = warehousesError.includes('Service temporarily unavailable') || 
                                warehousesError.includes('503');
    
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className={`bg-white rounded-xl shadow-sm border p-8 text-center max-w-md ${
          isServiceUnavailable ? 'border-orange-100' : 'border-red-100'
        }`}>
          <div className="text-4xl mb-4">
            {isServiceUnavailable ? '🔄' : '❌'}
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${
            isServiceUnavailable ? 'text-orange-800' : 'text-red-800'
          }`}>
            {isServiceUnavailable ? 'Service Temporarily Unavailable' : 'Error Loading Warehouses'}
          </h3>
          <p className={`text-sm mb-4 whitespace-pre-line ${
            isServiceUnavailable ? 'text-orange-600' : 'text-red-600'
          }`}>
            {warehousesError}
          </p>
          {isServiceUnavailable && (
            <p className="text-gray-500 text-xs mb-4">
              The warehouse service might be starting up or temporarily down. 
              {retryCount > 0 && ` Failed ${retryCount} time(s).`}
            </p>
          )}
          <div className="space-y-2">
            <button 
              onClick={() => loadWarehousesIndependently()} 
              disabled={isRetrying}
              className={`w-full px-4 py-2 rounded-lg text-white ${
                isServiceUnavailable 
                  ? 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300' 
                  : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
              } disabled:cursor-not-allowed`}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
            {isServiceUnavailable && (
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'keeper' && accessibleWarehouses.length === 0) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No warehouse assigned to you</h3>
          <p className="text-gray-500 text-sm mb-4">Please contact your administrator to be assigned a warehouse.</p>
        </div>
      </div>
    );
  }

  if (!selectedWarehouse) {
    return (
      <div className="p-4 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <h1 className="text-xl font-bold text-gray-800">Slot Management</h1>
            <p className="text-gray-500 text-xs mt-1">Select a warehouse to manage its slots</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleWarehouses.map(warehouse => (
              <div
                key={warehouse.id}
                onClick={() => handleWarehouseSelect(warehouse)}
                className="bg-white rounded-xl shadow border border-gray-100 p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{warehouse.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{warehouse.address}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Slots:</span>
                  <span className="font-semibold text-gray-800">{warehouse.totalSlots || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const occupancyRate = getOccupancyRate(selectedWarehouse);
  const availableSlots = warehouseSlots.filter(s => s.status === 'AVAILABLE').length;
  const occupiedSlots = warehouseSlots.filter(s => s.status === 'OCCUPIED').length;
  const bookedSlots = warehouseSlots.filter(s => s.status === 'RESERVED').length;

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* Connection status indicator */}
        {retryCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <span className="text-orange-500 mr-2">⚠️</span>
              <span className="text-orange-700 text-sm">
                Connection issues detected. Some features may not work properly.
              </span>
            </div>
          </div>
        )}

        {/* ------------  header  ------------ */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {user.role !== 'keeper' && (
                <button 
                  onClick={handleBackToWarehouses} 
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">Back</span>
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">{selectedWarehouse.name}</h1>
                <p className="text-gray-500 text-xs mt-1">{selectedWarehouse.address}</p>
              </div>
            </div>

            {/* toggle buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSlotMode('booked')}
                className={`px-3 py-1 rounded text-sm ${slotMode === 'booked' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                Booked
              </button>
              <button
                onClick={() => setSlotMode('all')}
                className={`px-3 py-1 rounded text-sm ${slotMode === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                All Slots
              </button>
            </div>
          </div>

          {/* stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
            <div className="bg-green-50 rounded-lg p-2 border border-green-100 text-center">
              <div className="text-base font-bold text-green-700">{selectedWarehouse.totalSlots || 0}</div>
              <div className="text-[11px] text-green-600 font-medium">Total Slots</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
              <div className="text-base font-bold text-blue-700">{availableSlots}</div>
              <div className="text-[11px] text-blue-600 font-medium">Available</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-100 text-center">
              <div className="text-base font-bold text-purple-700">{occupiedSlots}</div>
              <div className="text-[11px] text-purple-600 font-medium">Occupied</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 border border-orange-100 text-center">
              <div className="text-base font-bold text-orange-700">{bookedSlots}</div>
              <div className="text-[11px] text-orange-600 font-medium">Booked</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-center">
              <div className="text-base font-bold text-gray-700">{occupancyRate}%</div>
              <div className="text-[11px] text-gray-600 font-medium">Occupancy</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100 text-center">
              <div className="text-base font-bold text-indigo-700">{warehouseSlots.length}</div>
              <div className="text-[11px] text-indigo-600 font-medium">Total Tracked</div>
            </div>
          </div>
        </div>

        {/* ----------  booked vs all toggle content  ---------- */}
        {slotMode === 'booked' ? (
          <SlotBookingPanel warehouseId={selectedWarehouse.id} userId={user.id} />
        ) : (
          <>
            {/* filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Slot ID</label>
                  <input 
                    type="text" 
                    value={slotFilter} 
                    onChange={e => setSlotFilter(e.target.value)} 
                    placeholder="Filter by slot..." 
                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="all">All Status</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_ORDER">Out of Order</option>
                    <option value="CLEANING">Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={dateFilter} 
                    onChange={e => setDateFilter(e.target.value)} 
                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs" 
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Showing:</span> {getFilteredSlots(warehouseSlots).length} of {warehouseSlots.length}
                  </div>
                </div>
              </div>
            </div>

            {/* loading state */}
            {slotsLoading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full mr-3"></div>
                  <span className="text-gray-600">Loading slots...</span>
                </div>
              </div>
            )}

            {/* error state */}
            {slotsError && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className={`border rounded-lg p-4 flex items-center justify-between ${
                  slotsError.includes('Service temporarily unavailable') || slotsError.includes('503')
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center">
                    <span className={`mr-2 ${
                      slotsError.includes('Service temporarily unavailable') ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      ⚠️
                    </span>
                    <span className={
                      slotsError.includes('Service temporarily unavailable') ? 'text-orange-700' : 'text-red-700'
                    }>
                      {slotsError}
                    </span>
                  </div>
                  <button 
                    onClick={() => loadSlotsForWarehouse(selectedWarehouse.id)} 
                    className={`text-white px-3 py-1 rounded text-sm ${
                      slotsError.includes('Service temporarily unavailable')
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* slots display for all/available modes */}
            {!slotsLoading && !slotsError && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <SlotsTable 
                  slots={getDisplaySlots()} 
                  getSlotStatusColor={getSlotStatusColor}
                  getUsagePercentage={getUsagePercentage}
                />
              </div>
            )}
            
          </>
        )}
      </div>
    </div>
  );
}
