import axiosInstance from './axios';

// API endpoints for members management
const ENDPOINTS = {
  ACTIVE_MEMBERS: '/admin/active-members',
};

export const membersApi = {
  // Fetch all active members
  fetchActiveMembers: async () => {
    try {
      console.log('Fetching active members from API...');
      const response = await axiosInstance.get(ENDPOINTS.ACTIVE_MEMBERS);
      console.log('Active members API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching active members:', error);
      
      // Enhanced error handling
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch active members';
        throw new Error(`${errorMessage} (Status: ${error.response.status})`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },

  // Get member by ID (if needed)
  getMemberById: async (memberId) => {
    try {
      console.log(`Fetching member with ID: ${memberId}`);
      const response = await axiosInstance.get(`${ENDPOINTS.ACTIVE_MEMBERS}/${memberId}`);
      console.log('Member details API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching member details:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to fetch member details';
        throw new Error(`${errorMessage} (Status: ${error.response.status})`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },

  // Update member status (if needed)
  updateMemberStatus: async (memberId, status) => {
    try {
      console.log(`Updating member ${memberId} status to: ${status}`);
      const response = await axiosInstance.put(`${ENDPOINTS.ACTIVE_MEMBERS}/${memberId}/status`, {
        status
      });
      console.log('Member status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating member status:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to update member status';
        throw new Error(`${errorMessage} (Status: ${error.response.status})`);
      } else if (error.request) {
        throw new Error('Network error: Unable to reach the server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  }
};