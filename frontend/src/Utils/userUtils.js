// userUtils.js - Utility functions for user data management

const API_BASE_URL = 'http://localhost:8080'; // API Gateway URL

/**
 * Fetch all users from the backend
 * @returns {Promise<Array>} Array of user objects
 */
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/all-dto`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users = await response.json();
    console.log('Fetched users:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get total user count from the system
 * @returns {Promise<number>} Total number of users
 */
export const getUserCount = async () => {
  try {
    console.log('Attempting to fetch user count...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/admin/users/count`);
      console.log('User count endpoint response status:', response.status);
      
      if (response.ok) {
        const count = await response.json();
        console.log('User count endpoint success:', count);
        return count;
      } else {
        console.log(`User count endpoint failed with status ${response.status}, trying fallback...`);
      }
    } catch (endpointError) {
      console.log('Error with user count endpoint:', endpointError.message);
    }
    
    // Fall back to counting all users
    console.log('Trying fallback: counting all users...');
    const users = await fetchAllUsers();
    console.log(`Fallback user count: ${users?.length || 0} users`);
    return users?.length || 0;
    
  } catch (error) {
    console.error('Error fetching user count:', error);
    // Return 0 as fallback instead of throwing
    return 0;
  }
};

/**
 * Create a lookup map for quick user access by ID
 * @param {Array} users - Array of user objects
 * @returns {Object} Object with userId as key and user data as value
 */
export const createUserLookupMap = (users) => {
  if (!users || !Array.isArray(users)) {
    console.warn('Invalid users array provided to createUserLookupMap');
    return {};
  }

  const lookupMap = {};
  users.forEach(user => {
    if (user && user.id) {
      lookupMap[user.id] = user;
    }
  });

  console.log('Created user lookup map with', Object.keys(lookupMap).length, 'users');
  return lookupMap;
};

/**
 * Get user name by ID from the lookup map
 * @param {number|string} userId - The user ID to look up
 * @param {Object} userLookupMap - The user lookup map
 * @returns {string} The user's display name
 */
export const getUserNameById = (userId, userLookupMap) => {
  if (!userId || !userLookupMap) {
    return 'Unknown User';
  }

  const user = userLookupMap[userId];
  if (!user) {
    return `User #${userId}`;
  }

  // Return username if available, otherwise email, otherwise just the ID
  return user.username || user.email || `User #${userId}`;
};

/**
 * Get detailed user information by ID from the lookup map
 * @param {number|string} userId - The user ID to look up
 * @param {Object} userLookupMap - The user lookup map
 * @returns {Object} The user's detailed information
 */
export const getUserDetailsById = (userId, userLookupMap) => {
  if (!userId || !userLookupMap) {
    return {
      id: userId,
      name: 'Unknown User',
      email: 'N/A',
      status: 'Unknown',
      phoneNo: 'N/A'
    };
  }

  const user = userLookupMap[userId];
  if (!user) {
    return {
      id: userId,
      name: `User #${userId}`,
      email: 'N/A',
      status: 'Unknown',
      phoneNo: 'N/A'
    };
  }

  return {
    id: user.id,
    name: user.username || user.email || `User #${userId}`,
    email: user.email || 'N/A',
    status: user.status || 'Unknown',
    phoneNo: user.phoneNo || 'N/A',
    nic: user.nic || 'N/A',
    roles: user.roles || []
  };
};

/**
 * Get buyer name from order using user lookup map
 * @param {number|string} buyerId - The buyer ID
 * @param {Object} userLookupMap - The user lookup map
 * @returns {string} The buyer's name
 */
export const getBuyerNameFromOrder = (buyerId, userLookupMap) => {
  return getUserNameById(buyerId, userLookupMap);
};

/**
 * Get buyer information for display in orders
 * @param {number|string} buyerId - The buyer ID
 * @param {Object} userLookupMap - The user lookup map
 * @returns {Object} Formatted buyer information
 */
export const getBuyerInfo = (buyerId, userLookupMap) => {
  const userDetails = getUserDetailsById(buyerId, userLookupMap);
  
  return {
    id: userDetails.id,
    displayName: userDetails.name,
    email: userDetails.email,
    status: userDetails.status,
    phoneNo: userDetails.phoneNo
  };
};

export default {
  fetchAllUsers,
  createUserLookupMap,
  getUserNameById,
  getUserDetailsById,
  getBuyerInfo,
  getBuyerNameFromOrder
};
