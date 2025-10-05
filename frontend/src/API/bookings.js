import api from './client';

const bookingsAPI = {
    // Get all bookings for warehouses owned by the authenticated user
    getBookings: (warehouseId = null, status = null, search = '') => {
        const params = {};
        if (warehouseId) params.warehouseId = warehouseId;
        if (status && status !== 'all') params.status = status;
        if (search) params.search = search;
        
        return api.get('/api/bookings', { 
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get bookings for a specific warehouse
    getWarehouseBookings: (warehouseId, status = null) => {
        const params = status && status !== 'all' ? { status } : {};
        return api.get(`/api/bookings/warehouse/${warehouseId}`, {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get a specific booking by ID
    getBooking: (id) => {
        return api.get(`/api/bookings/${id}`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get booking statistics for dashboard
    getBookingStats: (warehouseId = null) => {
        const params = warehouseId ? { warehouseId } : {};
        return api.get('/api/bookings/stats', {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Approve a booking
    approveBooking: (bookingId, approvalData = {}) => {
        return api.put(`/api/bookings/${bookingId}/approve`, approvalData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Reject a booking
    rejectBooking: (bookingId, rejectionData) => {
        return api.put(`/api/bookings/${bookingId}/reject`, rejectionData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Update booking status
    updateBookingStatus: (bookingId, status, additionalData = {}) => {
        return api.put(`/api/bookings/${bookingId}/status`, {
            status,
            ...additionalData
        }, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Handle early retrieval request
    handleEarlyRetrieval: (bookingId, action, data = {}) => {
        return api.put(`/api/bookings/${bookingId}/early-retrieval`, {
            action, // 'approve' or 'reject'
            ...data
        }, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get booking activity logs
    getBookingActivity: (bookingId) => {
        return api.get(`/api/bookings/${bookingId}/activity`, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get bookings by date range
    getBookingsByDateRange: (startDate, endDate, warehouseId = null) => {
        const params = { startDate, endDate };
        if (warehouseId) params.warehouseId = warehouseId;
        
        return api.get('/api/bookings/date-range', {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get revenue analytics
    getRevenueAnalytics: (warehouseId = null, period = 'month') => {
        const params = { period };
        if (warehouseId) params.warehouseId = warehouseId;
        
        return api.get('/api/bookings/revenue-analytics', {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Send notification to farmer
    sendNotification: (bookingId, notificationData) => {
        return api.post(`/api/bookings/${bookingId}/notify`, notificationData, {
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Get booking utilization report
    getUtilizationReport: (warehouseId = null, period = 'month') => {
        const params = { period };
        if (warehouseId) params.warehouseId = warehouseId;
        
        return api.get('/api/bookings/utilization-report', {
            params,
            headers: {
                'X-User-Id': '1' // TODO: Replace with actual user ID from auth context
            }
        });
    },

    // Health check
    healthCheck: () => {
        return api.get('/api/bookings/health');
    }
};

export default bookingsAPI;