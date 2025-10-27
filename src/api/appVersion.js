import axios from './axios';

export const appVersionApi = {
  // Get current app versions
  getCurrentVersions: async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching current app versions...');
      
      const response = await axios.get('/admin/app-versions', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Current app versions fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch current app versions:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update app versions
  updateVersions: async (versionData) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Updating app versions with data:', versionData);
      
      const response = await axios.post('/admin/app-versions', versionData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ App versions updated successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update app versions:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get version history
  getVersionHistory: async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching app version history...');
      
      const response = await axios.get('/admin/app-versions/history', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ App version history fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch app version history:', error.response?.data || error.message);
      throw error;
    }
  },

  // Toggle force update
  toggleForceUpdate: async (enabled) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`${enabled ? 'Enabling' : 'Disabling'} force update...`);
      
      const response = await axios.patch('/admin/app-versions/force-update', 
        { enabled },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: false,
        }
      );
      
      console.log(`✅ Force update ${enabled ? 'enabled' : 'disabled'} successfully:`, response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Failed to ${enabled ? 'enable' : 'disable'} force update:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default appVersionApi;