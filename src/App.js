import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, useTheme, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar, { SidebarProvider } from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import User from './components/User.jsx';
import ActiveMembers from './components/Active members.jsx';
import BookMeetingRoom from './components/BookMeetingRoom.jsx';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';

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
        {/* <AuthProvider> */}
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Dashboard />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/" />
              
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <User />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/users" />
              
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <ActiveMembers />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/active-members" />
              
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <PastMembers />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/past-members" />
              
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <BookMeetingRoom />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/book-meeting" />
              
              <Route element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Inventory />
                  </ResponsiveLayout>
                </SidebarProvider>
              } path="/inventory" />
            </Route>
            
            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        {/* </AuthProvider> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;
