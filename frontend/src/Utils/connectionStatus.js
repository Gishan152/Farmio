/**
 * Utility functions for checking connections to various backend services
 */
import { checkApiAvailability } from './serviceStatus';

// Constants for connection states
export const CONNECTION_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  UNKNOWN: 'unknown',
};

// Store the connection status globally
const connectionState = {
  status: CONNECTION_STATES.UNKNOWN,
  lastChecked: null,
  retryCount: 0,
  maxRetries: 3,
};

/**
 * Check the connection to the backend API and update the connection state
 * @returns {Promise<boolean>} True if connected, false if not
 */
export const checkBackendConnection = async () => {
  try {
    connectionState.lastChecked = new Date();
    
    // Try to connect to the API gateway
    const isAvailable = await checkApiAvailability();
    
    if (isAvailable) {
      connectionState.status = CONNECTION_STATES.CONNECTED;
      connectionState.retryCount = 0;
      return true;
    } else {
      connectionState.status = CONNECTION_STATES.DISCONNECTED;
      return false;
    }
  } catch (error) {
    console.error('Error checking backend connection:', error);
    connectionState.status = CONNECTION_STATES.DISCONNECTED;
    return false;
  }
};

/**
 * Get the current connection status
 * @returns {Object} The current connection state
 */
export const getConnectionStatus = () => {
  return { 
    ...connectionState,
    lastCheckedFormatted: connectionState.lastChecked ? 
      new Date(connectionState.lastChecked).toLocaleTimeString() : 'Never'
  };
};

/**
 * Attempt to reconnect to the backend if disconnected
 * @param {Function} onStatusChange Callback that receives the updated connection state
 * @returns {Promise<boolean>} True if reconnected successfully, false otherwise
 */
export const attemptReconnect = async (onStatusChange = null) => {
  if (connectionState.status === CONNECTION_STATES.CONNECTED) {
    return true;
  }
  
  if (connectionState.retryCount >= connectionState.maxRetries) {
    console.error('Maximum reconnection attempts reached');
    return false;
  }
  
  connectionState.status = CONNECTION_STATES.RECONNECTING;
  if (onStatusChange) onStatusChange(getConnectionStatus());
  
  connectionState.retryCount++;
  
  // Try to reconnect
  const isConnected = await checkBackendConnection();
  
  if (isConnected) {
    console.log('Successfully reconnected to the backend');
    if (onStatusChange) onStatusChange(getConnectionStatus());
    return true;
  }
  
  console.error(`Reconnection attempt ${connectionState.retryCount} failed`);
  if (onStatusChange) onStatusChange(getConnectionStatus());
  return false;
};

/**
 * Setup a periodic connection check
 * @param {Function} onStatusChange Callback that receives the updated connection state
 * @param {number} intervalMs How often to check in milliseconds, defaults to 30 seconds
 * @returns {Function} Function to cancel the periodic checks
 */
export const setupConnectionMonitoring = (onStatusChange, intervalMs = 30000) => {
  // Check connection initially
  checkBackendConnection().then(isConnected => {
    if (onStatusChange) onStatusChange(getConnectionStatus());
  });
  
  // Setup interval for periodic checks
  const intervalId = setInterval(() => {
    checkBackendConnection().then(isConnected => {
      if (onStatusChange) onStatusChange(getConnectionStatus());
    });
  }, intervalMs);
  
  // Return function to cancel the monitoring
  return () => clearInterval(intervalId);
};

export default {
  checkBackendConnection,
  getConnectionStatus,
  attemptReconnect,
  setupConnectionMonitoring,
  CONNECTION_STATES,
};