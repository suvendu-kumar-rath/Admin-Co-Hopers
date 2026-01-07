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
  TablePagination,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Modal,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { membersApi } from '../api';
import axios from 'axios';
import { formatDocumentUrl } from '../utils/imagePath';

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

const StyledPaper = styled(Paper)({
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '600px',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.15)',
  maxHeight: '80vh',
  overflow: 'auto',
});

const columns = [
  { id: 'id', label: 'ID', minWidth: 40 },
  { id: 'name', label: 'NAME', minWidth: 120 },
  { id: 'spaceType', label: 'SPACE TYPE', minWidth: 100 },
  { id: 'start', label: 'START', minWidth: 80 },
  { id: 'end', label: 'END', minWidth: 80 },
  { id: 'unit', label: 'UNIT', minWidth: 60 },
  { id: 'amount', label: 'AMOUNT', minWidth: 80 },
  { id: 'mail', label: 'MAIL', minWidth: 180 },
  { id: 'details', label: 'DETAILS', minWidth: 60 },
  { id: 'kyc', label: 'KYC DETAILS', minWidth: 80 },
  { id: 'notice', label: 'NOTICE', minWidth: 80 },
];

// const rows = [
//   { 
//     id: 1, 
//     name: 'Ann Culhane', 
//     phone: '5684320536', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Private Office', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Verified',
//       idType: 'Passport',
//       idNumber: 'P1234567',
//       dateOfBirth: '1990-05-15',
//       nationality: 'American',
//       occupation: 'Software Engineer',
//       verificationDate: '2024-12-15'
//     }
//   },
//   { 
//     id: 2, 
//     name: 'Ahmad Rosser', 
//     phone: '5684320537', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Shared Desk', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Pending',
//       idType: 'Driver License',
//       idNumber: 'DL987654',
//       dateOfBirth: '1988-03-22',
//       nationality: 'Canadian',
//       occupation: 'Designer',
//       verificationDate: null
//     }
//   },
//   { 
//     id: 3, 
//     name: 'Zain Calzoni', 
//     phone: '5684320538', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Hot Desk', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Verified',
//       idType: 'National ID',
//       idNumber: 'NID456789',
//       dateOfBirth: '1992-11-08',
//       nationality: 'British',
//       occupation: 'Marketing Manager',
//       verificationDate: '2024-12-20'
//     }
//   },
//   { 
//     id: 4, 
//     name: 'Leo Stanton', 
//     phone: '5684320539', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Meeting Room', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Rejected',
//       idType: 'Passport',
//       idNumber: 'P7654321',
//       dateOfBirth: '1985-07-12',
//       nationality: 'Australian',
//       occupation: 'Consultant',
//       verificationDate: null
//     }
//   },
//   { 
//     id: 5, 
//     name: 'Kalya Vetovas', 
//     phone: '5684320540', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Private Office', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Verified',
//       idType: 'Driver License',
//       idNumber: 'DL123456',
//       dateOfBirth: '1993-09-25',
//       nationality: 'German',
//       occupation: 'Data Analyst',
//       verificationDate: '2024-12-18'
//     }
//   },
//   { 
//     id: 6, 
//     name: 'Ryan Westervet', 
//     phone: '5684320541', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Shared Desk', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Pending',
//       idType: 'Passport',
//       idNumber: 'P9876543',
//       dateOfBirth: '1991-12-03',
//       nationality: 'French',
//       occupation: 'Product Manager',
//       verificationDate: null
//     }
//   },
//   { 
//     id: 7, 
//     name: 'Corey Stanton', 
//     phone: '5684320542', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Hot Desk', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Verified',
//       idType: 'National ID',
//       idNumber: 'NID789123',
//       dateOfBirth: '1989-04-17',
//       nationality: 'Spanish',
//       occupation: 'Web Developer',
//       verificationDate: '2024-12-22'
//     }
//   },
//   { 
//     id: 8, 
//     name: 'Adison Aminoff', 
//     phone: '5684320533', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Conference Room', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Pending',
//       idType: 'Driver License',
//       idNumber: 'DL567890',
//       dateOfBirth: '1987-08-30',
//       nationality: 'Italian',
//       occupation: 'Business Analyst',
//       verificationDate: null
//     }
//   },
//   { 
//     id: 9, 
//     name: 'Alfredo Aminoff', 
//     phone: '5684320534', 
//     address: 'Lorem ipsum elit. Nulla...', 
//     spaceType: 'Private Office', 
//     start: '1 JAN 2025', 
//     end: '1 JAN 2025', 
//     unit: '605', 
//     amount: '5158', 
//     mail: 'sbdhjbj13@gmail.com',
//     kyc: {
//       status: 'Verified',
//       idType: 'Passport',
//       idNumber: 'P5432109',
//       dateOfBirth: '1994-01-14',
//       nationality: 'Dutch',
//       occupation: 'UX Designer',
//       verificationDate: '2024-12-25'
//     }
//   },
// ];

const ActiveMembers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [selectedNoticeMember, setSelectedNoticeMember] = useState(null);
  const [noticePdf, setNoticePdf] = useState(null);
  const [noticeRemainingDays, setNoticeRemainingDays] = useState('');
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch active members from API
  const fetchActiveMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await membersApi.fetchActiveMembers();
      console.log('Active members API response:', response);
      
      let apiMembers = [];
      
      // Handle different response formats
      if (response.success && response.data) {
        apiMembers = response.data;
      } else if (Array.isArray(response.data)) {
        apiMembers = response.data;
      } else if (Array.isArray(response)) {
        apiMembers = response;
      }
      
      // Transform API data to match component format
      const transformedMembers = apiMembers.map((member, index) => ({
        id: member.id || index + 1,
        name: member.name || member.username || 'N/A',
        phone: member.phone || member.mobile || 'N/A',
        address: member.address || 'N/A',
        spaceType: member.spaceType || member.space_type || 'N/A',
        start: member.startDate ? new Date(member.startDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase() : 'N/A',
        end: member.endDate ? new Date(member.endDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase() : 'Ongoing',
        unit: member.unit || 'TBD',
        amount: member.amount || member.totalAmount || 'N/A',
        mail: member.email || 'N/A',
        // Store details and kycDetails from API response
        details: member.details || null,
        kycDetails: member.kycDetails || null,
        // Keep original kyc for backward compatibility
        kyc: member.kycDetails || member.kyc || {
          status: member.kycStatus || 'Pending',
          idType: member.idType || 'TBD',
          idNumber: member.idNumber || 'TBD',
          dateOfBirth: member.dateOfBirth || 'TBD',
          nationality: member.nationality || 'TBD',
          occupation: member.occupation || 'TBD',
          verificationDate: member.verificationDate || null
        },
        isFromAPI: true
      }));
      
      // Also load any local confirmed leads as fallback
      const confirmedLeads = JSON.parse(localStorage.getItem('activeMembers') || '[]');
      const transformedConfirmedLeads = confirmedLeads.map((lead, index) => ({
        id: `local_${index}`,
        name: lead.name,
        phone: lead.mobile,
        address: lead.address,
        spaceType: 'Hot Desk',
        start: new Date(lead.confirmationDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase(),
        end: 'Ongoing',
        unit: 'TBD',
        amount: 'TBD',
        mail: lead.email,
        kyc: {
          status: 'Pending',
          idType: 'TBD',
          idNumber: 'TBD',
          dateOfBirth: 'TBD',
          nationality: 'TBD',
          occupation: 'TBD',
          verificationDate: null
        },
        isConfirmedLead: true
      }));
      
      // Combine API data with local leads (if any)
      const allMembersData = [...transformedMembers, ...transformedConfirmedLeads];
      setAllMembers(allMembersData);
      
    } catch (err) {
      console.error('Failed to fetch active members:', err);
      setError(err.message || 'Failed to load active members');
      
      // Fallback to static data and local storage
      const confirmedLeads = JSON.parse(localStorage.getItem('activeMembers') || '[]');
      const transformedConfirmedLeads = confirmedLeads.map((lead, index) => ({
        id: `fallback_${index}`,
        name: lead.name,
        phone: lead.mobile,
        address: lead.address,
        spaceType: 'Hot Desk',
        start: new Date(lead.confirmationDate).toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        }).toUpperCase(),
        end: 'Ongoing',
        unit: 'TBD',
        amount: 'TBD',
        mail: lead.email,
        kyc: {
          status: 'Pending',
          idType: 'TBD',
          idNumber: 'TBD',
          dateOfBirth: 'TBD',
          nationality: 'TBD',
          occupation: 'TBD',
          verificationDate: null
        },
        isConfirmedLead: true
      }));
      
      // Use static rows as fallback + any local leads
      setAllMembers([ ...transformedConfirmedLeads]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMembers();
  }, []);

  // Refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActiveMembers();
    setRefreshing(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((row) => row.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = allMembers.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.mail.toLowerCase().includes(search.toLowerCase())
  );

  const handleDetailsClick = (member) => {
    setSelectedMember(member);
    setDetailsModalOpen(true);
  };

  const handleKycDetailsClick = (member) => {
    setSelectedMember(member);
    setKycModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedMember(null);
  };

  const handleCloseKycModal = () => {
    setKycModalOpen(false);
    setSelectedMember(null);
  };

  const handleNoticeClick = (member) => {
    setSelectedNoticeMember(member);
    setNoticeModalOpen(true);
    setNoticePdf(null);
    setNoticeRemainingDays('');
  };

  const handleCloseNoticeModal = () => {
    setNoticeModalOpen(false);
    setSelectedNoticeMember(null);
    setNoticePdf(null);
    setNoticeRemainingDays('');
  };

  const handlePdfChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNoticePdf(file);
    } else {
      setSnackbar({ open: true, message: 'Please select a valid PDF file', severity: 'error' });
    }
  };

  const handleSubmitNotice = async () => {
    if (!selectedNoticeMember) {
      setSnackbar({ open: true, message: 'No member selected', severity: 'error' });
      return;
    }

    if (!noticePdf) {
      setSnackbar({ open: true, message: 'Please select a PDF file', severity: 'error' });
      return;
    }

    if (!noticeRemainingDays || noticeRemainingDays <= 0) {
      setSnackbar({ open: true, message: 'Please enter valid remaining days', severity: 'error' });
      return;
    }

    setNoticeLoading(true);

    try {
      const formData = new FormData();
      formData.append('notice', noticePdf);
      formData.append('remainingDays', noticeRemainingDays);

      const bookingId = selectedNoticeMember.id;
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `https://api.boldtribe.in/api/admin/booking/${bookingId}/submit-notice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      console.log('Notice submitted successfully:', response.data);
      setSnackbar({ open: true, message: 'Notice submitted successfully!', severity: 'success' });
      handleCloseNoticeModal();
      await handleRefresh();
    } catch (error) {
      console.error('Failed to submit notice:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit notice';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setNoticeLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'Verified': return { bg: '#E8F5E8', color: '#2E7D32' };
      case 'Pending': return { bg: '#FFF3E0', color: '#F57C00' };
      case 'Rejected': return { bg: '#FFEBEE', color: '#D32F2F' };
      default: return { bg: '#F5F5F5', color: '#757575' };
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ mr: 1, bgcolor: '#E6F0F3', borderRadius: 2 }}>
            <FilterListIcon />
          </IconButton>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: 350, bgcolor: '#F8F9FA', borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography sx={{ ml: 2, color: '#A0AEC0', fontWeight: 500 }}>
            Active Members ({filteredRows.length})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ 
              bgcolor: '#E8F5E8', 
              borderRadius: 2,
              '&:hover': { bgcolor: '#C8E6C9' }
            }}
          >
            <RefreshIcon sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
          {error && (
            <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 500 }}>
              API Error - Using cached data
            </Typography>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      <StyledPaper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ padding: '16px' }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                    checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                    onChange={handleSelectAllClick}
                    disabled={loading}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth, fontWeight: 700, color: '#6B7280', background: '#F8F9FA', padding: '16px' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                [...Array(5)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell padding="checkbox" sx={{ padding: '16px' }}>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} sx={{ padding: '16px' }}>
                        <Skeleton variant="text" height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredRows.length === 0 ? (
                // No data message
                <TableRow>
                  <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No active members found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {search ? 'Try adjusting your search criteria' : 'No members data available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // Data rows
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" sx={{ padding: '16px' }}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => handleClick(row.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.id}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
                            <Typography sx={{ fontSize: 12, color: '#A0AEC0' }}>{row.phone}</Typography>
                          </Box>
                          {row.isConfirmedLead && (
                            <Box
                              sx={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                fontSize: '10px',
                                px: 1,
                                py: 0.5,
                                borderRadius: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                              }}
                            >
                              Local
                            </Box>
                          )}
                          {row.isFromAPI && (
                            <Box
                              sx={{
                                backgroundColor: '#2196F3',
                                color: 'white',
                                fontSize: '10px',
                                px: 1,
                                py: 0.5,
                                borderRadius: '12px',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                              }}
                            >
                              API
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.spaceType}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.start}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.end}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.unit}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.amount}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.mail}</TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        <IconButton onClick={() => handleDetailsClick(row)}>
                          <VisibilityIcon sx={{ color: '#3B82F6', background: '#E8F0FE', borderRadius: '50%', fontSize: 22, p: '2px' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        <IconButton onClick={() => handleKycDetailsClick(row)}>
                          <VisibilityIcon sx={{ color: '#4CAF50', background: '#E8F5E8', borderRadius: '50%', fontSize: 20, p: '2px' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        <IconButton onClick={() => handleNoticeClick(row)}>
                          <NotificationsIcon sx={{ color: '#FF9800', background: '#FFF3E0', borderRadius: '50%', fontSize: 20, p: '2px' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {!loading && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </StyledPaper>

      {/* Details Modal */}
      <Modal open={detailsModalOpen} onClose={handleCloseDetailsModal}>
        <ModalContent>
          {selectedMember && selectedMember.details && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                Member Details - {selectedMember.name}
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID:</Typography>
                    <Typography variant="body1">{selectedMember.details.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>User ID:</Typography>
                    <Typography variant="body1">{selectedMember.details.userId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Space ID:</Typography>
                    <Typography variant="body1">{selectedMember.details.spaceId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Booking Date:</Typography>
                    <Typography variant="body1">{selectedMember.details.bookingDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Start Date:</Typography>
                    <Typography variant="body1">{selectedMember.details.startDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>End Date:</Typography>
                    <Typography variant="body1">{selectedMember.details.endDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Amount:</Typography>
                    <Typography variant="body1">₹{selectedMember.details.amount}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Status:</Typography>
                    <Typography variant="body1">{selectedMember.details.status}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCloseDetailsModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Notice Modal */}
      <Modal open={noticeModalOpen} onClose={handleCloseNoticeModal}>
        <ModalContent>
          {selectedNoticeMember && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                Submit Notice - {selectedNoticeMember.name}
              </Typography>
              
              <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2, mb: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Booking ID:
                  </Typography>
                  <Typography variant="body1">{selectedNoticeMember.id}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Member Name:
                  </Typography>
                  <Typography variant="body1">{selectedNoticeMember.name}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Remaining Days"
                    type="number"
                    value={noticeRemainingDays}
                    onChange={(e) => setNoticeRemainingDays(e.target.value)}
                    variant="outlined"
                    inputProps={{ min: 1 }}
                    helperText="Enter the number of remaining days for the notice"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                    Upload Notice PDF:
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    {noticePdf ? noticePdf.name : 'Select PDF File'}
                    <input
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={handlePdfChange}
                    />
                  </Button>
                  {noticePdf && (
                    <Typography variant="caption" color="success.main">
                      File selected: {noticePdf.name} ({(noticePdf.size / 1024).toFixed(2)} KB)
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleCloseNoticeModal}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSubmitNotice}
                  disabled={noticeLoading || !noticePdf || !noticeRemainingDays}
                  startIcon={noticeLoading && <CircularProgress size={20} />}
                >
                  {noticeLoading ? 'Submitting...' : 'Submit Notice'}
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>


      {/* KYC Details Modal */}
      <Modal open={kycModalOpen} onClose={handleCloseKycModal}>
        <ModalContent sx={{ maxWidth: '900px' }}>
          {selectedMember && (selectedMember.kycDetails || selectedMember.kyc) && (() => {
            const kyc = selectedMember.kycDetails || selectedMember.kyc;
            return (
              <>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                  KYC Details{kyc.name ? ` - ${kyc.name}` : ''}
                </Typography>
                <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {kyc.id && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID:</Typography>
                        <Typography variant="body1">{kyc.id}</Typography>
                      </Box>
                    )}
                    {kyc.bookingId && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Booking ID:</Typography>
                        <Typography variant="body1">{kyc.bookingId}</Typography>
                      </Box>
                    )}
                    {kyc.documentType && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Document Type:</Typography>
                        <Typography variant="body1">{kyc.documentType}</Typography>
                      </Box>
                    )}
                    {kyc.name && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Name:</Typography>
                        <Typography variant="body1">{kyc.name}</Typography>
                      </Box>
                    )}
                    {kyc.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Email:</Typography>
                        <Typography variant="body1">{kyc.email}</Typography>
                      </Box>
                    )}
                    {kyc.mobile && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Mobile:</Typography>
                        <Typography variant="body1">{kyc.mobile}</Typography>
                      </Box>
                    )}
                    {kyc.gstNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>GST Number:</Typography>
                        <Typography variant="body1">{kyc.gstNumber}</Typography>
                      </Box>
                    )}
                    {kyc.companyName && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Company Name:</Typography>
                        <Typography variant="body1">{kyc.companyName}</Typography>
                      </Box>
                    )}
                    {kyc.directorName && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director Name:</Typography>
                        <Typography variant="body1">{kyc.directorName}</Typography>
                      </Box>
                    )}
                    {kyc.din && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>DIN:</Typography>
                        <Typography variant="body1">{kyc.din}</Typography>
                      </Box>
                    )}
                    {kyc.idType && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID Type:</Typography>
                        <Typography variant="body1">{kyc.idType}</Typography>
                      </Box>
                    )}
                    {kyc.idNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID Number:</Typography>
                        <Typography variant="body1">{kyc.idNumber}</Typography>
                      </Box>
                    )}
                    {kyc.dateOfBirth && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Date of Birth:</Typography>
                        <Typography variant="body1">{kyc.dateOfBirth}</Typography>
                      </Box>
                    )}
                    {kyc.nationality && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Nationality:</Typography>
                        <Typography variant="body1">{kyc.nationality}</Typography>
                      </Box>
                    )}
                    {kyc.occupation && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Occupation:</Typography>
                        <Typography variant="body1">{kyc.occupation}</Typography>
                      </Box>
                    )}
                    {kyc.verificationDate && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Verification Date:</Typography>
                        <Typography variant="body1">{kyc.verificationDate}</Typography>
                      </Box>
                    )}
                    {/* All document links below */}
                    {kyc.idFront && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID Front:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.idFront)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.idBack && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>ID Back:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.idBack)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.pan && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>PAN:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.pan)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.photo && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Photo:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.photo.startsWith('/') ? kyc.photo : `/uploads/kyc/${kyc.photo}`)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Photo
                        </Box>
                      </Box>
                    )}
                    {kyc.paymentScreenshot && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Payment Screenshot:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.paymentScreenshot)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Screenshot
                        </Box>
                      </Box>
                    )}
                    {kyc.companyPAN && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Company PAN:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.companyPAN)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.certificateOfIncorporation && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Certificate of Incorporation:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.certificateOfIncorporation)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.directorPAN && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director PAN:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.directorPAN)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.directorPhoto && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director Photo:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.directorPhoto)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Photo
                        </Box>
                      </Box>
                    )}
                    {kyc.directorIdFront && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director ID Front:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.directorIdFront)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.directorIdBack && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director ID Back:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.directorIdBack)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                    {kyc.directorPaymentProof && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>Director Payment Proof:</Typography>
                        <Box component="a" href={formatDocumentUrl(kyc.directorPaymentProof)} target="_blank" rel="noopener noreferrer"
                          sx={{ color: '#2196F3', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                          View Document
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={handleCloseKycModal}>
                    Close
                  </Button>
                </Box>
              </>
            );
          })()}
        </ModalContent>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ActiveMembers;
