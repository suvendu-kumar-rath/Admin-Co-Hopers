import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PaymentsIcon from '@mui/icons-material/Payments';
import InventoryIcon from '@mui/icons-material/Inventory';
import CoHopersLogo from '../assets/images/BoldTribe Logo-3.png';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);

const SidebarContainer = styled(MotionBox)(({ theme }) => ({
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
}));

const Logo = styled(MotionBox)({
  padding: '10px 0',
  marginTop: '-80px',
  '& img': {
    width: 180,
    height: 'auto',
  },
});

const MenuItem = styled(MotionListItem)(({ active }) => ({
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  },
  padding: '10px 16px',
}));

const MenuItemText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
  },
});

const MenuItemIcon = styled(ListItemIcon)({
  minWidth: 40,
  color: 'white',
  '& .MuiSvgIcon-root': {
    fontSize: '1.3rem',
  },
});

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

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, active: true },
    { text: 'Users', icon: <PeopleIcon /> },
    { text: 'Active members', icon: <StarIcon /> },
    { text: 'Past members', icon: <HistoryIcon /> },
    { text: 'KYC', icon: <VerifiedUserIcon /> },
    { text: 'Payments', icon: <PaymentsIcon /> },
    { text: 'Inventory', icon: <InventoryIcon /> },
  ];

  return (
    <SidebarContainer
      initial="initial"
      animate="animate"
      variants={sidebarVariants}
    >
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
            button 
            key={item.text} 
            active={item.active}
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
  );
};

export default Sidebar; 