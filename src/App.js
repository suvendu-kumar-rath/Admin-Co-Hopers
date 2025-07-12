import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import User from './components/User';
import ActiveMembers from './components/Active members';
import Kyc from './components/Kyc';
import Payments from './components/Payments';
import PastMembers from './components/PastMembers';
import Inventory from './components/Inventory';

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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1 }}>
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
              <Route path="/kyc" element={
                <>
                  <Header />
                  <Kyc />
                </>
              } />
              <Route path="/payments" element={
                <>
                  <Header />
                  <Payments />
                </>
              } />
              <Route path="/inventory" element={
                <>
                  <Header />
                  <Inventory />
                </>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
