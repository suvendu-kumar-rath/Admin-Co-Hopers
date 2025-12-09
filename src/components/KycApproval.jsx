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
import kycApprovalApi from '../api/kycApproval';

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

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await kycApprovalApi.fetchPendingKyc();
      
      if (response.success && response.data) {
        setKycData(Array.isArray(response.data) ? response.data : []);
      } else {
        setKycData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pending KYC submissions');
      setKycData([]);
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

  const handleApprove = async (kycId) => {
    try {
      setActionLoading(true);
      console.log('Approving KYC with ID:', kycId);
      const response = await kycApprovalApi.approveKyc(kycId);
      
      console.log('Approve response:', response);
      // Check for success in response
      if (response.success || response.message || response) {
        setSuccessMessage('KYC approved successfully');
        fetchKycData(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      }
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

    try {
      setActionLoading(true);
      console.log('Rejecting KYC with ID:', selectedKyc.id, 'Reason:', rejectReason);
      const response = await kycApprovalApi.rejectKyc(selectedKyc.id, rejectReason);
      
      console.log('Reject response:', response);
      // Check for success in response
      if (response.success || response.message || response) {
        setSuccessMessage('KYC rejected successfully');
        handleCloseRejectModal();
        fetchKycData(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Reject error:', err);
      setError(err.message || 'Failed to reject KYC');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDocumentUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.boldtribe.in${path}`;
  };

  const renderKycDetails = () => {
    if (!selectedKyc) return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          KYC Details
        </Typography>
        
        <Grid container spacing={2}>
          {selectedKyc.id && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">KYC ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.id}</Typography>
            </Grid>
          )}
          
          {selectedKyc.userId && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">User ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.userId}</Typography>
            </Grid>
          )}
          
          {selectedKyc.bookingId && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Booking ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.bookingId}</Typography>
            </Grid>
          )}
          
          {selectedKyc.documentType && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Document Type</Typography>
              <Chip label={selectedKyc.documentType} color="primary" size="small" />
            </Grid>
          )}
          
          {selectedKyc.name && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.name}</Typography>
            </Grid>
          )}
          
          {selectedKyc.email && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.email}</Typography>
            </Grid>
          )}
          
          {selectedKyc.mobile && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Mobile</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.mobile}</Typography>
            </Grid>
          )}
          
          {selectedKyc.gstNumber && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">GST Number</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.gstNumber}</Typography>
            </Grid>
          )}
          
          {selectedKyc.companyName && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Company Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.companyName}</Typography>
            </Grid>
          )}
          
          {selectedKyc.directorName && (
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Director Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedKyc.directorName}</Typography>
            </Grid>
          )}
          
          {selectedKyc.din && (
            <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.idFront)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View ID Front
                </Button>
              </Grid>
            )}
            
            {selectedKyc.idBack && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.idBack)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View ID Back
                </Button>
              </Grid>
            )}
            
            {selectedKyc.pan && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.pan)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PAN Card
                </Button>
              </Grid>
            )}
            
            {selectedKyc.photo && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(`/uploads/kyc/${selectedKyc.photo}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Photo
                </Button>
              </Grid>
            )}
            
            {selectedKyc.paymentScreenshot && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.paymentScreenshot)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Payment Screenshot
                </Button>
              </Grid>
            )}
            
            {selectedKyc.companyPAN && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.companyPAN)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Company PAN
                </Button>
              </Grid>
            )}
            
            {selectedKyc.gstCertificate && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.gstCertificate)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View GST Certificate
                </Button>
              </Grid>
            )}
            
            {selectedKyc.addressProof && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  href={formatDocumentUrl(selectedKyc.addressProof)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Address Proof
                </Button>
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
                  <TableCell>{kyc.name || 'N/A'}</TableCell>
                  <TableCell>{kyc.email || 'N/A'}</TableCell>
                  <TableCell>{kyc.mobile || 'N/A'}</TableCell>
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
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(kyc.id)}
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
