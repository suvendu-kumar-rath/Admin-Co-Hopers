import axios from './axios';

export const spacesApi = {
  create: async ({ spaceName, seater, price, availability, images, availableDates }) => {
    const formData = new FormData();
    if (spaceName !== undefined) formData.append('space_name', spaceName);
    if (seater !== undefined) formData.append('seater', String(seater));
    if (price !== undefined) formData.append('price', String(price));
    if (availability !== undefined) formData.append('availability', availability);
    if (Array.isArray(availableDates)) {
      formData.append('availableDates', JSON.stringify(availableDates));
    }
    if (Array.isArray(images)) {
      images.forEach((file) => {
        if (file) formData.append('images', file);
      });
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.post('/inventory/spaces', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },
};


