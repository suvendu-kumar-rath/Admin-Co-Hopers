import React, { useState, useContext, createContext } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  styled, 
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

import InventoryIcon from '@mui/icons-material/Inventory';
import CoHopersLogo from '../assets/images/BoldTribe Logo-3.png';
import { motion } from 'framer-motion';

// Create a context for sidebar state
export const SidebarContext = createContext();

const MotionBox = motion(Box);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);

const SidebarContainer = styled(MotionBox, {
  shouldForwardProp: (prop) => prop !== 'isopen',
})(({ theme, isopen }) => ({
  width: 250,
  backgroundColor: '#8EC8D4',
  height: '100%',
  minHeight: '100vh',
  padding: theme.spacing(2),
  color: 'white',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  borderTopRightRadius: 24,
  borderBottomRightRadius: 24,
  zIndex: 1200,
  transition: 'transform 0.3s ease-in-out',
  [theme.breakpoints.down('lg')]: {
    transform: isopen ? 'translateX(0)' : 'translateX(-100%)',
  },
  [theme.breakpoints.up('lg')]: {
    transform: 'translateX(0)',
  },
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  left: 20,
  zIndex: 1300,
  backgroundColor: '#8EC8D4',
  color: 'white',
  '&:hover': {
    backgroundColor: '#7BB8C5',
  },
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1100,
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
}));

const Logo = styled(MotionBox)(({ theme }) => ({
  padding: '10px 0',
  marginTop: '-80px',
  '& img': {
    width: 180,
    height: 'auto',
    [theme.breakpoints.down('md')]: {
      width: 140,
    },
    [theme.breakpoints.down('sm')]: {
      width: 120,
    },
  },
}));

const MenuItem = styled(MotionListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  },
  padding: '10px 16px',
  [theme.breakpoints.down('sm')]: {
    padding: '8px 12px',
    marginBottom: 6,
  },
}));

const MenuItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.85rem',
    },
  },
}));

const MenuItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 40,
  color: 'white',
  '& .MuiSvgIcon-root': {
    fontSize: '1.3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
    },
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 35,
  },
}));

// Animation variants
const sidebarVariants = {
  initial: { x: -250, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 100, damping: 20 }
};

const logoVariants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay: 0.2, duration: 0.5 }
};

const listVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.3, duration: 0.5 }
};

const itemVariants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 }
};

// Provider component for sidebar state
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar, isLargeScreen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(SidebarContext);
  
  // Handle case where context is not provided (fallback for development)
  if (!context) {
    throw new Error('Sidebar must be used within a SidebarProvider');
  }
  
  const { isOpen, toggleSidebar, closeSidebar, isLargeScreen } = context;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Space Bookings', icon: <PeopleIcon />, path: '/users' },
    { text: 'Active members', icon: <StarIcon />, path: '/active-members' },
    { text: 'Past members', icon: <HistoryIcon />, path: '/past-members' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Book Meeting Room', icon: <MeetingRoomIcon />, path: '/book-meeting' },
    { text: 'Refreshment', icon: <RestaurantMenuIcon />, path: '/refreshment' },
    { text: 'App Version', icon: <SystemUpdateAltIcon />, path: '/app-version' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (!isLargeScreen) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <MobileMenuButton onClick={toggleSidebar}>
        <MenuIcon />
      </MobileMenuButton>

      {/* Overlay for mobile */}
      {isOpen && !isLargeScreen && (
        <Overlay onClick={closeSidebar} />
      )}

      <SidebarContainer
        isopen={isOpen}
        initial="initial"
        animate="animate"
        variants={sidebarVariants}
      >
      {/* Mobile close button */}
      {!isLargeScreen && (
        <IconButton
          onClick={closeSidebar}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <Logo
        variants={logoVariants}
        initial="initial"
        animate="animate"
      >
        <motion.img 
          src={CoHopersLogo} 
          alt="CoHopers Logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </Logo>
      <MotionList 
        sx={{ mt: 2 }}
        variants={listVariants}
      >
        {menuItems.map((item, index) => (
          <MenuItem 
            key={item.text} 
            active={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
            variants={itemVariants}
            custom={index}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <MenuItemIcon>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {item.icon}
              </motion.div>
            </MenuItemIcon>
            <MenuItemText primary={item.text} />
          </MenuItem>
        ))}
      </MotionList>
    </SidebarContainer>
    </>
  );
};

export default Sidebar; 