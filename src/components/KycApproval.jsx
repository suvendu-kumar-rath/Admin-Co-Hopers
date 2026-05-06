import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Modal,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import kycApprovalApi from '../api/kycApproval';
import { formatDocumentUrl as formatDocUrl } from '../utils/imagePath';
import { pushNotificationsApi } from '../api';
import { realtimeSyncManager } from '../utils/realtimeSync';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: 80,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    marginTop: 70,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    marginTop: 60,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginTop: theme.spacing(3),
  overflow: 'auto',
  maxHeight: 'calc(100vh - 250px)',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#2563EB',
  '& th': {
    color: 'white',
    fontWeight: 600,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      padding: '8px 4px',
    },
  },
}));

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  maxHeight: '90vh',
  overflow: 'auto',
  backgroundColor: 'white',
  borderRadius: 12,
  boxShadow: 24,
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    padding: theme.spacing(2),
  },
}));

const KycApproval = () => {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Push notification states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  useEffect(() => {
    // Start real-time synchronization for KYC data
    // This ensures all admin devices see updates instantly
    console.log('🔄 Starting real-time KYC sync...');
    
    const unsubscribe = realtimeSyncManager.startPolling(
      'kyc-approval-data',
      fetchKycData,
      5000, // Poll every 5 seconds
      (newData) => {
        // Update data when changes are detected
        if (newData && Array.isArray(newData.data || newData)) {
          const kycArray = Array.isArray(newData) ? newData : (newData.data || []);
          setKycData(kycArray);
          console.log('📱 KYC data synced from server:', kycArray);
        }
      }
    );

    // Fetch data immediately on component mount
    fetchKycData();

    // Subscribe to updates from other devices
    const dataUnsubscribe = realtimeSyncManager.subscribe('kyc-approval-data', (newData) => {
      if (newData) {
        const kycArray = Array.isArray(newData) ? newData : (newData.data || []);
        setKycData(kycArray);
        console.log('✅ Real-time update received from another device');
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      dataUnsubscribe();
      realtimeSyncManager.stopPolling('kyc-approval-data');
    };
  }, []);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kycApprovalApi.fetchPendingKyc();
      
      if (response.success && response.data) {
        const kycArray = Array.isArray(response.data) ? response.data : [];
        setKycData(kycArray);
        return kycArray; // Return data for polling
      } else {
        setKycData([]);
        return [];
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pending KYC submissions');
      setKycData([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleViewKyc = (kyc) => {
    setSelectedKyc(kyc);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedKyc(null);
  };

  const handleOpenRejectModal = (kyc) => {
    setSelectedKyc(kyc);
    setRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedKyc(null);
    setRejectReason('');
  };

  const handleApprove = async (kyc) => {
    // Get the KYC ID from different possible field names
    const kycId = kyc.id || kyc._id || kyc.kycId || kyc.bookingId;
    
    if (!kycId) {
      console.error('No valid KYC ID found:', kyc);
      setError('Invalid KYC ID. Please refresh and try again.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('Approving KYC with ID:', kycId, 'Full KYC object:', kyc);
      const response = await kycApprovalApi.approveKyc(kycId);
      
      console.log('Approve response:', response);
      
      // Update local state immediately to change button to chip
      setKycData(prevData => 
        prevData.map(item => {
          const itemId = item.id || item._id || item.kycId || item.bookingId;
          if (itemId === kycId) {
            return { ...item, status: 'Approved', verification_status: 'approved' };
          }
          return item;
        })
      );
      
      setSuccessMessage('KYC approved successfully ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Trigger update to notify all subscribers (other devices)
      realtimeSyncManager.triggerUpdate('kyc-approval-data', kycData);
      
      // The polling will handle syncing from server automatically
      
    } catch (err) {
      console.error('Approve error:', err);
      setError(err.message || 'Failed to approve KYC');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Get the KYC ID from different possible field names
    const kycId = selectedKyc.id || selectedKyc._id || selectedKyc.kycId || selectedKyc.bookingId;
    
    if (!kycId) {
      console.error('No valid KYC ID found:', selectedKyc);
      setError('Invalid KYC ID. Please refresh and try again.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setActionLoading(true);
      console.log('Rejecting KYC with ID:', kycId, 'Reason:', rejectReason);
      const response = await kycApprovalApi.rejectKyc(kycId, rejectReason);
      
      console.log('Reject response:', response);
      
      // Update local state immediately to change button to chip
      setKycData(prevData => 
        prevData.map(item => {
          const itemId = item.id || item._id || item.kycId || item.bookingId;
          if (itemId === kycId) {
            return { ...item, status: 'Rejected', verification_status: 'rejected' };
          }
          return item;
        })
      );
      
      setSuccessMessage('KYC rejected successfully ❌');
      handleCloseRejectModal();
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Trigger update to notify all subscribers (other devices)
      realtimeSyncManager.triggerUpdate('kyc-approval-data', kycData);
      
      // The polling will handle syncing from server automatically
      
    } catch (err) {
      console.error('Reject error:', err);
      setError(err.message || 'Failed to reject KYC');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  // Use the imported utility function instead of local one
  const formatDocumentUrl = formatDocUrl;
  
  // Push Notification Functions
  const requestNotificationPermission = async () => {
    try {
      if (!('Notification' in window)) {
        setError('This browser does not support notifications');
        setTimeout(() => setError(null), 3000);
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSuccessMessage('Notifications enabled successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        return true;
      } else {
        setError('Notification permission denied');
        setTimeout(() => setError(null), 3000);
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setError('Failed to enable notifications');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const registerPushNotification = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await pushNotificationsApi.registerPushToken({
        token: token,
        deviceType: 'web',
        deviceId: navigator.userAgent,
      });

      await pushNotificationsApi.subscribePushTopic({
        token: token,
        topic: 'all_users',
      });

      setPushToken(token);
      setNotificationsEnabled(true);
      setSubscribedTopics(['kyc-approval-updates']);
      
      setSuccessMessage('✅ Push notifications enabled! You will receive KYC approval updates.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error registering push notification:', error);
      setError('❌ Failed to enable push notifications');
      setTimeout(() => setError(null), 5000);
    }
  };

  const subscribeTopic = async (topic) => {
    try {
      if (!pushToken) {
        setError('Please enable notifications first');
        setTimeout(() => setError(null), 3000);
        return;
      }

      await pushNotificationsApi.subscribePushTopic({
        token: pushToken,
        topic: topic,
      });

      setSubscribedTopics([...subscribedTopics, topic]);
      setSuccessMessage(`Subscribed to ${topic}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      setError(`Failed to subscribe to ${topic}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const unsubscribeTopic = async (topic) => {
    try {
      if (!pushToken) return;

      await pushNotificationsApi.unsubscribePushTopic({
        token: pushToken,
        topic: topic,
      });

      setSubscribedTopics(subscribedTopics.filter(t => t !== topic));
      setSuccessMessage(`Unsubscribed from ${topic}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      setError(`Failed to unsubscribe from ${topic}`);
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Render KYC Details
  const renderKycDetails = () => {
    if (!selectedKyc) return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          KYC Details
        </Typography>
        
        <Grid container spacing={2}>
          {selectedKyc.id && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">KYC ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.id}</Typography>
            </Grid>
          )}
          
          {selectedKyc.userId && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">User ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.userId}</Typography>
            </Grid>
          )}
          
          {selectedKyc.bookingId && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Booking ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.bookingId}</Typography>
            </Grid>
          )}
          
          {selectedKyc.documentType && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Document Type</Typography>
              <Chip label={selectedKyc.documentType} color="primary" size="small" />
            </Grid>
          )}
          
          {/* Prefer user segment for name, email, mobile */}
          {(selectedKyc.user?.username || selectedKyc.name) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.name}</Typography>
            </Grid>
          )}
          
          {(selectedKyc.user?.email || selectedKyc.email) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.email}</Typography>
            </Grid>
          )}
          
          {(selectedKyc.user?.mobile || selectedKyc.mobile) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Mobile</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.mobile}</Typography>
            </Grid>
          )}
          
          {selectedKyc.gstNumber && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">GST Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.gstNumber}</Typography>
            </Grid>
          )}
          
          {selectedKyc.companyName && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Company Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.companyName}</Typography>
            </Grid>
          )}
          
          {selectedKyc.directorName && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">Director Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.directorName}</Typography>
            </Grid>
          )}
          
          {selectedKyc.din && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">DIN</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.din}</Typography>
            </Grid>
          )}
        </Grid>

        {/* Documents Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Documents
          </Typography>
          <Grid container spacing={2}>
            {selectedKyc.idFront && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>ID Front</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.idFront)}
                  alt="ID Front"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.idFront), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.idBack && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>ID Back</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.idBack)}
                  alt="ID Back"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.idBack), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.pan && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>PAN Card</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.pan)}
                  alt="PAN Card"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.pan), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.photo && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Photo</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.photo.startsWith('/') ? selectedKyc.photo : `/uploads/kyc/${selectedKyc.photo}`)}
                  alt="Photo"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.photo.startsWith('/') ? selectedKyc.photo : `/uploads/kyc/${selectedKyc.photo}`), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.paymentScreenshot && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Payment Screenshot</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.paymentScreenshot)}
                  alt="Payment Screenshot"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.paymentScreenshot), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.companyPAN && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Company PAN</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.companyPAN)}
                  alt="Company PAN"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.companyPAN), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.certificateOfIncorporation && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Certificate of Incorporation</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.certificateOfIncorporation)}
                  alt="Certificate of Incorporation"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.certificateOfIncorporation), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.directorPAN && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Director PAN</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.directorPAN)}
                  alt="Director PAN"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.directorPAN), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.directorPhoto && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Director Photo</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.directorPhoto)}
                  alt="Director Photo"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.directorPhoto), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.directorIdFront && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Director ID Front</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.directorIdFront)}
                  alt="Director ID Front"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.directorIdFront), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.directorIdBack && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Director ID Back</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.directorIdBack)}
                  alt="Director ID Back"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.directorIdBack), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.directorPaymentProof && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Director Payment Proof</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.directorPaymentProof)}
                  alt="Director Payment Proof"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.directorPaymentProof), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.gstCertificate && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>GST Certificate</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.gstCertificate)}
                  alt="GST Certificate"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.gstCertificate), '_blank')}
                />
              </Grid>
            )}
            
            {selectedKyc.addressProof && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Address Proof</Typography>
                <Box
                  component="img"
                  src={formatDocumentUrl(selectedKyc.addressProof)}
                  alt="Address Proof"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => window.open(formatDocumentUrl(selectedKyc.addressProof), '_blank')}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        KYC Approval
      </Typography>

      {/* Push Notification Banner */}
      {!notificationsEnabled && (
        <Alert 
          severity="info" 
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={registerPushNotification}
              startIcon={<NotificationsActiveIcon />}
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Enable Notifications
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Enable push notifications for instant KYC approval updates.
          </Typography>
        </Alert>
      )}

      {/* Notification Status Badge */}
      {notificationsEnabled && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: '#ECFDF5', 
            borderRadius: 2,
            border: '1px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActiveIcon sx={{ color: '#059669' }} />
            <Typography variant="body2" sx={{ color: '#065F46', fontWeight: 600 }}>
              Push Notifications Active
            </Typography>
            <Chip 
              label={`${subscribedTopics.length} topic(s)`} 
              size="small" 
              sx={{ backgroundColor: '#10B981', color: 'white', fontWeight: 600, fontSize: '0.7rem' }} 
            />
          </Box>
          <Button 
            size="small" 
            startIcon={<NotificationsOffIcon />}
            onClick={() => {
              setNotificationsEnabled(false);
              setPushToken(null);
              setSubscribedTopics([]);
              setSuccessMessage('🔕 Notifications disabled');
              setTimeout(() => setSuccessMessage(''), 5000);
            }}
            sx={{ 
              color: '#059669',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#D1FAE5' }
            }}
          >
            Disable
          </Button>
        </Box>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {kycData.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No pending KYC submissions
          </Typography>
        </Paper>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell align="center">View KYC</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {kycData.map((kyc, index) => (
                <TableRow key={kyc.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kyc.userId || 'N/A'}</TableCell>
                  <TableCell>{kyc.user?.username || kyc.name || 'N/A'}</TableCell>
                  <TableCell>{kyc.user?.email || kyc.email || 'N/A'}</TableCell>
                  <TableCell>{kyc.user?.mobile || kyc.mobile || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewKyc(kyc)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    {(() => {
                      // Check if KYC has already been processed
                      const status = kyc.status || kyc.verification_status || kyc.kycStatus || 'pending';
                      const isProcessed = status.toLowerCase() === 'approved' || status.toLowerCase() === 'rejected' || status.toLowerCase() === 'approve' || status.toLowerCase() === 'reject';
                      
                      if (isProcessed) {
                        // Show status chip for already processed KYCs
                        const chipColor = (status.toLowerCase() === 'approved' || status.toLowerCase() === 'approve') ? 'success' : 'error';
                        const chipLabel = (status.toLowerCase() === 'approved' || status.toLowerCase() === 'approve') ? 'Approved' : 'Rejected';
                        
                        return (
                          <Chip 
                            label={chipLabel}
                            color={chipColor}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        );
                      } else {
                        // Show approve/reject buttons for pending KYCs
                        return (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleApprove(kyc)}
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleOpenRejectModal(kyc)}
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
                          </Box>
                        );
                      }
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      {/* View KYC Modal */}
      <Modal
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        aria-labelledby="view-kyc-modal"
      >
        <ModalBox>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              KYC Submission Details
            </Typography>
            <IconButton onClick={handleCloseViewModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {renderKycDetails()}
        </ModalBox>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={handleCloseRejectModal}
        aria-labelledby="reject-kyc-modal"
      >
        <ModalBox sx={{ maxWidth: 500 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reject KYC Submission
            </Typography>
            <IconButton onClick={handleCloseRejectModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this KYC submission:
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            variant="outlined"
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCloseRejectModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              startIcon={actionLoading ? <CircularProgress size={20} /> : <CancelIcon />}
            >
              Reject KYC
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </PageContainer>
  );
};

export default KycApproval;
