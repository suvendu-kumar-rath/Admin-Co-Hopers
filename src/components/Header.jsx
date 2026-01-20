import React, { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  Avatar,
  styled,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';  

const MotionAppBar = motion(AppBar);
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const StyledAppBar = styled(MotionAppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: '#000',
  marginTop: '20px',
  marginLeft: 0,
  width: '100%',
  padding: '0 20px',
  [theme.breakpoints.up('lg')]: {
    marginLeft: 0,
    width: '100%',
  },
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0,
    marginTop: '80px', // Account for mobile menu button
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '70px',
    padding: '0 16px',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '60px',
    padding: '0 12px',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F3F0FF',
    borderRadius: 20,
    fontSize: '14px',
    '& fieldset': {
      border: 'none',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '13px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    },
  },
}));

const UserProfile = styled(MotionBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    gap: 6,
  },
  [theme.breakpoints.down('sm')]: {
    gap: 4,
  },
}));

const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: 8,
    minWidth: 180,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
});

const StyledMenuItem = styled(MenuItem)({
  padding: '10px 20px',
  gap: 12,
  '&:hover': {
    backgroundColor: '#F3F0FF',
  },
});

const MotionMenuItem = motion(StyledMenuItem);

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
    handleClose();
  };
  
  // const navigate = useNavigate();

  // Logout functionality removed - direct access to dashboard

  return (
    <StyledAppBar 
      position="static"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' }, px: { xs: 1, sm: 2, md: 3 } }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 0, 
              mr: { xs: 1, sm: 2, md: 4 },
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Overview
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ 
            flexGrow: 1, 
            maxWidth: isMobile ? 200 : 400,
            minWidth: isSmall ? 120 : 180 
          }}
        >
          <SearchTextField
            placeholder="Search"
            fullWidth
            size={isMobile ? "small" : "medium"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize={isSmall ? "small" : "medium"} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <MotionIconButton 
          sx={{ 
            mr: { xs: 1, sm: 2 },
            padding: { xs: '6px', sm: '8px' }
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <NotificationsIcon fontSize={isSmall ? "small" : "medium"} />
        </MotionIconButton>
        
                  <UserProfile 
            onClick={handleClick}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Avatar 
                src="/path-to-user-image.jpg"
                sx={{ 
                  width: { xs: 32, sm: 40 }, 
                  height: { xs: 32, sm: 40 } 
                }}
              />
            </motion.div>
            {!isSmall && (
              <Typography 
                variant="subtitle1"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Admin Co-Hopers
              </Typography>
            )}
            <MotionIconButton 
              size="small"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              sx={{ padding: { xs: '4px', sm: '6px' } }}
            >
              <KeyboardArrowDownIcon fontSize={isSmall ? "small" : "medium"} />
            </MotionIconButton>
          </UserProfile>

        <AnimatePresence>
          {open && (
            <StyledMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MotionMenuItem
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MotionMenuItem>
              <MotionMenuItem
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={handleLogout}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MotionMenuItem>
            </StyledMenu>
          )}
        </AnimatePresence>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;