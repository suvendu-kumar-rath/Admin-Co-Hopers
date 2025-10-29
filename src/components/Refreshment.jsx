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
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import refreshmentApi from '../api/refreshment';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    fetchRefreshmentOrders();
  }, []);

  const fetchRefreshmentOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching cafeteria orders...');
      
      // Try to fetch from API first
      try {
        const response = await refreshmentApi.fetchOrders();
        
        // Handle different response structures from your API
        let ordersData = response.data || response.orders || response || [];
        
        // Ensure it's an array
        if (!Array.isArray(ordersData)) {
          ordersData = [];
        }
        
        console.log('📊 Raw API response:', response);
        console.log('📋 Processed orders data:', ordersData);
        
        // Transform API data to match component structure
        const transformedData = ordersData.map(order => ({
          id: order.id || order._id || order.orderId,
          cabinNumber: order.cabinNumber || order.cabin_number || order.spaceNumber || 'N/A',
          username: (order.user && order.user.username) || order.username || order.user_name || order.customerName || order.name || 'N/A',
          roomNumber: order.roomNumber || order.room_number || order.spaceId || 'N/A',
          // Store individual item details for structured display
          itemName: order.itemName || 'N/A',
          quantity: order.quantity || 0,
          orderType: order.orderType || 'N/A',
          specialInstructions: order.specialInstructions || '',
          paymentScreenshot: order.paymentScreenshot || order.payment_screenshot || order.receiptImage || '',
          paymentMethod: order.paymentMethod || order.payment_method || order.paymentType || 'N/A',
          amount: order.amount || order.totalAmount || order.total_amount || order.price || 0,
          orderDate: order.orderDate || order.order_date || order.createdAt || order.created_at || new Date().toISOString().split('T')[0],
          status: order.status || order.orderStatus || order.order_status || 'Pending'
        }));
        
        console.log(`✅ Successfully loaded ${transformedData.length} orders from API`);
        console.log('📸 Sample order data:', transformedData[0]);
        setRefreshmentData(transformedData);
        setFilteredData(transformedData);
        
      } catch (apiError) {
        console.error('❌ API call failed:', apiError);
        console.log('🔄 Falling back to sample data...');
        
        // Fallback to sample data if API is not available
        setRefreshmentData(sampleData);
        setFilteredData(sampleData);
        
        setSnackbar({
          open: true,
          message: 'Using demo data - API not available',
          severity: 'warning'
        });
      }
      
    } catch (err) {
      console.error('💥 Critical error fetching orders:', err);
      setError('Failed to fetch refreshment orders');
      
      // Load sample data as last resort
      console.log('🆘 Loading sample data as last resort...');
      setRefreshmentData(sampleData);
      setFilteredData(sampleData);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter data based on search term with null-safe operations
    const filtered = refreshmentData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.username || '').toLowerCase().includes(searchLower) ||
        (item.cabinNumber || '').toLowerCase().includes(searchLower) ||
        (item.roomNumber || '').toLowerCase().includes(searchLower) ||
        (item.items || '').toLowerCase().includes(searchLower) ||
        (item.paymentMethod || '').toLowerCase().includes(searchLower) ||
        (item.status || '').toLowerCase().includes(searchLower)
      );
    });
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
    console.log('🔄 Refreshing refreshment data...');
    fetchRefreshmentOrders();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading refreshment orders...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchRefreshmentOrders}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Debug Info: Orders Array Length: {refreshmentData.length} | Loading: {loading.toString()} | Error: {error || 'None'}
          </Typography>
        </Box>
      )}
      
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
              <TableCell>Item</TableCell>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                        Item:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{ 
                          maxWidth: 180, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {row.itemName || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                        Qty:
                      </Typography>
                      <Chip 
                        label={row.quantity || 0} 
                        size="small" 
                        sx={{ height: 20, bgcolor: '#e8f5e9', color: '#2e7d32' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                        Type:
                      </Typography>
                      <Chip 
                        label={row.orderType || 'N/A'} 
                        size="small" 
                        sx={{ height: 20, bgcolor: '#e3f2fd', color: '#1565c0' }}
                      />
                    </Box>
                    {row.specialInstructions && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                          Notes:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            maxWidth: 150, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontStyle: 'italic',
                            color: '#757575'
                          }}
                          title={row.specialInstructions}
                        >
                          {row.specialInstructions}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {row.paymentScreenshot ? (
                    <Tooltip title="Click to view payment screenshot">
                      <Avatar
                        src={row.paymentScreenshot}
                        alt="Payment Screenshot"
                        variant="rounded"
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          cursor: 'pointer',
                          bgcolor: '#e3f2fd',
                          '&:hover': { opacity: 0.8 }
                        }}
                        onClick={() => handleViewScreenshot(row.paymentScreenshot)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="No payment screenshot">
                      <Avatar
                        alt="No Screenshot"
                        variant="rounded"
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: '#f5f5f5',
                          color: '#9e9e9e'
                        }}
                      >
                        N/A
                      </Avatar>
                    </Tooltip>
                  )}
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

      {filteredData.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No refreshment orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'No orders have been placed yet'}
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Refreshment;