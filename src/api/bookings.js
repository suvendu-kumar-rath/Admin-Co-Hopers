import axios from './axios';

export const bookingsApi = {
  // Fetch all space bookings
  fetchBookings: async () => {
    console.log('Fetching all space bookings...');
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get('/admin/space-bookings', {
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
      const response = await axios.get(`/bookings/${bookingId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Booking fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch booking:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify space booking (confirm/reject)
  updatePaymentStatus: async (bookingId, status) => {
    console.log('Verifying space booking status:', { bookingId, status });
    
    const token = localStorage.getItem('authToken');
    
    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    try {
      const response = await axios.put(`/admin/space-bookings/${bookingId}/verify`, {
        status: status,
        verified: status === 'CONFIRMED' ? true : false
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Space booking status updated successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update space booking status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Helper methods for confirm/reject
  confirmBooking: async (bookingId) => {
    return await bookingsApi.updatePaymentStatus(bookingId, 'CONFIRMED');
  },

  rejectBooking: async (bookingId) => {
    return await bookingsApi.updatePaymentStatus(bookingId, 'REJECTED');
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
      const response = await axios.get(`/bookings?${params.toString()}`, {
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
      const response = await axios.get('/bookings/stats', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Booking stats fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch booking stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update booking details (admin only)
  updateBooking: async (bookingId, updateData) => {
    console.log('Updating booking:', { bookingId, updateData });
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.put(`/bookings/${bookingId}`, updateData, {
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
      const response = await axios.delete(`/bookings/${bookingId}`, {
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
      const response = await axios.get(`/bookings/export?${params.toString()}`, {
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
      
      console.log('✅ Bookings exported successfully');
      return { success: true, message: 'Bookings exported successfully' };
      
    } catch (error) {
      console.error('❌ Failed to export bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send notification to user about booking status
  sendStatusNotification: async (bookingId, message) => {
    console.log('Sending status notification:', { bookingId, message });
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.post(`/bookings/${bookingId}/notify`, {
        message
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Notification sent successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send notification:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default bookingsApi;