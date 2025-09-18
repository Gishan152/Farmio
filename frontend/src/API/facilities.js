import api from './client';

export const getFacilities = async () => {
  const { data } = await api.get('/api/facilities');
  return data;
};

export const getFacility = async (id) => {
  const { data } = await api.get(`/api/facilities/${id}`);
  return data;
};

export const createFacility = async (payload) => {
  const { data } = await api.post('/api/facilities', payload);
  return data;
};

export const updateFacility = async (id, payload) => {
  const { data } = await api.put(`/api/facilities/${id}`, payload);
  return data;
};

export const deleteFacility = async (id) => {
  await api.delete(`/api/facilities/${id}`);
};

export const searchFacilities = async (term) => {
  const { data } = await api.get(`/api/facilities/search`, { params: { searchTerm: term } });
  return data;
};

export const getAvailableFacilities = async () => {
  const { data } = await api.get('/api/facilities/available');
  return data;
};
