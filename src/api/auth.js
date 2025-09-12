import axios from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await axios.post('/admin/login', credentials);
    return response.data;
  },
};


