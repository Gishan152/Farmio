import api from './client';

const headers = { 'X-User-Id': '1' };

const slotsAPI = {
  getSlotsByWarehouse(warehouseId) {
    return api.get(`/api/slots/warehouse/${warehouseId}`, { headers });
  },

  getAllSlotsForWarehouse(warehouseId) {
    return api.get(`/api/slots/warehouse/${warehouseId}/all`, { headers });
  },

  getAllWarehousesWithSlots() {
    return api.get('/api/slots/by-warehouse', { headers });
  },

  getBookedAndAvailable(warehouseId) {
    return api.get(`/api/slots/warehouse/${warehouseId}/booked-available`, { headers });
  },

  createBooking(warehouseId, payload) {
    return api.post(`/api/slots/warehouse/${warehouseId}/book`, payload, { headers });
  }
};

export default slotsAPI;