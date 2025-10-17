import api from './client';

const productPriceService = {
  /**
   * Get all product prices - requires moderator role
   * @returns {Promise<Array>} List of product price objects
   */
  getAllProductPrices: async () => {
    try {
      const response = await api.get('/api/analytics/moderator/prices');
      return response.data;
    } catch (error) {
      console.error('Error fetching all product prices:', error);
      throw error;
    }
  },

  /**
   * Get active product prices - public endpoint
   * @returns {Promise<Array>} List of active product price objects
   */
  getActiveProductPrices: async () => {
    try {
      const response = await api.get('/api/analytics/prices');
      return response.data;
    } catch (error) {
      console.error('Error fetching active product prices:', error);
      throw error;
    }
  },

  /**
   * Get product prices by category - public endpoint
   * @param {string} category - The category to filter by
   * @returns {Promise<Array>} List of product price objects in the specified category
   */
  getProductPricesByCategory: async (category) => {
    try {
      const response = await api.get(`/api/analytics/prices/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product prices for category ${category}:`, error);
      throw error;
    }
  },

  /**
   * Get product price by ID - requires moderator role
   * @param {number} id - The ID of the product price to fetch
   * @returns {Promise<Object>} The product price object
   */
  getProductPriceById: async (id) => {
    try {
      const response = await api.get(`/api/analytics/moderator/prices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product price with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new product price - requires moderator role
   * @param {Object} priceData - The product price data
   * @returns {Promise<Object>} The created product price object
   */
  createProductPrice: async (priceData) => {
    try {
      const response = await api.post('/api/analytics/moderator/prices', priceData);
      return response.data;
    } catch (error) {
      console.error('Error creating product price:', error);
      throw error;
    }
  },

  /**
   * Update an existing product price - requires moderator role
   * @param {number} id - The ID of the product price to update
   * @param {Object} priceData - The updated product price data
   * @returns {Promise<Object>} The updated product price object
   */
  updateProductPrice: async (id, priceData) => {
    try {
      const response = await api.put(`/api/analytics/moderator/prices/${id}`, priceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product price with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product price - requires moderator role
   * @param {number} id - The ID of the product price to delete
   * @returns {Promise<void>}
   */
  deleteProductPrice: async (id) => {
    try {
      await api.delete(`/api/analytics/moderator/prices/${id}`);
    } catch (error) {
      console.error(`Error deleting product price with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deactivate a product price - requires moderator role
   * @param {number} id - The ID of the product price to deactivate
   * @returns {Promise<Object>} The updated product price object
   */
  deactivateProductPrice: async (id) => {
    try {
      const response = await api.put(`/api/analytics/moderator/prices/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating product price with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Activate a product price - requires moderator role
   * @param {number} id - The ID of the product price to activate
   * @returns {Promise<Object>} The updated product price object
   */
  activateProductPrice: async (id) => {
    try {
      const response = await api.put(`/api/analytics/moderator/prices/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error(`Error activating product price with ID ${id}:`, error);
      throw error;
    }
  }
};

export default productPriceService;
