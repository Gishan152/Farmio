/**
 * API.js - Central API utility for authentication and common operations
 * 
 * This module provides utility functions for making API requests with proper
 * authentication, error handling, timeouts, and automatic retries. It handles
 * common error scenarios such as authentication failures, network issues, and
 * CORS problems.
 * 
 * Usage examples:
 * 
 * // Simple GET request
 * try {
 *   const data = await API.get('/api/products');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Error fetching products:', error);
 * }
 * 
 * // POST request with data
 * try {
 *   const result = await API.post('/api/orders', { 
 *     productId: 123,
 *     quantity: 2
 *   });
 *   console.log('Order created:', result);
 * } catch (error) {
 *   console.error('Error creating order:', error);
 * }
 */

import { API_BASE_URL } from '../config/apiConfig';
import { getAuthToken, isAuthenticated } from './localStorage';
import { fetchWithTimeoutAndRetry } from './timeoutUtils';

// Base API configuration
/**
 * Make an API request with proper error handling and authentication
 * 
 * @param {string} url - The URL to fetch
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {Object|null} body - Request body for POST/PUT/PATCH requests
 * @returns {Promise<Object|string>} - Response data (parsed JSON or text)
 * @throws {Error} - With details about request failures
 */
export const apiRequest = async (url, method = 'GET', body = null) => {
  const headers = {};
  
  // Add auth header if token exists
  if (isAuthenticated()) {
    const token = getAuthToken();
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Only add Content-Type for requests with a body
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    // Don't include credentials option to avoid CORS preflight
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`API Request: ${method} ${url}`);
    
    try {
      // Use the fetchWithTimeoutAndRetry utility instead of plain fetch
      const response = await fetchWithTimeoutAndRetry(
        url, 
        config, 
        10000, // 10 second timeout
        2      // 2 retries
      );
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      
      if (!response.ok) {
        // Handle error responses
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.message || `API error: ${response.status}`);
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }
      
      // Parse response
      if (isJson) {
        return await response.json();
      }
      
      return await response.text();
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out - API service may be unavailable');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`API Request failed: ${error.message}`);
    throw error;
  }
};

/**
 * Check if the current error is related to CORS
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a CORS error
 */
export const isCorsError = (error) => {
  if (!error || !error.message) return false;
  
  const errorMsg = error.message.toLowerCase();
  return errorMsg.includes('cors') || 
         errorMsg.includes('blocked by mode') ||
         errorMsg.includes('cross-origin') ||
         errorMsg.includes('access-control-allow-origin');
};

/**
 * Check if the current error is related to authentication
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's an authentication error
 */
export const isAuthError = (error) => {
  if (!error || !error.message) return false;
  
  const errorMsg = error.message.toLowerCase();
  return errorMsg.includes('401') ||
         errorMsg.includes('403') || 
         errorMsg.includes('unauthorized') ||
         errorMsg.includes('forbidden') ||
         errorMsg.includes('authentication');
};

/**
 * Check if the current error is related to network connectivity
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a network error
 */
export const isNetworkError = (error) => {
  if (!error || !error.message) return false;
  
  const errorMsg = error.message.toLowerCase();
  return errorMsg.includes('failed to fetch') ||
         errorMsg.includes('network') ||
         errorMsg.includes('offline') ||
         errorMsg.includes('timeout') ||
         errorMsg.includes('connection');
};

// Export API utility functions
export default {
  // Basic HTTP methods
  get: (url) => apiRequest(url),
  post: (url, data) => apiRequest(url, 'POST', data),
  put: (url, data) => apiRequest(url, 'PUT', data),
  delete: (url) => apiRequest(url, 'DELETE'),
  patch: (url, data) => apiRequest(url, 'PATCH', data),
  
  // Error detection helpers
  isCorsError,
  isAuthError,
  isNetworkError
};