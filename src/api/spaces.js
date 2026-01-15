import axios, { baseURL } from './axios';

export const spacesApi = {
  create: async ({ space_name, seater, price, availability, spaceImages, availableDates, roomNumber, cabinNumber }) => {
    console.log('Creating space with data:', { space_name, seater, price, availability, spaceImages, availableDates, roomNumber, cabinNumber });
    
    const token = localStorage.getItem('authToken');
    
    // Check if spaceImages are provided (required by backend)
    if (!spaceImages || spaceImages.length === 0) {
      throw new Error('At least one image is required to create a space');
    }
    
    // Use FormData approach as backend expects multipart/form-data for file uploads
    const formData = new FormData();
    
    // Add all fields with proper names matching backend expectations
    formData.append('space_name', space_name || 'Unnamed Space');
    formData.append('roomNumber', String(roomNumber || ''));
    formData.append('cabinNumber', String(cabinNumber || ''));
    formData.append('seater', String(seater || 1));
    formData.append('price', String(price || 0));
    formData.append('availability', availability || 'AVAILABLE');
    
    // Add spaceImages (required field)
    if (Array.isArray(spaceImages) && spaceImages.length > 0) {
      spaceImages.forEach((file, index) => {
        if (file && file instanceof File) {
          console.log(`Adding image ${index + 1}:`, file.name, file.size, file.type);
          formData.append('spaceImages', file);
        }
      });
    }
    
    // Add available dates if provided
    if (Array.isArray(availableDates) && availableDates.length > 0) {
      formData.append('availableDates', JSON.stringify(availableDates));
    }
    
    // Log all formData entries for debugging
    console.log('FormData entries being sent:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      const response = await axios.post(`${baseURL}/spaces/spaces`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Space created successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Space creation failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete space function
  deleteSpace: async (spaceId) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${baseURL}/spaces/spaces/${spaceId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    return response.data;
  },

  // Update space function
  updateSpace: async (spaceId, { space_name, seater, price, availability, spaceImages, existingImages, availableDates, roomNumber, cabinNumber }) => {
    console.log('🔄 Updating space ID:', spaceId);
    console.log('📝 Update data received:', { space_name, seater, price, availability, roomNumber, cabinNumber });
    console.log('🖼️ Images - New:', spaceImages?.length || 0, 'Existing:', existingImages?.length || 0);
    
    const formData = new FormData();
    
    // Try multiple field name variations for space name and seater
    if (space_name !== undefined && space_name !== null) {
      formData.append('space_name', String(space_name));
      formData.append('name', String(space_name)); // Try alternative name
      console.log('✅ Sending space_name (both space_name and name):', space_name);
    }
    
    if (seater !== undefined && seater !== null) {
      formData.append('seater', String(seater));
      formData.append('capacity', String(seater)); // Try alternative name
      console.log('✅ Sending seater (both seater and capacity):', seater);
    }
    
    if (price !== undefined && price !== null) {
      formData.append('price', String(price));
      console.log('✅ Sending price:', price);
    }
    
    if (availability !== undefined && availability !== null) {
      formData.append('availability', String(availability));
      console.log('✅ Sending availability:', availability);
    } else {
      console.log('⚠️ Availability is missing:', availability);
    }
    
    // Only send roomNumber and cabinNumber if they have values
    if (roomNumber !== undefined && roomNumber !== null && roomNumber !== '') {
      formData.append('roomNumber', String(roomNumber));
      console.log('✅ Sending roomNumber:', roomNumber);
    } else {
      console.log('⚠️ roomNumber is empty:', roomNumber);
    }
    
    if (cabinNumber !== undefined && cabinNumber !== null && cabinNumber !== '') {
      formData.append('cabinNumber', String(cabinNumber));
      console.log('✅ Sending cabinNumber:', cabinNumber);
    } else {
      console.log('⚠️ cabinNumber is empty:', cabinNumber);
    }
    
    if (Array.isArray(availableDates)) {
      formData.append('availableDates', JSON.stringify(availableDates));
    }
    
    // Send existing image URLs to keep them
    if (Array.isArray(existingImages) && existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }
    
    // Add new image files
    if (Array.isArray(spaceImages) && spaceImages.length > 0) {
      spaceImages.forEach((file) => {
        if (file && file instanceof File) {
          console.log('📎 Adding new image file:', file.name);
          formData.append('spaceImages', file);
        }
      });
    }
    
    // Log all formData entries for debugging
    console.log('📤 FormData being sent:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: File(${pair[1].name})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`${baseURL}/spaces/spaces/${spaceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ Space updated successfully!');
      console.log('📦 Response structure:', response);
      console.log('📦 Response.data:', response.data);
      console.log('📦 Updated space object:', response.data?.data || response.data?.space || response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Space update failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch all spaces function
  fetchSpaces: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${baseURL}/spaces/spaces`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      withCredentials: false,
    });
    console.log('📦 fetchSpaces response:', response.data);
    console.log('📦 First space in array:', response.data?.data?.[0] || response.data?.[0]);
    return response.data;
  },

  // Fetch space by ID function
  fetchSpaceById: async (spaceId) => {
    console.log('Fetching space by ID:', spaceId);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await axios.get(`${baseURL}/spaces/spaces/${spaceId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      
      console.log('✅ Space fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch space:', error.response?.data || error.message);
      throw error;
    }
  },

  // Test function to check API with minimal data
  testCreate: async () => {
    console.log('Testing API with minimal data...');
    
    // Test 1: JSON approach
    const token = localStorage.getItem('authToken');
    try {
      console.log('Test 1: Trying JSON approach...');
      const jsonData = {
        space_name: 'Test Room JSON',
        seater: 2,
        price: 500,
        availability: 'AVAILABLE'
      };
      
      const jsonResponse = await axios.post(`${baseURL}/spaces/spaces`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        withCredentials: false,
      });
      console.log('✅ JSON Test successful:', jsonResponse.data);
      return jsonResponse.data;
      
    } catch (jsonError) {
      console.warn('JSON test failed:', jsonError.response?.status, jsonError.response?.data);
      
      // Test 2: FormData approach
      try {
        console.log('Test 2: Trying FormData approach...');
        const formData = new FormData();
        formData.append('space_name', 'Test Room FormData');
        formData.append('seater', '2');
        formData.append('price', '500');
        formData.append('availability', 'AVAILABLE');

        const response = await axios.post(`${baseURL}/spaces/spaces`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: false,
        });
        console.log('✅ FormData Test successful:', response.data);
        return response.data;
      } catch (formError) {
        console.error('❌ Both JSON and FormData tests failed');
        console.error('JSON Error:', jsonError.response?.status, jsonError.response?.data);
        console.error('FormData Error:', formError.response?.status, formError.response?.data);
        throw formError;
      }
    }
  },

  // Check if the endpoint exists and what methods it supports
  testEndpoint: async () => {
    console.log('Testing endpoint availability...');
    const token = localStorage.getItem('authToken');
    
    try {
      // Try OPTIONS request to see what's allowed
      const optionsResponse = await axios.options(`${baseURL}/spaces/spaces`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      console.log('✅ OPTIONS successful:', optionsResponse.headers);
    } catch (optionsError) {
      console.log('OPTIONS not supported or failed:', optionsError.response?.status);
    }
    
    try {
      // Try GET request to see if endpoint exists
      const getResponse = await axios.get(`${baseURL}/spaces/spaces`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      console.log('✅ GET successful, endpoint exists:', getResponse.status);
    } catch (getError) {
      console.error('❌ GET failed:', getError.response?.status, getError.response?.data);
    }
  },
};


