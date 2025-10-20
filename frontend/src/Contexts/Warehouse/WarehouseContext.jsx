import { createContext, useContext, useEffect, useState } from 'react';
import warehouseAPI from '../../API/warehouse';
import slotsAPI from '../../API/slots';

const WarehouseContext = createContext();

export const useWarehouseContext = () => {
    const context = useContext(WarehouseContext);
    if (!context) {
        throw new Error('useWarehouseContext must be used within WarehouseContextProvider');
    }
    return context;
};

const WarehouseContextProvider = ({ children }) => {
    const [warehouses, setWarehouses] = useState([]);
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load warehouses
    const loadWarehouses = async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await warehouseAPI.getWarehouses(search);
            setWarehouses(response.data || []);
        } catch (error) {
            console.error('Failed to load warehouses:', error);
            setError('Failed to load warehouses');
            setWarehouses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWarehouses();
    }, []);

    const addWarehouse = async (warehouse) => {
        setLoading(true);
        setError(null);
        try {
            const response = await warehouseAPI.createWarehouse(warehouse);
            const created = response.data;
            setWarehouses(prev => [...prev, created]);
            return created;
        } catch (error) {
            console.error('Failed to create warehouse:', error);
            setError('Failed to create warehouse');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateWarehouse = async (id, updates) => {
        setLoading(true);
        setError(null);
        try {
            const response = await warehouseAPI.updateWarehouse(id, updates);
            const updated = response.data;
            setWarehouses(prev => prev.map(w => w.id === id ? updated : w));
            return updated;
        } catch (error) {
            console.error('Failed to update warehouse:', error);
            setError('Failed to update warehouse');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteWarehouse = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await warehouseAPI.deleteWarehouse(id);
            setWarehouses(prev => prev.filter(w => w.id !== id));
        } catch (error) {
            console.error('Failed to delete warehouse:', error);
            setError('Failed to delete warehouse');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Load slots for a warehouse
    const loadSlotsByWarehouse = async (warehouseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await slotsAPI.getSlotsByWarehouse(warehouseId);
            setSlots(response.data || []);
            return response.data || [];
        } catch (error) {
            console.error('Failed to load slots:', error);
            setError('Failed to load slots');
            setSlots([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Create slot
    const createSlot = async (slotData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await slotsAPI.createSlot(slotData);
            const created = response.data;
            setSlots(prev => [...prev, created]);
            return created;
        } catch (error) {
            console.error('Failed to create slot:', error);
            setError('Failed to create slot');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update slot
    const updateSlot = async (slotId, slotData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await slotsAPI.updateSlot(slotId, slotData);
            const updated = response.data;
            setSlots(prev => prev.map(s => s.id === slotId ? updated : s));
            return updated;
        } catch (error) {
            console.error('Failed to update slot:', error);
            setError('Failed to update slot');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Delete slot
    const deleteSlot = async (slotId) => {
        setLoading(true);
        setError(null);
        try {
            await slotsAPI.deleteSlot(slotId);
            setSlots(prev => prev.filter(s => s.id !== slotId));
        } catch (error) {
            console.error('Failed to delete slot:', error);
            setError('Failed to delete slot');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Reserve slot capacity
    const reserveSlotCapacity = async (slotId, reservationData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await slotsAPI.reserveSlotCapacity(slotId, reservationData);
            const updated = response.data;
            setSlots(prev => prev.map(s => s.id === slotId ? updated : s));
            return updated;
        } catch (error) {
            console.error('Failed to reserve slot capacity:', error);
            setError('Failed to reserve slot capacity');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get enhanced warehouse data with utilization
    const getWarehouseWithUtilization = async (warehouseId) => {
        try {
            const [warehouseResponse, utilizationResponse] = await Promise.all([
                warehouseAPI.getWarehouse(warehouseId),
                slotsAPI.getWarehouseUtilization(warehouseId)
            ]);
            
            const warehouse = warehouseResponse.data;
            const utilization = utilizationResponse.data;
            
            return {
                ...warehouse,
                utilization: utilization,
                occupiedCapacity: utilization.currentLoad + utilization.reservedLoad,
                availableCapacity: utilization.availableCapacity,
                utilizationPercentage: utilization.utilizationPercentage
            };
        } catch (error) {
            console.error('Failed to get warehouse utilization:', error);
            // Return warehouse data without utilization if slot service fails
            try {
                const warehouseResponse = await warehouseAPI.getWarehouse(warehouseId);
                return warehouseResponse.data;
            } catch (warehouseError) {
                console.error('Failed to get warehouse:', warehouseError);
                throw warehouseError;
            }
        }
    };

    // Load warehouses with utilization data
    const loadWarehousesWithUtilization = async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await warehouseAPI.getWarehouses(search);
            const warehousesData = response.data || [];
            
            // Enhance each warehouse with utilization data
            const enhancedWarehouses = await Promise.all(
                warehousesData.map(async (warehouse) => {
                    try {
                        return await getWarehouseWithUtilization(warehouse.id);
                    } catch (error) {
                        console.error(`Failed to get utilization for warehouse ${warehouse.id}:`, error);
                        return warehouse; // Return warehouse without utilization if it fails
                    }
                })
            );
            
            setWarehouses(enhancedWarehouses);
        } catch (error) {
            console.error('Failed to load warehouses:', error);
            setError('Failed to load warehouses');
            setWarehouses([]);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        warehouses,
        slots,
        bookings,
        payments,
        loading,
        error,
        loadWarehouses,
        loadWarehousesWithUtilization,
        getWarehouseWithUtilization,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        loadSlotsByWarehouse,
        createSlot,
        updateSlot,
        deleteSlot,
        reserveSlotCapacity,
        setSlots,
        setBookings,
        setPayments
    };

    return (
        <WarehouseContext.Provider value={value}>
            {children}
        </WarehouseContext.Provider>
    );
};

export default WarehouseContextProvider;