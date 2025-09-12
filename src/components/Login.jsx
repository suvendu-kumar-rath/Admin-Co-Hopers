import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  InputAdornment, 
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the API for authentication
      const data = await authApi.login({ email, password });

      // Normalize token from possible response shapes
      const token = data?.token || data?.access_token || data?.authToken;

      // If API uses token-based auth or sets httpOnly cookies, consider both
      if (token || data?.success === true) {
        localStorage.setItem('isAuthenticated', 'true');
        if (token) {
          localStorage.setItem('authToken', token);
        }
        navigate('/');
      } else {
        const serverMessage = data?.message || 'Invalid response from server';
        setError(serverMessage);
      }
    } catch (err) {
      // Axios error shape normalization
      const status = err?.response?.status ?? err?.status;
      const serverMessage = err?.response?.data?.message || err?.message;
      console.error('Login error:', { status, serverMessage, err });

      if (status === 401) {
        setError('Invalid email or password');
      } else if (status === 0 || (typeof status === 'number' && status >= 500)) {
        setError('Server error. Please try again later.');
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img 
              src={process.env.PUBLIC_URL + '/assets/images/BoldTribe Logo-3.png'} 
              alt="Co-Hopers Logo" 
              style={{ height: '60px', marginBottom: '16px' }} 
            />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access the admin dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 1 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
