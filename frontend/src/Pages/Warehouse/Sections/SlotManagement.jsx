import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../../../Contexts/UserContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SlotBookingPanel from '../../../Components/Warehouse/SlotBookingPanel';
import warehouseAPI from '../../../API/warehouse';
import slotsAPI from '../../../API/slots';

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
  const [slotMode, setSlotMode] = useState('booked');

  /* ----------  data loaders  ---------- */
  const loadWarehousesIndependently = useCallback(async (retryAttempt = 0) => {
    setWarehousesLoading(true);
    setWarehousesError(null);
    setIsRetrying(retryAttempt > 0);

    try {
      const response = await warehouseAPI.getWarehouses();
      setLocalWarehouses(response.data || []);
      setRetryCount(0);
    } catch (error) {
      console.error('Error loading warehouses:', error);

      const errorMessage =
        error.response?.status === 503
          ? 'Service temporarily unavailable. Please check your connection and try again.'
          : error.response?.data?.message || error.message || 'Failed to load warehouses';

      setWarehousesError(errorMessage);

      // Auto-retry for 503 errors with exponential backoff
      if (error.response?.status === 503 && retryAttempt < 3) {
        const delay = Math.pow(2, retryAttempt) * 1000;
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

  const loadSlotsForWarehouse = useCallback(async (warehouseId) => {
    try {
      const response = await slotsAPI.getSlotsByWarehouse(warehouseId);
      setWarehouseSlots(response.data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      setWarehouseSlots([]);
    }
  }, []);

  useEffect(() => {
    loadWarehousesIndependently();
  }, [loadWarehousesIndependently]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      loadSlotsForWarehouse(selectedWarehouse.id);
    }
  }, [selectedWarehouse, loadSlotsForWarehouse]);

  /* ----------  keeper logic  ---------- */
  const accessibleWarehouses =
    user.role === 'keeper'
      ? localWarehouses.filter((w) => w.id === user.assignedWarehouseId)
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
    const occupiedSlots = warehouseSlots.filter(
      (s) => s.status === 'OCCUPIED' || s.status === 'RESERVED'
    ).length;
    return Math.round((occupiedSlots / warehouse.totalSlots) * 100);
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
    const isServiceUnavailable =
      warehousesError.includes('Service temporarily unavailable') ||
      warehousesError.includes('503');

    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div
          className={`bg-white rounded-xl shadow-sm border p-8 text-center max-w-md ${
            isServiceUnavailable ? 'border-orange-100' : 'border-red-100'
          }`}
        >
          <div className="text-4xl mb-4">{isServiceUnavailable ? '🔄' : '❌'}</div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              isServiceUnavailable ? 'text-orange-800' : 'text-red-800'
            }`}
          >
            {isServiceUnavailable ? 'Service Temporarily Unavailable' : 'Error Loading Warehouses'}
          </h3>
          <p
            className={`text-sm mb-4 whitespace-pre-line ${
              isServiceUnavailable ? 'text-orange-600' : 'text-red-600'
            }`}
          >
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
          <p className="text-gray-500 text-sm mb-4">
            Please contact your administrator to be assigned a warehouse.
          </p>
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
            {accessibleWarehouses.map((warehouse) => (
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
  const availableSlots = warehouseSlots.filter((s) => s.status === 'AVAILABLE').length;
  const occupiedSlots = warehouseSlots.filter((s) => s.status === 'OCCUPIED').length;
  const bookedSlots = warehouseSlots.filter((s) => s.status === 'RESERVED').length;

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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  slotMode === 'booked'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Slot Management
              </button>
              <button
                onClick={() => setSlotMode('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  slotMode === 'all'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Available Capacity
              </button>
            </div>
          </div>

          {/* stats bar */}
          <div className="grid grid-cols-4 gap-2">
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
          </div>
        </div>

        {/* ----------  booked vs all toggle content  ---------- */}
        {slotMode === 'booked' ? (
          <SlotBookingPanel warehouseId={selectedWarehouse.id} userId={user.id} />
        ) : (
          <>
            {/* Warehouse Capacity Overview for All Slots View */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🏪 Available Capacity Management</h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      selectedWarehouse.totalCapacity ||
                      selectedWarehouse.totalCapacityKg ||
                      selectedWarehouse.capacity ||
                      (selectedWarehouse.totalSlots ? selectedWarehouse.totalSlots * 100 : 10000)
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Capacity (kg)</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      const totalCapacity =
                        selectedWarehouse.totalCapacity ||
                        selectedWarehouse.totalCapacityKg ||
                        selectedWarehouse.capacity ||
                        (selectedWarehouse.totalSlots ? selectedWarehouse.totalSlots * 100 : 10000);
                      const allocated = warehouseSlots.reduce(
                        (sum, slot) => sum + (slot.totalStoredKg || 0) + (slot.reservedLoadKg || 0),
                        0
                      );
                      return Math.max(0, totalCapacity - allocated).toLocaleString();
                    })()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Available (kg)</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {warehouseSlots
                      .reduce((sum, slot) => sum + (slot.totalStoredKg || 0) + (slot.reservedLoadKg || 0), 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Allocated (kg)</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">
                    Rs.{' '}
                    {(
                      selectedWarehouse.pricePerKg ||
                      selectedWarehouse.price ||
                      selectedWarehouse.pricePerUnit ||
                      25
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Price per kg</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-700">{warehouseSlots.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Slots</div>
                </div>
              </div>

              {/* Capacity utilization bar */}
              {(() => {
                const totalCapacity =
                  selectedWarehouse.totalCapacity ||
                  selectedWarehouse.totalCapacityKg ||
                  selectedWarehouse.capacity ||
                  (selectedWarehouse.totalSlots ? selectedWarehouse.totalSlots * 100 : 10000);
                const allocated = warehouseSlots.reduce(
                  (sum, slot) => sum + (slot.totalStoredKg || 0) + (slot.reservedLoadKg || 0),
                  0
                );
                const utilizationPercent = totalCapacity > 0 ? Math.round((allocated / totalCapacity) * 100) : 0;

                return (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span className="font-medium">Capacity Utilization</span>
                      <span className="font-semibold">{utilizationPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0 kg</span>
                      <span>{totalCapacity.toLocaleString()} kg</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}