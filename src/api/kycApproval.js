import axiosInstance from './axios';

// Fetch all pending KYC submissions
export const fetchPendingKyc = async () => {
  try {
    const response = await axiosInstance.get('/admin/kyc');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending KYC:', error);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response.status === 404) {
        throw new Error('Pending KYC endpoint not found.');
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// Approve KYC
export const approveKyc = async (kycId) => {
  try {
    console.log('🔄 Approving KYC ID:', kycId);
    const payload = { status: 'Approve' };
    console.log('Sending payload:', JSON.stringify(payload));
    
    const response = await axiosInstance.put(`/admin/kyc/${kycId}/verify`, payload);
    
    console.log('✅ KYC approved successfully:', response.data);
    console.log('Response status:', response.status);
    
    // Verify the response contains the updated KYC
    if (!response.data) {
      throw new Error('Server returned empty response');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error approving KYC:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again. Your session may have expired.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response.status === 404) {
        throw new Error('KYC submission not found. It may have been deleted.');
      } else if (error.response.status === 500) {
        throw new Error(`Server error: ${error.response.data?.message || 'Internal server error'}`);
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(`Server error (${error.response.status}): ${error.response.statusText}`);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

// Reject KYC
export const rejectKyc = async (kycId, reason) => {
  try {
    console.log('🔄 Rejecting KYC ID:', kycId, 'Reason:', reason);
    const payload = { status: 'Reject', reason: reason };
    console.log('Sending payload:', JSON.stringify(payload));
    
    const response = await axiosInstance.put(`/admin/kyc/${kycId}/verify`, payload);
    
    console.log('✅ KYC rejected successfully:', response.data);
    console.log('Response status:', response.status);
    
    if (!response.data) {
      throw new Error('Server returned empty response');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error rejecting KYC:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again. Your session may have expired.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response.status === 404) {
        throw new Error('KYC submission not found. It may have been deleted.');
      } else if (error.response.status === 500) {
        throw new Error(`Server error: ${error.response.data?.message || 'Internal server error'}`);
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(`Server error (${error.response.status}): ${error.response.statusText}`);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

const kycApprovalApi = {
  fetchPendingKyc,
  approveKyc,
  rejectKyc,
};

export default kycApprovalApi;
