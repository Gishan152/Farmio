import api from './client';

// Waste Service API wrapper
const wasteService = {
  // Get all waste listings
  getAllWasteListings: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings`);
      return response.data;
    } catch (error) {
      console.error("Error fetching waste listings:", error);
      throw error;
    }
  },

  // Get all waste agents
  getAllWasteAgents: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/agents`);
      return response.data;
    } catch (error) {
      console.error("Error fetching waste agents:", error);
      throw error;
    }
  },

  // Get waste listings count by status
  getWasteListingCountByStatus: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings/status-count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching waste listing status counts:", error);
      throw error;
    }
  },

  // Get waste listings by status
  getWasteListingsByStatus: async (status) => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings/by-status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching waste listings with status ${status}:`, error);
      throw error;
    }
  },

  // Get waste listings count by type
  getWasteListingCountByType: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings/type-count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching waste listing type counts:", error);
      throw error;
    }
  },

  // Get waste listings by type
  getWasteListingsByType: async (type) => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings/by-type?type=${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching waste listings with type ${type}:`, error);
      throw error;
    }
  },

  // Get total waste listing count
  getTotalWasteListingCount: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/listings/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching total waste listing count:", error);
      throw error;
    }
  },

  // Get total waste agent count
  getTotalWasteAgentCount: async () => {
    try {
      const response = await api.get(`/api/analytics/admin/waste/agents/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching total waste agent count:", error);
      throw error;
    }
  }
};

export default wasteService;