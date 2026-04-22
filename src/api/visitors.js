import axios, { baseURL } from './axios';

export const visitorsApi = {
  fetchVisitors: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${baseURL}/admin/visitors`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },
};
