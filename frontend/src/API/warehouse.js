import api from './client';

const header = { 'X-User-Id': '1' };

const warehouseAPI = {
  getWarehouses()    { return api.get('/api/warehouses', { headers: header }); },
  createWarehouse(p) { return api.post('/api/warehouses', p, { headers: header }); },
  updateWarehouse(id, p) { return api.put(`/api/warehouses/${id}`, p, { headers: header }); },
  deleteWarehouse(id) { return api.delete(`/api/warehouses/${id}`, { headers: header }); },
  searchWarehouses(term) { return api.get('/api/warehouses/search', { params: { searchTerm: term }, headers: header }); }
};

export default warehouseAPI;   