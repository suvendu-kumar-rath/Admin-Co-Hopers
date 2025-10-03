import axios from './axios';

export const meetingRoomApi = {
  // Fetch all meeting room bookings
  fetchBookings: async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching meeting room bookings...');
      
      const response = await axios.get('/admin/meeting-room-bookings', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Meeting room bookings fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch meeting room bookings:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify (confirm/reject) a meeting room booking
  verifyBooking: async (bookingId, action = 'confirm') => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`${action === 'confirm' ? 'Confirming' : 'Rejecting'} booking with ID: ${bookingId}`);
      
      const response = await axios.post(`/meetingrooms/verify-booking/${bookingId}`, 
        { 
          action: action, // 'confirm' or 'reject'
          status: action === 'confirm' ? 'confirmed' : 'rejected'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: false,
        }
      );
      
      console.log(`✅ Booking ${action}ed successfully:`, response.data);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Failed to ${action} booking:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Confirm a booking (helper method)
  confirmBooking: async (bookingId) => {
    return await meetingRoomApi.verifyBooking(bookingId, 'confirm');
  },

  // Reject a booking (helper method)
  rejectBooking: async (bookingId) => {
    return await meetingRoomApi.verifyBooking(bookingId, 'reject');
  },

  // Update booking timing (if needed)
  updateBookingTiming: async (bookingId, startTime, endTime) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Updating booking timing for ID: ${bookingId}`);
      
      const response = await axios.put(`/meetingrooms/booking/${bookingId}/timing`, 
        { 
          startTime: startTime,
          endTime: endTime
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: false,
        }
      );
      
      console.log('✅ Booking timing updated successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update booking timing:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default meetingRoomApi;
