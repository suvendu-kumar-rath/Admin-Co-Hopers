import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: '#5B4DBC',
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
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
            <Dashboard />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
