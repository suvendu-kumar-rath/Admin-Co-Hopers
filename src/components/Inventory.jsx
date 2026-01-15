import React, { useState, useEffect } from 'react';
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
  Badge,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { spacesApi } from '../api';
import APITester from './APITester';

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

const CalendarContainer = styled(Box)({
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: 'white',
  marginTop: '8px',
});

const CalendarHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

const CalendarGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
});

const CalendarDay = styled(Box)(({ isbooked, isselected, istoday }) => {
  let backgroundColor = 'transparent';
  let color = '#374151';
  let border = '1px solid transparent';
  
  if (istoday) {
    border = '2px solid #3B82F6';
  }
  
  if (isbooked) {
    backgroundColor = '#FEE2E2';
    color = '#DC2626';
  }
  
  if (isselected) {
    backgroundColor = '#10B981';
    color = 'white';
  }
  
  return {
    padding: '8px',
    textAlign: 'center',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor,
    color,
    border,
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&:hover': {
      backgroundColor: isbooked ? '#FEE2E2' : (isselected ? '#047857' : '#F3F4F6'),
    },
  };
});

const DatePickerButton = styled(Button)(({ hasdate }) => ({
  backgroundColor: hasdate ? '#EBF8FF' : '#F9FAFB',
  color: hasdate ? '#2563EB' : '#6B7280',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '12px 16px',
  textTransform: 'none',
  fontWeight: 500,
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: hasdate ? '#DBEAFE' : '#F3F4F6',
  },
}));

// Sample booked dates (in real app, this would come from your backend)
const bookedDates = [
  '2024-12-25', '2024-12-26', '2024-12-31',
  '2025-01-01', '2025-01-15', '2025-02-14',
  '2025-03-10', '2025-03-15', '2025-04-01'
];

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
    space_name: '',
    seater: '',
    availability: 'AVAILABLE',
    roomNumber: '',
    cabinNumber: '',
    price: '',
    spaceImages: [],
    availableDates: [],
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const response = await spacesApi.fetchSpaces();
        
        console.log('📦 Raw API Response:', response);
        console.log('📦 First space object:', response.data?.[0]);
        
        // Transform API response to match expected format
        const transformedData = response.data?.map(space => {
          console.log('🔍 Processing space:', space);
          
          // Properly handle roomNumber and cabinNumber - check for null/undefined, not falsy
          const roomNum = space.roomNumber !== null && space.roomNumber !== undefined 
            ? String(space.roomNumber) 
            : (space.room_number !== null && space.room_number !== undefined ? String(space.room_number) : '');
          const cabinNum = space.cabinNumber !== null && space.cabinNumber !== undefined 
            ? String(space.cabinNumber) 
            : (space.cabin_number !== null && space.cabin_number !== undefined ? String(space.cabin_number) : '');
          
          console.log('🏠 Room/Cabin found:', { roomNum, cabinNum });
          console.log('🚦 Space availability from API:', space.availability);
          
          return {
            id: space.id,
            roomNumber: roomNum || 'N/A',
            cabinNumber: cabinNum || 'N/A',
            date: space.date || new Date().toISOString().split('T')[0],
            availability: space.availability || 'AVAILABLE',
            price: space.price || '0',
            space_name: space.space_name || space.name || 'Unknown',
            seater: space.seater || 1,
            spaceImages: space.images || space.spaceImages || space.space_images || [],
            availableDates: space.availableDates || space.available_dates || []
          };
        }) || [];
        
        console.log('✅ Transformed data:', transformedData);
        setInventoryItems(transformedData);
        setSnackbarMessage('Inventory data loaded successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setSnackbarMessage('Failed to load inventory data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        // Keep empty array if API fails
        setInventoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingItem(null);
    setOpenModal(true);
  };

  const handleEditModal = (item) => {
    console.log("inside edit modal", item)
    setIsEditMode(true);
    setEditingItem(item);
    
    // Convert existing image URLs to proper format for display
    const existingImages = (item.spaceImages || []).map(img => {
      if (typeof img === 'string') {
        return { type: 'url', value: img }; // Mark as existing URL
      }
      return img;
    });
    
    setFormData({
      space_name: item.space_name,
      availability: item.availability,
      roomNumber: item.roomNumber,
      cabinNumber: item.cabinNumber,
      price: item.price,
      seater: item.seater,                
      spaceImages: existingImages, // Load existing images with type markers
      availableDates: item.availableDates || [], // Load existing dates
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowCalendar(false);
    setIsEditMode(false);
    setEditingItem(null);
    setFormData({
      space_name: '',
      seater: '',
      availability: 'AVAILABLE',
      roomNumber: '',
      cabinNumber: '',
      price: '',
      spaceImages: [],
      availableDates: [],
    });
  };

  const handleInputChange = (field, value) => {
    console.log(`📝 Field changed: ${field} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const totalFiles = formData.spaceImages.length + files.length;
      if (totalFiles <= 5) {
        // Mark new files as type 'file'
        const newFiles = files.map(file => ({ type: 'file', value: file }));
        setFormData(prev => ({
          ...prev,
          spaceImages: [...prev.spaceImages, ...newFiles],
        }));
      } else {
        // Only add files up to the 5-file limit
        const remainingSlots = 5 - formData.spaceImages.length;
        if (remainingSlots > 0) {
          const newFiles = files.slice(0, remainingSlots).map(file => ({ type: 'file', value: file }));
          setFormData(prev => ({
            ...prev,
            spaceImages: [...prev.spaceImages, ...newFiles],
          }));
        }
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      spaceImages: prev.spaceImages.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Delete functionality
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      // Call the API to delete the item
      await spacesApi.deleteSpace(itemToDelete.id);
      
      // Remove item from local state
      setInventoryItems(prevItems => 
        prevItems.filter(item => item.id !== itemToDelete.id)
      );
      
      // Show success message
      setSnackbarMessage(`${itemToDelete.name} has been successfully deleted.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbarMessage('Failed to delete item. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Calendar helper functions
  const formatDate = (date) => {
    // Use local date without timezone offset to avoid one-day-before issue
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateBooked = (date) => {
    return bookedDates.includes(formatDate(date));
  };

  const isDateSelected = (date) => {
    return formData.availableDates.includes(formatDate(date));
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    
    // Don't allow selection of booked dates
    if (isDateBooked(date)) {
      return;
    }
    
    setFormData(prev => {
      const isSelected = prev.availableDates.includes(dateStr);
      if (isSelected) {
        // Remove date if already selected
        return {
          ...prev,
          availableDates: prev.availableDates.filter(d => d !== dateStr),
        };
      } else {
        // Add date if not selected
        return {
          ...prev,
          availableDates: [...prev.availableDates, dateStr],
        };
      }
    });
  };

  const changeMonth = (increment) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = async () => {
    // Validate required fields first
    if (!formData.space_name || !formData.seater || !formData.roomNumber || !formData.cabinNumber || !formData.price) {
      setSnackbarMessage('Please fill in all required fields (Space Name, Seater Size, Room Number, Cabin Number, and Price)');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Only validate images for new space creation (not for edit mode)
    if (!isEditMode) {
      // Validate minimum 1 photo requirement for new spaces
      if (formData.spaceImages.length === 0) {
        setSnackbarMessage('At least one image is required. Please upload at least 1 photo.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      // Validate image files for new spaces
      const validImages = formData.spaceImages.filter(img => 
        (img.type === 'file' && img.value instanceof File) || img instanceof File
      );
      if (validImages.length === 0) {
        setSnackbarMessage('Please upload valid image files.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
    }

    setLoading(true);
    
    console.log('📝 Form data before submit:', formData);
    console.log('� Availability value:', formData.availability);
    console.log('�🔧 Edit mode:', isEditMode);
    console.log('📌 Editing item:', editingItem);
    
    // Define submitData outside try block so it's accessible in catch block
    // Separate new files from existing URLs
    const newFiles = formData.spaceImages
      .filter(img => img.type === 'file')
      .map(img => img.value);
    const existingUrls = formData.spaceImages
      .filter(img => img.type === 'url')
      .map(img => img.value);
    
    const submitData = {
      space_name: formData.space_name,
      seater: formData.seater,
      price: formData.price,
      availability: formData.availability,
      spaceImages: isEditMode ? newFiles : formData.spaceImages.map(img => img.value || img),
      existingImages: isEditMode ? existingUrls : [], // Keep track of existing images
      availableDates: formData.availableDates,
      roomNumber: formData.roomNumber,
      cabinNumber: formData.cabinNumber,
    };
    
    console.log('📤 Submit data being sent to API:', submitData);
    
    try {

      if (isEditMode && editingItem) {
        // Update existing item
        await spacesApi.updateSpace(editingItem.id, submitData);
        setSnackbarMessage(`${formData.space_name} has been successfully updated.`);
      } else {
        // Create new item - try with full data first
        try {
          await spacesApi.create(submitData);
          setSnackbarMessage(`${formData.space_name} has been successfully added.`);
        } catch (fullDataError) {
          console.warn('Full data create failed, trying minimal data:', fullDataError);
          
          // Fallback: try with minimal required data only
          const minimalData = {
            space_name: formData.space_name,
            seater: formData.seater,
            price: formData.price,
            availability: formData.availability,
            spaceImages: [], // Empty spaceImages array
            availableDates: [] // Empty dates array
          };
          
          await spacesApi.create(minimalData);
          setSnackbarMessage(`${formData.space_name} has been added (with minimal data).`);
        }
      }
      
      // Refresh inventory data from API
      try {
        const response = await spacesApi.fetchSpaces();
        const transformedData = response.data?.map(space => {
          // Properly handle roomNumber and cabinNumber - check for null/undefined, not falsy
          const roomNum = space.roomNumber !== null && space.roomNumber !== undefined 
            ? String(space.roomNumber) 
            : (space.room_number !== null && space.room_number !== undefined ? String(space.room_number) : '');
          const cabinNum = space.cabinNumber !== null && space.cabinNumber !== undefined 
            ? String(space.cabinNumber) 
            : (space.cabin_number !== null && space.cabin_number !== undefined ? String(space.cabin_number) : '');
          
          console.log('🚦 Space availability from API:', space.availability);
          return {
            id: space.id,
            roomNumber: roomNum || 'N/A',
            cabinNumber: cabinNum || 'N/A',
            date: space.date || space.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            availability: space.availability || 'AVAILABLE',
            price: space.price || '0',
            space_name: space.space_name || space.name || 'Unknown',
            seater: space.seater || space.capacity || 1,
            spaceImages: space.images || space.spaceImages || space.space_images || [],
            availableDates: space.availableDates || space.available_dates || []
          };
        }) || [];
        setInventoryItems(transformedData);
        console.log('✅ Inventory refreshed successfully:', transformedData);
      } catch (refreshError) {
        console.error('Error refreshing data:', refreshError);
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseModal();
      
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      console.error('Submitted data was:', submitData);
      
      let errorMessage = isEditMode 
        ? 'Failed to update space. Please try again.' 
        : 'Failed to add space. Please try again.';
        
      // More specific error messages based on status
      if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please check the data format and try again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided. Please check all fields.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      }
      
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const paginatedData = inventoryItems.slice(
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

      {/* Debug Section - Remove this after fixing the 500 error */}
      <Accordion sx={{ mb: 2, border: '2px solid #ff9800' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fff3e0' }}>
          <Typography variant="h6" color="warning.main">
            🔧 Debug 500 Error - API Tester
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <APITester />
        </AccordionDetails>
      </Accordion>

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
                <StyledTableCell>SPACE NAME</StyledTableCell>
                <StyledTableCell>ROOM NO.</StyledTableCell>
                <StyledTableCell>CABIN NO.</StyledTableCell>
                <StyledTableCell>SEATER</StyledTableCell>
                <StyledTableCell>DATE</StyledTableCell>
                <StyledTableCell>AVAILABILITY</StyledTableCell>
                <StyledTableCell>PRICE</StyledTableCell>
                <StyledTableCell>ACTION</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <StyledTableRow key={`skeleton-${index}`}>
                    <StyledTableBodyCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ minWidth: '20px' }}>
                          {index + 1}
                        </Typography>
                        <Box sx={{ ml: 1, backgroundColor: '#f0f0f0', borderRadius: 1, width: 40, height: 40 }} />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                          Loading...
                        </Typography>
                      </Box>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                    <StyledTableBodyCell>Loading...</StyledTableBodyCell>
                  </StyledTableRow>
                ))
              ) : paginatedData.length === 0 ? (
                // No data message
                <StyledTableRow>
                  <StyledTableBodyCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No inventory data available
                    </Typography>
                  </StyledTableBodyCell>
                </StyledTableRow>
              ) : (
                // Actual data rows
                paginatedData.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableBodyCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ minWidth: '20px' }}>
                          {page * rowsPerPage + index + 1}
                        </Typography>
                        <RoomImage 
                          src={row.spaceImages?.[0] || '/default-room.jpg'} 
                          alt={`Room ${row.roomNumber}`}
                          sx={{ ml: 1 }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                          {row.space_name || `Room ${row.roomNumber}`}
                        </Typography>
                      </Box>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.roomNumber}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2">
                        {row.cabinNumber}
                      </Typography>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.seater} seats
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
                        ₹{row.price}
                      </Typography>
                    </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <Box display="flex" alignItems="center" gap={isSmall ? 0.5 : 1}>
                      {/* View icon removed as requested */}
                      <ActionButton 
                        actiontype="delete"
                        onClick={() => handleDeleteClick(row)}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize={isSmall ? "small" : "small"} />
                      </ActionButton>
                      <ActionButton 
                        actiontype="edit"
                        onClick={() => handleEditModal(row)}
                        disabled={loading}
                      >
                        <EditIcon fontSize={isSmall ? "small" : "small"} />
                      </ActionButton>
                    </Box>
                  </StyledTableBodyCell>
                </StyledTableRow>
                ))
              )}
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
              count={inventoryItems.length}
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
      <StyledDialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <StyledDialogTitle>
          {isEditMode ? `Edit ${editingItem?.roomNo}` : 'Add New Space'}
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
            Upload New Space Photos* (Minimum 1, Maximum 5 photos)
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280', mb: 2, display: 'block' }}>
            Upload spaceImages of the new space (at least 1 photo required, maximum 5 photos)
          </Typography>
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={formData.spaceImages.length >= 5}
          />
          <label htmlFor="file-upload">
            <UploadArea component="span" sx={{ 
              opacity: formData.spaceImages.length >= 5 ? 0.5 : 1,
              cursor: formData.spaceImages.length >= 5 ? 'not-allowed' : 'pointer'
            }}>
              <CloudUploadIcon sx={{ fontSize: 24, color: '#6B7280', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {formData.spaceImages.length >= 5 ? 'Maximum 5 photos reached' : 'Add Files'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                {formData.spaceImages.length}/5 photos selected
              </Typography>
            </UploadArea>
          </label>

          {/* Display uploaded spaceImages */}
          {formData.spaceImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Selected Photos:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.spaceImages.map((image, index) => {
                  // Handle both File objects and URL strings
                  let imageUrl;
                  const imageData = image.value || image; // Support both old and new structure
                  
                  if (imageData instanceof File) {
                    imageUrl = URL.createObjectURL(imageData);
                  } else if (typeof imageData === 'string') {
                    // Handle relative URLs from API - remove extra /api
                    if (imageData.startsWith('http')) {
                      imageUrl = imageData;
                    } else {
                      let apiURL = process.env.REACT_APP_API_URL || 'https://api.boldtribe.in/api';
                      const baseURL = apiURL.replace(/\/api$/, ''); // Remove trailing /api
                      imageUrl = imageData.startsWith('/') ? `${baseURL}${imageData}` : `${baseURL}/${imageData}`;
                    }
                  }
                  
                  return (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#F9FAFB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#999;">❌</div>';
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Space Name*"
                variant="outlined"
                value={formData.space_name}
                onChange={(e) => handleInputChange('space_name', e.target.value)}
                placeholder="Enter space name (e.g., Meeting Room A, Conference Hall)"
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
                label="Seater Size*"
                variant="outlined"
                type="number"
                value={formData.seater}
                onChange={(e) => handleInputChange('seater', e.target.value)}
                placeholder="Number of seats"
                inputProps={{ min: 1, max: 100 }}
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
                label="Price*"
                variant="outlined"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Price per hour/day"
                inputProps={{ min: 0 }}
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
                label="Room Number*"
                variant="outlined"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                placeholder="e.g., R101, A-205"
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
                placeholder="e.g., C001, CAB-12"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Grid>
            
            {/* Available Dates Section */}
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Available Dates*
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', mb: 2, display: 'block' }}>
                Select the dates when this space will be available
              </Typography>
              
              <DatePickerButton
                fullWidth
                hasdate={formData.availableDates.length > 0}
                onClick={() => setShowCalendar(!showCalendar)}
                startIcon={<CalendarTodayIcon />}
              >
                {formData.availableDates.length > 0 
                  ? `${formData.availableDates.length} date(s) selected`
                  : 'Select Available Dates'
                }
              </DatePickerButton>

              {showCalendar && (
                <CalendarContainer>
                  <CalendarHeader>
                    <IconButton onClick={() => changeMonth(-1)} size="small">
                      <Typography>‹</Typography>
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </Typography>
                    <IconButton onClick={() => changeMonth(1)} size="small">
                      <Typography>›</Typography>
                    </IconButton>
                  </CalendarHeader>

                  {/* Day names header */}
                  <CalendarGrid>
                    {dayNames.map(day => (
                      <Box
                        key={day}
                        sx={{
                          padding: '8px',
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: '12px',
                          color: '#6B7280',
                        }}
                      >
                        {day}
                      </Box>
                    ))}
                  </CalendarGrid>

                  {/* Calendar days */}
                  <CalendarGrid>
                    {getDaysInMonth().map((date, index) => (
                      <CalendarDay
                        key={index}
                        isbooked={date ? isDateBooked(date) : false}
                        isselected={date ? isDateSelected(date) : false}
                        istoday={date ? isToday(date) : false}
                        onClick={() => date && handleDateClick(date)}
                        sx={{
                          cursor: date ? (isDateBooked(date) ? 'not-allowed' : 'pointer') : 'default',
                          opacity: date ? 1 : 0,
                        }}
                      >
                        {date ? date.getDate() : ''}
                        {date && isDateBooked(date) && (
                          <EventBusyIcon 
                            sx={{ 
                              position: 'absolute', 
                              top: 2, 
                              right: 2, 
                              fontSize: 12,
                              color: '#DC2626'
                            }} 
                          />
                        )}
                      </CalendarDay>
                    ))}
                  </CalendarGrid>

                  {/* Legend */}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#10B981', borderRadius: '50%' }} />
                      <Typography variant="caption">Selected</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, backgroundColor: '#FEE2E2', borderRadius: '50%' }} />
                      <Typography variant="caption">Booked</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, border: '2px solid #3B82F6', borderRadius: '50%' }} />
                      <Typography variant="caption">Today</Typography>
                    </Box>
                  </Box>
                </CalendarContainer>
              )}

              {/* Selected dates display */}
              {formData.availableDates.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Selected Available Dates:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.availableDates.sort().map((dateStr, index) => (
                      <Chip
                        key={index}
                        label={new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        onDelete={() => {
                          setFormData(prev => ({
                            ...prev,
                            availableDates: prev.availableDates.filter(d => d !== dateStr),
                          }));
                        }}
                        size="small"
                        sx={{
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          '& .MuiChip-deleteIcon': {
                            color: '#059669',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ padding: '0 24px 24px', justifyContent: 'center' }}>
          <SubmitButton 
            onClick={handleSubmit}
            disabled={(!isEditMode && formData.spaceImages.length === 0) || loading}
            sx={{
              opacity: ((!isEditMode && formData.spaceImages.length === 0) || loading) ? 0.5 : 1,
              cursor: ((!isEditMode && formData.spaceImages.length === 0) || loading) ? 'not-allowed' : 'pointer',
            }}
          >
            {loading 
              ? (isEditMode ? 'Updating...' : 'Adding...') 
              : (isEditMode ? 'Update Space' : 'Submit')
            }
          </SubmitButton>
        </DialogActions>
      </StyledDialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>{itemToDelete?.roomNo}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The space will be permanently removed from the inventory.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

export default Inventory;
