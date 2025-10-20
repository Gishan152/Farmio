import api from './client';

export const login = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
