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
  styled
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
                    <TableBodyCell>{row.slotTiming}</TableBodyCell>
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
    </PageContainer>
  );
};

export default BookMeetingRoom;
