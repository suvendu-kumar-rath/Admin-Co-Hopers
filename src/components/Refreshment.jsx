import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { styled } from '@mui/material/styles';
import refreshmentApi from '../api/refreshment';
import { pushNotificationsApi } from '../api';
import { onMessageListener } from '../config/firebase';

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

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0.5),
  minWidth: 80,
}));

const Refreshment = () => {
  const [refreshmentData, setRefreshmentData] = useState([]);
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
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Push notification states - Load from localStorage
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('pushNotificationsEnabled') === 'true';
  });
  const [pushToken, setPushToken] = useState(() => {
    return localStorage.getItem('pushToken') || null;
  });
  const [subscribedTopics, setSubscribedTopics] = useState(() => {
    const saved = localStorage.getItem('subscribedTopics');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // Ref to track known order IDs (survives re-renders without triggering them)
  const knownOrderIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);
  const fetchRef = useRef(null); // always points to latest fetchRefreshmentOrders

  // Notification sound function
  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Play two-tone beep for attention
      const playTone = (freq, startTime, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playTone(880, now, 0.15);        // High beep
      playTone(1100, now + 0.18, 0.15); // Higher beep
      playTone(880, now + 0.36, 0.3);   // Sustained beep

      console.log('🔊 Notification sound played');
    } catch (err) {
      console.warn('Sound playback failed:', err);
    }
  }, []);

  // Show new-order notification popup
  const showNewOrderAlert = useCallback((newOrders) => {
    if (newOrders.length === 0) return;

    playNotificationSound();

    const firstOrder = newOrders[0];
    const title = newOrders.length === 1
      ? `🔔 New Order from ${firstOrder.username}`
      : `🔔 ${newOrders.length} New Orders Received!`;
    const body = newOrders.length === 1
      ? `${firstOrder.username} ordered ${firstOrder.itemName || 'an item'} (₹${firstOrder.amount})`
      : newOrders.map(o => `${o.username}: ${o.itemName || 'item'}`).join(', ');

    // In-app snackbar notification
    setSnackbar({
      open: true,
      message: `${title} — ${body}`,
      severity: 'info'
    });

    // Browser notification popup (if permission granted)
    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body: body,
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: `new-order-${Date.now()}`,
          requireInteraction: true,
          vibrate: [200, 100, 200]
        });
        notif.onclick = () => { window.focus(); notif.close(); };
        console.log('✅ Browser notification shown for new orders');
      } catch (e) {
        console.warn('Browser notification failed:', e);
      }
    }

    console.log(`🔔 Notified admin about ${newOrders.length} new order(s):`, newOrders.map(o => o.id));
  }, [playNotificationSound]);

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
    console.log('%c🚀 REFRESHMENT PAGE LOADED — New order detection ACTIVE', 'background:#1976d2;color:white;padding:4px 12px;border-radius:4px;font-size:14px');
    console.log('📋 Build timestamp:', new Date().toISOString());
    console.log('📋 Known order IDs:', knownOrderIdsRef.current.size);
    
    fetchRefreshmentOrders();
    
    // Auto-request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        console.log('📋 Notification permission:', perm);
      });
    }

    // Expose test function on window for debugging from browser console
    window.__testOrderNotification = () => {
      console.log('%c🧪 TEST: Triggering fake new-order notification...', 'color:orange;font-weight:bold');
      showNewOrderAlert([{
        id: 'test-' + Date.now(),
        username: 'Test User',
        itemName: 'Cappuccino',
        amount: 150
      }]);
    };
    console.log('💡 TIP: Run window.__testOrderNotification() in console to test notification sound + popup');

    return () => { delete window.__testOrderNotification; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh orders every 15 seconds to catch new orders quickly
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('🔄 Auto-refreshing orders...');
      fetchRef.current(); // always calls the latest version
    }, 15000); // 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Listen for push notifications (FCM) and refresh immediately
  useEffect(() => {
    console.log('🎧 Setting up FCM notification listener for Refreshment page...');
    console.log('⚠️ NOTE: FCM only works if the BACKEND sends messages via Firebase Admin SDK');
    
    const unsubscribe = onMessageListener((payload) => {
      console.log('🔔 FCM Notification received on Refreshment page:', payload);
      fetchRef.current();
      playNotificationSound();
      setSnackbar({ 
        open: true, 
        message: `🔔 ${payload.notification?.title || 'New order received'}`, 
        severity: 'info' 
      });
    });

    return () => {
      console.log('🔕 Cleaning up notification listener for Refreshment page');
      if (unsubscribe) unsubscribe();
    };
  }, [playNotificationSound]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRefreshmentOrders = async () => {
    try {
      setLoading(prev => isFirstLoadRef.current ? true : prev); // Only show spinner on first load
      setError(null);
      
      console.log('🔄 Fetching cafeteria orders...');
      
      // Try to fetch from API first
      try {
        const response = await refreshmentApi.fetchOrders();
        
        // Handle different response structures from your API
        let ordersData = response;
        
        // If the response is wrapped (e.g. { data: [...] } or { orders: [...] })
        if (response && !Array.isArray(response)) {
          ordersData = response.data || response.orders || [];
        }
        
        // Ensure it's an array
        if (!Array.isArray(ordersData)) {
          console.warn('⚠️ ordersData is not an array, got:', typeof ordersData, ordersData);
          ordersData = [];
        }
        
        console.log('📊 API returned type:', typeof response, Array.isArray(response) ? '(array)' : '');
        console.log(`📋 Processing ${ordersData.length} orders. First order sample:`, ordersData[0]);
        
        // Transform API data to match component structure
        const transformedData = ordersData.map(order => ({
          id: order.id || order._id || order.orderId,
          cabinNumber: order.cabinNumber || order.cabin_number || order.spaceNumber || '',
          username: (order.user && order.user.username) || order.username || order.user_name || order.customerName || order.name || 'N/A',
          roomNumber: order.roomNumber || order.room_number || order.spaceId || '',
          // Store individual item details for structured display
          itemName: order.itemName || 'N/A',
          quantity: order.quantity || 0,
          orderType: order.orderType || 'N/A',
          specialInstructions: order.specialInstructions || '',
          paymentScreenshot: order.paymentScreenshot || order.payment_screenshot || order.receiptImage || '',
          paymentMethod: order.paymentMethod || order.payment_method || order.paymentType || '',
          amount: order.amount || order.totalAmount || order.total_amount || order.price || 0,
          orderDate: order.orderDate || order.order_date || order.createdAt || order.created_at || new Date().toISOString().split('T')[0],
          status: order.status || order.orderStatus || order.order_status || 'Pending',
          isPersonal: order.isPersonal || false,
          companyName: order.isPersonal && order.kyc?.companyName ? order.kyc.companyName : (order.companyName || null)
        }));
        
        console.log(`✅ Successfully loaded ${transformedData.length} orders from API`);
        
        // === NEW ORDER DETECTION ===
        const validOrders = transformedData.filter(o => o.id != null && o.id !== '');
        
        if (isFirstLoadRef.current) {
          // First load — just record all existing order IDs, don't notify
          validOrders.forEach(order => knownOrderIdsRef.current.add(String(order.id)));
          isFirstLoadRef.current = false;
          console.log(`📋 First load: recorded ${knownOrderIdsRef.current.size} existing order IDs:`, [...knownOrderIdsRef.current]);
        } else {
          // Subsequent loads — detect new orders
          const newOrders = validOrders.filter(order => !knownOrderIdsRef.current.has(String(order.id)));
          
          if (newOrders.length > 0) {
            console.log(`🆕 Detected ${newOrders.length} NEW order(s)!`, newOrders.map(o => ({ id: o.id, user: o.username, item: o.itemName })));
            showNewOrderAlert(newOrders);
            // Add new IDs to known set
            newOrders.forEach(order => knownOrderIdsRef.current.add(String(order.id)));
          } else {
            console.log(`✅ Refreshed ${validOrders.length} orders — no new orders detected`);
          }
        }
        // === END NEW ORDER DETECTION ===
        
        // Merge with localStorage updates for persistence
        const localUpdates = JSON.parse(localStorage.getItem('refreshmentOrderUpdates') || '{}');
        const finalData = transformedData.map(order => {
          const orderId = order.id || order._id || order.orderId;
          if (localUpdates[orderId]) {
            return { ...order, ...localUpdates[orderId] };
          }
          return order;
        });
        
        setRefreshmentData(finalData);
        setFilteredData(finalData);
        setLastRefreshTime(new Date());
        
      } catch (apiError) {
        console.error('❌ API call failed:', apiError);
        console.log('🔄 Falling back to sample data...');
        
        // Apply localStorage updates to sample data too
        const localUpdates = JSON.parse(localStorage.getItem('refreshmentOrderUpdates') || '{}');
        const updatedSampleData = sampleData.map(order => {
          const orderId = order.id || order._id || order.orderId;
          if (localUpdates[orderId]) {
            return { ...order, ...localUpdates[orderId] };
          }
          return order;
        });
        
        // Fallback to sample data if API is not available
        setRefreshmentData(updatedSampleData);
        setFilteredData(updatedSampleData);
        setLastRefreshTime(new Date());
        
        setSnackbar({
          open: true,
          message: 'Using demo data - API not available',
          severity: 'warning'
        });
      }
      
    } catch (err) {
      console.error('💥 Critical error fetching orders:', err);
      setError('Failed to fetch refreshment orders');
      
      // Apply localStorage updates to sample data
      const localUpdates = JSON.parse(localStorage.getItem('refreshmentOrderUpdates') || '{}');
      const updatedSampleData = sampleData.map(order => {
        const orderId = order.id || order._id || order.orderId;
        if (localUpdates[orderId]) {
          return { ...order, ...localUpdates[orderId] };
        }
        return order;
      });
      
      // Load sample data as last resort
      console.log('🆘 Loading sample data as last resort...');
      setRefreshmentData(updatedSampleData);
      setFilteredData(updatedSampleData);
      
    } finally {
      setLoading(false);
    }
  };

  // Keep fetchRef always pointing to the latest function (must be after definition)
  fetchRef.current = fetchRefreshmentOrders;

  useEffect(() => {
    // Filter data based on search term and date range with null-safe operations
    const filtered = refreshmentData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search term filter - convert all values to strings to handle numbers
      const matchesSearch = searchTerm === '' || (
        String(item.username || '').toLowerCase().includes(searchLower) ||
        String(item.cabinNumber || '').toLowerCase().includes(searchLower) ||
        String(item.roomNumber || '').toLowerCase().includes(searchLower) ||
        String(item.items || '').toLowerCase().includes(searchLower) ||
        String(item.itemName || '').toLowerCase().includes(searchLower) ||
        String(item.paymentMethod || '').toLowerCase().includes(searchLower) ||
        String(item.status || '').toLowerCase().includes(searchLower) ||
        String(item.companyName || '').toLowerCase().includes(searchLower)
      );
      
      // Date range filter
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
      
      // Status filter
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      
      return matchesSearch && matchesDateRange && matchesStatus;
    });
    setFilteredData(filtered);

    // Group filtered data by username
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
      
      // Update userInfo with first valid cabin/room/companyName if not set yet
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

    // Sort orders by date (newest first) for each user
    Object.keys(grouped).forEach(username => {
      grouped[username].orders.sort((a, b) => {
        const dateA = new Date(a.orderDate || 0);
        const dateB = new Date(b.orderDate || 0);
        return dateB - dateA; // Descending order (newest first)
      });
    });

    setGroupedData(grouped);
  }, [searchTerm, refreshmentData, dateFrom, dateTo, statusFilter]);
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('All');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setProcessingOrderId(orderId);
      
      // Send status directly to API - backend expects 'Confirmed' or 'Rejected'
      const apiStatus = newStatus;
      
      // Update via API if available
      try {
        await refreshmentApi.updateOrderStatus(orderId, apiStatus);
        
        // Save to localStorage for persistence
        const localUpdates = JSON.parse(localStorage.getItem('refreshmentOrderUpdates') || '{}');
        localUpdates[orderId] = { status: newStatus };
        localStorage.setItem('refreshmentOrderUpdates', JSON.stringify(localUpdates));
        
        // Update local state
        setRefreshmentData(prevData =>
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
      } catch (apiError) {
        console.warn('API update failed, updating locally:', apiError.message);
        
        // Save to localStorage even when API fails
        const localUpdates = JSON.parse(localStorage.getItem('refreshmentOrderUpdates') || '{}');
        localUpdates[orderId] = { status: newStatus };
        localStorage.setItem('refreshmentOrderUpdates', JSON.stringify(localUpdates));
        
        // Update local state
        setRefreshmentData(prevData =>
          prevData.map(order => {
            const id = order.id || order._id || order.orderId;
            return id == orderId ? { ...order, status: newStatus } : order;
          })
        );
        
        setSnackbar({
          open: true,
          message: `Order ${newStatus.toLowerCase()} locally (API unavailable)`,
          severity: 'warning'
        });
      }
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

  const handleViewScreenshot = (screenshotUrl, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    console.log('🖼️ Image clicked, raw URL:', screenshotUrl);
    if (screenshotUrl && screenshotUrl.trim() !== '') {
      setImageError(false);
      setImageLoading(true);
      
      // Handle relative URLs by prepending base URL if needed
      let fullImageUrl = screenshotUrl;
      if (screenshotUrl && !screenshotUrl.startsWith('http')) {
        // Get base URL and remove /api suffix if present
        let baseURL = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
        console.log('🔧 Original base URL:', baseURL);
        baseURL = baseURL.replace(/\/api$/, ''); // Remove trailing /api
        console.log('🔧 Base URL after removing /api:', baseURL);
        fullImageUrl = screenshotUrl.startsWith('/') ? `${baseURL}${screenshotUrl}` : `${baseURL}/${screenshotUrl}`;
        console.log('✅ Constructed full URL:', fullImageUrl);
      } else {
        console.log('✅ Using URL as-is (already absolute):', fullImageUrl);
      }
      
      setSelectedImage(fullImageUrl);
      setImageDialogOpen(true);
      // Close menu after a short delay to allow dialog to open
      setTimeout(() => handleMenuClose(), 100);
    } else {
      console.warn('No screenshot URL provided');
      setSnackbar({
        open: true,
        message: 'No screenshot URL available',
        severity: 'warning'
      });
    }
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

  // Push Notification Functions
  const requestNotificationPermission = async () => {
    try {
      if (!('Notification' in window)) {
        setSnackbar({ open: true, message: 'This browser does not support notifications', severity: 'error' });
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSnackbar({ open: true, message: 'Notifications enabled successfully', severity: 'success' });
        return true;
      } else {
        setSnackbar({ open: true, message: 'Notification permission denied', severity: 'warning' });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setSnackbar({ open: true, message: 'Failed to enable notifications', severity: 'error' });
      return false;
    }
  };

  const registerPushNotification = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      // Get real FCM token from Firebase
      setSnackbar({ open: true, message: 'Getting push notification token...', severity: 'info' });
      
      const token = await pushNotificationsApi.getFCMToken();
      
      if (!token) {
        throw new Error('Failed to get FCM token. Please ensure Firebase is configured correctly.');
      }
      
      console.log('✅ Got FCM Token:', token);
      console.log('Token length:', token.length, 'Type:', typeof token);
      
      await pushNotificationsApi.registerPushToken({
        token: token,
        deviceType: 'web',
        deviceId: navigator.userAgent,
      });

      console.log('📤 About to subscribe to topic with:', { token, topic: 'cafeteria_admin' });
      
      await pushNotificationsApi.subscribePushTopic({
        token: token,
        topic: 'cafeteria_admin',
      });

      // Save to state and localStorage
      setPushToken(token);
      setNotificationsEnabled(true);
      setSubscribedTopics(['cafeteria_admin']);
      
      localStorage.setItem('pushToken', token);
      localStorage.setItem('pushNotificationsEnabled', 'true');
      localStorage.setItem('subscribedTopics', JSON.stringify(['cafeteria_admin']));
      
      setSnackbar({ open: true, message: '✅ Push notifications enabled! You will receive refreshment order updates.', severity: 'success' });
    } catch (error) {
      console.error('Error registering push notification:', error);
      
      // Use the custom error message if available
      let errorMessage = error.userMessage || error.message || '❌ Failed to enable push notifications.';
      
      // Check if it's a Firebase configuration error
      if (error.message && error.message.includes('Firebase')) {
        errorMessage = '⚠️ Firebase is not configured. Please add your Firebase credentials to enable push notifications.';
      }
      
      // For 403 errors, show a warning instead of error
      const severity = error.response?.status === 403 ? 'warning' : 'error';
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: severity 
      });
      
      // Reset notification state on error
      setNotificationsEnabled(false);
      setPushToken(null);
      setSubscribedTopics([]);
      
      localStorage.removeItem('pushToken');
      localStorage.removeItem('pushNotificationsEnabled');
      localStorage.removeItem('subscribedTopics');
    }
  };

  const subscribeTopic = async (topic) => {
    try {
      if (!pushToken) {
        setSnackbar({ open: true, message: 'Please enable notifications first', severity: 'warning' });
        return;
      }

      await pushNotificationsApi.subscribePushTopic({
        token: pushToken,
        topic: topic,
      });

      setSubscribedTopics([...subscribedTopics, topic]);
      setSnackbar({ open: true, message: `Subscribed to ${topic}`, severity: 'success' });
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      const errorMessage = error.userMessage || `Failed to subscribe to ${topic}`;
      const severity = error.response?.status === 403 ? 'warning' : 'error';
      setSnackbar({ open: true, message: errorMessage, severity: severity });
    }
  };

  const unsubscribeTopic = async (topic) => {
    try {
      if (!pushToken) return;

      await pushNotificationsApi.unsubscribePushTopic({
        token: pushToken,
        topic: topic,
      });

      const newTopics = subscribedTopics.filter(t => t !== topic);
      setSubscribedTopics(newTopics);
      
      // If no topics left, disable notifications completely
      if (newTopics.length === 0) {
        setNotificationsEnabled(false);
        setPushToken(null);
        localStorage.removeItem('pushToken');
        localStorage.removeItem('pushNotificationsEnabled');
        localStorage.removeItem('subscribedTopics');
      } else {
        localStorage.setItem('subscribedTopics', JSON.stringify(newTopics));
      }
      
      setSnackbar({ open: true, message: '🔕 Notifications disabled successfully', severity: 'success' });
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      const errorMessage = error.userMessage || '❌ Failed to disable notifications';
      const severity = error.response?.status === 403 ? 'warning' : 'error';
      setSnackbar({ open: true, message: errorMessage, severity: severity });
    }
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
          {lastRefreshTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip 
                label="🔄 Auto-refresh: ON"
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 22 }}
              />
              <Typography variant="caption" color="text.secondary">
                Last updated: {lastRefreshTime.toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
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

      {/* Push Notification Banner */}
      {!notificationsEnabled && (
        <Alert 
          severity="info" 
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={registerPushNotification}
              startIcon={<NotificationsActiveIcon />}
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Enable Notifications
            </Button>
          }
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Enable push notifications for instant refreshment order updates.
          </Typography>
        </Alert>
      )}

      {/* Notification Status Badge */}
      {notificationsEnabled && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: '#ECFDF5', 
            borderRadius: 2,
            border: '1px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActiveIcon sx={{ color: '#059669' }} />
            <Typography variant="body2" sx={{ color: '#065F46', fontWeight: 600 }}>
              Push Notifications Active
            </Typography>
            <Chip 
              label={`${subscribedTopics.length} topic(s)`} 
              size="small" 
              sx={{ backgroundColor: '#10B981', color: 'white', fontWeight: 600, fontSize: '0.7rem' }} 
            />
          </Box>
          <Button 
            size="small" 
            startIcon={<NotificationsOffIcon />}
            onClick={() => {
              setNotificationsEnabled(false);
              setPushToken(null);
              setSubscribedTopics([]);
              localStorage.removeItem('pushToken');
              localStorage.removeItem('pushNotificationsEnabled');
              localStorage.removeItem('subscribedTopics');
              setSnackbar({ open: true, message: 'Notifications disabled', severity: 'info' });
            }}
            sx={{ 
              color: '#059669',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#D1FAE5' }
            }}
          >
            Disable
          </Button>
        </Box>
      )}

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
            {/* Username/Company Name Search */}
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
            
            {/* Date From */}
            <TextField
              label="From Date"
              type="date"
              variant="outlined"
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            
            {/* Date To */}
            <TextField
              label="To Date"
              type="date"
              variant="outlined"
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            
            {/* Status Filter */}
            <TextField
              label="Status"
              select
              variant="outlined"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </TextField>
          </Box>
          
          {/* Active Filters Display */}
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

      {/* Display grouped orders by user */}
      {Object.keys(groupedData).length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No refreshment orders found
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

            {/* Orders Table for this user */}
            <StyledTableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Item Details</TableCell>
                    <TableCell>Payment Screenshot</TableCell>
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
                      <IconButton
                        onClick={(e) => handleViewScreenshot(row.paymentScreenshot, e)}
                        sx={{ p: 0 }}
                      >
                        <Avatar
                          src={row.paymentScreenshot}
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
                  ) : (
                    <Tooltip title="No payment screenshot">
                      <Avatar
                        alt="No Screenshot"
                        variant="rounded"
                        sx={{ 
                          width: 50, 
                          height: 50, 
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
                  {row.status === 'Confirmed' ? (
                    <StatusChip
                      label="Confirmed"
                      status="Confirmed"
                      size="small"
                    />
                  ) : row.status === 'Rejected' ? (
                    <StatusChip
                      label="Rejected"
                      status="Rejected"
                      size="small"
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <ActionButton
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={processingOrderId === row.id ? <CircularProgress size={16} /> : <CheckIcon />}
                        onClick={() => handleStatusUpdate(row.id, 'Confirmed')}
                        disabled={processingOrderId === row.id}
                      >
                        Accept
                      </ActionButton>
                      <ActionButton
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={processingOrderId === row.id ? <CircularProgress size={16} /> : <CancelIcon />}
                        onClick={() => handleStatusUpdate(row.id, 'Rejected')}
                        disabled={processingOrderId === row.id}
                      >
                        Reject
                      </ActionButton>
                    </Box>
                  )}
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
          Payment Screenshot
          {selectedImage && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              {selectedImage}
            </Typography>
          )}
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
            {imageLoading && !imageError && (
              <CircularProgress />
            )}
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
                alt="Payment Screenshot"
                crossOrigin="anonymous"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  display: imageLoading || imageError ? 'none' : 'block',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully');
                  setImageLoading(false);
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', selectedImage);
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

      {/* Snackbar for notifications */}
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

export default Refreshment;