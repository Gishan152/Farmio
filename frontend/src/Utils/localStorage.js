/**
 * Utility functions for working with localStorage with proper error handling
 */

const STORAGE_PREFIX = 'farmio_';

/**
 * Get an item from localStorage with error handling
 * @param {string} key - The key to retrieve
 * @param {*} defaultValue - Default value if key doesn't exist or on error
 * @returns {*} The stored value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    
    // Check if item exists
    if (item === null) {
      return defaultValue;
    }
    
    // Try to parse as JSON, fall back to raw value if parsing fails
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage with error handling
 * @param {string} key - The key to set
 * @param {*} value - The value to store (objects will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
export const setItem = (key, value) => {
  try {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Remove an item from localStorage with error handling
 * @param {string} key - The key to remove
 * @returns {boolean} True if successful, false otherwise
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Clear all farmio related items from localStorage with error handling
 * @returns {boolean} True if successful, false otherwise
 */
export const clearAll = () => {
  try {
    // Only clear items with our prefix
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
};

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  return getItem('auth_token');
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The token to store
 * @returns {boolean} True if successful, false otherwise
 */
export const setAuthToken = (token) => {
  return setItem('auth_token', token);
};

/**
 * Clear the authentication token from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearAuthToken = () => {
  return removeItem('auth_token');
};

/**
 * Check if the user is authenticated (has a token)
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  isAuthenticated
};