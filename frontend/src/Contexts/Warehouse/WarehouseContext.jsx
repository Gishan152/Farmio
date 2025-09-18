import { createContext, useContext, useEffect, useState } from 'react';
import warehouseAPI from '../../API/warehouse';

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

    const value = {
        warehouses,
        slots,
        bookings,
        payments,
        loading,
        error,
        loadWarehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
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