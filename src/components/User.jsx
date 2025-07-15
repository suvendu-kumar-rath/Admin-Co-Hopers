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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
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

const AddButton = styled(Button)({
  backgroundColor: '#4461F2',
  borderRadius: '8px',
  textTransform: 'none',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#3451E2',
  },
});

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

const StatusChip = styled(Box)(({ status }) => ({
  padding: '6px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: 
    status === 'Open' ? '#EEF2FF' :
    status === 'Paid' ? '#ECFDF3' :
    status === 'Due' ? '#FEF2F2' :
    '#F3F4F6',
  color:
    status === 'Open' ? '#4F46E5' :
    status === 'Paid' ? '#059669' :
    status === 'Due' ? '#DC2626' :
    '#6B7280',
}));

const User = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const users = [
    { id: 1, name: 'Ann Culhane', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Open', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 2, name: 'Ahmad Rosser', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Paid', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 3, name: 'Zain Calzoni', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Open', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 4, name: 'Leo Stanton', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Inactive', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 5, name: 'Kaiya Vetrovs', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Open', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 6, name: 'Ryan Westervelt', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Paid', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 7, name: 'Corey Stanton', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Due', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 8, name: 'Adison Aminoff', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Open', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
    { id: 9, name: 'Alfredo Aminoff', address: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...', status: 'Inactive', mobile: '8567485158', email: 'sbdhbi@136gmail.com' },
  ];

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    const newSelected = selectedUsers.includes(id)
      ? selectedUsers.filter(userId => userId !== id)
      : [...selectedUsers, id];
    setSelectedUsers(newSelected);
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
          <AddButton
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add user
          </AddButton>
        </SearchContainer>

        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                  />
                </StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>NAME</StyledTableCell>
                <StyledTableCell>ADDRESS</StyledTableCell>
                <StyledTableCell>STATUS</StyledTableCell>
                <StyledTableCell>MOBILE</StyledTableCell>
                <StyledTableCell>MAIL</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  selected={selectedUsers.includes(user.id)}
                  component={motion.tr}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{user.id}</StyledTableCell>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.address}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip status={user.status}>{user.status}</StatusChip>
                  </StyledTableCell>
                  <StyledTableCell>{user.mobile}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
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
      </MotionBox>
    </Container>
  );
};

export default User; 