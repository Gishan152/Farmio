import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // DEVELOPMENT MODE ONLY: Skip authentication for admin pages during development
    const path = window.location.pathname;
    const isDevelopment = true; // Set to true for development, false for production
    
    // Skip authentication for admin pages during development
    if (isDevelopment && path.startsWith('/admin')) {
      // Add a dummy token for development
      config.headers.set("Authorization", "Bearer dev-admin-token-12345");
      return config;
    }
    
    // Normal authentication flow for other cases
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
    // DEVELOPMENT MODE ONLY: Don't redirect during development for admin routes
    const path = window.location.pathname;
    const isDevelopment = true; // Set to true for development, false for production
    
    if (isDevelopment && path.startsWith('/admin')) {
      // Don't redirect admin pages during development
      console.warn('Authentication error intercepted in development mode');
      return Promise.reject(error);
    }
    
    // Normal redirect flow for authentication errors
    if (error.response && error.response.status === 401) {
      // Optional: clear token or user info if stored
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      // Redirect to login
      window.location.href = '/login'; // since you're outside of React components
      
      // Get current role from localStorage or default to admin
      const currentRole = localStorage.getItem('role') || 'admin';
      
      // Redirect based on role
      if (currentRole === 'moderator') {
        window.location.href = '/moderator/login';
      } else {
        // Default to admin login
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
