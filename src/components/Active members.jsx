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
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { membersApi } from '../api';

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
  { id: 'address', label: 'ADDRESS', minWidth: 170 },
  { id: 'spaceType', label: 'SPACE TYPE', minWidth: 100 },
  { id: 'start', label: 'START', minWidth: 80 },
  { id: 'end', label: 'END', minWidth: 80 },
  { id: 'unit', label: 'UNIT', minWidth: 60 },
  { id: 'amount', label: 'AMOUNT', minWidth: 80 },
  { id: 'mail', label: 'MAIL', minWidth: 180 },
  { id: 'details', label: 'DETAILS', minWidth: 60 },
  { id: 'kyc', label: 'KYC DETAILS', minWidth: 80 },
];

const rows = [
  { 
    id: 1, 
    name: 'Ann Culhane', 
    phone: '5684320536', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Private Office', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P1234567',
      dateOfBirth: '1990-05-15',
      nationality: 'American',
      occupation: 'Software Engineer',
      verificationDate: '2024-12-15'
    }
  },
  { 
    id: 2, 
    name: 'Ahmad Rosser', 
    phone: '5684320537', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Shared Desk', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Pending',
      idType: 'Driver License',
      idNumber: 'DL987654',
      dateOfBirth: '1988-03-22',
      nationality: 'Canadian',
      occupation: 'Designer',
      verificationDate: null
    }
  },
  { 
    id: 3, 
    name: 'Zain Calzoni', 
    phone: '5684320538', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Hot Desk', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Verified',
      idType: 'National ID',
      idNumber: 'NID456789',
      dateOfBirth: '1992-11-08',
      nationality: 'British',
      occupation: 'Marketing Manager',
      verificationDate: '2024-12-20'
    }
  },
  { 
    id: 4, 
    name: 'Leo Stanton', 
    phone: '5684320539', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Meeting Room', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Rejected',
      idType: 'Passport',
      idNumber: 'P7654321',
      dateOfBirth: '1985-07-12',
      nationality: 'Australian',
      occupation: 'Consultant',
      verificationDate: null
    }
  },
  { 
    id: 5, 
    name: 'Kalya Vetovas', 
    phone: '5684320540', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Private Office', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Verified',
      idType: 'Driver License',
      idNumber: 'DL123456',
      dateOfBirth: '1993-09-25',
      nationality: 'German',
      occupation: 'Data Analyst',
      verificationDate: '2024-12-18'
    }
  },
  { 
    id: 6, 
    name: 'Ryan Westervet', 
    phone: '5684320541', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Shared Desk', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Pending',
      idType: 'Passport',
      idNumber: 'P9876543',
      dateOfBirth: '1991-12-03',
      nationality: 'French',
      occupation: 'Product Manager',
      verificationDate: null
    }
  },
  { 
    id: 7, 
    name: 'Corey Stanton', 
    phone: '5684320542', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Hot Desk', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Verified',
      idType: 'National ID',
      idNumber: 'NID789123',
      dateOfBirth: '1989-04-17',
      nationality: 'Spanish',
      occupation: 'Web Developer',
      verificationDate: '2024-12-22'
    }
  },
  { 
    id: 8, 
    name: 'Adison Aminoff', 
    phone: '5684320533', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Conference Room', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Pending',
      idType: 'Driver License',
      idNumber: 'DL567890',
      dateOfBirth: '1987-08-30',
      nationality: 'Italian',
      occupation: 'Business Analyst',
      verificationDate: null
    }
  },
  { 
    id: 9, 
    name: 'Alfredo Aminoff', 
    phone: '5684320534', 
    address: 'Lorem ipsum elit. Nulla...', 
    spaceType: 'Private Office', 
    start: '1 JAN 2025', 
    end: '1 JAN 2025', 
    unit: '605', 
    amount: '5158', 
    mail: 'sbdhjbj13@gmail.com',
    kyc: {
      status: 'Verified',
      idType: 'Passport',
      idNumber: 'P5432109',
      dateOfBirth: '1994-01-14',
      nationality: 'Dutch',
      occupation: 'UX Designer',
      verificationDate: '2024-12-25'
    }
  },
];

const ActiveMembers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
        kyc: member.kyc || {
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
      setAllMembers([...rows, ...transformedConfirmedLeads]);
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

  const handleKycDetailsClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMember(null);
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
                      <TableCell sx={{ padding: '16px' }}>{row.address}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.spaceType}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.start}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.end}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.unit}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.amount}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{row.mail}</TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        <VisibilityIcon sx={{ color: '#3B82F6', background: '#E8F0FE', borderRadius: '50%', fontSize: 22, p: '2px' }} />
                      </TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        <IconButton onClick={() => handleKycDetailsClick(row)}>
                          <VisibilityIcon sx={{ color: '#4CAF50', background: '#E8F5E8', borderRadius: '50%', fontSize: 20, p: '2px' }} />
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

      {/* KYC Details Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          {selectedMember && (
            <>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                KYC Details - {selectedMember.name}
              </Typography>
              
              <Box sx={{ mb: 4, p: 3, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Status:
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        px: 2, 
                        py: 0.5, 
                        borderRadius: 2,
                        ...getKycStatusColor(selectedMember.kyc.status),
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      {selectedMember.kyc.status}
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Type:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc.idType}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ID Number:
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedMember.kyc.idNumber}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Date of Birth:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedMember.kyc.dateOfBirth).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Nationality:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.nationality}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Occupation:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.occupation}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ gridColumn: 'span 2' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Date:
                    </Typography>
                    <Typography variant="body1">
                      {selectedMember.kyc.verificationDate 
                        ? new Date(selectedMember.kyc.verificationDate).toLocaleDateString()
                        : 'Not verified yet'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ActiveMembers;
