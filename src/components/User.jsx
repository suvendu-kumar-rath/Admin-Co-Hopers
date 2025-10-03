import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  styled,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Container = styled(Box)(({ theme }) => ({
  padding: '24px',
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    padding: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'stretch',
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: '400px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F8F9FA',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const StyledTableCell = styled(TableCell)({
  padding: '16px',
  '&.MuiTableCell-head': {
    backgroundColor: '#F8F9FA',
    fontWeight: 600,
    color: '#333',
  },
});

const DateCell = styled(Box)({
  padding: '6px 12px',
  borderRadius: '8px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: '#F8F9FA',
  color: '#333',
});

const User = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [leadToConfirm, setLeadToConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [leads, setLeads] = useState([
    { id: 1, name: 'Corey Stanton', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-01-15', mobile: '8567485158', email: 'corey@example.com', status: 'lead' },
    { id: 2, name: 'Adison Aminoff', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-02-20', mobile: '8567485159', email: 'adison@example.com', status: 'lead' },
    { id: 3, name: 'Alfredo Aminoff', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-03-10', mobile: '8567485160', email: 'alfredo@example.com', status: 'lead' },
    { id: 4, name: 'John Smith', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-02-28', mobile: '8567485161', email: 'john@example.com', status: 'lead' },
    { id: 5, name: 'Sarah Johnson', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-03-05', mobile: '8567485162', email: 'sarah@example.com', status: 'lead' },
    { id: 6, name: 'Mike Wilson', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-03-12', mobile: '8567485163', email: 'mike@example.com', status: 'lead' },
    { id: 7, name: 'Emma Davis', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-03-18', mobile: '8567485164', email: 'emma@example.com', status: 'lead' },
    { id: 8, name: 'Chris Brown', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-01-08', mobile: '8567485165', email: 'chris@example.com', status: 'lead' },
    { id: 9, name: 'Lisa Anderson', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', dateOfJoining: '2023-04-02', mobile: '8567485166', email: 'lisa@example.com', status: 'lead' },
  ]);

  // Leads data is now managed in state above

  const handleConfirmLead = (lead) => {
    setLeadToConfirm(lead);
    setConfirmDialogOpen(true);
  };

  const confirmLeadToActiveMember = () => {
    if (!leadToConfirm) return;

    // Get existing active members from localStorage
    const existingActiveMembers = JSON.parse(localStorage.getItem('activeMembers') || '[]');
    
    // Add the confirmed lead to active members with updated status and confirmation date
    const newActiveMember = {
      ...leadToConfirm,
      status: 'active',
      confirmationDate: new Date().toISOString(),
      membershipStartDate: new Date().toISOString()
    };
    
    const updatedActiveMembers = [...existingActiveMembers, newActiveMember];
    localStorage.setItem('activeMembers', JSON.stringify(updatedActiveMembers));

    // Remove the lead from the leads list
    setLeads(leads.filter(lead => lead.id !== leadToConfirm.id));

    // Close dialog and show success message
    setConfirmDialogOpen(false);
    setLeadToConfirm(null);
    setSuccessMessage(`${leadToConfirm.name} has been confirmed and moved to Active Members!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedLeads(leads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id) => {
    const newSelected = selectedLeads.includes(id)
      ? selectedLeads.filter(leadId => leadId !== id)
      : [...selectedLeads, id];
    setSelectedLeads(newSelected);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchContainer>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchField
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton sx={{ backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
              <FilterListIcon />
            </IconButton>
          </Box>
        </SearchContainer>

        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedLeads.length > 0 && selectedLeads.length < leads.length}
                    checked={selectedLeads.length === leads.length}
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>NAME</StyledTableCell>
                <StyledTableCell>ADDRESS</StyledTableCell>
                <StyledTableCell>DATE OF JOINING</StyledTableCell>
                <StyledTableCell>MOBILE</StyledTableCell>
                <StyledTableCell>MAIL</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                          {leads.map((lead) => (
              <TableRow
                key={lead.id}
                hover
                selected={selectedLeads.includes(lead.id)}
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleSelectLead(lead.id)}
                  />
                </StyledTableCell>
                <StyledTableCell>{lead.id}</StyledTableCell>
                <StyledTableCell>{lead.name}</StyledTableCell>
                <StyledTableCell>{lead.address}</StyledTableCell>
                <StyledTableCell>
                  <DateCell>{formatDate(lead.dateOfJoining)}</DateCell>
                </StyledTableCell>
                <StyledTableCell>{lead.mobile}</StyledTableCell>
                <StyledTableCell>{lead.email}</StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleConfirmLead(lead)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(68, 97, 242, 0.3)',
                      }
                    }}
                  >
                    Confirm
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            1-10 of 97
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(e.target.value)}
              size="small"
              sx={{ minWidth: 80 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Confirm Lead to Active Member
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to confirm <strong>{leadToConfirm?.name}</strong> as an active member?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action will move the lead to the Active Members section and cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button 
              onClick={() => setConfirmDialogOpen(false)}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmLeadToActiveMember}
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </MotionBox>
    </Container>
  );
};

export default User; 