import api from './client';

const productService = {
  /**
   * Get all products from analytic-service through API Gateway
   * @returns {Promise<Array>} List of product objects
   */
  getAllProducts: async () => {
    try {
      console.log('Fetching products from API...');
      const response = await api.get('/api/analytics/admin/products');
      
      // Log image URLs to help debugging
      if (response.data && Array.isArray(response.data)) {
        console.log(`Received ${response.data.length} products`);
        const withImages = response.data.filter(p => p.imageUrls && p.imageUrls.length > 0);
        console.log(`Products with images: ${withImages.length}/${response.data.length}`);
        
        // Sample the first few products with images to check format
        if (withImages.length > 0) {
          const sample = withImages.slice(0, Math.min(3, withImages.length));
          console.log('Sample product image URLs:', sample.map(p => ({ 
            id: p.id, 
            name: p.productName,
            imageUrls: p.imageUrls
          })));
        }
      }
      
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
  },
  
  /**
   * Check if a product can be safely deleted (not used in any orders)
   * @param {number} productId - The ID of the product to check
   * @returns {Promise<Object>} Object with canDelete boolean and message
   */
  checkProductCanBeDeleted: async (productId) => {
    try {
      console.log(`Checking if product ${productId} can be deleted...`);
      const response = await api.get(`/api/analytics/admin/products/${productId}/can-delete`);
      return response.data;
    } catch (error) {
      console.error(`Error checking if product ${productId} can be deleted:`, error);
      return { 
        canDelete: false, 
        message: "Error checking product usage. For safety, assuming the product cannot be deleted." 
      };
    }
  },
  
  /**
   * Delete a product from crop-listing-service
   * @param {number} productId - The ID of the product to delete
   * @returns {Promise<Object>} Object with success boolean and message
   */
  deleteProduct: async (productId) => {
    try {
      console.log(`Deleting product ${productId}...`);
      const response = await api.delete(`/api/analytics/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      
      // Extract error message from the API response if available
      let errorMessage = "Failed to delete product. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  }
};

export default productService;
