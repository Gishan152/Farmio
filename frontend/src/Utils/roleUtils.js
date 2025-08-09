/**
 * Utility functions for handling user roles in the Farmio admin panel
 */

// Available role constants
export const ROLES = {
  FARMER: 'ROLE_FARMER',
  BUYER: 'ROLE_BUYER',
  WASTE: 'ROLE_WASTE',
  WAREHOUSE: 'ROLE_WAREHOUSE',
  TRANSPORT: 'ROLE_TRANSPORT',
  ADMIN: 'ROLE_ADMIN',
  MODERATOR: 'ROLE_MODERATOR'
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.FARMER]: 'Farmer',
  [ROLES.BUYER]: 'Buyer',
  [ROLES.WASTE]: 'Waste Management Agent',
  [ROLES.WAREHOUSE]: 'Warehouse Owner',
  [ROLES.TRANSPORT]: 'Transport Provider',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.MODERATOR]: 'Moderator'
};

/**
 * Fetch users from API with optional role filtering
 * @param {string} role - Optional role to filter by (e.g., 'ROLE_FARMER')
 * @returns {Promise<Array>} Array of user objects
 */
export const fetchUsersByRole = async (role = null) => {
  try {
    let url = 'http://localhost:8080/api/analytics/admin/users';
    
    // Try to use the new role-based endpoint if a role is specified
    if (role) {
      try {
        const roleResponse = await fetch(`${url}/by-role?role=${role}`);
        if (roleResponse.ok) {
          return await roleResponse.json();
        }
      } catch (error) {
        console.warn('Role-based endpoint not available, falling back to client-side filtering');
      }
    }
    
    // Fallback to fetching all users and filtering on client side
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allUsers = await response.json();
    
    // If no role specified, return all users
    if (!role) {
      return allUsers;
    }
    
    // Filter users by role on client side
    return allUsers.filter(user => 
      user.roles && user.roles.includes(role)
    );
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Transform API user data to match component format
 * @param {Array} apiUsers - Users from API
 * @param {string} defaultRole - Default role display name
 * @returns {Array} Transformed users for component
 */
export const transformApiUsers = (apiUsers, defaultRole = 'User') => {
  return apiUsers.map(user => ({
    id: user.id,
    name: user.username,
    email: user.email,
    phone: user.phoneNo,
    location: "N/A", // Not available in API
    farmSize: "N/A", // Not available in API  
    crops: "N/A", // Not available in API
    status: user.status,
    nic: user.nic,
    roles: user.roles ? user.roles.join(', ') : 'N/A',
    joinDate: "N/A", // Not available in API
    lastActive: "N/A", // Not available in API
    
    // Role-specific fields that can be added later
    warehouseSize: "N/A",
    specialFeatures: "N/A",
    certification: "N/A",
    capacityUsed: "N/A",
    contactPerson: user.username, // Use username as contact person for now
    
    // Transport-specific fields
    vehicleType: "N/A",
    serviceArea: "N/A",
    
    // Waste management specific fields
    serviceType: "N/A",
    coverage: "N/A"
  }));
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const userHasRole = (user, role) => {
  return user.roles && user.roles.includes(role);
};

/**
 * Get role display name
 * @param {string} role - Role constant (e.g., 'ROLE_FARMER')
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

/**
 * Get sample data for a specific role (fallback when API fails)
 * @param {string} role - Role constant
 * @returns {Array} Sample user data
 */
export const getSampleDataByRole = (role) => {
  const baseSampleUser = {
    id: 1,
    name: "Sample User",
    email: "sample@example.com",
    phone: "+94 77 123 4567",
    location: "Sample Location",
    status: "Active",
    nic: "123456789V",
    roles: role,
    joinDate: "2023-01-15",
    lastActive: "2023-06-10"
  };

  switch (role) {
    case ROLES.FARMER:
      return [{
        ...baseSampleUser,
        name: "Sample Farmer",
        email: "farmer@example.com",
        farmSize: "10 acres",
        crops: "Rice, Vegetables"
      }];
    
    case ROLES.BUYER:
      return [{
        ...baseSampleUser,
        name: "Sample Buyer",
        email: "buyer@example.com",
        businessType: "Retail",
        purchaseVolume: "Large"
      }];
    
    case ROLES.WAREHOUSE:
      return [{
        ...baseSampleUser,
        name: "Sample Warehouse",
        email: "warehouse@example.com",
        warehouseSize: "5000 sq ft",
        specialFeatures: "Climate Controlled",
        certification: "ISO 9001",
        capacityUsed: "70%",
        contactPerson: "Sample Manager"
      }];
    
    case ROLES.TRANSPORT:
      return [{
        ...baseSampleUser,
        name: "Sample Transport",
        email: "transport@example.com",
        vehicleType: "Truck",
        serviceArea: "Island Wide"
      }];
    
    case ROLES.WASTE:
      return [{
        ...baseSampleUser,
        name: "Sample Waste Agent",
        email: "waste@example.com",
        serviceType: "Organic Waste",
        coverage: "District Wide"
      }];
    
    case ROLES.ADMIN:
      return [{
        ...baseSampleUser,
        name: "Sample Admin",
        email: "admin@example.com",
        permissions: "Full Access"
      }];
    
    case ROLES.MODERATOR:
      return [{
        ...baseSampleUser,
        name: "Sample Moderator",
        email: "moderator@example.com",
        permissions: "Content Management"
      }];
    
    default:
      return [baseSampleUser];
  }
};