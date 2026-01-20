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
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  InputAdornment,
  TablePagination,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { bookingsApi } from '../api/bookings';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '12px 16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  minWidth: 80,
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  fontWeight: 'bold',
  ...(status === 'CONFIRMED' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'REJECTED' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }),
  ...(status === 'PENDING' && {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  }),
}));

const Container = styled(Box)(({ theme }) => ({
  padding: '24px',
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    padding: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const DateCell = styled(Box)({
  padding: '6px 12px',
  borderRadius: '8px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: '#F8F9FA',
  color: '#333',
});

const User = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [negotiatedAmountValues, setNegotiatedAmountValues] = useState({});

  // Mock data for space bookings - replace with actual API call
  const mockBookings = [
    {
      id: 1,
      userId: 'USR001',
      username: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '+1234567890',
      spaceName: 'Conference Room A',
      roomNumber: '101',
      cabinNumber: 'C001',
      seater: 8,
      startDate: '2024-01-15',
      endDate: '2024-01-16',
      amount: 2500,
      negotiatedAmount: 2300,
      paymentScreenshot: 'https://via.placeholder.com/300x200?text=Payment+Screenshot+1',
      paymentStatus: 'PENDING'
    },
    {
      id: 2,
      userId: 'USR002',
      username: 'Jane Smith',
      email: 'jane@example.com',
      mobileNumber: '+1234567891',
      spaceName: 'Meeting Room B',
      roomNumber: '102',
      cabinNumber: 'C002',
      seater: 4,
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      amount: 1800,
      negotiatedAmount: 1750,
      paymentScreenshot: 'https://via.placeholder.com/300x200?text=Payment+Screenshot+2',
      paymentStatus: 'CONFIRMED'
    },
    {
      id: 3,
      userId: 'USR003',
      username: 'Mike Johnson',
      email: 'mike@example.com',
      mobileNumber: '+1234567892',
      spaceName: 'Workspace C',
      roomNumber: '103',
      cabinNumber: 'C003',
      seater: 2,
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      amount: 1200,
      negotiatedAmount: 1100,
      paymentScreenshot: 'https://via.placeholder.com/300x200?text=Payment+Screenshot+3',
      paymentStatus: 'REJECTED'
    },
    {
      id: 4,
      userId: 'USR004',
      username: 'Sarah Wilson',
      email: 'sarah@example.com',
      mobileNumber: '+1234567893',
      spaceName: 'Executive Suite',
      roomNumber: '201',
      cabinNumber: 'C004',
      seater: 12,
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      amount: 3500,
      negotiatedAmount: 3300,
      paymentScreenshot: 'https://via.placeholder.com/300x200?text=Payment+Screenshot+4',
      paymentStatus: 'PENDING'
    },
    {
      id: 5,
      userId: 'USR005',
      username: 'David Brown',
      email: 'david@example.com',
      mobileNumber: '+1234567894',
      spaceName: 'Creative Lab',
      roomNumber: '105',
      cabinNumber: 'C005',
      seater: 6,
      startDate: '2024-02-05',
      endDate: '2024-02-06',
      amount: 1900,
      negotiatedAmount: 1850,
      paymentScreenshot: 'https://via.placeholder.com/300x200?text=Payment+Screenshot+5',
      paymentStatus: 'CONFIRMED'
    }
  ];

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize negotiated amount values from bookings
  useEffect(() => {
    const initialValues = {};
    bookings.forEach(booking => {
      initialValues[booking.id] = booking.negotiatedAmount || '';
    });
    setNegotiatedAmountValues(initialValues);
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const response = await bookingsApi.fetchBookings();
        
        // Handle different response structures from your API
        let bookingsData = response.data || response.bookings || response || [];
        
        // Ensure it's an array
        if (!Array.isArray(bookingsData)) {
          bookingsData = [];
        }
        
        console.log('Fetched space bookings data:', bookingsData);
        
        // Merge with localStorage updates (in case API doesn't have latest status)
        const localUpdates = JSON.parse(localStorage.getItem('spaceBookingUpdates') || '{}');
        bookingsData = bookingsData.map(booking => {
          const bookingId = booking.id || booking._id || booking.bookingId;
          if (localUpdates[bookingId]) {
            return { ...booking, ...localUpdates[bookingId] };
          }
          return booking;
        });
        
        setBookings(bookingsData);
        
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError.message);
        
        // Fallback to mock data but apply localStorage updates
        const localUpdates = JSON.parse(localStorage.getItem('spaceBookingUpdates') || '{}');
        const updatedMockData = mockBookings.map(booking => {
          const bookingId = booking.id || booking._id || booking.bookingId;
          if (localUpdates[bookingId]) {
            return { ...booking, ...localUpdates[bookingId] };
          }
          return booking;
        });
        
        setBookings(updatedMockData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch space bookings');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // Get the negotiated amount from the input field
      const inputNegotiatedAmount = negotiatedAmountValues[bookingId];
      const negotiatedAmount = inputNegotiatedAmount ? parseFloat(inputNegotiatedAmount) : null;
      
      // If confirming, check if negotiated amount is set and valid
      if (newStatus === 'Confirm') {
        if (!negotiatedAmount || isNaN(negotiatedAmount) || negotiatedAmount <= 0) {
          setSnackbar({
            open: true,
            message: 'Please enter a valid negotiated amount before confirming',
            severity: 'warning'
          });
          return;
        }
      }
      
      setProcessingBookingId(bookingId);
      
      // Map the status to proper format (CONFIRMED/REJECTED for UI)
      const uiStatus = newStatus === 'Confirm' ? 'CONFIRMED' : 'REJECTED';
      
      // Try to update via API first
      try {
        const response = await bookingsApi.updatePaymentStatus(bookingId, newStatus, negotiatedAmount);
        console.log('API Response:', response);
        
        // Save to localStorage for persistence
        const localUpdates = JSON.parse(localStorage.getItem('spaceBookingUpdates') || '{}');
        localUpdates[bookingId] = {
          paymentStatus: uiStatus,
          status: uiStatus,
          ...(negotiatedAmount && { negotiatedAmount })
        };
        localStorage.setItem('spaceBookingUpdates', JSON.stringify(localUpdates));
        
        // Update local state on success with proper status
        setBookings(prevBookings =>
          prevBookings.map(booking => {
            const id = booking.id || booking._id || booking.bookingId;
            return id == bookingId
              ? { 
                  ...booking, 
                  paymentStatus: uiStatus, 
                  status: uiStatus,
                  ...(negotiatedAmount && { negotiatedAmount })
                }
              : booking;
          })
        );
        
        setSnackbar({
          open: true,
          message: `Space booking ${newStatus.toLowerCase()}ed successfully!`,
          severity: 'success'
        });
        
      } catch (apiError) {
        console.warn('API update failed, updating locally:', apiError.message);
        
        // Save to localStorage for persistence even when API fails
        const localUpdates = JSON.parse(localStorage.getItem('spaceBookingUpdates') || '{}');
        localUpdates[bookingId] = {
          paymentStatus: uiStatus,
          status: uiStatus,
          ...(negotiatedAmount && { negotiatedAmount })
        };
        localStorage.setItem('spaceBookingUpdates', JSON.stringify(localUpdates));
        
        // Fallback to local state update with proper status
        setBookings(prevBookings =>
          prevBookings.map(booking => {
            const id = booking.id || booking._id || booking.bookingId;
            return id == bookingId
              ? { 
                  ...booking, 
                  paymentStatus: uiStatus, 
                  status: uiStatus,
                  ...(negotiatedAmount && { negotiatedAmount })
                }
              : booking;
          })
        );
        
        setSnackbar({
          open: true,
          message: `Space booking ${newStatus.toLowerCase()}ed locally (API unavailable)`,
          severity: 'warning'
        });
      }
      
    } catch (err) {
      console.error('Error updating booking status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update booking status',
        severity: 'error'
      });
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleImageClick = (imageUrl) => {
    console.log('🖼️ Image clicked, raw URL:', imageUrl);
    setImageLoadError(false);
    setImageLoading(true);
    
    // Handle relative URLs by prepending base URL if needed
    let fullImageUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Get base URL and remove /api suffix if present
      let baseURL = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
      console.log('🔧 Original base URL:', baseURL);
      baseURL = baseURL.replace(/\/api$/, ''); // Remove trailing /api
      console.log('🔧 Base URL after removing /api:', baseURL);
      fullImageUrl = imageUrl.startsWith('/') ? `${baseURL}${imageUrl}` : `${baseURL}/${imageUrl}`;
      console.log('✅ Constructed full URL:', fullImageUrl);
    } else {
      console.log('✅ Using URL as-is (already absolute):', fullImageUrl);
    }
    
    setSelectedImage(fullImageUrl);
    setImageDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredBookings = bookings.filter(booking =>
    booking.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.spaceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Space Bookings Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and review all space booking requests
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search by name, email, or space..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          onClick={fetchBookings}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>User Info</StyledTableCell>
                <StyledTableCell>Space Details</StyledTableCell>
                <StyledTableCell>Booking Period</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Negotiated Amount</StyledTableCell>
                <StyledTableCell>Payment Proof</StyledTableCell>
                <StyledTableCell align="center">Status / Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <StyledTableRow key={booking.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {booking.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {booking.username}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {booking.email}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {booking.mobileNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {booking.spaceName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Room: {booking.roomNumber} | Cabin: {booking.cabinNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Capacity: {booking.seater} seats
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        <strong>Start:</strong> {formatDate(booking.startDate)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>End:</strong> {formatDate(booking.endDate)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatCurrency(booking.amount)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={negotiatedAmountValues[booking.id] || ''}
                        onChange={(e) => setNegotiatedAmountValues({
                          ...negotiatedAmountValues,
                          [booking.id]: e.target.value
                        })}
                        placeholder="Enter amount"
                        sx={{ width: 150 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        disabled={booking.paymentStatus === 'CONFIRMED' || booking.paymentStatus === 'REJECTED'}
                      />
                    </TableCell>
                    
                    <TableCell>
                      {booking.paymentScreenshot ? (
                        <Tooltip title="View Payment Screenshot">
                          <IconButton
                            onClick={() => handleImageClick(booking.paymentScreenshot)}
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No image
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {booking.paymentStatus === 'CONFIRMED' ? (
                        <StatusChip
                          label="CONFIRMED"
                          status="CONFIRMED"
                          size="small"
                        />
                      ) : booking.paymentStatus === 'REJECTED' ? (
                        <StatusChip
                          label="REJECTED"
                          status="REJECTED"
                          size="small"
                        />
                      ) : (
                        <Box display="flex" gap={1} justifyContent="center">
                          <ActionButton
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleStatusUpdate(booking.id, 'Confirm')}
                            disabled={processingBookingId === booking.id}
                            startIcon={processingBookingId === booking.id ? 
                              <CircularProgress size={16} /> : <CheckIcon />}
                          >
                            Confirm
                          </ActionButton>
                          <ActionButton
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleStatusUpdate(booking.id, 'Reject')}
                            disabled={processingBookingId === booking.id}
                            startIcon={processingBookingId === booking.id ? 
                              <CircularProgress size={16} /> : <CancelIcon />}
                          >
                            Reject
                          </ActionButton>
                        </Box>
                      )}
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Image Dialog */}
      <Dialog 
        open={imageDialogOpen} 
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Payment Screenshot
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={2} minHeight="300px">
            {imageLoading && !imageLoadError && (
              <CircularProgress />
            )}
            {selectedImage && !imageLoadError && (
              <img
                src={selectedImage}
                alt="Payment Screenshot"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageLoadError(true);
                }}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  display: imageLoading ? 'none' : 'block'
                }}
                crossOrigin="anonymous"
              />
            )}
            {imageLoadError && (
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to load image. The image may be unavailable or the URL is incorrect.
                </Alert>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', mb: 2 }}>
                  URL: {selectedImage}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => window.open(selectedImage, '_blank')}
                >
                  Try Opening in New Tab
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default User; 