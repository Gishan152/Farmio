import api from './client';

const headers = { 'X-User-Id': '1' };  

const warehouseAPI = {
  // Owner/Admin endpoints (authenticated)
  getWarehouses()        { return api.get('/api/warehouses',        { headers }); },
  createWarehouse(p)     { return api.post('/api/warehouses',       p, { headers }); },
  updateWarehouse(id, p) { return api.put(`/api/warehouses/${id}`,  p, { headers }); },
  deleteWarehouse(id)    { return api.delete(`/api/warehouses/${id}`,{ headers }); },
  searchWarehouses(term) { return api.get('/api/warehouses/search', { params:{searchTerm:term}, headers }); },
  
  // Public endpoints for buyers (no authentication required)
  getPublicWarehouses(params = {}) { 
    return api.get('/api/warehouses/public', { params }); 
  },
  
  getPublicWarehouse(id) { 
    return api.get(`/api/warehouses/public/${id}`); 
  },
  
  getNearbyWarehouses(params = {}) { 
    return api.get('/api/warehouses/public/nearby', { params }); 
  },
  
  searchWarehousesAdvanced(searchRequest) {
    return api.post('/api/warehouses/public/search', searchRequest);
  },
  
  getWarehouseCapacity(id) {
    return api.get(`/api/warehouses/${id}/capacity`);
  },
  
  // Helper methods for common searches
  searchByLocation(latitude, longitude, radius = 50, filters = {}) {
    // Only use location-based search if coordinates are provided
    if (latitude && longitude) {
      const params = {
        latitude,
        longitude,
        radiusKm: radius,
        ...filters
      };
      return this.getNearbyWarehouses(params);
    } else {
      // Fallback to regular search without location
      return this.getPublicWarehouses(filters);
    }
  },
  
  searchByFilters(filters = {}) {
    return this.getPublicWarehouses(filters);
  },
  
  // Search warehouses by city/region (no coordinates needed)
  searchByCity(city, filters = {}) {
    const params = {
      city,
      ...filters
    };
    return this.getPublicWarehouses(params);
  },
  
  // Search warehouses by storage type (no coordinates needed) 
  searchByStorageType(storageType, filters = {}) {
    const params = {
      storageType,
      ...filters
    };
    return this.getPublicWarehouses(params);
  },
  
  // General search by name/description (no coordinates needed)
  searchByName(searchTerm, filters = {}) {
    const params = {
      search: searchTerm,
      ...filters
    };
    return this.getPublicWarehouses(params);
  },

  // Booking requests
  createBookingRequest(warehouseId, requestPayload) {
    return api.post(`/api/slots/warehouse/${warehouseId}/request-booking`, requestPayload, { headers });
  }
};

export default warehouseAPI;