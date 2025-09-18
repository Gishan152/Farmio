import api from './client';

const warehouseAPI = {
    // Get all warehouses for the authenticated user with optional search
    getWarehouses: (search = '') => {
        const params = search ? { search } : {};
        return api.get('/api/warehouses', { 
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get a specific warehouse by ID
    getWarehouse: (id) => {
        return api.get(`/api/warehouses/${id}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Create a new warehouse
    createWarehouse: (warehouseData) => {
        return api.post('/api/warehouses', warehouseData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Update an existing warehouse
    updateWarehouse: (id, warehouseData) => {
        return api.put(`/api/warehouses/${id}`, warehouseData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Delete a warehouse
    deleteWarehouse: (id) => {
        return api.delete(`/api/warehouses/${id}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Health check
    healthCheck: () => {
        return api.get('/api/warehouses/health');
    }
};

export default warehouseAPI;