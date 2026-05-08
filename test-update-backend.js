// Test Script to Diagnose Backend Update Issues
// Run this in your browser console

console.log('%c=== BACKEND UPDATE DIAGNOSTIC TEST ===', 'color: red; font-size: 16px; font-weight: bold;');

const API_BASE_URL = 'https://api.boldtribe.in/api';
const token = localStorage.getItem('authToken');

// Helper function to make API calls
const testApiCall = async (method, endpoint, data = null) => {
  console.log(`\n%c>>> Testing: ${method} ${endpoint}`, 'color: blue; font-weight: bold;');
  
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    console.log('Request headers:', config.headers);
    console.log('Request body:', data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (!response.ok) {
      console.error(`%c❌ FAILED - Status ${response.status}`, 'color: red; font-weight: bold;');
      return { success: false, status: response.status, data: responseData };
    } else {
      console.log(`%c✅ SUCCESS - Data persisted to backend`, 'color: green; font-weight: bold;');
      return { success: true, status: response.status, data: responseData };
    }
  } catch (error) {
    console.error(`%c❌ ERROR: ${error.message}`, 'color: red; font-weight: bold;');
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

// Test 1: Check Authentication
console.log('\n%c### TEST 1: Authentication Check ###', 'color: orange; font-size: 14px;');
console.log('Token exists:', !!token);
console.log('Token preview:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');

// Test 2: Try to fetch pending KYC to see if backend works at all
console.log('\n%c### TEST 2: Backend Connectivity ###', 'color: orange; font-size: 14px;');
const testKyc = async () => {
  const result = await testApiCall('GET', '/admin/kyc');
  return result;
};

// Test 3: Try to approve a KYC (will fail if no valid KYC ID, but will show if backend processes it)
console.log('\n%c### TEST 3: KYC Approval (with test ID) ###', 'color: orange; font-size: 14px;');
const testApproveKyc = async () => {
  // Use a test ID - will likely not exist but will show if backend receives the request
  const testId = 'TEST_KYC_123';
  const result = await testApiCall('PUT', `/admin/kyc/${testId}/verify`, {
    status: 'Approve'
  });
  return result;
};

// Test 4: Try to update a space booking  
console.log('\n%c### TEST 4: Space Booking Update (with test ID) ###', 'color: orange; font-size: 14px;');
const testUpdateBooking = async () => {
  const testId = 'TEST_BOOKING_123';
  const result = await testApiCall('PUT', `/admin/space-bookings/${testId}/verify`, {
    status: 'Confirm'
  });
  return result;
};

// Test 5: Check what KYC records actually exist
console.log('\n%c### TEST 5: Fetch Actual KYC Records ###', 'color: orange; font-size: 14px;');
const testFetchKyc = async () => {
  const result = await testApiCall('GET', '/admin/kyc');
  if (result.success && result.data) {
    console.log('Found KYC records:', result.data);
    if (Array.isArray(result.data) || Array.isArray(result.data.data)) {
      const kycs = Array.isArray(result.data) ? result.data : result.data.data;
      if (kycs.length > 0) {
        const firstKyc = kycs[0];
        console.log('First KYC ID:', firstKyc.id || firstKyc._id);
        console.log('First KYC status:', firstKyc.status || firstKyc.verification_status);
        return firstKyc;
      }
    }
  }
  return null;
};

// Test 6: Fetch actual bookings
console.log('\n%c### TEST 6: Fetch Actual Space Bookings ###', 'color: orange; font-size: 14px;');
const testFetchBookings = async () => {
  const result = await testApiCall('GET', '/admin/space-bookings');
  if (result.success && result.data) {
    console.log('Found bookings:', result.data);
    if (Array.isArray(result.data) || Array.isArray(result.data.data)) {
      const bookings = Array.isArray(result.data) ? result.data : result.data.data;
      if (bookings.length > 0) {
        const firstBooking = bookings[0];
        console.log('First booking ID:', firstBooking.id || firstBooking._id);
        console.log('First booking status:', firstBooking.status || firstBooking.paymentStatus);
        return firstBooking;
      }
    }
  }
  return null;
};

// Run all tests
console.log('\n%c=== RUNNING ALL TESTS ===', 'color: red; font-weight: bold;');

(async () => {
  // Test connectivity first
  const kycResult = await testFetchKyc();
  const bookingResult = await testFetchBookings();
  
  // If we have real records, try to update them
  if (kycResult) {
    const kycId = kycResult.id || kycResult._id;
    console.log('\n%c### TEST 7: Try to Approve Real KYC ###', 'color: orange; font-size: 14px;');
    await testApiCall('PUT', `/admin/kyc/${kycId}/verify`, {
      status: 'Approve'
    });
    
    // Fetch again to see if it changed
    console.log('\n%c### TEST 8: Verify if KYC Status Changed ###', 'color: orange; font-size: 14px;');
    const updatedKycResult = await testApiCall('GET', `/admin/kyc`);
    if (updatedKycResult.success) {
      const kycs = Array.isArray(updatedKycResult.data) ? updatedKycResult.data : updatedKycResult.data.data;
      const updatedKyc = kycs.find(k => (k.id || k._id) === kycId);
      if (updatedKyc) {
        console.log('Updated KYC status:', updatedKyc.status || updatedKyc.verification_status);
        if ((updatedKyc.status === 'Approved' || updatedKyc.verification_status === 'approved')) {
          console.log('%c✅ KYC Status WAS UPDATED in backend!', 'color: green; font-weight: bold;');
        } else {
          console.log('%c❌ KYC Status was NOT updated in backend (Backend issue)', 'color: red; font-weight: bold;');
        }
      }
    }
  }
  
  if (bookingResult) {
    const bookingId = bookingResult.id || bookingResult._id;
    console.log('\n%c### TEST 9: Try to Confirm Real Booking ###', 'color: orange; font-size: 14px;');
    await testApiCall('PUT', `/admin/space-bookings/${bookingId}/verify`, {
      status: 'Confirm'
    });
    
    // Fetch again to see if it changed
    console.log('\n%c### TEST 10: Verify if Booking Status Changed ###', 'color: orange; font-size: 14px;');
    const updatedBookingResult = await testApiCall('GET', `/admin/space-bookings`);
    if (updatedBookingResult.success) {
      const bookings = Array.isArray(updatedBookingResult.data) ? updatedBookingResult.data : updatedBookingResult.data.data;
      const updatedBooking = bookings.find(b => (b.id || b._id) === bookingId);
      if (updatedBooking) {
        console.log('Updated booking status:', updatedBooking.status || updatedBooking.paymentStatus);
        if (updatedBooking.status === 'Confirm' || updatedBooking.paymentStatus === 'Confirm') {
          console.log('%c✅ Booking Status WAS UPDATED in backend!', 'color: green; font-weight: bold;');
        } else {
          console.log('%c❌ Booking Status was NOT updated in backend (Backend issue)', 'color: red; font-weight: bold;');
        }
      }
    }
  }
  
  console.log('\n%c=== DIAGNOSTIC COMPLETE ===', 'color: red; font-weight: bold;');
})();
