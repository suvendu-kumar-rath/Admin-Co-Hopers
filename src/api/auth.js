import axios, { baseURL } from './axios';

export const authApi = {
  // Login function with comprehensive token management
  login: async (credentials) => {
    try {
      const response = await axios.post(`${baseURL}/admin/login`, credentials);
      
      // If login is successful, store the token and user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store user info if provided
        if (response.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        }
        
        // Set token expiry (default 24 hours if not provided)
        const expiryTime = response.data.expiresIn 
          ? Date.now() + (response.data.expiresIn * 1000)
          : Date.now() + (24 * 60 * 60 * 1000); // 24 hours default
        
        localStorage.setItem('tokenExpiry', expiryTime.toString());
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('tokenExpiry');
  },

  // Check if user is authenticated and token is valid
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !isAuth || !tokenExpiry) {
      return false;
    }
    
    // Check if token has expired
    const currentTime = Date.now();
    if (currentTime > parseInt(tokenExpiry)) {
      // Token expired, clean up
      authApi.logout();
      return false;
    }
    
    return true;
  },

  // Get stored user info
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};


