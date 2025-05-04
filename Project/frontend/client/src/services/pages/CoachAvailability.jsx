import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  AccessTime,
  CalendarToday,
  Person,
  Schedule,
  Group,
  CheckCircle,
  Warning,
  Email,
  Phone,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import coachAvailabilityService from '../services/coachAvailabilityService';

/**
 * CoachAvailability Component
 * 
 * Features:
 * - Set working days and time ranges
 * - Manage member assignments
 *   - Session Capacity Management:
 *     - Each time range can have its own capacity
 *     - Capacity is displayed in the time ranges table
 *     - Default capacity is 1 if not specified
 *     - Capacity can be set when adding/editing time ranges
 */

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontWeight: 500,
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DayChip = styled(Chip)(({ theme, selected }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.default,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const CoachAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({
    days: [],
    timeRanges: [],
  });
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [openTimeDialog, setOpenTimeDialog] = useState(false);
  const [newTimeRange, setNewTimeRange] = useState({
    startTime: '',
    endTime: '',
    day: '',
    capacity: 1
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [editingTimeRange, setEditingTimeRange] = useState(null);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  useEffect(() => {
    console.log('CoachAvailability component mounted');
    console.log('Current user:', user);
    console.log('User ID:', user?.id || user?._id);
    if (user && (user.role === 'coach' || user.role === 'instructor')) {
      loadCoachAvailability();
    }
  }, [user]);

  const loadCoachAvailability = async () => {
    try {
      setLoading(true);
      const userId = user?.id || user?._id;
      console.log('Loading coach availability for user:', userId);
      const data = await coachAvailabilityService.getCoachAvailability(userId);
      console.log('Received data:', data);
      
      if (data) {
        setAvailability({
          days: data.availability.map(day => day.day),
          timeRanges: data.availability.flatMap(day => 
            day.timeRanges.map(range => ({
              ...range,
              day: day.day,
              id: `${day.day}-${range.startTime}-${range.endTime}`
            }))
          ),
        });

        const memberData = data.assignedMembers?.map(assignment => ({
          _id: assignment.memberId._id,
          name: assignment.memberId.name,
          email: assignment.memberId.email,
          membershipType: assignment.memberId.membershipType
        })) || [];

        setAssignedMembers(memberData);
      } else {
        console.log('No availability data found');
        setAvailability({
          days: [],
          timeRanges: [],
        });
        setAssignedMembers([]);
      }
    } catch (error) {
      console.error('Error loading coach availability:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load availability: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
      setAvailability({
        days: [],
        timeRanges: [],
      });
      setAssignedMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleEditTimeRange = (range) => {
    setEditingTimeRange(range);
    setNewTimeRange({
      startTime: range.startTime,
      endTime: range.endTime,
      day: range.day,
      capacity: range.capacity || 1
    });
    setOpenTimeDialog(true);
  };

  const handleAddTimeRange = () => {
    if (newTimeRange.startTime && newTimeRange.endTime && newTimeRange.day) {
      if (editingTimeRange) {
        // Update existing time range
        setAvailability(prev => ({
          ...prev,
          timeRanges: prev.timeRanges.map(range => 
            range.id === editingTimeRange.id 
              ? { ...newTimeRange, id: range.id }
              : range
          )
        }));
        setEditingTimeRange(null);
      } else {
        // Add new time range
        setAvailability(prev => ({
          ...prev,
          timeRanges: [...prev.timeRanges, { ...newTimeRange, id: Date.now() }]
        }));
      }
      setNewTimeRange({ startTime: '', endTime: '', day: '', capacity: 1 });
      setOpenTimeDialog(false);
    }
  };

  const handleCloseTimeDialog = () => {
    setOpenTimeDialog(false);
    setEditingTimeRange(null);
    setNewTimeRange({ startTime: '', endTime: '', day: '', capacity: 1 });
  };

  const handleRemoveTimeRange = (id) => {
    setAvailability(prev => ({
      ...prev,
      timeRanges: prev.timeRanges.filter(range => range.id !== id)
    }));
  };

  const handleSaveAvailability = async () => {
    try {
      setLoading(true);
      const formattedAvailability = availability.days.map(day => ({
        day,
        timeRanges: availability.timeRanges
          .filter(range => range.day === day)
          .map(({ startTime, endTime, capacity }) => ({ startTime, endTime, capacity })),
      }));

      await coachAvailabilityService.updateAvailability(
        formattedAvailability
      );
      
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Availability saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save availability',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'coach' && user.role !== 'instructor')) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Access Denied. This page is for coaches only.
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">
            Loading availability...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Grid container spacing={4}>
          {/* Header Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Coach Availability Management
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Set your working hours and view assigned members
                  </Typography>
                </Box>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Assigned Members Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Person sx={{ fontSize: 28 }} />
                  Assigned Members
                </Typography>
              </Box>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Membership</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedMembers.map((member) => (
                      <StyledTableRow key={member._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ color: 'primary.main' }} />
                            {member.name}
                          </Box>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={member.membershipType}
                            color={member.membershipType === 'Platinum' ? 'primary' : 
                                   member.membershipType === 'Gold' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledPaper>
          </Grid>

          {/* Current Availability Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Schedule sx={{ fontSize: 28 }} />
                  Current Availability
                </Typography>
                <StyledButton
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Availability
                </StyledButton>
              </Box>

              {isEditing ? (
                <>
                  {/* Days Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <CalendarToday sx={{ fontSize: 20 }} />
                      Select Working Days
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {days.map(day => (
                        <DayChip
                          key={day}
                          label={day}
                          selected={availability.days.includes(day)}
                          onClick={() => handleDayToggle(day)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Time Ranges */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <AccessTime sx={{ fontSize: 20 }} />
                      Add Time Ranges
                    </Typography>
                    <StyledButton
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenTimeDialog(true)}
                      sx={{ mb: 3 }}
                    >
                      Add Time Range
                    </StyledButton>

                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Day</StyledTableCell>
                            <StyledTableCell>Start Time</StyledTableCell>
                            <StyledTableCell>End Time</StyledTableCell>
                            <StyledTableCell>Capacity</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {availability.timeRanges.map((range) => (
                            <StyledTableRow key={range.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarToday sx={{ color: 'primary.main' }} />
                                  {range.day}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AccessTime sx={{ color: 'primary.main' }} />
                                  {range.startTime}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AccessTime sx={{ color: 'primary.main' }} />
                                  {range.endTime}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Group sx={{ color: 'primary.main' }} />
                                  {range.capacity || 1}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="Edit Time Range">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditTimeRange(range)}
                                      sx={{
                                        color: 'primary.main',
                                        '&:hover': {
                                          backgroundColor: 'primary.light',
                                          color: 'primary.contrastText',
                                        },
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove Time Range">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleRemoveTimeRange(range.id)}
                                      sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                          backgroundColor: 'error.light',
                                          color: 'error.contrastText',
                                        },
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Save Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={handleSaveAvailability}
                      disabled={loading || availability.days.length === 0 || availability.timeRanges.length === 0}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                    >
                      {loading ? 'Saving...' : 'Save Availability'}
                    </StyledButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <CalendarToday sx={{ fontSize: 20 }} />
                      Working Days:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {availability.days.map(day => (
                        <Chip 
                          key={day} 
                          label={day}
                          color="primary"
                          variant="outlined"
                          icon={<CheckCircle />}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <AccessTime sx={{ fontSize: 20 }} />
                      Time Ranges:
                    </Typography>
                    <TableContainer 
                      component={Paper} 
                      sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                        mt: 2,
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Day</StyledTableCell>
                            <StyledTableCell>Time Range</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {availability.timeRanges.map((range) => (
                            <StyledTableRow key={range.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CalendarToday sx={{ color: 'primary.main' }} />
                                  {range.day}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <AccessTime sx={{ color: 'primary.main' }} />
                                  {`${range.startTime} - ${range.endTime}`}
                                </Box>
                              </TableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
            </StyledPaper>
          </Grid>
        </Grid>

        {/* Time Range Dialog */}
        <Dialog 
          open={openTimeDialog} 
          onClose={handleCloseTimeDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 600,
          }}>
            {editingTimeRange ? 'Edit Time Range' : 'Add Time Range'}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={newTimeRange.day}
                    label="Day"
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, day: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {availability.days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Start Time</InputLabel>
                  <Select
                    value={newTimeRange.startTime}
                    label="Start Time"
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, startTime: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>End Time</InputLabel>
                  <Select
                    value={newTimeRange.endTime}
                    label="End Time"
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, endTime: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Capacity"
                  type="number"
                  value={newTimeRange.capacity}
                  onChange={(e) => setNewTimeRange({ ...newTimeRange, capacity: parseInt(e.target.value) || 1 })}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button 
              onClick={handleCloseTimeDialog}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddTimeRange}
              variant="contained"
              color="primary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {editingTimeRange ? 'Update Time Range' : 'Add Time Range'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default CoachAvailability; 