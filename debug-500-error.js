// Debug Helper for 500 Error
// Copy this into your browser console to test the API

console.log('=== Inventory API Debug Helper ===');

// Check if we can access the spacesApi
let spacesApi;
try {
  // Try to import from the global scope or module
  spacesApi = window.spacesApi || (await import('./api/spaces.js')).spacesApi;
} catch (e) {
  console.error('Could not access spacesApi:', e);
}

// Test functions
const debugFunctions = {
  // Test 1: Check authentication
  testAuth: () => {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');
    console.log('Authentication status:');
    console.log('Token exists:', !!token);
    console.log('Is authenticated:', isAuth === 'true');
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
  },

  // Test 2: Try minimal API call
  testMinimalCreate: async () => {
    console.log('\n=== Testing Minimal Create API ===');
    try {
      if (spacesApi && spacesApi.testCreate) {
        const result = await spacesApi.testCreate();
        console.log('✅ Minimal API test successful:', result);
      } else {
        console.log('❌ spacesApi.testCreate not available');
      }
    } catch (error) {
      console.error('❌ Minimal API test failed:', error);
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
    }
  },

  // Test 3: Check API endpoint directly
  testEndpoint: async () => {
    console.log('\n=== Testing API Endpoint Directly ===');
    const token = localStorage.getItem('authToken');
    const baseUrl = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
    
    try {
      const formData = new FormData();
      formData.append('space_name', 'Debug Test Room');
      formData.append('seater', '2');
      formData.append('price', '500');
      formData.append('availability', 'AVAILABLE');

      const response = await fetch(`${baseUrl}/spaces/spaces`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct API test successful:', data);
      } else {
        const errorText = await response.text();
        console.error('❌ Direct API test failed:');
        console.error('Status:', response.status);
        console.error('Response:', errorText);
      }
    } catch (error) {
      console.error('❌ Direct API test error:', error);
    }
  },

  // Test 4: Check form data format
  testFormData: () => {
    console.log('\n=== Testing FormData Format ===');
    const formData = new FormData();
    formData.append('space_name', 'Test Room');
    formData.append('seater', '4');
    formData.append('price', '1000');
    formData.append('availability', 'AVAILABLE');
    formData.append('room_number', 'R101');
    formData.append('cabin_number', 'C001');

    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }
};

// Make functions available globally
window.inventoryDebug = debugFunctions;

console.log('\n=== Available Debug Functions ===');
console.log('window.inventoryDebug.testAuth() - Check authentication');
console.log('window.inventoryDebug.testMinimalCreate() - Test minimal API call');
console.log('window.inventoryDebug.testEndpoint() - Test endpoint directly');
console.log('window.inventoryDebug.testFormData() - Check form data format');

console.log('\n=== Auto-running basic checks ===');
debugFunctions.testAuth();
debugFunctions.testFormData();

// Common 500 error causes and solutions
console.log('\n=== Common 500 Error Causes ===');
console.log('1. Missing required fields on server side');
console.log('2. Invalid data format (e.g., string instead of number)');
console.log('3. Database connection issues');
console.log('4. Server validation rules not met');
console.log('5. Authentication token issues');
console.log('6. File upload size limits exceeded');

console.log('\n=== Suggested Fixes ===');
console.log('1. Check server logs for exact error');
console.log('2. Verify all required fields are being sent');
console.log('3. Test with minimal data first');
console.log('4. Check data types match server expectations');
console.log('5. Verify API endpoint is correct');

export { debugFunctions };