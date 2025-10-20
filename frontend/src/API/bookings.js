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
  
  // Early Retrieval Request APIs
  getEarlyRetrievalRequests(warehouseId) {
    return api.get(`/api/bookings/warehouse/${warehouseId}/early-retrieval-requests`, { headers });
  },
  
  createEarlyRetrievalRequest(bookingId, payload) {
    return api.post(`/api/bookings/${bookingId}/early-retrieval`, payload, { headers });
  },
  
  approveEarlyRetrievalRequest(requestId, payload) {
    return api.put(`/api/bookings/early-retrieval/${requestId}/approve`, payload, { headers });
  },
  
  rejectEarlyRetrievalRequest(requestId, reason) {
    return api.put(`/api/bookings/early-retrieval/${requestId}/reject`, { reason }, { headers });
  },
  
  // Extension Request APIs
  getExtensionRequests(warehouseId) {
    return api.get(`/api/bookings/warehouse/${warehouseId}/extension-requests`, { headers });
  },
  
  createExtensionRequest(bookingId, payload) {
    return api.post(`/api/bookings/${bookingId}/extension`, payload, { headers });
  },
  
  approveExtensionRequest(requestId, payload) {
    return api.put(`/api/bookings/extension/${requestId}/approve`, payload, { headers });
  },
  
  rejectExtensionRequest(requestId, reason) {
    return api.put(`/api/bookings/extension/${requestId}/reject`, { reason }, { headers });
  },
  
  // Regular Booking APIs
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