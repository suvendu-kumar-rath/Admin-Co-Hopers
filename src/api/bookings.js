import axios, { baseURL } from './axios';

export const bookingsApi = {
  // Fetch all space bookings
  fetchBookings: async () => {
    console.log('Fetching all space bookings...');
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(`${baseURL}/admin/space-bookings`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Space bookings fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch space bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch booking by ID
  fetchBookingById: async (bookingId) => {
    console.log('Fetching booking by ID:', bookingId);
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(`${baseURL}/bookings/${bookingId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log(' Booking fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(' Failed to fetch booking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify space booking (confirm/reject)
  updatePaymentStatus: async (bookingId, status, negotiatedAmount = null, depositedAmount = null) => {
    console.log('📤 Verifying space booking status:', { bookingId, status, negotiatedAmount, depositedAmount });
    
    const token = localStorage.getItem('authToken');
    const requestBody = {
      status: status
    };
    
    // Add negotiated amount if provided (backend expects 'finalAmount')
    if (negotiatedAmount !== null && negotiatedAmount !== undefined) {
      requestBody.finalAmount = negotiatedAmount;
    }

    // Add deposited amount if provided
    if (depositedAmount !== null && depositedAmount !== undefined) {
      requestBody.depositedAmount = depositedAmount;
    }
    
    console.log('📋 Request body:', JSON.stringify(requestBody));
    
    try {
      const response = await axios.put(`${baseURL}/admin/space-bookings/${bookingId}/verify`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Space booking status updated successfully:', response.data);
      console.log('Response status:', response.status);
      
      if (!response.data) {
        throw new Error('Server returned empty response');
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update space booking status');
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again. Your session may have expired.');
      } else if (error.response?.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response?.status === 404) {
        throw new Error('Booking not found. It may have been deleted.');
      } else if (error.response?.status === 500) {
        throw new Error(`Server error: ${error.response.data?.message || 'Internal server error'}`);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw error;
    }
  },

  // Helper methods for confirm/reject
  confirmBooking: async (bookingId) => {
    return await bookingsApi.updatePaymentStatus(bookingId, 'Approve');
  },

  rejectBooking: async (bookingId) => {
    return await bookingsApi.updatePaymentStatus(bookingId, 'Reject');
  },

  // Fetch bookings with filters
  fetchBookingsWithFilters: async (filters = {}) => {
    console.log('Fetching bookings with filters:', filters);
    
    const token = localStorage.getItem('authToken');
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.spaceId) params.append('spaceId', filters.spaceId);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    try {
      const response = await axios.get(`${baseURL}/bookings?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Filtered bookings fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch filtered bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async () => {
    console.log('Fetching booking statistics...');
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(`${baseURL}/bookings/stats`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log(' Booking stats fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(' Failed to fetch booking stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update booking details (admin only)
  updateBooking: async (bookingId, updateData) => {
    console.log('Updating booking:', { bookingId, updateData });
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.put(`${baseURL}/bookings/${bookingId}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Booking updated successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update booking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete booking (admin only)
  deleteBooking: async (bookingId) => {
    console.log('Deleting booking:', bookingId);
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.delete(`${baseURL}/bookings/${bookingId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Booking deleted successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to delete booking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Export bookings to CSV
  exportBookings: async (filters = {}) => {
    console.log('Exporting bookings to CSV...');
    
    const token = localStorage.getItem('authToken');
    
    // Build query parameters
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    try {
      const response = await axios.get(`${baseURL}/bookings/export?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        responseType: 'blob', // Important for file downloads
        withCredentials: false,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bookings-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Bookings exported successfully');
      return { success: true, message: 'Bookings exported successfully' };
      
    } catch (error) {
      console.error('Failed to export bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send notification to user about booking status
  sendStatusNotification: async (bookingId, message) => {
    console.log('Sending status notification:', { bookingId, message });
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.post(`${baseURL}/bookings/${bookingId}/notify`, {
        message
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log(' Notification sent successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(' Failed to send notification:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default bookingsApi;