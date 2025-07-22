import { createContext, useContext, useState } from 'react';

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

    const addWarehouse = (warehouse) => {
        setWarehouses(prev => [...prev, { ...warehouse, id: Date.now() }]);
    };

    const updateWarehouse = (id, updates) => {
        setWarehouses(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    };

    const deleteWarehouse = (id) => {
        setWarehouses(prev => prev.filter(w => w.id !== id));
    };

    const value = {
        warehouses,
        slots,
        bookings,
        payments,
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