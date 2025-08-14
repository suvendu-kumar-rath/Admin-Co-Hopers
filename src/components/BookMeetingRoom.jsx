import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

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
    status: 'Pending'
  }
];

const BookMeetingRoom = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bookings, setBookings] = useState(sampleData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeFormat, setTimeFormat] = useState('12h'); // '12h' or '24h'

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleConfirm = (id) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id ? { ...booking, status: 'Confirmed' } : booking
      )
    );
  };
  
  const handleReject = (id) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === id ? { ...booking, status: 'Rejected' } : booking
      )
    );
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
                    <TableBodyCell>{row.id}</TableBodyCell>
                    <TableBodyCell>{row.userId}</TableBodyCell>
                    <TableBodyCell>{row.userName}</TableBodyCell>
                    <TableBodyCell>{row.bookingType}</TableBodyCell>
                    <TableBodyCell>{row.memberType}</TableBodyCell>
                    <TableBodyCell>{row.date}</TableBodyCell>
                    <TableBodyCell>{row.seatType}</TableBodyCell>
                    <TableBodyCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.slotTiming}
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => openEditDialog(row)}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell>
                      {row.status === 'Pending' ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="success" 
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleConfirm(row.id)}
                          >
                            Confirm
                          </Button>
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="error" 
                            startIcon={<CancelIcon />}
                            onClick={() => handleReject(row.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Chip 
                          label={row.status} 
                          color={row.status === 'Confirmed' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      )}
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

      {/* Edit Slot Timing Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
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
          Edit Time Slot
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                {currentEditBooking?.userName} - {currentEditBooking?.bookingType}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {currentEditBooking?.date} • {currentEditBooking?.seatType}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Time Format
              </Typography>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  value={timeFormat}
                  onChange={handleTimeFormatChange}
                  displayEmpty
                >
                  <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                  <MenuItem value="24h">24-hour</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Start Time
              </Typography>
              <TextField
                type="time"
                fullWidth
                variant="outlined"
                size="small"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{
                  '& input': {
                    padding: '10px 14px',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                End Time
              </Typography>
              <TextField
                type="time"
                fullWidth
                variant="outlined"
                size="small"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{
                  '& input': {
                    padding: '10px 14px',
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeEditDialog} 
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSlotTiming} 
            color="primary" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              bgcolor: '#8EC8D4',
              '&:hover': {
                bgcolor: '#7ab8c4'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default BookMeetingRoom;
