import axios, { baseURL } from './axios';

export const meetingRoomApi = {
  // Fetch all meeting room bookings
  fetchBookings: async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching meeting room bookings...');
      
      const response = await axios.get(`${baseURL}/admin/meeting-room-bookings`, {
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
      
      const endpoint = `/meetingrooms/verify-booking/${bookingId}`;
      console.log('🔗 API Endpoint:', `${baseURL}${endpoint}`);
      
      // Backend expects status to be exactly 'Confirm' or 'Reject' (with capital letters)
      const payload = { 
        status: action === 'confirm' ? 'Confirm' : 'Reject'
      };
      
      console.log('📤 Sending payload:', payload);
      
      const response = await axios.put(`${baseURL}${endpoint}`, 
        payload,
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
      console.error(`❌ Failed to ${action} booking:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        endpoint: `/meetingrooms/verify-booking/${bookingId}`
      });
      
      // Log the full error response to understand what the backend expects
      if (error.response?.data) {
        console.error('🔍 Backend error details:', error.response.data);
      }
      
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

  // --- Meeting Room Entity CRUD ---

  // Fetch all meeting rooms (physical rooms, not bookings)
  fetchRooms: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${baseURL}/meetingrooms/`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Meeting rooms fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch meeting rooms:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new meeting room
  createRoom: async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('roomNumber', String(data.roomNumber));
      formData.append('capacity', String(data.capacity));
      formData.append('price', String(data.price));
      formData.append('availability', data.availability || 'AVAILABLE');
      if (data.roomImages && data.roomImages.length > 0) {
        data.roomImages.forEach(file => {
          if (file instanceof File) formData.append('roomImages', file);
        });
      }
      const response = await axios.post(`${baseURL}/meetingrooms/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Meeting room created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create meeting room:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing meeting room
  updateRoom: async (roomId, data) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.capacityType !== undefined) formData.append('capacityType', data.capacityType);
      if (data.hourlyRate !== undefined) formData.append('hourlyRate', String(data.hourlyRate));
      if (data.dayRate !== undefined) formData.append('dayRate', String(data.dayRate));
      if (data.memberHourlyRate !== undefined) formData.append('memberHourlyRate', String(data.memberHourlyRate));
      if (data.memberDayRate !== undefined) formData.append('memberDayRate', String(data.memberDayRate));
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.openTime !== undefined) formData.append('openTime', data.openTime);
      if (data.closeTime !== undefined) formData.append('closeTime', data.closeTime);
      if (data.status !== undefined) formData.append('status', data.status ? 'true' : 'false');
      if (data.image instanceof File) formData.append('image', data.image);
      const response = await axios.put(`${baseURL}/meetingrooms/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Meeting room updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update meeting room:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a meeting room
  deleteRoom: async (roomId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${baseURL}/meetingrooms/${roomId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Meeting room deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete meeting room:', error.response?.data || error.message);
      throw error;
    }
  },

  // Add a new meeting room type (POST /meetingrooms/add)
  addRoomType: async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('capacityType', data.capacityType);
      formData.append('hourlyRate', String(data.hourlyRate));
      formData.append('dayRate', String(data.dayRate));
      formData.append('memberHourlyRate', String(data.memberHourlyRate));
      formData.append('memberDayRate', String(data.memberDayRate));
      formData.append('description', data.description || '');
      formData.append('openTime', data.openTime);
      formData.append('closeTime', data.closeTime);
      formData.append('status', data.status ? 'true' : 'false');
      if (data.image instanceof File) {
        formData.append('image', data.image);
      }
      const response = await axios.post(`${baseURL}/meetingrooms/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Meeting room type added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to add meeting room type:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update booking timing (if needed)
  updateBookingTiming: async (bookingId, startTime, endTime) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Updating booking timing for ID: ${bookingId}`);
      
      const response = await axios.put(`${baseURL}/meetingrooms/${bookingId}`, 
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
