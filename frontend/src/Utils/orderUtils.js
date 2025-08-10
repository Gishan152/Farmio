// API utility functions for order analytics

/**
 * Fetch all orders from analytic service
 */
export const fetchAllOrders = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/analytics/admin/orders');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get total order count
 */
export const getOrderCount = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/analytics/admin/orders/count');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order count:', error);
    throw error;
  }
};

/**
 * Get order count by status
 */
export const getOrderCountByStatus = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/analytics/admin/orders/status-count');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order count by status:', error);
    throw error;
  }
};

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (status) => {
  try {
    const response = await fetch(`http://localhost:8080/api/analytics/admin/orders/by-status?status=${status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders by status:', error);
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
