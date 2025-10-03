import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e0e0e0',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#f8f9fa',
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#2c3e50',
    borderBottom: '2px solid #e9ecef',
    fontSize: '0.95rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fafafa',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
  transition: 'background-color 0.2s ease',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 0),
}));

const PaymentMethodChip = styled(Chip)(({ method }) => {
  const getColors = () => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return { bgcolor: '#e8f5e8', color: '#2e7d32' };
      case 'card':
        return { bgcolor: '#e3f2fd', color: '#1565c0' };
      case 'cash':
        return { bgcolor: '#fff3e0', color: '#ef6c00' };
      case 'bank transfer':
        return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
      default:
        return { bgcolor: '#f5f5f5', color: '#757575' };
    }
  };

  const colors = getColors();
  return {
    backgroundColor: colors.bgcolor,
    color: colors.color,
    fontWeight: 500,
    '& .MuiChip-label': {
      fontSize: '0.8rem',
    },
  };
});

const Refreshment = () => {
  const [refreshmentData, setRefreshmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Sample data - replace this with API call
  const sampleData = [
    {
      id: 1,
      cabinNumber: 'C001',
      username: 'John Doe',
      roomNumber: 'R101',
      items: 'Coffee, Sandwich, Cookies',
      paymentScreenshot: 'https://via.placeholder.com/100x100?text=Receipt1',
      paymentMethod: 'UPI',
      amount: 350,
      orderDate: '2025-10-01',
      status: 'Completed'
    },
    {
      id: 2,
      cabinNumber: 'C002',
      username: 'Jane Smith',
      roomNumber: 'R102',
      items: 'Tea, Pastry',
      paymentScreenshot: 'https://via.placeholder.com/100x100?text=Receipt2',
      paymentMethod: 'Card',
      amount: 180,
      orderDate: '2025-10-01',
      status: 'Pending'
    },
    {
      id: 3,
      cabinNumber: 'C003',
      username: 'Mike Johnson',
      roomNumber: 'R103',
      items: 'Fresh Juice, Salad, Fruit Bowl',
      paymentScreenshot: 'https://via.placeholder.com/100x100?text=Receipt3',
      paymentMethod: 'Cash',
      amount: 450,
      orderDate: '2025-09-30',
      status: 'Completed'
    },
    {
      id: 4,
      cabinNumber: 'C004',
      username: 'Sarah Wilson',
      roomNumber: 'R104',
      items: 'Cappuccino, Muffin',
      paymentScreenshot: 'https://via.placeholder.com/100x100?text=Receipt4',
      paymentMethod: 'Bank Transfer',
      amount: 220,
      orderDate: '2025-09-30',
      status: 'Completed'
    },
    {
      id: 5,
      cabinNumber: 'C005',
      username: 'Alex Brown',
      roomNumber: 'R105',
      items: 'Smoothie, Bagel, Energy Bar',
      paymentScreenshot: 'https://via.placeholder.com/100x100?text=Receipt5',
      paymentMethod: 'UPI',
      amount: 380,
      orderDate: '2025-09-29',
      status: 'Completed'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setRefreshmentData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    // Filter data based on search term
    const filtered = refreshmentData.filter(item =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cabinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, refreshmentData]);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleViewScreenshot = (screenshotUrl) => {
    window.open(screenshotUrl, '_blank');
    handleMenuClose();
  };

  const handleDownloadScreenshot = (screenshotUrl, username) => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `payment_${username}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const refreshData = () => {
    // Simulate data refresh
    setRefreshmentData([...sampleData]);
    console.log('Refreshment data refreshed');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <HeaderBox>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            mb: 1
          }}>
            Refreshment Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all refreshment orders from members
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search orders..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={refreshData}
              sx={{ 
                bgcolor: '#e3f2fd', 
                color: '#1976d2',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </HeaderBox>

      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Cabin Number</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Payment Screenshot</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((row) => (
              <StyledTableRow key={row.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {row.cabinNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#8EC8D4' }}>
                      {row.username.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={500}>
                      {row.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.roomNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {row.items}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Avatar
                    src={row.paymentScreenshot}
                    alt="Payment Screenshot"
                    variant="rounded"
                    sx={{ width: 40, height: 40, cursor: 'pointer' }}
                    onClick={() => handleViewScreenshot(row.paymentScreenshot)}
                  />
                </TableCell>
                <TableCell>
                  <PaymentMethodChip
                    label={row.paymentMethod}
                    method={row.paymentMethod}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    ₹{row.amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.orderDate}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'Completed' ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuClick(e, row)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewScreenshot(selectedRow?.paymentScreenshot)}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View Screenshot
        </MenuItem>
        <MenuItem onClick={() => handleDownloadScreenshot(selectedRow?.paymentScreenshot, selectedRow?.username)}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download Screenshot
        </MenuItem>
      </Menu>

      {filteredData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No refreshment orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'No orders have been placed yet'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Refreshment;