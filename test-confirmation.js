// Test script to simulate lead confirmation flow
// This script can be run in browser console to test the functionality

// Sample lead data that would be confirmed
const testLead = {
  id: 999,
  name: 'Test User',
  address: 'Test Address, Test City',
  dateOfJoining: '2023-09-19',
  mobile: '9876543210',
  email: 'testuser@example.com',
  status: 'lead'
};

// Simulate lead confirmation
function testConfirmLead() {
  console.log('Testing lead confirmation...');
  
  // Get existing active members
  const existingActiveMembers = JSON.parse(localStorage.getItem('activeMembers') || '[]');
  console.log('Existing active members:', existingActiveMembers.length);
  
  // Add confirmed lead
  const newActiveMember = {
    ...testLead,
    status: 'active',
    confirmationDate: new Date().toISOString(),
    membershipStartDate: new Date().toISOString()
  };
  
  const updatedActiveMembers = [...existingActiveMembers, newActiveMember];
  localStorage.setItem('activeMembers', JSON.stringify(updatedActiveMembers));
  
  console.log('Lead confirmed and added to active members');
  console.log('Updated active members count:', updatedActiveMembers.length);
  console.log('New member:', newActiveMember);
  
  return updatedActiveMembers;
}

// Function to clear test data
function clearTestData() {
  localStorage.removeItem('activeMembers');
  console.log('Test data cleared');
}

// Function to view current active members
function viewActiveMembers() {
  const activeMembers = JSON.parse(localStorage.getItem('activeMembers') || '[]');
  console.log('Current active members:', activeMembers);
  return activeMembers;
}

console.log('Test functions available:');
console.log('- testConfirmLead() - Test lead confirmation');
console.log('- viewActiveMembers() - View current active members');
console.log('- clearTestData() - Clear test data');