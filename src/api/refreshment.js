import axios from './axios';

export const refreshmentApi = {
  // Fetch all cafeteria orders
  fetchOrders: async () => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching cafeteria orders...');
      
      const response = await axios.get('/cafeteria/admin/orders', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Cafeteria orders fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch cafeteria orders:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Fetching cafeteria order with ID: ${orderId}`);
      
      const response = await axios.get(`/cafeteria/admin/orders/${orderId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Cafeteria order fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch cafeteria order:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update order status (if needed)
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Updating order ${orderId} status to:`, status);
      
      const response = await axios.patch(`/cafeteria/admin/orders/${orderId}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: false,
        }
      );
      
      console.log('✅ Order status updated successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to update order status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get orders with filters
  fetchOrdersWithFilters: async (filters = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching filtered cafeteria orders with filters:', filters);
      
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.userId) params.append('userId', filters.userId);
      
      const response = await axios.get(`/cafeteria/admin/orders?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Filtered cafeteria orders fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch filtered cafeteria orders:', error.response?.data || error.message);
      throw error;
    }
  },

  // Export orders data
  exportOrders: async (format = 'csv', filters = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(`Exporting cafeteria orders as ${format}...`);
      
      const params = new URLSearchParams();
      params.append('format', format);
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`/cafeteria/admin/orders/export?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        responseType: 'blob',
        withCredentials: false,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cafeteria_orders_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      console.log('✅ Cafeteria orders exported successfully');
      return { success: true, message: 'Export completed successfully' };
      
    } catch (error) {
      console.error('❌ Failed to export cafeteria orders:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default refreshmentApi;