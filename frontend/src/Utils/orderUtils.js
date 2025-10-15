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
    console.log('Attempting to fetch order count...');
    
    // Try the dedicated count endpoint first
    try {
      const response = await fetch('http://localhost:8080/api/analytics/admin/orders/count');
      console.log('Order count endpoint response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order count endpoint success:', data);
        return data;
      } else {
        console.log(`Order count endpoint failed with status ${response.status}, trying fallback...`);
      }
    } catch (endpointError) {
      console.log('Error with order count endpoint:', endpointError.message);
    }
    
    // Fallback: count all orders
    console.log('Trying fallback: counting all orders...');
    const allOrdersResponse = await fetch('http://localhost:8080/api/analytics/admin/orders');
    
    if (!allOrdersResponse.ok) {
      throw new Error(`HTTP error! status: ${allOrdersResponse.status}`);
    }
    
    const allOrders = await allOrdersResponse.json();
    console.log(`All orders endpoint success: received ${allOrders?.length || 0} orders`);
    
    return Array.isArray(allOrders) ? allOrders.length : 0;
    
  } catch (error) {
    console.error('Error fetching order count:', error);
    // Return 0 as a fallback value instead of throwing
    return 0;
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
 * Get recent orders (last N orders)
 * @param {number} limit - Number of recent orders to fetch (default: 7)
 * @returns {Promise<Array>} Recent order objects
 */
export const getRecentOrders = async (limit = 7) => {
  try {
    console.log(`Attempting to fetch recent orders with limit ${limit}...`);
    
    // Try the modern endpoint first
    try {
      const response = await fetch(`http://localhost:8080/api/analytics/admin/orders/recent?limit=${limit}`);
      console.log(`Recent orders endpoint response status:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Recent orders endpoint success: received ${data?.length || 0} orders`);
        return data;
      } else {
        console.log(`Recent orders endpoint failed with status ${response.status}, trying fallback...`);
      }
    } catch (endpointError) {
      console.log(`Error with recent orders endpoint:`, endpointError.message);
    }
    
    // Fallback: fetch all orders and take the most recent ones
    console.log(`Trying fallback: fetching all orders...`);
    const allOrdersResponse = await fetch(`http://localhost:8080/api/analytics/admin/orders`);
    
    if (!allOrdersResponse.ok) {
      throw new Error(`HTTP error! status: ${allOrdersResponse.status}`);
    }
    
    const allOrders = await allOrdersResponse.json();
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
