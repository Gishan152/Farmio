import api from './client';

const headers = { 'X-User-Id': '1' };

const slotsAPI = {
  getSlotsByWarehouse(warehouseId) {
    return api.get(`/api/slots/warehouse/${warehouseId}`, { headers });
  },

  getAllWarehousesWithSlots() {
    return api.get('/api/slots/by-warehouse', { headers });
  }
};

export default slotsAPI;