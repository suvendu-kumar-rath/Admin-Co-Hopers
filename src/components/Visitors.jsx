import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  TablePagination,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import { visitorsApi } from '../api';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const MainContainer = styled(MotionBox)(({ theme }) => ({
  marginLeft: 0,
  padding: '20px 30px',
  backgroundColor: '#F8F9FA',
  minHeight: '100vh',
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0,
  },
  [theme.breakpoints.down('md')]: {
    padding: '16px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
  },
}));

const TableContainer_Styled = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '12px',
  marginTop: '20px',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  overflowX: 'auto',
  [theme.breakpoints.down('md')]: {
    marginTop: '16px',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '14px',
  color: '#6B7280',
  textTransform: 'uppercase',
  borderBottom: '1px solid #E5E7EB',
  padding: '16px 12px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '12px 8px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
    padding: '8px 6px',
  },
}));

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#F9FAFB',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid #F3F4F6',
  },
});

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  color: '#374151',
  padding: '12px',
  borderBottom: 'none',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '8px 6px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
    padding: '6px 4px',
  },
}));

const VisitorImage = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '8px',
  marginRight: '8px',
  [theme.breakpoints.down('md')]: {
    width: 40,
    height: 40,
    marginRight: '6px',
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    marginRight: '4px',
  },
}));

const Visitors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await visitorsApi.fetchVisitors();
      const visitorsList = Array.isArray(response) ? response : (response?.data || []);
      
      setVisitors(visitorsList);
      setSnackbarMessage('Visitors data loaded successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      setSnackbarMessage('Failed to load visitors data');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setVisitors([]);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const paginatedData = visitors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <MainContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 600,
            color: '#1F2937',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          }}
        >
          Active Visitors
        </Typography>
      </Box>

      {/* Table Section */}
      <MotionPaper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TableContainer_Styled>
          <Table sx={{ minWidth: isMobile ? '700px' : 'auto' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>NAME</StyledTableCell>
                <StyledTableCell>EMAIL</StyledTableCell>
                <StyledTableCell>MOBILE</StyledTableCell>
                <StyledTableCell>ID PROOF</StyledTableCell>
                <StyledTableCell>CABIN NUMBER</StyledTableCell>
                <StyledTableCell>ROOM NUMBER</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={`skeleton-${index}`}>
                    <StyledTableBodyCell>
                      <Typography variant="body2">Loading...</Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                  </StyledTableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <StyledTableRow>
                  <StyledTableBodyCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No active visitors found
                    </Typography>
                  </StyledTableBodyCell>
                </StyledTableRow>
              ) : (
                paginatedData.map((visitor, index) => (
                  <StyledTableRow key={visitor.id}>
                    <StyledTableBodyCell>
                      <Typography variant="body2">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Box display="flex" alignItems="center">
                        <VisitorImage
                          src={visitor.idProof || '/default-user.jpg'}
                          alt={visitor.name}
                          sx={{ ml: 0 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {visitor.name}
                        </Typography>
                      </Box>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2">
                        {visitor.email}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2">
                        {visitor.mobile}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: '#2563EB',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          '&:hover': { color: '#1D4ED8' }
                        }}
                        component="a"
                        href={visitor.idProof}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {visitor.cabinNumber || 'N/A'}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {visitor.roomNumber || 'N/A'}
                      </Typography>
                    </StyledTableBodyCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer_Styled>

        {/* Pagination */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={{ xs: 1, sm: 2 }}
          sx={{
            borderTop: '1px solid #E5E7EB',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {`${page * rowsPerPage + 1}-${Math.min(
              (page + 1) * rowsPerPage,
              visitors.length
            )} of ${visitors.length}`}
          </Typography>

          <TablePagination
            component="div"
            count={visitors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiTablePagination-toolbar': {
                minHeight: 'auto',
                paddingLeft: 0,
                paddingRight: 0,
              },
            }}
          />
        </Box>
      </MotionPaper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default Visitors;
