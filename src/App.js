import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme, useTheme, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar, { SidebarProvider } from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import User from './components/User.jsx';
import ActiveMembers from './components/Active members.jsx';
import Visitors from './components/Visitors.jsx';
import BookMeetingRoom from './components/BookMeetingRoom.jsx';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PastMembers from './components/PastMembers.jsx';
import Inventory from './components/Inventory.jsx';
import Refreshment from './components/Refreshment.jsx';
import Utilities from './components/Utilities.jsx';
import AppVersionManagement from './components/AppVersionManagement.jsx';
import KycApproval from './components/KycApproval.jsx';
import { onMessageListener } from './config/firebase';


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
          maxHeight: '100vh',
          transition: 'margin-left 0.3s ease-in-out',
          width: isLargeScreen ? 'calc(100% - 250px)' : '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#8EC8D4',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#7BB8C5',
            },
          },
          // Firefox scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: '#8EC8D4 #f1f1f1',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

function App() {
  const [notification, setNotification] = useState({
    show: false,
    title: '',
    body: '',
    severity: 'info'
  });

  useEffect(() => {
    console.log('🎬 App mounted, setting up notification listener...');
    
    // Create notification sound
    const playNotificationSound = () => {
      try {
        // Use Web Audio API to create a notification beep
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        console.log('🔊 Notification sound played');
      } catch (error) {
        console.error('❌ Error playing notification sound:', error);
      }
    };
    
    // Listen for foreground Firebase messages - ALWAYS listen, not just when enabled
    const unsubscribe = onMessageListener((payload) => {
      console.log('🔔 ========== NOTIFICATION RECEIVED IN APP ==========');
      console.log('Full payload:', JSON.stringify(payload, null, 2));
      console.log('Notification object:', payload.notification);
      console.log('Data object:', payload.data);
      
      const title = payload.notification?.title || payload.data?.title || 'New Order';
      const body = payload.notification?.body || payload.data?.body || 'You have a new order';
      
      console.log('Extracted notification:', { title, body });
      
      // Play notification sound
      playNotificationSound();
      
      // Show in-app notification popup
      setNotification({
        show: true,
        title: title,
        body: body,
        severity: 'info'
      });
      console.log('✅ In-app snackbar notification set');

      // Also show browser notification if permission granted
      if (Notification.permission === 'granted') {
        try {
          const browserNotif = new Notification(title, {
            body: body,
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: 'order-notification',
            requireInteraction: true,
            vibrate: [200, 100, 200]
          });
          
          browserNotif.onclick = () => {
            window.focus();
            browserNotif.close();
          };
          
          console.log('✅ Browser notification shown with sound');
        } catch (error) {
          console.error('❌ Error showing browser notification:', error);
        }
      } else {
        console.log('⚠️ Browser notification permission:', Notification.permission);
        console.log('💡 Ask user to grant notification permission');
      }
      
      console.log('====================================================');
    });

    const checkStatus = () => {
      const pushToken = localStorage.getItem('pushToken');
      const notificationsEnabled = localStorage.getItem('pushNotificationsEnabled') === 'true';
      console.log('📊 Current Status:', { 
        enabled: notificationsEnabled, 
        hasToken: !!pushToken,
        permission: Notification.permission,
        token: pushToken?.substring(0, 20) + '...'
      });
      
      if (!notificationsEnabled) {
        console.warn('⚠️ Push notifications are NOT enabled. Please enable them from any page.');
      }
      if (Notification.permission !== 'granted') {
        console.warn('⚠️ Browser notification permission is NOT granted. Current:', Notification.permission);
      }
    };
    
    checkStatus();
    
    return () => {
      if (unsubscribe) {
        console.log('🔕 Unsubscribing from message listener');
        unsubscribe();
      }
    };
  }, []);

  const handleCloseNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Global Notification Snackbar */}
      <Snackbar
        open={notification.show}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            minWidth: '300px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          <Box>
            <Box sx={{ fontWeight: 'bold', mb: 0.5 }}>{notification.title}</Box>
            <Box>{notification.body}</Box>
          </Box>
        </Alert>
      </Snackbar>

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
              
              <Route path="/visitors" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Visitors />
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
              
              <Route path="/kyc-approval" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <KycApproval />
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

              <Route path="/utilities" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <Utilities />
                  </ResponsiveLayout>
                </SidebarProvider>
              } />
              
              <Route path="/app-version" element={
                <SidebarProvider>
                  <Sidebar />
                  <ResponsiveLayout>
                    <Header />
                    <AppVersionManagement />
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
