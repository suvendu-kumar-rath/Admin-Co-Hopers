import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import UpdateIcon from '@mui/icons-material/Update';
import NotificationsIcon from '@mui/icons-material/Notifications';
import appVersionApi from '../api/appVersion';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  border: '1px solid #e0e0e0',
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const AppVersionManagement = () => {
  const [formData, setFormData] = useState({
    androidVersion: '',
    iosVersion: '',
    changeLogMessage: '',
    forceUpdate: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock current version data - replace with actual API call
  const [currentVersions, setCurrentVersions] = useState({
    android: '1.2.3',
    ios: '1.2.3',
    lastUpdated: '2024-10-20',
    forceUpdateActive: false
  });

  useEffect(() => {
    fetchCurrentVersions();
  }, []);

  const fetchCurrentVersions = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await appVersionApi.getCurrentVersions();
        const data = response.data || response;
        
        setCurrentVersions({
          android: data.androidVersion || data.android_version || '1.0.0',
          ios: data.iosVersion || data.ios_version || '1.0.0',
          lastUpdated: data.lastUpdated || data.last_updated || new Date().toISOString().split('T')[0],
          forceUpdateActive: data.forceUpdate || data.force_update || false
        });
        
      } catch (apiError) {
        console.warn('API call failed, using default data:', apiError.message);
        // Keep the mock data as fallback
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching current versions:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch current version data',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = field === 'forceUpdate' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validation
    if (!formData.androidVersion && !formData.iosVersion) {
      setSnackbar({
        open: true,
        message: 'Please provide at least one version (Android or iOS)',
        severity: 'warning'
      });
      return;
    }

    if (!formData.changeLogMessage.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a change log message',
        severity: 'warning'
      });
      return;
    }

    try {
      setSaving(true);
      
      // Prepare the payload
      const payload = {
        androidVersion: formData.androidVersion || null,
        iosVersion: formData.iosVersion || null,
        changeLogMessage: formData.changeLogMessage,
        forceUpdate: formData.forceUpdate
      };
      
      // Try to update via API first
      try {
        const response = await appVersionApi.updateVersions(payload);
        console.log('API Response:', response);
        
        // Update current versions with response data or form data
        const updatedData = response.data || response;
        setCurrentVersions(prev => ({
          android: updatedData.androidVersion || formData.androidVersion || prev.android,
          ios: updatedData.iosVersion || formData.iosVersion || prev.ios,
          lastUpdated: updatedData.lastUpdated || new Date().toISOString().split('T')[0],
          forceUpdateActive: updatedData.forceUpdate !== undefined ? updatedData.forceUpdate : formData.forceUpdate
        }));
        
      } catch (apiError) {
        console.warn('API call failed, updating locally only:', apiError.message);
        
        // Fallback: update locally only
        setCurrentVersions(prev => ({
          ...prev,
          android: formData.androidVersion || prev.android,
          ios: formData.iosVersion || prev.ios,
          lastUpdated: new Date().toISOString().split('T')[0],
          forceUpdateActive: formData.forceUpdate
        }));
        
        setSnackbar({
          open: true,
          message: 'Updated locally (API unavailable)',
          severity: 'warning'
        });
        setSaving(false);
        return;
      }
      
      // Reset form on successful API call
      setFormData({
        androidVersion: '',
        iosVersion: '',
        changeLogMessage: '',
        forceUpdate: false
      });
      
      setSnackbar({
        open: true,
        message: 'App version updated successfully!',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error updating app version:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update app version. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', mb: 3 }}>
        App Version Management
      </Typography>

      {/* Current Version Status */}
      <SectionCard>
        <CardContent>
          <IconBox>
            <UpdateIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Current App Versions
            </Typography>
          </IconBox>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AndroidIcon sx={{ color: '#4CAF50' }} />
                <Typography variant="subtitle1" fontWeight="500">Android Version</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {currentVersions.android}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AppleIcon sx={{ color: '#000' }} />
                <Typography variant="subtitle1" fontWeight="500">iOS Version</Typography>
              </Box>
              <Typography variant="h5" color="primary">
                {currentVersions.ios}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {currentVersions.lastUpdated}
                </Typography>
                <Chip 
                  label={currentVersions.forceUpdateActive ? "Force Update Active" : "Force Update Inactive"} 
                  color={currentVersions.forceUpdateActive ? "error" : "default"}
                  size="small"
                  icon={<NotificationsIcon />}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </SectionCard>

      {/* Update Form */}
      <StyledPaper component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#333', mb: 3 }}>
          Update App Version
        </Typography>

        <Grid container spacing={3}>
          {/* Version Inputs */}
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AndroidIcon sx={{ color: '#4CAF50' }} />
              <Typography variant="subtitle1" fontWeight="500">Android Version</Typography>
              <Chip label="Optional" size="small" variant="outlined" />
            </Box>
            <TextField
              fullWidth
              placeholder="e.g., 1.2.4"
              value={formData.androidVersion}
              onChange={handleInputChange('androidVersion')}
              helperText="Leave empty to keep current version"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AppleIcon sx={{ color: '#000' }} />
              <Typography variant="subtitle1" fontWeight="500">iOS Version</Typography>
              <Chip label="Optional" size="small" variant="outlined" />
            </Box>
            <TextField
              fullWidth
              placeholder="e.g., 1.2.4"
              value={formData.iosVersion}
              onChange={handleInputChange('iosVersion')}
              helperText="Leave empty to keep current version"
              variant="outlined"
            />
          </Grid>

          {/* Change Log Message */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              Change Log Message *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe what's new in this version..."
              value={formData.changeLogMessage}
              onChange={handleInputChange('changeLogMessage')}
              variant="outlined"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Force Update Setting */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                Force Update Setting
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.forceUpdate}
                    onChange={handleInputChange('forceUpdate')}
                    color="error"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">
                      {formData.forceUpdate ? 'Force Update Enabled' : 'Force Update Disabled'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.forceUpdate 
                        ? 'Users will be required to update before using the app'
                        : 'Users can choose when to update the app'
                      }
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#8EC8D4',
                  '&:hover': {
                    bgcolor: '#7ab8c4'
                  }
                }}
              >
                {saving ? 'Updating...' : 'Update App Version'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default AppVersionManagement;