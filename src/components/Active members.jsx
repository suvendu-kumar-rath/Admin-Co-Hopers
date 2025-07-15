import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const StyledPaper = styled(Paper)({
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
});

const columns = [
  { id: 'id', label: 'ID', minWidth: 40 },
  { id: 'name', label: 'NAME', minWidth: 120 },
  { id: 'address', label: 'ADDRESS', minWidth: 170 },
  { id: 'start', label: 'START', minWidth: 80 },
  { id: 'end', label: 'END', minWidth: 80 },
  { id: 'unit', label: 'UNIT', minWidth: 60 },
  { id: 'amount', label: 'AMOUNT', minWidth: 80 },
  { id: 'mail', label: 'MAIL', minWidth: 180 },
  { id: 'details', label: 'DETAILS', minWidth: 60 },
];

const rows = [
  { id: 1, name: 'Ann Culhane', phone: '5684320536', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 2, name: 'Ahmad Rosser', phone: '5684320537', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 3, name: 'Zain Calzoni', phone: '5684320538', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 4, name: 'Leo Stanton', phone: '5684320539', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 5, name: 'Kalya Vetovas', phone: '5684320540', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 6, name: 'Ryan Westervet', phone: '5684320541', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 7, name: 'Corey Stanton', phone: '5684320542', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 8, name: 'Adison Aminoff', phone: '5684320533', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
  { id: 9, name: 'Alfredo Aminoff', phone: '5684320534', address: 'Lorem ipsum elit. Nulla...', start: '1 JAN 2025', end: '1 JAN 2025', unit: '605', amount: '5158', mail: 'sbdhjbj13@gmail.com' },
];

const ActiveMembers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((row) => row.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase()) ||
    row.mail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton sx={{ mr: 1, bgcolor: '#E6F0F3', borderRadius: 2 }}>
          <FilterListIcon />
        </IconButton>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 300, bgcolor: '#F8F9FA', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography sx={{ ml: 2, color: '#A0AEC0', fontWeight: 500 }}>
          Active Members
        </Typography>
      </Box>
      <StyledPaper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ padding: '16px' }}>
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                    checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth, fontWeight: 700, color: '#6B7280', background: '#F8F9FA', padding: '16px' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox" sx={{ padding: '16px' }}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleClick(row.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.id}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{row.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#A0AEC0' }}>{row.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.address}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.start}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.end}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.unit}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.amount}</TableCell>
                    <TableCell sx={{ padding: '16px' }}>{row.mail}</TableCell>
                    <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                      <VisibilityIcon sx={{ color: '#3B82F6', background: '#E8F0FE', borderRadius: '50%', fontSize: 22, p: '2px' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </Container>
  );
};

export default ActiveMembers;
