// routeUtils.js - Utility functions for route/transport data management

import API from './API';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Fetch all routes from analytic service
 * @returns {Promise<Array>} Array of route objects
 */
export const fetchAllRoutes = async () => {
  try {
    console.log('🚗 Fetching all routes...');
    const routes = await API.get(`${API_BASE_URL}/api/analytics/admin/routes`);
    console.log('✅ Routes fetched:', routes?.length || 0);
    return routes || [];
  } catch (error) {
    console.error('❌ Error fetching routes:', error);
    return [];
  }
};

/**
 * Get total route count
 * @returns {Promise<number>} Total number of routes
 */
export const getRouteCount = async () => {
  try {
    const count = await API.get(`${API_BASE_URL}/api/analytics/admin/routes/count`);
    return count || 0;
  } catch (error) {
    console.error('Error fetching route count:', error);
    return 0;
  }
};

/**
 * Get routes by location (starting or destination)
 * @param {string} location - The location to filter by
 * @returns {Promise<Array>} Array of routes
 */
export const getRoutesByLocation = async (location) => {
  try {
    const routes = await API.get(`${API_BASE_URL}/api/analytics/admin/routes/by-location?location=${location}`);
    return routes || [];
  } catch (error) {
    console.error('Error fetching routes by location:', error);
    return [];
  }
};

/**
 * Get total distance of all routes
 * @returns {Promise<number>} Total distance
 */
export const getTotalDistance = async () => {
  try {
    const distance = await API.get(`${API_BASE_URL}/api/analytics/admin/routes/total-distance`);
    return distance || 0;
  } catch (error) {
    console.error('Error fetching total distance:', error);
    return 0;
  }
};

/**
 * Get average distance of routes
 * @returns {Promise<number>} Average distance
 */
export const getAverageDistance = async () => {
  try {
    const avgDistance = await API.get(`${API_BASE_URL}/api/analytics/admin/routes/average-distance`);
    return avgDistance || 0;
  } catch (error) {
    console.error('Error fetching average distance:', error);
    return 0;
  }
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (!distance) return '0 km';
  return `${distance.toFixed(2)} km`;
};

/**
 * Format time for display
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time
 */
export const formatTime = (minutes) => {
  if (!minutes) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatRouteDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export default {
  fetchAllRoutes,
  getRouteCount,
  getRoutesByLocation,
  getTotalDistance,
  getAverageDistance,
  formatDistance,
  formatTime,
  formatRouteDate
};

