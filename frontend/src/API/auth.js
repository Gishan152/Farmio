import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('farmio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API functions
export const authAPI = {
  // Login function that will be used by the AdminLoginForm
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        role // 'admin' or 'moderator'
      });
      
      if (response.data.token) {
        localStorage.setItem('farmio_token', response.data.token);
        localStorage.setItem('farmio_user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('farmio_token');
    localStorage.removeItem('farmio_user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('farmio_token');
    return !!token;
  },
};

export default api;
