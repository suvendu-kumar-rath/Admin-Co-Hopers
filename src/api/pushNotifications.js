import axios from './axios';
import { requestFCMToken, onMessageListener } from '../config/firebase';

export const pushNotificationsApi = {
  /**
   * Get FCM token from Firebase
   * @returns {Promise<string|null>} FCM token or null if failed
   */
  getFCMToken: async () => {
    try {
      const token = await requestFCMToken();
      if (!token) {
        throw new Error('Failed to get FCM token. Make sure Firebase is configured correctly.');
      }
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      throw error;
    }
  },

  // Register admin push token
  registerPushToken: async (tokenData) => {
    try {
      console.log('📤 Registering push token with data:', tokenData);
      const response = await axios.post('/admin/push/register', tokenData);
      console.log('✅ Push token registered successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error registering push token:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Add more context to the error
      if (error.response?.status === 403) {
        error.userMessage = 'Push notifications feature is not available. Your account may not have the required permissions or this feature is not enabled on the server.';
      } else if (error.response?.status === 404) {
        error.userMessage = 'Push notification service is not available. The backend may not support this feature yet.';
      } else if (error.response?.status === 401) {
        error.userMessage = 'Authentication required. Please log in again.';
      } else {
        error.userMessage = 'Failed to register push token. Please try again later.';
      }
      
      throw error;
    }
  },

  // Subscribe to a push topic
  subscribePushTopic: async (topicData) => {
    try {
      console.log('📤 Subscribing to push topic with data:', topicData);
      const response = await axios.post('/admin/push/subscribe', topicData);
      console.log('✅ Subscribed to push topic:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error subscribing to push topic:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      console.error('🔴 Backend Error Message:', error.response?.data?.error || error.response?.data?.message || 'Unknown error');
      
      // Add more context to the error
      if (error.response?.status === 403) {
        error.userMessage = 'Push notifications feature is not available. Your account may not have the required permissions or this feature is not enabled on the server.';
      } else if (error.response?.status === 404) {
        error.userMessage = 'Push notification service is not available. The backend may not support this feature yet.';
      } else if (error.response?.status === 401) {
        error.userMessage = 'Authentication required. Please log in again.';
      } else {
        error.userMessage = 'Failed to enable push notifications. Please try again later.';
      }
      
      throw error;
    }
  },

  // Unsubscribe from a push topic
  unsubscribePushTopic: async (topicData) => {
    try {
      console.log('📤 Unsubscribing from push topic with data:', topicData);
      const response = await axios.post('/admin/push/unsubscribe', topicData);
      console.log('✅ Unsubscribed from push topic:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error unsubscribing from push topic:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Add more context to the error
      if (error.response?.status === 403) {
        error.userMessage = 'Cannot unsubscribe. Your account may not have the required permissions.';
      } else if (error.response?.status === 404) {
        error.userMessage = 'Push notification service is not available.';
      } else if (error.response?.status === 401) {
        error.userMessage = 'Authentication required. Please log in again.';
      } else {
        error.userMessage = 'Failed to disable push notifications. Please try again later.';
      }
      
      throw error;
    }
  },
};

// Export onMessageListener for foreground message handling
export { onMessageListener };
