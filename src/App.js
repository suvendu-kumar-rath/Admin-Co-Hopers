import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, useTheme, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar, { SidebarProvider } from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import User from './components/User.jsx';
import ActiveMembers from './components/Active members.jsx';
import BookMeetingRoom from './components/BookMeetingRoom.jsx';

import PastMembers from './components/PastMembers.jsx';
import Inventory from './components/Inventory.jsx';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#4461F2',
    },
    background: {
      default: '#F8F9FA',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

// Responsive Layout Component
const ResponsiveLayout = ({ children }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <Box 
        sx={{ 
          flexGrow: 1,
          marginLeft: isLargeScreen ? '250px' : '0',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease-in-out',
          width: isLargeScreen ? 'calc(100% - 250px)' : '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SidebarProvider>
          <Sidebar />
          <ResponsiveLayout>
            <Routes>
              <Route path="/" element={
                <>
                  <Header />
                  <Dashboard />
                </>
              } />
              <Route path="/users" element={<User />} />
              <Route path="/active-members" element={
                <>
                  <Header />
                  <ActiveMembers />
                </>
              } />
              <Route path="/past-members" element={
                <>
                  <Header />
                  <PastMembers />
                </>
              } />
              
              <Route path="/book-meeting" element={
                <>
                  <Header />
                  <BookMeetingRoom />
                </>
              } />

              <Route path="/inventory" element={
                <>
                  <Header />
                  <Inventory />
                </>
              } />
            </Routes>
          </ResponsiveLayout>
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
