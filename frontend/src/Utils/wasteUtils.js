// wasteUtils.js - Utility functions for waste data management

import API from './API';
import { API_BASE_URL } from '../config/apiConfig';
import { checkApiAvailability } from './serviceStatus';

// Helper function for simple fetch with no extra headers to avoid CORS issues
const simpleFetch = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      // No headers, no credentials to avoid CORS preflight
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

/**
 * Fetch all waste listings from analytic service
 * @returns {Promise<Array>} Array of waste listing objects
 */
export const fetchAllWasteListings = async () => {
  try {
    console.log('Attempting to fetch waste listings...');
    
    // Check if API is available
    const isApiAvailable = await checkApiAvailability();
    if (!isApiAvailable) {
      console.warn('API Gateway is unavailable, returning empty array');
      return [];
    }
    
    // Try simple fetch first to avoid CORS issues
    try {
      const data = await simpleFetch(`${API_BASE_URL}/api/analytics/admin/waste/listings`);
      console.log(`Fetched ${data?.length || 0} waste listings`);
      return data;
    } catch (fetchError) {
      console.log(`Simple fetch failed: ${fetchError.message}, trying with API utility...`);
      
      // Fallback to API utility with auth headers if simple fetch fails
      try {
        const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings`);
        console.log(`Fetched ${data?.length || 0} waste listings with API utility`);
        return data;
      } catch (apiError) {
        console.error(`API utility fetch failed: ${apiError.message}`);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error fetching waste listings:', error);
    return []; // Return empty array on error for resilience
  }
};

/**
 * Fetch all waste agents from analytic service
 * @returns {Promise<Array>} Array of waste agent objects
 */
export const fetchAllWasteAgents = async () => {
  try {
    console.log('Attempting to fetch waste agents...');
    
    // Check if API is available
    const isApiAvailable = await checkApiAvailability();
    if (!isApiAvailable) {
      console.warn('API Gateway is unavailable, returning empty array');
      return [];
    }
    
    // Try simple fetch first to avoid CORS issues
    try {
      const data = await simpleFetch(`${API_BASE_URL}/api/analytics/admin/waste/agents`);
      console.log(`Fetched ${data?.length || 0} waste agents`);
      return data;
    } catch (fetchError) {
      console.log(`Simple fetch failed: ${fetchError.message}, trying with API utility...`);
      
      // Fallback to API utility with auth headers if simple fetch fails
      try {
        const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/agents`);
        console.log(`Fetched ${data?.length || 0} waste agents with API utility`);
        return data;
      } catch (apiError) {
        console.error(`API utility fetch failed: ${apiError.message}`);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error fetching waste agents:', error);
    return []; // Return empty array on error for resilience
  }
};

/**
 * Get waste listing count by status
 * @returns {Promise<Object>} Object with status keys and count values
 */
export const getWasteListingCountByStatus = async () => {
  try {
    console.log('Attempting to fetch waste listing status counts...');
    
    // Check if API is available
    const isApiAvailable = await checkApiAvailability();
    if (!isApiAvailable) {
      console.warn('API Gateway is unavailable, returning default status counts');
      return {
        'PENDING': 0,
        'ACCEPTED': 0,
        'COMPLETED': 0,
        'CANCELLED': 0
      };
    }
    
    // Try simple fetch first to avoid CORS issues
    try {
      const data = await simpleFetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/status-count`);
      console.log('Fetched waste listing status counts:', data);
      return data;
    } catch (fetchError) {
      console.log(`Simple fetch failed: ${fetchError.message}, trying with API utility...`);
      
      // Fallback to API utility with auth headers if simple fetch fails
      try {
        const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings/status-count`);
        console.log('Fetched waste listing status counts with API utility');
        return data;
      } catch (apiError) {
        console.error(`API utility fetch failed: ${apiError.message}`);
        throw apiError;
      }
    }
  } catch (error) {
    console.error('Error fetching waste listing status counts:', error);
    // Return default empty object with common statuses
    return { 
      'PENDING': 0,
      'ACCEPTED': 0,
      'COMPLETED': 0,
      'CANCELLED': 0
    };
  }
};

/**
 * Get waste listings by status
 * @param {string} status - The status to filter by (e.g., 'PENDING', 'COMPLETED')
 * @returns {Promise<Array>} Array of waste listing objects with matching status
 */
export const getWasteListingsByStatus = async (status) => {
  try {
    console.log(`Attempting to fetch waste listings with status: ${status}...`);
    
    const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings/by-status?status=${status}`);
    
    console.log(`Fetched ${data?.length || 0} waste listings with status ${status}`);
    return data;
  } catch (error) {
    console.error(`Error fetching waste listings with status ${status}:`, error);
    return [];
  }
};

/**
 * Get waste listing count by type
 * @returns {Promise<Object>} Object with type keys and count values
 */
export const getWasteListingCountByType = async () => {
  try {
    console.log('Attempting to fetch waste listing type counts...');
    
    const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings/type-count`);
    
    console.log('Fetched waste listing type counts:', data);
    return data;
  } catch (error) {
    console.error('Error fetching waste listing type counts:', error);
    // Return default empty object with common types
    return { 
      'ORGANIC': 0,
      'RECYCLABLE': 0,
      'HAZARDOUS': 0,
      'MIXED': 0
    };
  }
};

/**
 * Get waste listings by type
 * @param {string} type - The waste type to filter by
 * @returns {Promise<Array>} Array of waste listing objects with matching type
 */
export const getWasteListingsByType = async (type) => {
  try {
    console.log(`Attempting to fetch waste listings with type: ${type}...`);
    
    const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings/by-type?type=${type}`);
    
    console.log(`Fetched ${data?.length || 0} waste listings with type ${type}`);
    return data;
  } catch (error) {
    console.error(`Error fetching waste listings with type ${type}:`, error);
    return [];
  }
};

/**
 * Get total waste listing count
 * @returns {Promise<number>} Total number of waste listings
 */
export const getTotalWasteListingCount = async () => {
  try {
    console.log('Attempting to fetch total waste listing count...');
    
    // Try the dedicated count endpoint first
    try {
      const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings/count`);
      console.log('Waste count endpoint success:', data);
      return data;
    } catch (endpointError) {
      console.log('Error with waste count endpoint:', endpointError.message);
    }
    
    // Fallback: count all waste listings
    console.log('Trying fallback: counting all waste listings...');
    const allListings = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/listings`);
    console.log(`All listings endpoint success: received ${allListings?.length || 0} listings`);
    
    return Array.isArray(allListings) ? allListings.length : 0;
    
  } catch (error) {
    console.error('Error fetching total waste listing count:', error);
    return 0;
  }
};

/**
 * Get total waste agent count
 * @returns {Promise<number>} Total number of waste agents
 */
export const getTotalWasteAgentCount = async () => {
  try {
    console.log('Attempting to fetch total waste agent count...');
    
    // Try the dedicated count endpoint first
    try {
      const data = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/agents/count`);
      console.log('Agents count endpoint success:', data);
      return data;
    } catch (endpointError) {
      console.log('Error with agents count endpoint:', endpointError.message);
    }
    
    // Fallback: count all waste agents
    console.log('Trying fallback: counting all waste agents...');
    const allAgents = await API.get(`${API_BASE_URL}/api/analytics/admin/waste/agents`);
    console.log(`All agents endpoint success: received ${allAgents?.length || 0} agents`);
    
    return Array.isArray(allAgents) ? allAgents.length : 0;
    
  } catch (error) {
    console.error('Error fetching total waste agent count:', error);
    return 0;
  }
};

/**
 * Format waste listing status for display
 * @param {string} status - The raw status value
 * @returns {string} The formatted status text
 */
export const formatWasteStatus = (status) => {
  const statusMap = {
    'PENDING': 'Pending',
    'ACCEPTED': 'Accepted',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  };
  return statusMap[status] || status;
};

/**
 * Get status color for styling
 * @param {string} status - The raw status value
 * @returns {string} Color name suitable for styling
 */
export const getWasteStatusColor = (status) => {
  const colorMap = {
    'PENDING': 'yellow',
    'ACCEPTED': 'blue',
    'COMPLETED': 'green',
    'CANCELLED': 'red'
  };
  return colorMap[status] || 'gray';
};

export default {
  fetchAllWasteListings,
  fetchAllWasteAgents,
  getWasteListingCountByStatus,
  getWasteListingsByStatus,
  getWasteListingCountByType,
  getWasteListingsByType,
  getTotalWasteListingCount,
  getTotalWasteAgentCount,
  formatWasteStatus,
  getWasteStatusColor
};