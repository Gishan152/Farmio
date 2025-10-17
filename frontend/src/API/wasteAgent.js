import api from './client';

const wasteAgentAPI = {
    // Get all waste agents with optional filters
    getWasteAgents: (params = {}) => {
        return api.get('/api/waste-agents', { params });
    },

    // Get waste agent by ID
    getWasteAgent: (id) => {
        return api.get(`/api/waste-agents/${id}`);
    },

    // Get waste agents serving a specific city
    getWasteAgentsServingCity: (city) => {
        return api.get(`/api/waste-agents/serving-city/${city}`);
    },

    // Search waste agents
    searchWasteAgents: (searchTerm) => {
        return api.get('/api/waste-agents', {
            params: { search: searchTerm }
        });
    },

    // Get waste agents by city
    getWasteAgentsByCity: (city) => {
        return api.get('/api/waste-agents', {
            params: { city }
        });
    },

    // Get waste agents by specialization
    getWasteAgentsBySpecialization: (specialization) => {
        return api.get('/api/waste-agents', {
            params: { specialization }
        });
    },

    // Get waste agents by city and specialization
    getWasteAgentsByCityAndSpecialization: (city, specialization) => {
        return api.get('/api/waste-agents', {
            params: { city, specialization }
        });
    },

    // Get active and verified waste agents
    getActiveVerifiedWasteAgents: () => {
        return api.get('/api/waste-agents', {
            params: { filter: 'active-verified' }
        });
    },

    // Get top rated waste agents
    getTopRatedWasteAgents: () => {
        return api.get('/api/waste-agents', {
            params: { filter: 'top-rated' }
        });
    },

    // Get waste agents with minimum rating
    getWasteAgentsWithMinRating: (minRating) => {
        return api.get('/api/waste-agents', {
            params: { minRating }
        });
    },

    // Get waste agents by multiple cities
    getWasteAgentsByMultipleCities: (cities) => {
        return api.get('/api/waste-agents', {
            params: { cities: cities.join(',') }
        });
    },

    // Count active waste agents by city
    countActiveWasteAgentsByCity: (city) => {
        return api.get(`/api/waste-agents/count/city/${city}`);
    },

    // Create a new waste agent
    createWasteAgent: (wasteAgentData) => {
        return api.post('/api/waste-agents', wasteAgentData);
    },

    // Update existing waste agent
    updateWasteAgent: (id, wasteAgentData) => {
        return api.put(`/api/waste-agents/${id}`, wasteAgentData);
    },

    // Delete waste agent (soft delete)
    deleteWasteAgent: (id) => {
        return api.delete(`/api/waste-agents/${id}`);
    },

    // Activate waste agent
    activateWasteAgent: (id) => {
        return api.patch(`/api/waste-agents/${id}/activate`);
    },

    // Verify waste agent
    verifyWasteAgent: (id) => {
        return api.patch(`/api/waste-agents/${id}/verify`);
    }
};

export default wasteAgentAPI;