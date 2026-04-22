import axios, { baseURL } from './axios';

export const cafeteriaApi = {
  fetchItems: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${baseURL}/cafeteria/items`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },

  addItem: async ({ item, category, price }) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${baseURL}/cafeteria/items`,
      { item, category, price },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      }
    );
    return response.data;
  },
  getItemById: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${baseURL}/cafeteria/items/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },

  updateItem: async (id, { item, category, price }) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(
      `${baseURL}/cafeteria/items/${id}`,
      { item, category, price },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      }
    );
    return response.data;
  },
  deleteItem: async (id) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${baseURL}/cafeteria/items/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },
};
