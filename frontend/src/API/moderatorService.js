import api from './client';

const moderatorService = {
  /**
   * Create a new moderator account with a temporary password
   * @param {Object} moderatorData - Moderator information including email, name, etc.
   * @returns {Promise<Object>} Created moderator data
   */
  createModerator: async (moderatorData) => {
    try {
      console.log('Creating moderator with data:', moderatorData);
      
      // Try to reach the backend API
      let response;
      try {
        response = await api.post('/api/admin/moderators', moderatorData);
        return response.data;
      } catch (apiError) {
        console.error('Error connecting to API:', apiError);
        
        // In development/demo mode, return a fake success response if the API is not available
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn('Development mode: Returning fake moderator creation response');
          const temporaryPassword = moderatorData.temporaryPassword || 'temp123';
          console.log('Generated temporary password (dev mode):', temporaryPassword);
          
          return { 
            id: Math.floor(Math.random() * 1000),
            username: moderatorData.email.split('@')[0],
            email: moderatorData.email,
            message: 'Moderator account created successfully (development mode)',
            temporaryPassword: temporaryPassword
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error creating moderator account:', error);
      throw error;
    }
  },

  /**
   * Get all moderators
   * @returns {Promise<Array>} List of moderators
   */
  getAllModerators: async () => {
    try {
      // Try to reach the backend API
      let response;
      try {
        response = await api.get('/api/admin/moderators');
        return response.data;
      } catch (apiError) {
        console.error('Error connecting to API:', apiError);
        
        // In development/demo mode, return sample data if the API is not available
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn('Development mode: Returning sample moderators data');
          
          const currentDate = new Date().toISOString().split('T')[0];
          
          return [
            {
              id: 1,
              name: "Ashan Jayasinghe",
              username: "ashan.j",
              nic: "198756432V",
              email: "ashan.j@farmio.lk",
              phone: "+94 77 123 4567",
              address: "42 Temple Road, Colombo 03",
              role: "Content Moderator",
              department: "User Support",
              permissions: {
                farmers: { view: true },
                buyers: { view: true },
                content: { view: true, edit: true, delete: true }
              },
              activityLevel: "High",
              status: "Active",
              joinDate: "2022-09-10",
              lastActive: currentDate
            },
            {
              id: 2,
              name: "Shalini Perera",
              username: "shalini.p",
              nic: "199087654V",
              email: "shalini.p@farmio.lk",
              phone: "+94 76 234 5678",
              address: "15 Lake Drive, Kandy",
              role: "Product Moderator",
              department: "Quality Control",
              permissions: {
                products: { view: true, edit: true, approve: true }
              },
              activityLevel: "Medium",
              status: "Active",
              joinDate: "2022-11-22",
              lastActive: currentDate
            },
            {
              id: 3,
              name: "Nuwan Fernando",
              username: "nuwan.f",
              nic: "199234567V",
              email: "nuwan.f@farmio.lk",
              phone: "+94 71 345 6789",
              address: "78 Beach Road, Galle",
              role: "Support Moderator",
              department: "Customer Success",
              permissions: {
                buyers: { view: true, edit: true },
                farmers: { view: true, edit: true },
                content: { view: true }
              },
              activityLevel: "Low",
              status: "Inactive",
              joinDate: "2023-01-15",
              lastActive: "2023-05-20"
            }
          ];
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching moderators:', error);
      throw error;
    }
  },

  /**
   * Update moderator information
   * @param {number} id - Moderator ID
   * @param {Object} moderatorData - Updated moderator data
   * @returns {Promise<Object>} Updated moderator data
   */
  updateModerator: async (id, moderatorData) => {
    try {
      const response = await api.put(`/api/admin/moderators/${id}`, moderatorData);
      return response.data;
    } catch (error) {
      console.error('Error updating moderator:', error);
      throw error;
    }
  },

  /**
   * Delete a moderator
   * @param {number} id - Moderator ID
   * @returns {Promise<boolean>} Success status
   */
  deleteModerator: async (id) => {
    try {
      await api.delete(`/api/admin/moderators/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting moderator:', error);
      throw error;
    }
  },

  /**
   * Reset a moderator's password to a new temporary password
   * @param {number} id - Moderator ID
   * @returns {Promise<Object>} Response with new temporary password
   */
  resetModeratorPassword: async (id) => {
    try {
      // Try to reach the backend API
      let response;
      try {
        response = await api.post(`/api/admin/moderators/${id}/reset-password`);
        return response.data;
      } catch (apiError) {
        console.error('Error connecting to API:', apiError);
        
        // In development/demo mode, return a fake success response if the API is not available
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn('Development mode: Returning fake password reset response');
          
          // Generate a fake temporary password for development
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
          let tempPassword = "";
          for (let i = 0; i < 10; i++) {
            tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          return {
            temporaryPassword: tempPassword,
            message: 'Password reset successfully (development mode). The moderator will need to change it on next login.'
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error resetting moderator password:', error);
      throw error;
    }
  },
  
  /**
   * First-time login for moderator to change temporary password
   * @param {Object} passwordData - Contains email, temporary password, and new password
   * @returns {Promise<Object>} Response with JWT token and success message
   */
  changeTemporaryPassword: async (passwordData) => {
    try {
      console.log('Changing temporary password with data:', {
        email: passwordData.email,
        temporaryPassword: '********', // Redacted for security
        newPassword: '********' // Redacted for security
      });
      
      // Try to reach the backend API
      let response;
      try {
        response = await api.post('/api/moderator/change-temp-password', passwordData);
        return response.data;
      } catch (apiError) {
        console.error('Error connecting to API:', apiError);
        
        // In development/demo mode, return a fake success response if the API is not available
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn('Development mode: Returning fake password change response');
          
          // Generate a fake JWT token for development
          const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vZGVyYXRvciIsInJvbGUiOiJNT0RFUkFUT1IiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
          
          return {
            token: fakeToken,
            success: true,
            message: 'Password changed successfully (development mode)'
          };
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error changing temporary password:', error);
      throw error;
    }
  },
  
  /**
   * Get activity logs for a moderator
   * @param {number} id - Moderator ID
   * @returns {Promise<Array>} List of activity logs
   */
  getModeratorActivityLogs: async (id) => {
    try {
      // Try to reach the backend API
      let response;
      try {
        response = await api.get(`/api/admin/moderators/${id}/activity`);
        return response.data;
      } catch (apiError) {
        console.error('Error connecting to API:', apiError);
        
        // In development/demo mode, return sample data if the API is not available
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          console.warn('Development mode: Returning sample activity logs');
          
          const currentDate = new Date().toISOString().split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          return [
            { 
              id: 1, 
              date: `${currentDate} 09:32:14`, 
              action: 'LOGIN',
              details: 'Moderator logged in'
            },
            { 
              id: 2, 
              date: `${currentDate} 09:45:22`, 
              action: 'CONTENT_REVIEW',
              details: 'Approved 12 product listings'
            },
            { 
              id: 3, 
              date: `${currentDate} 11:15:30`, 
              action: 'USER_REPORT',
              details: 'Handled complaint against farmer ID F-1023'
            },
            { 
              id: 4, 
              date: `${yesterdayStr} 15:20:14`, 
              action: 'CONTENT_MODERATION',
              details: 'Removed 3 inappropriate comments'
            },
            { 
              id: 5, 
              date: `${yesterdayStr} 16:45:51`, 
              action: 'LOGIN',
              details: 'Moderator logged in'
            },
            { 
              id: 6, 
              date: `${yesterdayStr} 17:30:00`, 
              action: 'LOGOUT',
              details: 'Moderator logged out'
            }
          ];
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Error fetching moderator activity logs:', error);
      throw error;
    }
  }
};

export default moderatorService;
