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
  },

  // New API for booking requests workflow
  createBookingRequest(warehouseId, payload) {
    return api.post(`/api/slots/warehouse/${warehouseId}/request-booking`, payload, { headers });
  },

  getBookingRequests(warehouseId, status) {
    const params = status && status !== 'all' ? { status } : {};
    return api.get(`/api/slots/warehouse/${warehouseId}/booking-requests`, { params, headers });
  },

  approveBookingRequest(warehouseId, requestId, slotPayload) {
    return api.post(`/api/slots/warehouse/${warehouseId}/booking-requests/${requestId}/approve`, slotPayload, { headers });
  },

  rejectBookingRequest(warehouseId, requestId, reason) {
    return api.post(`/api/slots/warehouse/${warehouseId}/booking-requests/${requestId}/reject`, { reason }, { headers });
  },

  createSlot(warehouseId, payload) {
    return api.post(`/api/slots/warehouse/${warehouseId}/create-slot`, payload, { headers });
  }
};

export default slotsAPI;