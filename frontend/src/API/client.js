import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
     if (!config.headers['X-User-Id']) {
      config.headers['X-User-Id'] = localStorage.getItem('userId') || '1';
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: clear token or user info if stored
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      // Redirect to login
      window.location.href = '/login'; // since you're outside of React components
    }
    return Promise.reject(error);
  }
);

export default api;
