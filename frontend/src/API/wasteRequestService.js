import api from './client';

/**
 * Waste Request Service
 * Handles all API calls related to waste requests
 */

// Get all requests created by the current user
export const getMyRequests = async () => {
  try {
    const response = await api.get('/api/waste/requests/my-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching my requests:', error);
    throw error;
  }
};

// Get all requests (admin/agent view)
export const getAllRequests = async (status = null) => {
  try {
    const url = status 
      ? `/api/waste/requests?status=${status}`
      : '/api/waste/requests';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

// Get a single request by ID
export const getRequestById = async (id) => {
  try {
    const response = await api.get(`/api/waste/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching request ${id}:`, error);
    throw error;
  }
};

// Create a new waste request
export const createRequest = async (requestData) => {
  try {
    const response = await api.post('/api/waste/requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// Cancel a request (only pending requests)
export const cancelRequest = async (id) => {
  try {
    const response = await api.delete(`/api/waste/requests/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling request ${id}:`, error);
    throw error;
  }
};

// Update request status (for agents)
export const updateRequestStatus = async (id, status) => {
  try {
    const response = await api.put(`/api/waste/requests/${id}/status?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating request status:`, error);
    throw error;
  }
};

// Accept a request (agent side)
export const acceptRequest = async (id, relatedListingId = null) => {
  try {
    const url = relatedListingId 
      ? `/api/waste/requests/${id}/accept?relatedListingId=${relatedListingId}`
      : `/api/waste/requests/${id}/accept`;
    const response = await api.put(url);
    return response.data;
  } catch (error) {
    console.error(`Error accepting request ${id}:`, error);
    throw error;
  }
};

export default {
  getMyRequests,
  getAllRequests,
  getRequestById,
  createRequest,
  cancelRequest,
  updateRequestStatus,
  acceptRequest,
};
