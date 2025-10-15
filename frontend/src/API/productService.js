import api from './client';

const productService = {
  /**
   * Get all products from analytic-service through API Gateway
   * @returns {Promise<Array>} List of product objects
   */
  getAllProducts: async () => {
    try {
      const response = await api.get('/api/analytics/admin/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get product count by status from analytic-service
   * This is a template for future use when implemented on backend
   * @returns {Promise<Object>} Object with status keys and count values
   */
  getProductCountByStatus: async () => {
    try {
      const response = await api.get('/api/analytics/admin/products/status-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching product status counts:', error);
      throw error;
    }
  }
};

export default productService;
