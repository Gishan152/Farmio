/**
 * serviceStatus.js - Utility for checking service availability and diagnostics
 * 
 * This module provides functions for checking if various services are available,
 * including the main API Gateway. It implements caching to avoid making too many
 * redundant calls and provides diagnostic information for troubleshooting.
 */

import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';
import { fetchWithTimeoutAndRetry } from './timeoutUtils';

// Cache the status check results for a short period to avoid redundant calls
let serviceStatusCache = {
  isAvailable: null,
  lastCheck: null,
  cacheTimeout: 30000 // 30 seconds
};

/**
 * Check if the API Gateway is available
 * @returns {Promise<boolean>} True if API Gateway responds, false otherwise
 */
export const checkApiAvailability = async () => {
  // Return cached result if still valid
  if (
    serviceStatusCache.isAvailable !== null &&
    serviceStatusCache.lastCheck &&
    Date.now() - serviceStatusCache.lastCheck < serviceStatusCache.cacheTimeout
  ) {
    return serviceStatusCache.isAvailable;
  }
  
  try {
    console.log('Checking API Gateway availability...');
    
    // Use the health check endpoint if available
    const healthEndpoint = API_ENDPOINTS.healthCheck || `${API_BASE_URL}/actuator/health`;
    
    try {
      // Use fetchWithTimeoutAndRetry with short timeout
      const response = await fetchWithTimeoutAndRetry(
        healthEndpoint, 
        { 
          method: 'HEAD',
          // Don't include credentials or content-type to avoid CORS issues
        },
        3000,  // 3 second timeout
        1      // 1 retry
      );
      
      const isAvailable = response.ok;
      console.log(`API Gateway is ${isAvailable ? 'available' : 'unavailable'}`);
      
      // Update cache
      serviceStatusCache.isAvailable = isAvailable;
      serviceStatusCache.lastCheck = Date.now();
      
      return isAvailable;
    } catch (fetchError) {      
      if (fetchError.name === 'AbortError' || fetchError.message.includes('timed out')) {
        console.log('API Gateway availability check timed out');
      } else {
        console.error('Error checking API Gateway:', fetchError.message);
      }
      
      // Update cache
      serviceStatusCache.isAvailable = false;
      serviceStatusCache.lastCheck = Date.now();
      
      return false;
    }
  } catch (error) {
    console.error('Error checking API Gateway availability:', error);
    
    // Update cache
    serviceStatusCache.isAvailable = false;
    serviceStatusCache.lastCheck = Date.now();
    
    return false;
  }
};

/**
 * Clear the service status cache
 */
export const clearServiceStatusCache = () => {
  serviceStatusCache.isAvailable = null;
  serviceStatusCache.lastCheck = null;
};

/**
 * Get diagnostic information about API services
 * @returns {Promise<Object>} Diagnostic information about API services
 */
export const getDiagnosticInfo = async () => {
  const isApiAvailable = await checkApiAvailability();
  
  // Try to get more information if API is available
  let additionalInfo = {};
  
  if (isApiAvailable) {
    try {
      // Try to get health data from the actuator endpoint
      const healthEndpoint = API_ENDPOINTS.healthCheck || `${API_BASE_URL}/actuator/health`;
      const response = await fetchWithTimeoutAndRetry(
        healthEndpoint, 
        {}, 
        3000, 
        0
      );
      
      if (response.ok) {
        try {
          const healthData = await response.json();
          additionalInfo.healthData = healthData;
        } catch (e) {
          // If we can't parse as JSON, that's ok
          additionalInfo.healthStatus = response.status;
        }
      }
    } catch (e) {
      // Ignore errors trying to get additional info
    }
  }
  
  return {
    apiGateway: {
      isAvailable: isApiAvailable,
      url: API_BASE_URL,
      lastCheck: serviceStatusCache.lastCheck ? new Date(serviceStatusCache.lastCheck).toISOString() : null,
      ...additionalInfo
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      onLine: navigator.onLine,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    },
    environment: {
      nodeEnv: import.meta.env.MODE || 'unknown',
      isDevelopment: import.meta.env.DEV === true,
      isProduction: import.meta.env.PROD === true
    }
  };
};

export default {
  checkApiAvailability,
  getDiagnosticInfo,
  clearServiceStatusCache
};