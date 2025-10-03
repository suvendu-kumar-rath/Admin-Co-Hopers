import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  // Since AuthContext is commented out, we'll use localStorage directly
  // This is a simple implementation - in a real app, use a proper auth system

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const isLoading = false; // Simplified for now

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

