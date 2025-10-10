import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Container,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  MeetingRoom as MeetingRoomIcon,
  AttachMoney as MoneyIcon,
  EventAvailable as BookingIcon,
  Pending as PendingIcon,
  Assessment as AssessmentIcon,
  AccountBalance as EarningsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { dashboardApi } from '../api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Styled Components with modern international design
const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: '24px',
  background: `
    radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #f093fb 0%, transparent 50%),
    linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
  `,
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(100px)',
    zIndex: -1,
  },
  [theme.breakpoints.down('lg')]: {
    padding: '20px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '16px',
  },
}));

const StatCard = styled(motion.div)(({ theme, color = '#667eea' }) => ({
  background: `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)`,
  borderRadius: '24px',
  padding: '32px 24px',
  height: '100%',
  boxShadow: `
    0 20px 40px -12px rgba(0,0,0,0.15),
    0 0 0 1px rgba(255,255,255,0.4),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: `linear-gradient(90deg, ${color}, ${color}99, ${color}66)`,
    borderRadius: '24px 24px 0 0',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    zIndex: 0,
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: `
      0 30px 60px -12px rgba(0,0,0,0.25),
      0 0 0 1px rgba(255,255,255,0.5),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    padding: '24px 20px',
    borderRadius: '20px',
  },
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '28px',
  background: `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)`,
  backdropFilter: 'blur(20px)',
  boxShadow: `
    0 25px 50px -12px rgba(0,0,0,0.15),
    0 0 0 1px rgba(255,255,255,0.4),
    inset 0 1px 0 rgba(255,255,255,0.6)
  `,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `
      0 35px 70px -12px rgba(0,0,0,0.2),
      0 0 0 1px rgba(255,255,255,0.5),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
  [theme.breakpoints.down('md')]: {
    padding: '24px',
    borderRadius: '24px',
  },
}));

const StatValue = styled(Typography)(({ color = '#667eea' }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 50%, ${color}99 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: '8px',
  lineHeight: 1.2,
  '@media (max-width: 1200px)': {
    fontSize: '2.5rem',
  },
  '@media (max-width: 900px)': {
    fontSize: '2rem',
  },
  '@media (max-width: 600px)': {
    fontSize: '1.75rem',
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '20px',
  opacity: 0.8,
}));

const IconWrapper = styled(Box)(({ color = '#667eea' }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  background: `
    linear-gradient(145deg, ${color}15 0%, ${color}08 100%),
    linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  position: 'relative',
  boxShadow: `
    inset 0 2px 4px rgba(255,255,255,0.8),
    inset 0 -2px 4px rgba(0,0,0,0.1),
    0 4px 8px rgba(0,0,0,0.1)
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    height: '80%',
    background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '32px',
    color: color,
    position: 'relative',
    zIndex: 1,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  },
}));

const ChangeIndicator = styled(Box)(({ isPositive = true }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '12px',
  background: isPositive 
    ? 'linear-gradient(135deg, #10b98115, #10b98108)'
    : 'linear-gradient(135deg, #ef444415, #ef444408)',
  border: `1px solid ${isPositive ? '#10b98120' : '#ef444420'}`,
}));

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

const listItemAnimation = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 }
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 7,
    totalSpaceBookings: 7,
    totalMeetingRoomBookings: 30,
    totalEarnings: 58826,
    monthlyEarnings: 5124,
    totalSpaces: 25,
    totalMeetingRooms: 2,
    pendingBookings: 6,
    recentSpaceBookings: [],
    recentMeetingRoomBookings: [],
    bookingStats: { spaceBookings: 7, meetingRoomBookings: 30 },
    earningsStats: { spaceEarnings: 21000, meetingRoomEarnings: 37826, totalEarnings: 58826 }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Actual API call - replace with your API endpoint
        const response = await dashboardApi.fetchDashboardStats();
        console.log('Dashboard API Response:', response);
        
        // Handle different response formats
        let apiData = response;
        if (response.data) {
          apiData = response.data;
        }
        if (response.success && response.data) {
          apiData = response.data;
        }
        
        // Map API response to component state
        setDashboardData({
          totalUsers: apiData.totalUsers || 0,
          totalSpaceBookings: apiData.totalSpaceBookings || 0,
          totalMeetingRoomBookings: apiData.totalMeetingRoomBookings || 0,
          totalEarnings: apiData.totalEarnings || 0,
          monthlyEarnings: apiData.monthlyEarnings || 0,
          totalSpaces: apiData.totalSpaces || 0,
          totalMeetingRooms: apiData.totalMeetingRooms || 0,
          pendingBookings: apiData.pendingBookings || 0,
          recentSpaceBookings: apiData.recentSpaceBookings || [],
          recentMeetingRoomBookings: apiData.recentMeetingRoomBookings || [],
          bookingStats: apiData.bookingStats || { spaceBookings: 0, meetingRoomBookings: 0 },
          earningsStats: apiData.earningsStats || { spaceEarnings: 0, meetingRoomEarnings: 0, totalEarnings: 0 }
        });
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Fallback to sample data if API fails
        setDashboardData({
          totalUsers: 7,
          totalSpaceBookings: 7,
          totalMeetingRoomBookings: 30,
          totalEarnings: 58826,
          monthlyEarnings: 5124,
          totalSpaces: 25,
          totalMeetingRooms: 2,
          pendingBookings: 6,
          recentSpaceBookings: [
            { id: 7, date: "2025-09-01", amount: "1500.00", status: "Pending", user: { username: "manoranjan" }, space: { space_name: "Executive Cabin" } },
            { id: 6, date: "2025-10-08", amount: "1500.00", status: "Confirm", user: { username: "Das Consultancy" }, space: { space_name: "Executive Cabin" } },
            { id: 5, date: "2025-09-01", amount: "1500.00", status: "Pending", user: { username: "manoranjan" }, space: { space_name: "Executive Cabin" } },
            { id: 4, date: "2025-09-01", amount: "1500.00", status: "Pending", user: { username: "manoranjan123" }, space: { space_name: "Executive Cabin" } },
            { id: 3, date: "2025-09-01", amount: "1500.00", status: "Confirm", user: { username: "manoranjan" }, space: { space_name: "Executive Cabin" } }
          ],
          recentMeetingRoomBookings: [
            { id: 30, bookingDate: "2025-09-29", totalAmount: "236.00", status: "confirmed", username: "manoranjan", MeetingRoom: { name: "Large Conference Room" } },
            { id: 29, bookingDate: "2025-09-28", totalAmount: "236.00", status: "confirmed", username: "manoranjan", MeetingRoom: { name: "Large Conference Room" } },
            { id: 28, bookingDate: "2025-09-25", totalAmount: "295.00", status: "pending", username: "manoranjan", MeetingRoom: { name: "Large Conference Room" } },
            { id: 27, bookingDate: "2025-09-25", totalAmount: "295.00", status: "pending", username: "manoranjan", MeetingRoom: { name: "Large Conference Room" } },
            { id: 26, bookingDate: "2025-09-25", totalAmount: "472.00", status: "confirmed", username: "manoranjan", MeetingRoom: { name: "Large Conference Room" } }
          ],
          bookingStats: { spaceBookings: 7, meetingRoomBookings: 30 },
          earningsStats: { spaceEarnings: 21000, meetingRoomEarnings: 37826, totalEarnings: 58826 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num?.toString() || '0';
  };

  const formatCurrency = (amount) => {
    return `₹${formatNumber(amount)}`;
  };

  // Statistics cards configuration
  const statisticsCards = [
    { 
      title: 'Total Users', 
      value: dashboardData.totalUsers, 
      icon: PeopleIcon, 
      color: '#3b82f6',
      change: '+12%',
      isIncrease: true 
    },
    { 
      title: 'Space Bookings', 
      value: dashboardData.totalSpaceBookings, 
      icon: BusinessIcon, 
      color: '#10b981',
      change: '+8%',
      isIncrease: true 
    },
    { 
      title: 'Meeting Rooms', 
      value: dashboardData.totalMeetingRoomBookings, 
      icon: MeetingRoomIcon, 
      color: '#f59e0b',
      change: '+25%',
      isIncrease: true 
    },
    { 
      title: 'Total Earnings', 
      value: formatCurrency(dashboardData.totalEarnings), 
      icon: MoneyIcon, 
      color: '#8b5cf6',
      change: '+18%',
      isIncrease: true 
    },
    { 
      title: 'Monthly Earnings', 
      value: formatCurrency(dashboardData.monthlyEarnings), 
      icon: EarningsIcon, 
      color: '#ef4444',
      change: 'This month',
      isIncrease: true 
    },
    { 
      title: 'Total Spaces', 
      value: dashboardData.totalSpaces, 
      icon: AssessmentIcon, 
      color: '#06b6d4',
      change: `${dashboardData.totalMeetingRooms} rooms`,
      isIncrease: true 
    },
    { 
      title: 'Total Meeting Rooms', 
      value: dashboardData.totalMeetingRooms, 
      icon: BookingIcon, 
      color: '#84cc16',
      change: 'Available',
      isIncrease: true 
    },
    { 
      title: 'Pending Bookings', 
      value: dashboardData.pendingBookings, 
      icon: PendingIcon, 
      color: '#f97316',
      change: 'Needs attention',
      isIncrease: false 
    },
  ];

  // Chart configurations
  const spaceBookingsChartData = {
    labels: dashboardData.recentSpaceBookings?.map((booking, index) => 
      `Booking ${index + 1}`
    ) || [],
    datasets: [
      {
        label: 'Space Bookings Amount (₹)',
        data: dashboardData.recentSpaceBookings?.map(booking => 
          parseFloat(booking.amount)
        ) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const meetingRoomChartData = {
    labels: dashboardData.recentMeetingRoomBookings?.map((booking, index) => 
      `Room ${index + 1}`
    ) || [],
    datasets: [
      {
        label: 'Meeting Room Earnings (₹)',
        data: dashboardData.recentMeetingRoomBookings?.map(booking => 
          parseFloat(booking.totalAmount)
        ) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const bookingStatsPieData = {
    labels: ['Space Bookings', 'Meeting Room Bookings'],
    datasets: [
      {
        data: [
          dashboardData.bookingStats?.spaceBookings || 0,
          dashboardData.bookingStats?.meetingRoomBookings || 0,
        ],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderColor: ['#2563eb', '#059669'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const earningsStatsPieData = {
    labels: ['Space Earnings', 'Meeting Room Earnings'],
    datasets: [
      {
        data: [
          dashboardData.earningsStats?.spaceEarnings || 0,
          dashboardData.earningsStats?.meetingRoomEarnings || 0,
        ],
        backgroundColor: ['#8b5cf6', '#f59e0b'],
        borderColor: ['#7c3aed', '#d97706'],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '600' }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 11 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 }
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '600' }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${typeof value === 'number' ? formatCurrency(value) : value}`;
          }
        }
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <DashboardContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} sx={{ color: 'white' }} />
        </Box>
      </DashboardContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardContainer>
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: '12px' }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </IconButton>
          }
        >
          {error}
        </Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer maxWidth={false}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              fontWeight: 800, 
              mb: 1,
              background: 'linear-gradient(45deg, #ffffff, #f8fafc)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontWeight: 400 
            }}
          >
            Real-time insights and analytics
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }} sx={{ mb: 5 }}>
          {statisticsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StatCard
                color={stat.color}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.7,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <IconWrapper color={stat.color}>
                    <stat.icon />
                  </IconWrapper>
                  <ChangeIndicator isPositive={stat.isIncrease}>
                    {stat.isIncrease ? (
                      <TrendingUpIcon sx={{ fontSize: 14, color: '#10b981' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.isIncrease ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </ChangeIndicator>
                </Box>
                
                <StatLabel>{stat.title}</StatLabel>
                <StatValue color={stat.color}>{stat.value}</StatValue>
                
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
                  >
                    {index < 4 ? 'Updated now' : 'Live data'}
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }} sx={{ mb: 5 }}>
          {/* Space Bookings Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2, type: "spring", stiffness: 80 }}
            >
              <ChartCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Recent Space Bookings
                  </Typography>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #3b82f615, #3b82f608)',
                    border: '1px solid #3b82f620'
                  }}>
                    <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      ₹{dashboardData.recentSpaceBookings?.reduce((sum, booking) => 
                        sum + parseFloat(booking.amount || 0), 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: { xs: 280, sm: 320, lg: 380 } }}>
                  <Bar data={spaceBookingsChartData} options={chartOptions} />
                </Box>
              </ChartCard>
            </motion.div>
          </Grid>

          {/* Meeting Room Bookings Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4, type: "spring", stiffness: 80 }}
            >
              <ChartCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #10b981, #047857, #065f46)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Meeting Room Bookings
                  </Typography>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #10b98115, #10b98108)',
                    border: '1px solid #10b98120'
                  }}>
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                      ₹{dashboardData.recentMeetingRoomBookings?.reduce((sum, booking) => 
                        sum + parseFloat(booking.totalAmount || 0), 0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: { xs: 280, sm: 320, lg: 380 } }}>
                  <Bar data={meetingRoomChartData} options={chartOptions} />
                </Box>
              </ChartCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Pie Charts Section */}
        <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
          {/* Booking Statistics Pie Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 1.6, type: "spring", stiffness: 80 }}
            >
              <ChartCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Booking Distribution
                  </Typography>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #8b5cf615, #8b5cf608)',
                    border: '1px solid #8b5cf620'
                  }}>
                    <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                      {(dashboardData.bookingStats?.spaceBookings || 0) + (dashboardData.bookingStats?.meetingRoomBookings || 0)} Total
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: { xs: 280, sm: 320, lg: 380 } }}>
                  <Pie data={bookingStatsPieData} options={pieOptions} />
                </Box>
              </ChartCard>
            </motion.div>
          </Grid>

          {/* Earnings Statistics Pie Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 1.8, type: "spring", stiffness: 80 }}
            >
              <ChartCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Earnings Distribution
                  </Typography>
                  <Box sx={{ 
                    px: 2, 
                    py: 1, 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, #f59e0b15, #f59e0b08)',
                    border: '1px solid #f59e0b20'
                  }}>
                    <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      ₹{dashboardData.earningsStats?.totalEarnings?.toLocaleString() || '0'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: { xs: 280, sm: 320, lg: 380 } }}>
                  <Pie data={earningsStatsPieData} options={pieOptions} />
                </Box>
              </ChartCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </DashboardContainer>
  );
};

export default Dashboard; 