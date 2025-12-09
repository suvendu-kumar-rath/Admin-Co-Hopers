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
    const response = await axiosInstance.put(`/admin/kyc/${kycId}/verify`, {
      status: 'Approve'
    });
    console.log('✅ KYC approved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error approving KYC:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response.status === 404) {
        throw new Error('KYC submission not found.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

// Reject KYC
export const rejectKyc = async (kycId, reason) => {
  try {
    console.log('🔄 Rejecting KYC ID:', kycId, 'Reason:', reason);
    const response = await axiosInstance.put(`/admin/kyc/${kycId}/verify`, {
      status: 'Reject',
      reason: reason
    });
    console.log('✅ KYC rejected successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error rejecting KYC:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Admin rights required.');
      } else if (error.response.status === 404) {
        throw new Error('KYC submission not found.');
      } else if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
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
