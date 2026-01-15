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

const BookedSpaceDetails = () => {
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

  // Mock data for demonstration - replace with actual API call
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
      negotiatedAmount: 2200,
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
      negotiatedAmount: 1650,
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
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

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
        setBookings(bookingsData);
        
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError.message);
        // Fallback to mock data if API is not available
        setBookings(mockBookings);
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
      setProcessingBookingId(bookingId);
      
      // Try to update via API first
      try {
        const response = await bookingsApi.updatePaymentStatus(bookingId, newStatus);
        console.log('API Response:', response);
        
        // Update local state on success
        setBookings(prevBookings =>
          prevBookings.map(booking => {
            const id = booking.id || booking._id || booking.bookingId;
            return id == bookingId
              ? { ...booking, paymentStatus: newStatus, status: newStatus }
              : booking;
          })
        );
        
        setSnackbar({
          open: true,
          message: `Space booking ${newStatus.toLowerCase()} successfully!`,
          severity: 'success'
        });
      } catch (apiError) {
        console.warn('API call failed, updating locally only:', apiError.message);
        
        // Fallback: update locally only
        setBookings(prevBookings =>
          prevBookings.map(booking => {
            const id = booking.id || booking._id || booking.bookingId;
            return id == bookingId
              ? { ...booking, paymentStatus: newStatus, status: newStatus }
              : booking;
          })
        );
        
        setSnackbar({
          open: true,
          message: `Space booking ${newStatus.toLowerCase()} locally (API unavailable)`,
          severity: 'warning'
        });
      }
      
      setProcessingBookingId(null);
    } catch (err) {
      console.error('Error updating space booking status:', err);
      setProcessingBookingId(null);
      setSnackbar({
        open: true,
        message: 'Failed to update space booking status',
        severity: 'error'
      });
    }
  };

  const handleViewImage = (imageUrl) => {
    setImageLoadError(false);
    setImageLoading(true);
    
    // Handle relative URLs by prepending base URL if needed
    let fullImageUrl = imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Get base URL and remove /api suffix if present
      let baseURL = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
      baseURL = baseURL.replace(/\/api$/, ''); // Remove trailing /api
      fullImageUrl = imageUrl.startsWith('/') ? `${baseURL}${imageUrl}` : `${baseURL}/${imageUrl}`;
    }
    
    setSelectedImage(fullImageUrl);
    setImageDialogOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const username = booking.username || booking.user_name || booking.customerName || booking.name || '';
    const email = booking.email || booking.user_email || booking.customerEmail || '';
    const spaceName = booking.spaceName || booking.space_name || booking.roomName || '';
    const userId = booking.userId || booking.user_id || booking.customerId || '';
    
    return username.toLowerCase().includes(searchLower) ||
           email.toLowerCase().includes(searchLower) ||
           spaceName.toLowerCase().includes(searchLower) ||
           userId.toString().toLowerCase().includes(searchLower);
  });

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', mb: 3 }}>
        Booked Space Details
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by username, email, space name, or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Total Bookings
          </Typography>
          <Typography variant="h4">
            {bookings.length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            Confirmed
          </Typography>
          <Typography variant="h4">
            {bookings.filter(b => {
              const status = b.paymentStatus || b.payment_status || b.status || '';
              return status === 'CONFIRMED';
            }).length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">
            Pending
          </Typography>
          <Typography variant="h4">
            {bookings.filter(b => {
              const status = b.paymentStatus || b.payment_status || b.status || '';
              return status === 'PENDING';
            }).length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h6" color="error.main">
            Rejected
          </Typography>
          <Typography variant="h4">
            {bookings.filter(b => {
              const status = b.paymentStatus || b.payment_status || b.status || '';
              return status === 'REJECTED';
            }).length}
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>User ID</StyledTableCell>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Contact</StyledTableCell>
              <StyledTableCell>Space Details</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Negotiated Amount</StyledTableCell>
              <StyledTableCell>Payment</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => {
              // Handle different ID fields from API
              const bookingId = booking.id || booking._id || booking.bookingId;
              const userId = booking.userId || booking.user_id || booking.customerId || 'N/A';
              const username = booking.username || booking.user_name || booking.customerName || booking.name || 'Unknown User';
              const email = booking.email || booking.user_email || booking.customerEmail || 'N/A';
              const mobile = booking.mobileNumber || booking.mobile_number || booking.phone || booking.phoneNumber || 'N/A';
              const spaceName = booking.spaceName || booking.space_name || booking.roomName || 'N/A';
              const roomNumber = booking.roomNumber || booking.room_number || 'N/A';
              const cabinNumber = booking.cabinNumber || booking.cabin_number || 'N/A';
              const seater = booking.seater || booking.seats || booking.capacity || 'N/A';
              const startDate = booking.startDate || booking.start_date || booking.checkIn || booking.from_date;
              const endDate = booking.endDate || booking.end_date || booking.checkOut || booking.to_date;
              const amount = booking.amount || booking.price || booking.total || booking.cost || 0;
              const negotiatedAmount = booking.negotiatedAmount || booking.negotiated_amount || booking.finalAmount || booking.final_amount || 0;
              const paymentScreenshot = booking.paymentScreenshot || booking.payment_screenshot || booking.paymentProof;
              const paymentStatus = booking.paymentStatus || booking.payment_status || booking.status || 'PENDING';
              
              return (
                <StyledTableRow key={bookingId}>
                  <TableCell>{userId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {username.charAt(0).toUpperCase()}
                      </Avatar>
                      {username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{mobile}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {spaceName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Room: {roomNumber} | Cabin: {cabinNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Seats: {seater}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        From: {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        To: {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      ₹{Number(amount).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="secondary.main">
                      {negotiatedAmount > 0 ? `₹${Number(negotiatedAmount).toLocaleString()}` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {paymentScreenshot ? (
                      <Tooltip title="View Payment Screenshot">
                        <IconButton
                          onClick={() => handleViewImage(paymentScreenshot)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No screenshot
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={paymentStatus}
                      status={paymentStatus}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {paymentStatus === 'PENDING' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <ActionButton
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={processingBookingId === bookingId ? <CircularProgress size={16} /> : <CheckIcon />}
                          onClick={() => handleStatusUpdate(bookingId, 'CONFIRMED')}
                          disabled={processingBookingId === bookingId}
                        >
                          Confirm
                        </ActionButton>
                        <ActionButton
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={processingBookingId === bookingId ? <CircularProgress size={16} /> : <CancelIcon />}
                          onClick={() => handleStatusUpdate(bookingId, 'REJECTED')}
                          disabled={processingBookingId === bookingId}
                        >
                          Reject
                        </ActionButton>
                      </Box>
                    )}
                    {paymentStatus !== 'PENDING' && (
                      <Typography variant="body2" color="text.secondary">
                        No actions available
                      </Typography>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Payment Screenshot</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', p: 2, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  display: imageLoading ? 'none' : 'block'
                }}
                crossOrigin="anonymous"
              />
            )}
            {imageLoadError && (
              <Box sx={{ textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to load image. The image may be unavailable or the URL is incorrect.
                </Alert>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  URL: {selectedImage}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => window.open(selectedImage, '_blank')}
                >
                  Try Opening in New Tab
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookedSpaceDetails;