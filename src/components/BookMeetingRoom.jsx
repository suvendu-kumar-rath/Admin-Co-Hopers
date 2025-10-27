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
  TablePagination,
  Button,
  Chip,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Backdrop
} from '@mui/material';
import meetingRoomApi from '../api/meetingroom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#8EC8D4',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  padding: '16px',
  [theme.breakpoints.down('sm')]: {
    padding: '12px 8px',
    fontSize: '0.8rem',
  },
}));

const TableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    padding: '8px',
    fontSize: '0.8rem',
  },
}));

// Sample data for demonstration
const sampleData = [
  {
    id: 1,
    userId: 'USR001',
    userName: 'John Doe',
    bookingType: 'Meeting',
    memberType: 'Premium',
    date: '2023-06-15',
    seatType: 'Conference Room',
    slotTiming: '10:00 AM - 12:00 PM',
    paymentEmail: 'john.doe@example.com',
    status: 'Pending'
  },
  {
    id: 2,
    userId: 'USR002',
    userName: 'Jane Smith',
    bookingType: 'Workspace',
    memberType: 'Standard',
    date: '2023-06-15',
    seatType: 'Desk',
    slotTiming: '01:00 PM - 05:00 PM',
    paymentEmail: 'jane.smith@example.com',
    status: 'Confirmed'
  },
  {
    id: 3,
    userId: 'USR003',
    userName: 'Robert Johnson',
    bookingType: 'Event',
    memberType: 'Premium',
    date: '2023-06-16',
    seatType: 'Auditorium',
    slotTiming: '09:00 AM - 11:00 AM',
    paymentEmail: 'robert.johnson@example.com',
    status: 'Pending'
  },
  {
    id: 4,
    userId: 'USR004',
    userName: 'Emily Davis',
    bookingType: 'Meeting',
    memberType: 'Standard',
    date: '2023-06-16',
    seatType: 'Small Meeting Room',
    slotTiming: '03:00 PM - 04:00 PM',
    paymentEmail: 'emily.davis@example.com',
    status: 'Rejected'
  },
  {
    id: 5,
    userId: 'USR005',
    userName: 'Michael Wilson',
    bookingType: 'Workspace',
    memberType: 'Premium',
    date: '2023-06-17',
    seatType: 'Desk',
    slotTiming: '10:00 AM - 06:00 PM',
    paymentEmail: 'michael.wilson@example.com',
    status: 'Pending'
  }
];

const BookMeetingRoom = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [processingBookingId, setProcessingBookingId] = useState(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await meetingRoomApi.fetchBookings();
      
      // Handle different response structures
      const bookingsData = response.data || response.bookings || response || [];
      
      console.log('Fetched bookings:', bookingsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setSnackbarMessage('Failed to load bookings. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
      // Fallback to sample data for development
      setBookings(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleConfirm = async (id) => {
    try {
      setProcessingBookingId(id);
      console.log('🔄 Confirming booking with ID:', id);
      
      const response = await meetingRoomApi.confirmBooking(id);
      console.log('✅ Confirm API response:', response);
      
      // Update local state - handle different possible ID formats
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          const bookingId = booking.id || booking._id || booking.bookingId;
          return bookingId == id ? { 
            ...booking, 
            status: 'Confirmed',
            // Also update other possible status fields
            booking_status: 'Confirmed',
            verification_status: 'confirmed'
          } : booking;
        })
      );
      
      setSnackbarMessage('Booking confirmed successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('❌ Failed to confirm booking:', error);
      
      // Extract more specific error message
      let errorMessage = 'Failed to confirm booking. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = `Failed to confirm booking: ${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage = `Failed to confirm booking: ${error.response.data.error}`;
      } else if (error.response?.status === 400) {
        errorMessage = 'Bad request - the booking might not exist or has invalid data.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - please check your authentication.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Booking not found - it might have been deleted.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error - please try again later.';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setProcessingBookingId(null);
    }
  };
  
  const handleReject = async (id) => {
    try {
      setProcessingBookingId(id);
      console.log('🔄 Rejecting booking with ID:', id);
      
      const response = await meetingRoomApi.rejectBooking(id);
      console.log('✅ Reject API response:', response);
      
      // Update local state - handle different possible ID formats
      setBookings(prevBookings => 
        prevBookings.map(booking => {
          const bookingId = booking.id || booking._id || booking.bookingId;
          return bookingId == id ? { 
            ...booking, 
            status: 'Rejected',
            // Also update other possible status fields
            booking_status: 'Rejected',
            verification_status: 'rejected'
          } : booking;
        })
      );
      
      setSnackbarMessage('Booking rejected successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('❌ Failed to reject booking:', error);
      
      // Extract more specific error message
      let errorMessage = 'Failed to reject booking. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = `Failed to reject booking: ${error.response.data.message}`;
      } else if (error.response?.data?.error) {
        errorMessage = `Failed to reject booking: ${error.response.data.error}`;
      } else if (error.response?.status === 400) {
        errorMessage = 'Bad request - the booking might not exist or has invalid data.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - please check your authentication.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Booking not found - it might have been deleted.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error - please try again later.';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const parseTimeString = (timeString) => {
    // Parse a time string like "10:00 AM - 12:00 PM" into start and end time strings
    try {
      const [startStr, endStr] = timeString.split(' - ');
      
      // Convert to 24-hour format for the input fields
      const convertTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
        
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };
      
      // Check if already in 24-hour format (no AM/PM)
      const startTime = startStr.includes('AM') || startStr.includes('PM') 
        ? convertTo24Hour(startStr) 
        : startStr;
        
      const endTime = endStr.includes('AM') || endStr.includes('PM') 
        ? convertTo24Hour(endStr) 
        : endStr;
      
      return { startTime, endTime };
    } catch (error) {
      console.error("Error parsing time string:", error);
      return { startTime: '', endTime: '' };
    }
  };

  const formatTimeString = (timeString, format) => {
    if (!timeString) return '';
    
    // Convert from 24-hour format to the desired format
    const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
    
    if (format === '24h') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  const openEditDialog = (booking) => {
    setCurrentEditBooking(booking);
    const { startTime: start, endTime: end } = parseTimeString(booking.slotTiming);
    setStartTime(start);
    setEndTime(end);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEditBooking(null);
    setStartTime('');
    setEndTime('');
  };

  const handleSaveSlotTiming = () => {
    if (currentEditBooking && startTime && endTime) {
      const formattedStartTime = formatTimeString(startTime, timeFormat);
      const formattedEndTime = formatTimeString(endTime, timeFormat);
      const newSlotTiming = `${formattedStartTime} - ${formattedEndTime}`;
      
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === currentEditBooking.id
            ? { ...booking, slotTiming: newSlotTiming }
            : booking
        )
      );
      closeEditDialog();
    }
  };
  
  const handleTimeFormatChange = (event) => {
    setTimeFormat(event.target.value);
  };
  
  const openEmailDialog = (booking) => {
    setEmailRecipient(booking);
    setEmailDialogOpen(true);
  };
  
  const closeEmailDialog = () => {
    setEmailDialogOpen(false);
    setEmailRecipient(null);
  };
  
  const handleSendPaymentEmail = () => {
    // In a real application, this would connect to an email API
    // For demo purposes, we'll just show a success message
    
    if (emailRecipient) {
      // Simulate sending email
      setTimeout(() => {
        setSnackbarMessage(`Payment reminder email sent to ${emailRecipient.userName} at ${emailRecipient.paymentEmail}`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        closeEmailDialog();
        
        // Mark as notified in the bookings data (optional)
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === emailRecipient.id
              ? { ...booking, paymentNotified: true }
              : booking
          )
        );
      }, 1000);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <PageContainer>
      <Typography variant="h5" fontWeight="600" mb={3}>
        Book Meeting Room
      </Typography>
      
      <StyledPaper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>SL</TableHeaderCell>
                <TableHeaderCell>UserID</TableHeaderCell>
                <TableHeaderCell>UserName</TableHeaderCell>
                <TableHeaderCell>Booking Type</TableHeaderCell>
                <TableHeaderCell>Member Type</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Seat Type</TableHeaderCell>
                <TableHeaderCell>Slot Timing</TableHeaderCell>
                <TableHeaderCell>Payment Email</TableHeaderCell>
                <TableHeaderCell>Send Payment Reminder</TableHeaderCell>
                <TableHeaderCell>Confirmation</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  >
                    <TableBodyCell>{row.id || row._id || row.bookingId || 'N/A'}</TableBodyCell>
                    <TableBodyCell>{row.userId || row.user_id || row.customerId || 'N/A'}</TableBodyCell>
                    <TableBodyCell>{row.userName || row.user_name || row.customerName || row.name || 'N/A'}</TableBodyCell>
                    <TableBodyCell>{row.bookingType || row.booking_type || row.type || 'Meeting'}</TableBodyCell>
                    <TableBodyCell>{row.memberType || row.member_type || row.membership || 'Standard'}</TableBodyCell>
                    <TableBodyCell>{row.date || row.booking_date || row.bookingDate || 'N/A'}</TableBodyCell>
                    <TableBodyCell>{row.seatType || row.seat_type || row.roomType || row.spaceType || 'N/A'}</TableBodyCell>
                    <TableBodyCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.slotTiming || row.slot_timing || row.timeSlot || row.timing || 'N/A'}
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell>{row.paymentEmail || row.payment_email || row.email || 'N/A'}</TableBodyCell>
                    <TableBodyCell align="center">
                      <Tooltip title="Send payment reminder email">
                        <IconButton
                          color="primary"
                          onClick={() => openEmailDialog(row)}
                          size="small"
                          sx={{
                            bgcolor: row.paymentNotified ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                            '&:hover': {
                              bgcolor: 'rgba(25, 118, 210, 0.12)',
                            }
                          }}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableBodyCell>
                    <TableBodyCell>
                      {(() => {
                        // Get booking ID in flexible way
                        const bookingId = row.id || row._id || row.bookingId;
                        // Get status in flexible way
                        const currentStatus = row.status || row.booking_status || row.verification_status || 'Pending';
                        
                        if (currentStatus === 'Pending' || currentStatus === 'pending') {
                          return (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="contained" 
                                size="small" 
                                color="success" 
                                startIcon={processingBookingId === bookingId ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                                onClick={() => handleConfirm(bookingId)}
                                disabled={processingBookingId === bookingId}
                              >
                                {processingBookingId === bookingId ? 'Confirming...' : 'Confirm'}
                              </Button>
                              <Button 
                                variant="contained" 
                                size="small" 
                                color="error" 
                                startIcon={processingBookingId === bookingId ? <CircularProgress size={16} color="inherit" /> : <CancelIcon />}
                                onClick={() => handleReject(bookingId)}
                                disabled={processingBookingId === bookingId}
                              >
                                {processingBookingId === bookingId ? 'Rejecting...' : 'Reject'}
                              </Button>
                            </Box>
                          );
                        } else {
                          // Show status chip for confirmed/rejected bookings
                          const chipColor = 
                            currentStatus === 'Confirmed' || currentStatus === 'confirmed' ? 'success' :
                            currentStatus === 'Rejected' || currentStatus === 'rejected' ? 'error' :
                            'default';
                          
                          return (
                            <Chip 
                              label={currentStatus}
                              color={chipColor}
                              variant="outlined"
                              sx={{ fontWeight: 'bold' }}
                            />
                          );
                        }
                      })()}
                    </TableBodyCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>


      {/* Payment Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={closeEmailDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#8EC8D4', 
          color: 'white',
          fontWeight: 600,
          py: 2
        }}>
          Send Payment Reminder
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Are you sure you want to send a payment reminder to:
          </Typography>
          <Box sx={{ mt: 2, mb: 1, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight={500}>
              {emailRecipient?.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {emailRecipient?.paymentEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booking: {emailRecipient?.bookingType} ({emailRecipient?.date})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seat: {emailRecipient?.seatType}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeEmailDialog}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendPaymentEmail}
            color="primary"
            variant="contained"
            startIcon={<EmailIcon />}
            sx={{ 
              borderRadius: 2,
              bgcolor: '#8EC8D4',
              '&:hover': {
                bgcolor: '#7ab8c4'
              }
            }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Loading meeting room bookings...</Typography>
        </Box>
      </Backdrop>

      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default BookMeetingRoom;
