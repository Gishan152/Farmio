// orderUtils.js - Utility functions for order data management

import API from './API';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Fetch all orders from analytic service
 * @returns {Promise<Array>} Array of order objects
 */
export const fetchAllOrders = async () => {
  try {
    const orders = await API.get(`${API_BASE_URL}/api/analytics/admin/orders`);
    console.log('Fetched orders:', orders?.length || 0);
    return orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get total order count from the system
 * @returns {Promise<number>} Total number of orders
 */
export const getOrderCount = async () => {
  try {
    console.log('Attempting to fetch order count...');
    
    try {
      const count = await API.get(`${API_BASE_URL}/api/analytics/admin/orders/count`);
      console.log('Order count endpoint success:', count);
      return count;
    } catch (endpointError) {
      console.log('Error with order count endpoint:', endpointError.message);
    }
    
    // Fall back to counting all orders
    console.log('Trying fallback: counting all orders...');
    const orders = await fetchAllOrders();
    console.log(`Fallback order count: ${orders?.length || 0} orders`);
    return orders?.length || 0;
    
  } catch (error) {
    console.error('Error fetching order count:', error);
    // Return 0 as fallback instead of throwing
    return 0;
  }
};

/**
 * Get order count by status
 * @returns {Promise<Object>} Object with status counts
 */
export const getOrderCountByStatus = async () => {
  try {
    const statusCounts = await API.get(`${API_BASE_URL}/api/analytics/admin/orders/status-count`);
    console.log('Fetched order status counts:', statusCounts);
    return statusCounts || {};
  } catch (error) {
    console.error('Error fetching order count by status:', error);
    throw error;
  }
};

/**
 * Get orders by status
 * @param {string} status - The status to filter by
 * @returns {Promise<Array>} Array of orders with the specified status
 */
export const getOrdersByStatus = async (status) => {
  try {
    const orders = await API.get(`${API_BASE_URL}/api/analytics/admin/orders/by-status?status=${status}`);
    console.log(`Fetched orders with status '${status}':`, orders?.length || 0);
    return orders || [];
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

/**
 * Get recent orders (last N orders)
 * @param {number} limit - Number of recent orders to fetch (default: 7)
 * @returns {Promise<Array>} Recent order objects
 */
export const getRecentOrders = async (limit = 7) => {
  try {
    console.log(`Attempting to fetch recent orders with limit ${limit}...`);
    
    // Try the modern endpoint first
    try {
      const orders = await API.get(`${API_BASE_URL}/api/analytics/admin/orders/recent?limit=${limit}`);
      console.log(`Recent orders endpoint success: received ${orders?.length || 0} orders`);
      return orders || [];
    } catch (endpointError) {
      console.log(`Error with recent orders endpoint:`, endpointError.message);
    }
    
    // Fallback: fetch all orders and take the most recent ones
    console.log(`Trying fallback: fetching all orders...`);
    const allOrders = await fetchAllOrders();
    console.log(`All orders endpoint success: received ${allOrders?.length || 0} orders`);
    
    // Sort orders by date and take the most recent ones
    const sortedOrders = Array.isArray(allOrders) 
      ? allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      : [];
      
    return sortedOrders.slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Format order status for display
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    'PENDING': 'Pending',
    'PROCESSING': 'Processing',
    'AWAITING_PICKUP': 'Ready for Pickup',
    'IN_TRANSPORT': 'In Transit',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled'
  };
  return statusMap[status] || status;
};

/**
 * Get status color for styling
 * @param {string} status - The order status
 * @returns {string} The color class for the status
 */
export const getStatusColor = (status) => {
  const colorMap = {
    'PENDING': 'yellow',
    'PROCESSING': 'blue',
    'AWAITING_PICKUP': 'purple',
    'IN_TRANSPORT': 'indigo',
    'DELIVERED': 'green',
    'CANCELLED': 'red'
  };
  return colorMap[status] || 'gray';
};

export default {
  fetchAllOrders,
  getOrderCount,
  getOrderCountByStatus,
  getOrdersByStatus,
  getRecentOrders,
  formatOrderStatus,
  getStatusColor
};
