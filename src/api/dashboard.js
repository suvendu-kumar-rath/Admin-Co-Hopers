import axios, { baseURL } from './axios';

export const dashboardApi = {
  // Fetch dashboard data
  fetchDashboardData: async () => {
    console.log('Fetching dashboard data...');
    
    const token = localStorage.getItem('authToken');
    
    try {
      // Using the provided API endpoint
      const response = await axios.get(`${baseURL}/admin/dashboard-data`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
        timeout: 15000,
      });
      
      console.log('✅ Dashboard data fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error('Authentication failed - redirecting to login');
        throw new Error('Authentication required');
      } else if (error.response?.status === 403) {
        console.error('Access forbidden - insufficient permissions');
        throw new Error('Access denied');
      } else if (error.response?.status === 404) {
        console.error('Dashboard endpoint not found');
        throw new Error('Dashboard data not available');
      } else if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
        throw new Error('Request timeout - please try again');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
      }
    }
  },

  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    console.log('Fetching dashboard statistics...');
    
    try {
      const response = await dashboardApi.fetchDashboardData();
      console.log('Raw backend response:', response);
      
      // Extract the actual data from the nested response structure
      const dashboardData = response.data || response;
      console.log('Extracted dashboard data:', dashboardData);
      
      // Map backend data structure to frontend expectations
      const stats = {
        // Map backend keys to frontend expectations
        activeMembers: dashboardData.totalUsers || 0,
        pastMembers: dashboardData.pendingBookings || 0, // Using pending bookings as past members for now
        totalMembers: dashboardData.totalUsers || 0,
        payments: dashboardData.totalEarnings || 0,
        monthlyEarnings: dashboardData.monthlyEarnings || 0,
        
        // Additional backend data
        totalSpaceBookings: dashboardData.totalSpaceBookings || 0,
        totalMeetingRoomBookings: dashboardData.totalMeetingRoomBookings || 0,
        totalSpaces: dashboardData.totalSpaces || 0,
        totalMeetingRooms: dashboardData.totalMeetingRooms || 0,
        pendingBookings: dashboardData.pendingBookings || 0,
        
        // Default values for data not provided by backend
        topActiveMembers: dashboardData.topActiveMembers || [],
        chartData: dashboardData.chartData || {
          values: [
            dashboardData.totalSpaceBookings || 0,
            dashboardData.totalMeetingRoomBookings || 0,
            dashboardData.totalEarnings || 0,
            dashboardData.monthlyEarnings || 0,
            dashboardData.totalUsers || 0
          ],
          categories: ['Space Bookings', 'Meeting Rooms', 'Total Earnings', 'Monthly Earnings', 'Users']
        },
        successRate: dashboardData.successRate || { 
          percentage: dashboardData.totalSpaceBookings > 0 
            ? Math.round(((dashboardData.totalSpaceBookings - dashboardData.pendingBookings) / dashboardData.totalSpaceBookings) * 100)
            : 0,
          successful: (dashboardData.totalSpaceBookings || 0) - (dashboardData.pendingBookings || 0),
          unsuccessful: dashboardData.pendingBookings || 0
        }
      };
      
      console.log('Mapped frontend data:', stats);
      return stats;
      
    } catch (error) {
      console.error('❌ Failed to fetch dashboard statistics:', error.message);
      throw error;
    }
  }
};
