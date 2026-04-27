import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { utilitiesApi } from '../api';

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

const StatusChip = styled(Chip)(({ status, theme }) => ({
  fontWeight: 'bold',
  ...(status === 'Confirmed' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  }),
  ...(status === 'Rejected' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }),
  ...(status === 'Pending' && {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  }),
}));

const Utilities = () => {
  const handlePaymentStatusToggle = (orderId, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Not Paid' : 'Paid';
    const localUpdates = JSON.parse(localStorage.getItem('utilitiesOrderUpdates') || '{}');
    localUpdates[orderId] = { ...localUpdates[orderId], paymentStatus: newStatus, paymentStatusManuallySet: true };
    localStorage.setItem('utilitiesOrderUpdates', JSON.stringify(localUpdates));
    setUtilitiesData(prevData =>
      prevData.map(order => {
        const id = order.id || order._id || order.orderId;
        return id == orderId ? { ...order, paymentStatus: newStatus } : order;
      })
    );
    setFilteredData(prevData =>
      prevData.map(order => {
        const id = order.id || order._id || order.orderId;
        return id == orderId ? { ...order, paymentStatus: newStatus } : order;
      })
    );
    setSnackbar({
      open: true,
      message: `Payment status updated to ${newStatus}`,
      severity: 'success'
    });
  };

  const [utilitiesData, setUtilitiesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('Image');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const fetchUtilitiesOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await utilitiesApi.fetchOrders();

      let ordersData = response;
      if (response && !Array.isArray(response)) {
        ordersData = response.data || response.orders || [];
      }
      if (!Array.isArray(ordersData)) {
        console.warn('⚠️ ordersData is not an array:', typeof ordersData, ordersData);
        ordersData = [];
      }

      const transformedData = ordersData.map(order => ({
        id: order.id || order._id || order.orderId,
        cabinNumber: order.cabinNumber || order.cabin_number || (order.space && order.space.cabinNumber) || order.spaceNumber || '',
        username: (order.user && order.user.username) || order.username || order.user_name || order.customerName || order.name || 'N/A',
        userEmail: (order.user && order.user.email) || order.email || '',
        userMobile: (order.user && order.user.mobile) || order.mobile || '',
        roomNumber: order.roomNumber || order.room_number || (order.space && order.space.roomNumber) || order.spaceId || '',
        itemName: (order.utility && order.utility.name) || order.itemName || order.utilityName || 'N/A',
        utilityCategory: (order.utility && order.utility.category) || '',
        quantity: order.quantity || 0,
        printType: order.printType || order.orderType || order.type || 'N/A',
        colorMode: order.colorMode || '',
        paperSize: order.paperSize || '',
        orientation: order.orientation || '',
        doubleSided: order.doubleSided || false,
        specialInstructions: order.specialInstructions || order.notes || '',
        paymentScreenshot: order.paymentScreenshot || order.payment_screenshot || order.receiptImage || '',
        printFile: order.printFile || '',
        utrNumber: order.utrNumber || '',
        paymentStatus: order.paid || order.paymentStatus || '',
        amount: order.amount || order.totalAmount || order.total_amount || order.price || 0,
        orderDate: order.orderDate || order.order_date || order.createdAt || order.created_at || new Date().toISOString().split('T')[0],
        status: order.status || order.orderStatus || 'Pending',
        isPersonal: order.isPersonal || false,
        companyName: order.isPersonal && order.kyc?.companyName ? order.kyc.companyName : (order.companyName || null)
      }));

      // Merge with localStorage overrides (for payment status toggles)
      const localUpdates = JSON.parse(localStorage.getItem('utilitiesOrderUpdates') || '{}');
      const finalData = transformedData.map(order => {
        const orderId = order.id;
        if (localUpdates[orderId]) {
          // Only apply override if admin manually toggled; don't override API-supplied paid status
          const overrides = { ...localUpdates[orderId] };
          if (!overrides.paymentStatusManuallySet) delete overrides.paymentStatus;
          return { ...order, ...overrides };
        }
        return order;
      });

      setUtilitiesData(finalData);
      setFilteredData(finalData);
      setLastRefreshTime(new Date());
    } catch (err) {
      console.error('❌ Error fetching utilities orders:', err);
      setError('Failed to fetch utilities orders. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilitiesOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filtered = utilitiesData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || (
        String(item.username || '').toLowerCase().includes(searchLower) ||
        String(item.cabinNumber || '').toLowerCase().includes(searchLower) ||
        String(item.roomNumber || '').toLowerCase().includes(searchLower) ||
        String(item.itemName || '').toLowerCase().includes(searchLower) ||
        String(item.utilityCategory || '').toLowerCase().includes(searchLower) ||
        String(item.utrNumber || '').toLowerCase().includes(searchLower) ||
        String(item.status || '').toLowerCase().includes(searchLower) ||
        String(item.companyName || '').toLowerCase().includes(searchLower)
      );

      let matchesDateRange = true;
      if (dateFrom || dateTo) {
        const orderDate = new Date(item.orderDate);
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          matchesDateRange = matchesDateRange && orderDate >= fromDate;
        }
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && orderDate <= toDate;
        }
      }

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesDateRange && matchesStatus;
    });
    setFilteredData(filtered);

    const grouped = {};
    filtered.forEach(order => {
      const key = order.username || 'Unknown User';
      if (!grouped[key]) {
        grouped[key] = {
          userInfo: {
            username: key,
            cabinNumber: order.cabinNumber && order.cabinNumber !== 'N/A' ? order.cabinNumber : '',
            roomNumber: order.roomNumber && order.roomNumber !== 'N/A' ? order.roomNumber : '',
            companyName: order.companyName || null
          },
          orders: []
        };
      }
      if (!grouped[key].userInfo.cabinNumber && order.cabinNumber && order.cabinNumber !== 'N/A') {
        grouped[key].userInfo.cabinNumber = order.cabinNumber;
      }
      if (!grouped[key].userInfo.roomNumber && order.roomNumber && order.roomNumber !== 'N/A') {
        grouped[key].userInfo.roomNumber = order.roomNumber;
      }
      if (!grouped[key].userInfo.companyName && order.companyName) {
        grouped[key].userInfo.companyName = order.companyName;
      }
      grouped[key].orders.push(order);
    });

    Object.keys(grouped).forEach(username => {
      grouped[username].orders.sort((a, b) => {
        const dateA = new Date(a.orderDate || 0);
        const dateB = new Date(b.orderDate || 0);
        return dateB - dateA;
      });
    });

    setGroupedData(grouped);
  }, [searchTerm, utilitiesData, dateFrom, dateTo, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('All');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setProcessingOrderId(orderId);

      try {
        await utilitiesApi.updateOrderStatus(orderId, newStatus);
      } catch (apiError) {
        console.warn('API status update failed, updating locally:', apiError.message);
      }

      // Persist locally regardless of API result
      const localUpdates = JSON.parse(localStorage.getItem('utilitiesOrderUpdates') || '{}');
      localUpdates[orderId] = { ...localUpdates[orderId], status: newStatus };
      localStorage.setItem('utilitiesOrderUpdates', JSON.stringify(localUpdates));

      setUtilitiesData(prevData =>
        prevData.map(order => {
          const id = order.id || order._id || order.orderId;
          return id == orderId ? { ...order, status: newStatus } : order;
        })
      );
      setSnackbar({
        open: true,
        message: `Order ${newStatus.toLowerCase()} successfully!`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update order status',
        severity: 'error'
      });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const resolveFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    let baseURL = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
    baseURL = baseURL.replace(/\/api$/, '');
    return url.startsWith('/') ? `${baseURL}${url}` : `${baseURL}/${url}`;
  };

  const handleViewScreenshot = (screenshotUrl, event, title = 'Image') => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (screenshotUrl && screenshotUrl.trim() !== '') {
      setImageError(false);
      setImageLoading(true);
      setSelectedImage(resolveFileUrl(screenshotUrl));
      setSelectedImageTitle(title);
      setImageDialogOpen(true);
      setTimeout(() => handleMenuClose(), 100);
    } else {
      setSnackbar({
        open: true,
        message: 'No file URL available',
        severity: 'warning'
      });
    }
  };

  const handleDownloadScreenshot = async (screenshotUrl, username) => {
    handleMenuClose();
    await handleDownloadFile(screenshotUrl, `payment_${username}_${Date.now()}.jpg`);
  };

  const handleDownloadFile = async (fileUrl, filename) => {
    const fullUrl = resolveFileUrl(fileUrl);
    const name = filename || `file_${Date.now()}`;
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const refreshData = () => {
    fetchUtilitiesOrders();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleExportExcel = () => {
    const exportData = filteredData.map(order => ({
      'Order ID': order.id,
      'Username': order.username,
      'Cabin Number': order.cabinNumber,
      'Room Number': order.roomNumber,
      'Company Name': order.companyName || '',
      'Personal': order.isPersonal ? 'Yes' : 'No',
      'Item Name': order.itemName,
      'Quantity': order.quantity,
      'Order Type': order.orderType,
      'Special Instructions': order.specialInstructions,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus || 'Not Paid',
      'Amount': order.amount,
      'Order Date': order.orderDate,
      'Status': order.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilities Orders');
    XLSX.writeFile(workbook, 'utilities_orders.xlsx');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading utilities orders...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchUtilitiesOrders}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <HeaderBox>
        <Box>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: 700,
            color: '#2c3e50',
            mb: 1
          }}>
            Utilities Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all utility orders from members
          </Typography>
          {lastRefreshTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastRefreshTime.toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Export to Excel">
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportExcel}
              sx={{ fontWeight: 600 }}
            >
              Export
            </Button>
          </Tooltip>
          <Tooltip title={showFilters ? 'Hide Filters' : 'Show Filters'}>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                bgcolor: showFilters ? '#bbdefb' : '#e3f2fd',
                color: '#1976d2',
                '&:hover': { bgcolor: '#bbdefb' }
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
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

      {/* Filter Section */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Filter Orders
            </Typography>
            <Button
              startIcon={<ClearIcon />}
              onClick={handleResetFilters}
              size="small"
              sx={{ color: '#757575' }}
            >
              Clear All
            </Button>
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2
          }}>
            <TextField
              label="Username / Company"
              placeholder="Search by name..."
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
              fullWidth
            />
            <TextField
              label="From Date"
              type="date"
              variant="outlined"
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="To Date"
              type="date"
              variant="outlined"
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Status"
              select
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </TextField>
          </Box>

          {(searchTerm || dateFrom || dateTo || statusFilter !== 'All') && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: '#757575', alignSelf: 'center' }}>
                Active Filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Name: ${searchTerm}`}
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {dateFrom && (
                <Chip
                  label={`From: ${dateFrom}`}
                  size="small"
                  onDelete={() => setDateFrom('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {dateTo && (
                <Chip
                  label={`To: ${dateTo}`}
                  size="small"
                  onDelete={() => setDateTo('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {statusFilter !== 'All' && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  size="small"
                  onDelete={() => setStatusFilter('All')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* Grouped orders by user */}
      {Object.keys(groupedData).length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No utilities orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'No orders have been placed yet'}
          </Typography>
        </Box>
      ) : (
        Object.entries(groupedData).map(([username, userData]) => (
          <Box key={username} sx={{ mb: 4 }}>
            {/* User Header */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#8EC8D4', width: 48, height: 48, fontSize: '1.25rem' }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700} color="#2c3e50">
                    {username}
                  </Typography>
                  {userData.userInfo.companyName && (
                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                      Company: {userData.userInfo.companyName}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Cabin: {userData.userInfo.cabinNumber || 'N/A'} | Room: {userData.userInfo.roomNumber || 'N/A'}
                  </Typography>
                </Box>
                <Chip
                  label={`${userData.orders.length} Order${userData.orders.length > 1 ? 's' : ''}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Paper>

            {/* Orders Table */}
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Item Details</TableCell>
                    <TableCell>Print File</TableCell>
                    <TableCell>Payment Screenshot</TableCell>
                    <TableCell>UTR / Payment</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell align="center">Status / Actions</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {userData.orders.map((row) => (
                    <StyledTableRow key={row.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          #{row.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {row.isPersonal && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Personal:
                              </Typography>
                              <Chip label="Yes" size="small" color="primary" sx={{ height: 20 }} />
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                              Utility:
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
                              title={row.itemName}
                            >
                              {row.itemName || 'N/A'}
                            </Typography>
                          </Box>
                          {row.utilityCategory && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Category:
                              </Typography>
                              <Chip
                                label={row.utilityCategory}
                                size="small"
                                sx={{ height: 20, bgcolor: '#ede7f6', color: '#512da8' }}
                              />
                            </Box>
                          )}
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
                          {row.printType && row.printType !== 'N/A' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Print Type:
                              </Typography>
                              <Chip
                                label={row.printType}
                                size="small"
                                sx={{ height: 20, bgcolor: '#e3f2fd', color: '#1565c0' }}
                              />
                            </Box>
                          )}
                          {row.colorMode && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Color:
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.colorMode}
                              </Typography>
                            </Box>
                          )}
                          {row.paperSize && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Paper:
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.paperSize}{row.orientation ? ` · ${row.orientation}` : ''}
                              </Typography>
                            </Box>
                          )}
                          {typeof row.doubleSided === 'boolean' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                                Double Sided:
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.doubleSided ? 'Yes' : 'No'}
                              </Typography>
                            </Box>
                          )}
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
                      {/* Print File column */}
                      <TableCell>
                        {row.printFile ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title="View print file">
                              <IconButton
                                onClick={(e) => handleViewScreenshot(row.printFile, e, 'Print File')}
                                sx={{ p: 0 }}
                              >
                                <Avatar
                                  src={resolveFileUrl(row.printFile)}
                                  alt="Print File"
                                  variant="rounded"
                                  sx={{ width: 50, height: 50, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download print file">
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadFile(row.printFile, `print_file_${row.id}`)}
                                sx={{ color: '#1976d2' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">N/A</Typography>
                        )}
                      </TableCell>
                      {/* Payment Screenshot column */}
                      <TableCell>
                        {row.paymentScreenshot ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title="Click to view payment screenshot">
                              <IconButton
                                onClick={(e) => handleViewScreenshot(row.paymentScreenshot, e, 'Payment Screenshot')}
                                sx={{ p: 0 }}
                              >
                                <Avatar
                                  src={resolveFileUrl(row.paymentScreenshot)}
                                  alt="Payment Screenshot"
                                  variant="rounded"
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.8 }
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download payment screenshot">
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadFile(row.paymentScreenshot, `payment_screenshot_${row.id}.jpg`)}
                                sx={{ color: '#1976d2' }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title="No payment screenshot">
                            <Avatar
                              alt="No Screenshot"
                              variant="rounded"
                              sx={{ width: 50, height: 50, bgcolor: '#f5f5f5', color: '#9e9e9e' }}
                            >
                              N/A
                            </Avatar>
                          </Tooltip>
                        )}
                      </TableCell>
                      {/* UTR / Payment Status column */}
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {row.utrNumber && (
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#555' }}>
                              UTR: <span style={{ color: '#1976d2' }}>{row.utrNumber}</span>
                            </Typography>
                          )}
                          <Button
                            variant="contained"
                            color={row.paymentStatus === 'Paid' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                            onClick={() => handlePaymentStatusToggle(row.id, row.paymentStatus)}
                          >
                            {row.paymentStatus === 'Paid' ? 'Paid' : row.paymentStatus || 'Pending'}
                          </Button>
                        </Box>
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
                      <TableCell align="center">
                        <TextField
                          select
                          variant="outlined"
                          size="small"
                          value={row.status}
                          onChange={e => handleStatusUpdate(row.id, e.target.value)}
                          sx={{ minWidth: 120, fontWeight: 600 }}
                        >
                          <MenuItem value="Confirmed">Accept</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Rejected">Reject</MenuItem>
                        </TextField>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Box>
        ))
      )}

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

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => {
          setImageDialogOpen(false);
          setSelectedImage(null);
          setImageError(false);
          setImageLoading(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedImageTitle}
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            position: 'relative'
          }}>
            {imageLoading && !imageError && <CircularProgress />}
            {imageError && (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography color="error" gutterBottom>
                  Failed to load image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The image may not exist or the URL is invalid
                </Typography>
              </Box>
            )}
            {selectedImage && (
              <img
                src={selectedImage}
                alt={selectedImageTitle}
                crossOrigin="anonymous"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  display: imageLoading || imageError ? 'none' : 'block',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            )}
            {!selectedImage && !imageLoading && (
              <Typography>No image available</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedImage && !imageError && (
            <Button
              startIcon={<DownloadIcon />}
              variant="outlined"
              onClick={() => handleDownloadFile(selectedImage, `${selectedImageTitle.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`)}
            >
              Download
            </Button>
          )}
          <Button onClick={() => {
            setImageDialogOpen(false);
            setSelectedImage(null);
            setImageError(false);
            setImageLoading(false);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: '320px',
            fontSize: '0.95rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Utilities;
