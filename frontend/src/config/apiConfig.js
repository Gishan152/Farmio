/**
 * API Configuration file for the Farmio application
 * This file centralizes all API endpoint definitions and settings
 */

// Base API URL, uses environment variable or falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

// Service endpoints
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  refreshToken: `${API_BASE_URL}/api/auth/refresh`,

  //order
  orders: `${API_BASE_URL}/api/orders`,

  // Users
  users: `${API_BASE_URL}/api/users`,
  userProfile: `${API_BASE_URL}/api/users/profile`,
  
  // Waste management
  wasteListings: `${API_BASE_URL}/api/analytics/admin/waste/listings`,
  wasteAgents: `${API_BASE_URL}/api/analytics/admin/waste/agents`,
  wasteStatusCounts: `${API_BASE_URL}/api/analytics/admin/waste/status-counts`,
  
  // Status check
  healthCheck: `${API_BASE_URL}/actuator/health`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS
};