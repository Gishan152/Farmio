// paymentService.js - Frontend service to interact with payment API endpoints
import api from './client';

const paymentService = {
  /**
   * Get all payments from analytic-service through API Gateway
   * @returns {Promise<Array>} List of payment objects
   */
  getAllPayments: async () => {
    try {
      console.log('Fetching payments from API...');
      const response = await api.get('/api/analytics/admin/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Get total payment amount
   * @returns {Promise<number>} Total payment amount
   */
  getTotalPaymentAmount: async () => {
    try {
      const response = await api.get('/api/analytics/admin/payments/total');
      return response.data;
    } catch (error) {
      console.error('Error fetching total payment amount:', error);
      throw error;
    }
  },

  /**
   * Get payment counts by status
   * @returns {Promise<Object>} Object with status keys and count values
   */
  getPaymentCountByStatus: async () => {
    try {
      const response = await api.get('/api/analytics/admin/payments/status-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status counts:', error);
      throw error;
    }
  },

  /**
   * Get payment amounts by status
   * @returns {Promise<Object>} Object with status keys and amount values
   */
  getPaymentAmountByStatus: async () => {
    try {
      const response = await api.get('/api/analytics/admin/payments/status-amount');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status amounts:', error);
      throw error;
    }
  },

  /**
   * Get payments by time period (daily, weekly, monthly)
   * @param {string} period - The time period (daily, weekly, monthly, yearly)
   * @returns {Promise<Object>} Object with payment data for the period
   */
  getPaymentsByTimePeriod: async (period) => {
    try {
      const response = await api.get(`/api/analytics/admin/payments/by-period?period=${period}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for period ${period}:`, error);
      throw error;
    }
  },

  /**
   * Get payment amounts by payment method
   * @returns {Promise<Object>} Object with payment method keys and amount values
   */
  getPaymentAmountByMethod: async () => {
    try {
      const response = await api.get('/api/analytics/admin/payments/by-method');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment method amounts:', error);
      throw error;
    }
  },

  /**
   * Get payment trend by date
   * @param {number} days - Number of days to include in trend
   * @returns {Promise<Object>} Object with date keys and amount values
   */
  getPaymentTrend: async (days = 30) => {
    try {
      const response = await api.get(`/api/analytics/admin/payments/trend?days=${days}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment trend for ${days} days:`, error);
      throw error;
    }
  }
};

export default paymentService;