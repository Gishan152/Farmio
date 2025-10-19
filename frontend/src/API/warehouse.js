import api from './client';

const headers = { 'X-User-Id': '1' };  

const warehouseAPI = {
  getWarehouses()        { return api.get('/api/warehouses',        { headers }); },
  createWarehouse(p)     { return api.post('/api/warehouses',       p, { headers }); },
  updateWarehouse(id, p) { return api.put(`/api/warehouses/${id}`,  p, { headers }); },
  deleteWarehouse(id)    { return api.delete(`/api/warehouses/${id}`,{ headers }); },
  searchWarehouses(term) { return api.get('/api/warehouses/search', { params:{searchTerm:term}, headers }); }
};

export default warehouseAPI;