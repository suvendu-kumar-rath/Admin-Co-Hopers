// Debug Login Redirect Issue
// Add this to your browser console to debug the login redirect

console.log('=== Login Redirect Debug Helper ===');

// Check current authentication status
const checkAuthStatus = () => {
  console.log('\n=== Current Auth Status ===');
  console.log('authToken:', localStorage.getItem('authToken'));
  console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));
  console.log('userInfo:', localStorage.getItem('userInfo'));
  console.log('tokenExpiry:', localStorage.getItem('tokenExpiry'));
  
  const expiry = localStorage.getItem('tokenExpiry');
  if (expiry) {
    const expiryDate = new Date(parseInt(expiry));
    const now = new Date();
    console.log('Token expiry date:', expiryDate.toLocaleString());
    console.log('Current time:', now.toLocaleString());
    console.log('Is token expired:', now > expiryDate);
  }
};

// Test the authApi.isAuthenticated function
const testAuthCheck = () => {
  console.log('\n=== Testing authApi.isAuthenticated() ===');
  try {
    // Assuming authApi is available globally or import it
    if (typeof authApi !== 'undefined') {
      const isAuth = authApi.isAuthenticated();
      console.log('authApi.isAuthenticated():', isAuth);
    } else {
      console.log('authApi not available in global scope');
    }
  } catch (error) {
    console.error('Error testing auth check:', error);
  }
};

// Simulate successful login
const simulateLogin = () => {
  console.log('\n=== Simulating Successful Login ===');
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
  const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  localStorage.setItem('authToken', mockToken);
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('tokenExpiry', expiryTime.toString());
  localStorage.setItem('userInfo', JSON.stringify({
    id: 1,
    email: 'admin@test.com',
    name: 'Test Admin'
  }));
  
  console.log('✅ Mock login data stored');
  checkAuthStatus();
  
  // Try to redirect
  console.log('Attempting redirect to dashboard...');
  if (typeof window !== 'undefined' && window.location) {
    window.location.href = '/';
  }
};

// Clear auth data
const clearAuth = () => {
  console.log('\n=== Clearing Auth Data ===');
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('tokenExpiry');
  console.log('✅ Auth data cleared');
};

// Debug steps
console.log('\nAvailable debug functions:');
console.log('- checkAuthStatus() - Check current authentication state');
console.log('- testAuthCheck() - Test authApi.isAuthenticated()');
console.log('- simulateLogin() - Simulate successful login');
console.log('- clearAuth() - Clear all auth data');

// Export functions to window for easy access
if (typeof window !== 'undefined') {
  window.loginDebug = {
    checkAuthStatus,
    testAuthCheck,
    simulateLogin,
    clearAuth
  };
  
  console.log('\nUse window.loginDebug.functionName() to test');
}

// Initial check
checkAuthStatus();

// Instructions
console.log('\n=== Debugging Instructions ===');
console.log('1. Open your login page in the browser');
console.log('2. Open browser console (F12)');
console.log('3. Copy and paste this script');
console.log('4. Try logging in with actual credentials');
console.log('5. Check console for any errors');
console.log('6. Use simulateLogin() to test redirect without API call');
console.log('7. Check if redirect happens or if there are errors');

export { checkAuthStatus, testAuthCheck, simulateLogin, clearAuth };