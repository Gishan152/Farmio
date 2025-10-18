import api from './client';

const headers = { 'X-User-Id': '1' }; // todo: real user

export default {
  getBookings(warehouseId, status, search) {
    const params = {};
    if (warehouseId) params.warehouseId = warehouseId;
    if (status && status !== 'all') params.status = status;
    if (search) params.search = search;
    return api.get('/api/bookings', { params, headers });
  },

  getWarehouseBookings(warehouseId, status) {
    const params = status && status !== 'all' ? { status } : {};
    return api.get(`/api/bookings/warehouse/${warehouseId}`, { params, headers });
  },

  getBooking(id) {
    return api.get(`/api/bookings/${id}`, { headers });
  },

  getBookingStats(warehouseId) {
    const params = warehouseId ? { warehouseId } : {};
    return api.get('/api/bookings/stats', { params, headers });
  },

  approveBooking(id) {
    return api.put(`/api/bookings/${id}/approve`, {}, { headers });
  },

  rejectBooking(id, reason) {
    return api.put(`/api/bookings/${id}/reject`, { reason }, { headers });
  },

  handleEarlyRetrieval(id, approve) {
    return api.put(`/api/bookings/${id}/early-retrieval?approve=${approve}`, {}, { headers });
  }
};