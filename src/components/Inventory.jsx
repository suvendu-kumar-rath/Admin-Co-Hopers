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
  IconButton,
  Button,
  Typography,
  Chip,
  Avatar,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  styled,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Grid,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const MainContainer = styled(MotionBox)(({ theme }) => ({
  marginLeft: 0,
  padding: '20px 30px',
  backgroundColor: '#F8F9FA',
  minHeight: '100vh',
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0,
  },
  [theme.breakpoints.down('md')]: {
    padding: '16px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
  },
}));

const TableContainer_Styled = styled(TableContainer)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '12px',
  marginTop: '20px',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  overflowX: 'auto',
  [theme.breakpoints.down('md')]: {
    borderRadius: '8px',
    marginTop: '16px',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '14px',
  color: '#6B7280',
  textTransform: 'uppercase',
  borderBottom: '1px solid #E5E7EB',
  padding: '16px 12px',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '12px 8px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
    padding: '8px 6px',
  },
}));

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#F9FAFB',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid #F3F4F6',
  },
});

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  fontSize: '14px',
  color: '#374151',
  padding: '12px',
  borderBottom: 'none',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '8px 6px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
    padding: '6px 4px',
  },
}));

const StatusChip = styled(Chip)(({ status }) => {
  let backgroundColor, color;
  
  switch (status) {
    case 'AVAILABLE':
      backgroundColor = '#D1FAE5';
      color = '#065F46';
      break;
    case 'AVAILABLE SOON':
      backgroundColor = '#FEF3C7';
      color = '#92400E';
      break;
    case 'NOT AVAILABLE':
      backgroundColor = '#FEE2E2';
      color = '#991B1B';
      break;
    default:
      backgroundColor = '#F3F4F6';
      color = '#6B7280';
  }
  
  return {
    backgroundColor,
    color,
    fontSize: '12px',
    fontWeight: 600,
    height: '24px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  };
});

const ActionButton = styled(IconButton)(({ actiontype, theme }) => {
  let backgroundColor, color, hoverColor;
  
  switch (actiontype) {
    case 'view':
      backgroundColor = '#EBF8FF';
      color = '#2563EB';
      hoverColor = '#1D4ED8';
      break;
    case 'delete':
      backgroundColor = '#FEF2F2';
      color = '#DC2626';
      hoverColor = '#B91C1C';
      break;
    case 'edit':
      backgroundColor = '#ECFDF5';
      color = '#059669';
      hoverColor = '#047857';
      break;
    default:
      backgroundColor = '#F3F4F6';
      color = '#6B7280';
      hoverColor = '#4B5563';
  }
  
  return {
    backgroundColor,
    color,
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    margin: '0 2px',
    '&:hover': {
      backgroundColor,
      color: hoverColor,
    },
    [theme.breakpoints.down('md')]: {
      width: '28px',
      height: '28px',
      margin: '0 1px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '24px',
      height: '24px',
      margin: '0',
    },
  };
});

const RoomImage = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '8px',
  marginRight: '8px',
  [theme.breakpoints.down('md')]: {
    width: 40,
    height: 40,
    marginRight: '6px',
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    marginRight: '4px',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
    minWidth: '500px',
    maxWidth: '600px',
    margin: '16px',
    [theme.breakpoints.down('md')]: {
      minWidth: '400px',
      maxWidth: '500px',
      margin: '12px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '90vw',
      maxWidth: '90vw',
      margin: '8px',
      borderRadius: '12px',
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px 16px',
  fontSize: '20px',
  fontWeight: 600,
  color: '#1F2937',
});

const UploadArea = styled(Box)({
  border: '2px dashed #D1D5DB',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '16px',
  '&:hover': {
    borderColor: '#9CA3AF',
    backgroundColor: '#F9FAFB',
  },
});

const AvailabilityButton = styled(Button)(({ selected, availabilitytype }) => {
  let backgroundColor, color, hoverColor;
  
  switch (availabilitytype) {
    case 'AVAILABLE':
      backgroundColor = selected ? '#10B981' : '#ECFDF5';
      color = selected ? 'white' : '#059669';
      hoverColor = '#047857';
      break;
    case 'AVAILABLE SOON':
      backgroundColor = selected ? '#F59E0B' : '#FEF3C7';
      color = selected ? 'white' : '#D97706';
      hoverColor = '#B45309';
      break;
    case 'NOT AVAILABLE':
      backgroundColor = selected ? '#EF4444' : '#FEE2E2';
      color = selected ? 'white' : '#DC2626';
      hoverColor = '#B91C1C';
      break;
    default:
      backgroundColor = '#F3F4F6';
      color = '#6B7280';
      hoverColor = '#4B5563';
  }
  
  return {
    backgroundColor,
    color,
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 600,
    padding: '8px 16px',
    marginRight: '8px',
    marginBottom: '8px',
    borderRadius: '6px',
    border: 'none',
    '&:hover': {
      backgroundColor: hoverColor,
      color: 'white',
    },
  };
});

const SubmitButton = styled(Button)({
  backgroundColor: '#10B981',
  color: 'white',
  textTransform: 'uppercase',
  fontWeight: 600,
  padding: '12px 32px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#047857',
  },
});

// Sample data to match the image
const inventoryData = [
  {
    id: 1,
    roomNo: '703',
    cabinNo: 'C1',
    date: '02 JUN 2025',
    availability: 'AVAILABLE',
    price: '8567',
    image: '/api/placeholder/48/48'
  },
  {
    id: 2,
    roomNo: '703',
    cabinNo: 'C1',
    date: '02 JUN 2025',
    availability: 'AVAILABLE SOON',
    price: '8567',
    image: '/api/placeholder/48/48'
  },
  {
    id: 3,
    roomNo: '703',
    cabinNo: 'C1',
    date: '02 JUN 2025',
    availability: 'NOT AVAILABLE',
    price: '8567',
    image: '/api/placeholder/48/48'
  },
  // Add more sample data
  ...Array.from({ length: 7 }, (_, index) => ({
    id: index + 4,
    roomNo: '703',
    cabinNo: 'C1',
    date: '02 JUN 2025',
    availability: ['AVAILABLE', 'AVAILABLE SOON', 'NOT AVAILABLE'][index % 3],
    price: '8567',
    image: '/api/placeholder/48/48'
  }))
];

const Inventory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    availability: 'AVAILABLE',
    roomNumber: '',
    cabinNumber: '',
    price: '',
    image: null,
  });

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      availability: 'AVAILABLE',
      roomNumber: '',
      cabinNumber: '',
      price: '',
      image: null,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form data:', formData);
    // You can add your API call here
    handleCloseModal();
  };

  const paginatedData = inventoryData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <MainContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            fontWeight: 600, 
            color: '#1F2937',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
          }}
        >
          Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={!isSmall && <AddIcon />}
          onClick={handleOpenModal}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: '#4F46E5',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            '&:hover': {
              backgroundColor: '#4338CA',
            },
          }}
        >
          {isSmall ? 'Add Space' : 'Add New Space'}
        </Button>
      </Box>

      {/* Table Section */}
      <MotionPaper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <TableContainer_Styled>
          <Table sx={{ minWidth: isMobile ? '700px' : 'auto' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>SL</StyledTableCell>
                <StyledTableCell>ROOM NO.</StyledTableCell>
                <StyledTableCell>CABIN NO.</StyledTableCell>
                <StyledTableCell>DATE</StyledTableCell>
                <StyledTableCell>AVAILABILITY</StyledTableCell>
                <StyledTableCell>PRICE</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableBodyCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ minWidth: '20px' }}>
                        {page * rowsPerPage + index + 1}
                      </Typography>
                      <RoomImage 
                        src={row.image} 
                        alt={`Room ${row.roomNo}`}
                        sx={{ ml: 1 }}
                      />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                        {row.roomNo}
                      </Typography>
                    </Box>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.roomNo}
                    </Typography>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Typography variant="body2">
                      {row.cabinNo}
                    </Typography>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Typography variant="body2">
                      {row.date}
                    </Typography>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <StatusChip 
                      label={isSmall ? row.availability.split(' ')[0] : row.availability}
                      status={row.availability}
                      size="small"
                    />
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.price}
                    </Typography>
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Box display="flex" alignItems="center" gap={isSmall ? 0.5 : 1}>
                      <ActionButton actiontype="view">
                        <VisibilityIcon fontSize={isSmall ? "small" : "small"} />
                      </ActionButton>
                      <ActionButton actiontype="delete">
                        <DeleteIcon fontSize={isSmall ? "small" : "small"} />
                      </ActionButton>
                      <ActionButton actiontype="edit">
                        <EditIcon fontSize={isSmall ? "small" : "small"} />
                      </ActionButton>
                    </Box>
                  </StyledTableBodyCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer_Styled>
        
        {/* Pagination */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          p={{ xs: 1, sm: 2 }}
          sx={{ 
            borderTop: '1px solid #E5E7EB',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, inventoryData.length)} of ${inventoryData.length}`}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
            {!isSmall && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Rows per page:
                </Typography>
                <FormControl size="small">
                  <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    sx={{ 
                      fontSize: '14px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            
            <TablePagination
              component="div"
              count={inventoryData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[]}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiTablePagination-toolbar': {
                  minHeight: 'auto',
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  display: 'none',
                },
              }}
            />
          </Box>
        </Box>
      </MotionPaper>

      {/* Add New Space Modal */}
      <StyledDialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          Add New Space
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        
        <DialogContent sx={{ padding: '0 24px 24px' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#374151' }}>
            Space Details
          </Typography>
          
          {/* Upload Section */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Upload New Space Photo*
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280', mb: 2, display: 'block' }}>
            Upload an image of the new space
          </Typography>
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <UploadArea component="span">
              <CloudUploadIcon sx={{ fontSize: 24, color: '#6B7280', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Add File
              </Typography>
              {formData.image && (
                <Typography variant="caption" sx={{ color: '#059669', mt: 1, display: 'block' }}>
                  {formData.image.name}
                </Typography>
              )}
            </UploadArea>
          </label>

          {/* Availability Section */}
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Availability*
          </Typography>
          <Box sx={{ mb: 3 }}>
            {['AVAILABLE', 'AVAILABLE SOON', 'NOT AVAILABLE'].map((status) => (
              <AvailabilityButton
                key={status}
                selected={formData.availability === status}
                availabilitytype={status}
                onClick={() => handleInputChange('availability', status)}
              >
                {status}
              </AvailabilityButton>
            ))}
          </Box>

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Room Number*"
                variant="outlined"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cabin Number*"
                variant="outlined"
                value={formData.cabinNumber}
                onChange={(e) => handleInputChange('cabinNumber', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price*"
                variant="outlined"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ padding: '0 24px 24px', justifyContent: 'center' }}>
          <SubmitButton onClick={handleSubmit}>
            Submit
          </SubmitButton>
        </DialogActions>
      </StyledDialog>
    </MainContainer>
  );
};

export default Inventory;
