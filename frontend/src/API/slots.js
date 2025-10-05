import api from './client';

const slotsAPI = {
    // Get all slots for a warehouse
    getSlotsByWarehouse: (warehouseId) => {
        return api.get(`/api/slots/warehouse/${warehouseId}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get available slots for a warehouse
    getAvailableSlots: (warehouseId, requiredCapacity = null) => {
        const params = requiredCapacity ? { requiredCapacity } : {};
        return api.get(`/api/slots/warehouse/${warehouseId}/available`, {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get warehouse utilization statistics
    getWarehouseUtilization: (warehouseId) => {
        return api.get(`/api/slots/warehouse/${warehouseId}/utilization`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get slot by ID
    getSlot: (slotId) => {
        return api.get(`/api/slots/${slotId}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Create a new slot
    createSlot: (slotData) => {
        return api.post('/api/slots', slotData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Bulk create slots
    createSlotsInBulk: (bulkData) => {
        return api.post('/api/slots/bulk', bulkData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Update slot
    updateSlot: (slotId, slotData) => {
        return api.put(`/api/slots/${slotId}`, slotData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Delete slot
    deleteSlot: (slotId) => {
        return api.delete(`/api/slots/${slotId}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Reserve slot capacity
    reserveSlotCapacity: (slotId, reservationData) => {
        return api.post(`/api/slots/${slotId}/reserve`, reservationData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Release reservation
    releaseReservation: (slotId) => {
        return api.post(`/api/slots/${slotId}/release`, {}, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Clean up expired reservations
    cleanupExpiredReservations: () => {
        return api.post('/api/slots/cleanup-expired', {});
    },

    // Health check
    healthCheck: () => {
        return api.get('/api/slots/health');
    }
};

export default slotsAPI;