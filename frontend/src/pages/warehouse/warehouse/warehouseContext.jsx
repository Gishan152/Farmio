// No filepath: place in a suitable context/provider file
import React, { createContext, useState } from "react";

const WarehouseContext = createContext();

export const WarehouseProvider = ({ children }) => {
  const [warehouses, setWarehouses] = useState([]); // [{id, name, ...}]
  const [bookings, setBookings] = useState([]);     // [{id, warehouseId, ...}]
  const [payments, setPayments] = useState([]);     // [{id, bookingId, ...}]

  // Add warehouse from Facilities page
  const addWarehouse = (warehouse) => setWarehouses(prev => [...prev, warehouse]);

  // Add booking/payment as needed...

  return (
    <WarehouseContext.Provider value={{
      warehouses, setWarehouses, addWarehouse,
      bookings, setBookings,
      payments, setPayments
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};