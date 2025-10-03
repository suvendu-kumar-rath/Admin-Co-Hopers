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
import PastMembers from './components/PastMembers.jsx';
import Inventory from './components/Inventory.jsx';
import Refreshment from './components/Refreshment.jsx';
import BookedSpaceDetails from './components/BookedSpaceDetails.jsx';

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
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Default Route - Dashboard */}
              <Route path="/" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Dashboard />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/users" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <User />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/active-members" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <ActiveMembers />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/past-members" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <PastMembers />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/book-meeting" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <BookMeetingRoom />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/inventory" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Inventory />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/refreshment" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Refreshment />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/booked-spaces" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <BookedSpaceDetails />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
            </Route>
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
