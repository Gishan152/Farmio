import axios from "axios";

const base = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: base,
  timeout: 10000,
});

const transportService = {
  // ---- ROUTES ----
  getAllRoutesByProvider: async (providerId) => {
    try {
      const response = await api.get(`/api/transport/getAllRoutes/${providerId}`);
      return response.data; // backend returns array
    } catch (error) {
      console.error('Error fetching routes:', error?.response || error.message);
      throw error;
    }
  },

  getRouteById: async (id) => {
    try {
      const response = await api.get(`/api/transport/route/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching route with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  },

  createRoute: async (routeData) => {
    try {
      const response = await api.post('/api/transport/createRoute', routeData);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error?.response || error.message);
      throw error;
    }
  },

  updateRoute: async (id, routeData) => {
    try {
      const response = await api.put(`/api/transport/editRoute/${id}`, routeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating route with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  },

  deleteRoute: async (id) => {
    try {
      await api.delete(`/api/transport/deleteRoute/${id}`);
    } catch (error) {
      console.error(`Error deleting route with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  },

  // ---- AVAILABILITY ----
  getAllAvailabilitiesByProvider: async (providerId) => {
    try {
      const response = await api.get(`/api/transport/getAllAvailabilities/${providerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availabilities:', error?.response || error.message);
      throw error;
    }
  },

  getAvailabilityById: async (id) => {
    try {
      const response = await api.get(`/api/transport/availability/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching availability with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  },

  createAvailability: async (availabilityData) => {
    try {
      const response = await api.post('/api/transport/createAvailability', availabilityData);
      return response.data;
    } catch (error) {
      console.error('Error creating availability:', error?.response || error.message);
      throw error;
    }
  },

  updateAvailability: async (id, availabilityData) => {
    try {
      const response = await api.put(`/api/transport/editAvailability/${id}`, availabilityData);
      return response.data;
    } catch (error) {
      console.error(`Error updating availability with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  },

  deleteAvailability: async (id) => {
    try {
      await api.delete(`/api/transport/deleteAvailability/${id}`);
    } catch (error) {
      console.error(`Error deleting availability with ID ${id}:`, error?.response || error.message);
      throw error;
    }
  }
};

export default transportService;
