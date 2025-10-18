// wasteUtils.js - Utility functions for waste data management

const API_BASE_URL = 'http://localhost:8080'; // API Gateway URL

/**
 * Fetch all waste listings from analytic service
 * @returns {Promise<Array>} Array of waste listing objects
 */
export const fetchAllWasteListings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waste listings:', error);
    throw error;
  }
};

/**
 * Fetch all waste agents from analytic service
 * @returns {Promise<Array>} Array of waste agent objects
 */
export const fetchAllWasteAgents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/agents`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waste agents:', error);
    throw error;
  }
};

/**
 * Get waste listing count by status
 * @returns {Promise<Object>} Object with status keys and count values
 */
export const getWasteListingCountByStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/status-count`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waste listing status counts:', error);
    throw error;
  }
};

/**
 * Get waste listings by status
 * @param {string} status - The status to filter by (e.g., 'PENDING', 'COMPLETED')
 * @returns {Promise<Array>} Array of waste listing objects with matching status
 */
export const getWasteListingsByStatus = async (status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/by-status?status=${status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching waste listings with status ${status}:`, error);
    throw error;
  }
};

/**
 * Get waste listing count by type
 * @returns {Promise<Object>} Object with type keys and count values
 */
export const getWasteListingCountByType = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/type-count`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching waste listing type counts:', error);
    throw error;
  }
};

/**
 * Get waste listings by type
 * @param {string} type - The waste type to filter by
 * @returns {Promise<Array>} Array of waste listing objects with matching type
 */
export const getWasteListingsByType = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/by-type?type=${type}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching waste listings with type ${type}:`, error);
    throw error;
  }
};

/**
 * Get total waste listing count
 * @returns {Promise<number>} Total number of waste listings
 */
export const getTotalWasteListingCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/listings/count`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching total waste listing count:', error);
    // Return 0 instead of throwing
    return 0;
  }
};

/**
 * Get total waste agent count
 * @returns {Promise<number>} Total number of waste agents
 */
export const getTotalWasteAgentCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/admin/waste/agents/count`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching total waste agent count:', error);
    // Return 0 instead of throwing
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