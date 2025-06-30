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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion, AnimatePresence } from 'framer-motion';

const MotionAppBar = motion(AppBar);
const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const StyledAppBar = styled(MotionAppBar)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  color: '#000',
  marginTop: '20px',
});

const SearchTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F3F0FF',
    borderRadius: 20,
    '& fieldset': {
      border: 'none',
    },
  },
});

const UserProfile = styled(MotionBox)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
});

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar 
      position="static"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <Toolbar>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h5" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            Overview
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ flexGrow: 1, maxWidth: 400 }}
        >
          <SearchTextField
            placeholder="Search"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <MotionIconButton 
          sx={{ mr: 2 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <NotificationsIcon />
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
            <Avatar src="/path-to-user-image.jpg" />
          </motion.div>
          <Typography variant="subtitle1">Danielle Campbell</Typography>
          <MotionIconButton 
            size="small"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <KeyboardArrowDownIcon />
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