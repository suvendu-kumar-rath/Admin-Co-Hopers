import React from 'react';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  styled,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { BarChart } from '@mui/x-charts';
import { motion } from 'framer-motion';

// Wrap Material-UI components with motion
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionListItem = motion(ListItem);

const StyledCard = styled(MotionCard)({
  padding: 24,
  borderRadius: 20,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  backgroundColor: 'white',
});

const StatCard = styled(MotionBox)({
  padding: 24,
  borderRadius: 20,
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const StatValue = styled(MotionTypography)({
  fontSize: '2rem',
  fontWeight: 600,
});

const SuccessRateCircle = styled(MotionBox)({
  position: 'relative',
  width: 160,
  height: 160,
  borderRadius: '50%',
  background: `conic-gradient(
    #4CAF50 ${98 * 3.6}deg,
    #E8F5E9 ${98 * 3.6}deg
  )`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: '50%',
    background: 'white',
  },
});

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
  const topVendors = [
    { name: 'Nicholas Patrick', amount: '₹2540.58', users: '150 users', subscription: '105 subscription', status: 'Gold' },
    { name: 'Cordell Edwards', amount: '₹1567.80', users: '95 users', subscription: '60 subscription', status: 'Silver' },
    { name: 'Derrick Spencer', amount: '₹1640.26', users: '120 users', subscription: '75 subscription', status: 'Silver' },
  ];

  const chartData = [45000, 120000, 115000, 110000, 180000];
  const chartCategories = ['Mar 1-7', 'Mar 8-14', 'Mar 15-21', 'Mar 22-28', 'Final wk'];

  return (
    <MotionBox 
      sx={{ p: 3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionTypography 
        variant="h6" 
        sx={{ mb: 3, fontWeight: 600 }}
        {...fadeInUp}
      >
        Top Vendor Representative
      </MotionTypography>
      
      <StyledCard 
        sx={{ mb: 4 }}
        {...scaleIn}
      >
        <List>
          {topVendors.map((vendor, index) => (
            <MotionListItem
              key={index}
              {...listItemAnimation}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              secondaryAction={
                <IconButton edge="end">
                  <MoreVertIcon />
                </IconButton>
              }
              sx={{ py: 2 }}
            >
              <ListItemAvatar>
                <Avatar sx={{ width: 40, height: 40 }}>{vendor.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={vendor.name}
                secondary={vendor.users}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              <Box sx={{ mr: 4 }}>
                <Typography variant="body1" fontWeight={500}>
                  {vendor.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.subscription}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color={vendor.status === 'Gold' ? '#FFB800' : '#4CAF50'}
                sx={{ fontWeight: 500 }}
              >
                +{vendor.status}
              </Typography>
            </MotionListItem>
          ))}
        </List>
      </StyledCard>

      <MotionBox 
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 4 }}
        {...fadeInUp}
      >
        {[
          { title: 'Vendors', value: '25.1k', change: '+15%', isIncrease: true },
          { title: 'Users', value: '43.5k', change: '-3.5%', isIncrease: false },
          { title: 'Total No. of members', value: '3.5M', change: '+15%', isIncrease: true },
          { title: 'Payments', value: '43.5k', change: '+10%', isIncrease: true },
        ].map((stat, index) => (
          <StatCard
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary">{stat.title}</Typography>
              <Typography 
                color={stat.isIncrease ? 'success.main' : 'error.main'} 
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                {stat.isIncrease ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />} {stat.change}
              </Typography>
            </Box>
            <StatValue>{stat.value}</StatValue>
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 500 }}>
              View {stat.title === 'Total No. of members' || stat.title === 'Payments' ? 'More' : 'Report'}
            </Typography>
          </StatCard>
        ))}
      </MotionBox>

      <MotionBox 
        sx={{ display: 'flex', gap: 4 }}
        {...fadeInUp}
      >
        <StyledCard 
          sx={{ flex: 1 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={500}>Last 30 days</Typography>
          </Box>
          <Box sx={{ height: 300 }}>
            <BarChart
              series={[{
                data: chartData,
                color: '#E7D8FD',
              }]}
              height={300}
              xAxis={[{ 
                data: chartCategories, 
                scaleType: 'band',
                tickLabelStyle: {
                  angle: 0,
                  textAnchor: 'middle',
                }
              }]}
              sx={{
                '& .MuiBarElement-root:hover': {
                  fill: '#8B5CF6',
                },
              }}
            />
          </Box>
        </StyledCard>

        <StyledCard 
          sx={{ width: 300 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" fontWeight={500} align="center" gutterBottom>
            Success rate
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mt: 3 }}>
            <SuccessRateCircle
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Typography
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#4CAF50',
                }}
              >
                98%
              </Typography>
            </SuccessRateCircle>
            <MotionBox 
              sx={{ display: 'flex', width: '100%', justifyContent: 'space-around', mt: 2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">1</Typography>
                <Typography variant="body2" color="text.secondary">Unsuccessful</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">150</Typography>
                <Typography variant="body2" color="text.secondary">Successful</Typography>
              </Box>
            </MotionBox>
          </Box>
        </StyledCard>
      </MotionBox>
    </MotionBox>
  );
};

export default Dashboard; 