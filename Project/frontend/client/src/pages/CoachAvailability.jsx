import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  AccessTime,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockUsers } from '../mockData/scheduleData';
import coachAvailabilityService from '../services/coachAvailabilityService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const CoachAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({
    days: [],
    timeRanges: [],
    maxMembersPerSession: 1
  });
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [openTimeDialog, setOpenTimeDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [newTimeRange, setNewTimeRange] = useState({
    startTime: '',
    endTime: '',
    day: ''
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

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
          maxMembersPerSession: data.availability[0]?.maxMembersPerSession || 1
        });
        setAssignedMembers(data.assignedMembers || []);
        setIsFirstTime(false);
      } else {
        // If no data is found, show first-time setup
        console.log('No availability data found, showing first-time setup');
        setIsFirstTime(true);
        setAvailability({
          days: [],
          timeRanges: [],
          maxMembersPerSession: 1
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
      // Show first-time setup on error
      setIsFirstTime(true);
      setAvailability({
        days: [],
        timeRanges: [],
        maxMembersPerSession: 1
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

  const handleAddTimeRange = () => {
    if (newTimeRange.startTime && newTimeRange.endTime && newTimeRange.day) {
      setAvailability(prev => ({
        ...prev,
        timeRanges: [...prev.timeRanges, { ...newTimeRange, id: Date.now() }]
      }));
      setNewTimeRange({ startTime: '', endTime: '', day: '' });
      setOpenTimeDialog(false);
    }
  };

  const handleRemoveTimeRange = (id) => {
    setAvailability(prev => ({
      ...prev,
      timeRanges: prev.timeRanges.filter(range => range.id !== id)
    }));
  };

  const handleAssignMember = async () => {
    if (selectedMember) {
      try {
        await coachAvailabilityService.assignMember(selectedMember._id);
        setAssignedMembers(prev => [...prev, selectedMember]);
        setSelectedMember(null);
        setOpenMemberDialog(false);
        setSnackbar({
          open: true,
          message: 'Member assigned successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to assign member',
          severity: 'error'
        });
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await coachAvailabilityService.removeMember(memberId);
      setAssignedMembers(prev => prev.filter(member => member.memberId._id !== memberId));
      setSnackbar({
        open: true,
        message: 'Member removed successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove member',
        severity: 'error'
      });
    }
  };

  const handleSaveAvailability = async () => {
    try {
      setLoading(true);
      const formattedAvailability = availability.days.map(day => ({
        day,
        timeRanges: availability.timeRanges
          .filter(range => range.day === day)
          .map(({ startTime, endTime }) => ({ startTime, endTime })),
        maxMembersPerSession: availability.maxMembersPerSession
      }));

      await coachAvailabilityService.updateAvailability(
        formattedAvailability,
        availability.maxMembersPerSession
      );
      
      setIsFirstTime(false);
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
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied. This page is for coaches only.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">
          Loading availability...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h4" component="h1" gutterBottom>
              Coach Availability Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Set your working hours and manage member assignments
            </Typography>
          </StyledPaper>
        </Grid>

        {isFirstTime ? (
          // First-time setup view
          <Grid item xs={12}>
            <StyledPaper>
              <Alert severity="info" sx={{ mb: 2 }}>
                Welcome! Please set up your availability to start managing member schedules.
              </Alert>
              
              {/* Days Selection */}
              <Typography variant="h6" gutterBottom>
                Select Working Days
              </Typography>
              <FormGroup row sx={{ mb: 3 }}>
                {days.map(day => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={availability.days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        name={day}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>

              {/* Time Ranges */}
              <Typography variant="h6" gutterBottom>
                Add Time Ranges
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenTimeDialog(true)}
                sx={{ mb: 2 }}
              >
                Add Time Range
              </Button>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availability.timeRanges.map((range) => (
                      <TableRow key={range.id}>
                        <TableCell>{range.day}</TableCell>
                        <TableCell>{range.startTime}</TableCell>
                        <TableCell>{range.endTime}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveTimeRange(range.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Max Members Per Session */}
              <TextField
                type="number"
                label="Max Members Per Session"
                value={availability.maxMembersPerSession}
                onChange={(e) => setAvailability(prev => ({
                  ...prev,
                  maxMembersPerSession: parseInt(e.target.value) || 1
                }))}
                sx={{ mt: 2 }}
              />

              {/* Save Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAvailability}
                  disabled={loading || availability.days.length === 0 || availability.timeRanges.length === 0}
                >
                  {loading ? 'Saving...' : 'Save Availability'}
                </Button>
              </Box>
            </StyledPaper>
          </Grid>
        ) : (
          <>
            {/* Assigned Members Section */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Assigned Members
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenMemberDialog(true)}
                  >
                    Assign Member
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Membership</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedMembers.map((member) => (
                        <TableRow key={member.memberId._id}>
                          <TableCell>{member.memberId.name}</TableCell>
                          <TableCell>{member.memberId.email}</TableCell>
                          <TableCell>{member.memberId.membershipType}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveMember(member.memberId._id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledPaper>
            </Grid>

            {/* Current Availability Section */}
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Current Availability
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsFirstTime(true)}
                  >
                    Edit Availability
                  </Button>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Working Days:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {availability.days.map(day => (
                      <Chip key={day} label={day} />
                    ))}
                  </Box>
                </Box>
                <Typography variant="subtitle1" gutterBottom>
                  Time Ranges:
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Time Range</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availability.timeRanges.map((range) => (
                        <TableRow key={range.id}>
                          <TableCell>{range.day}</TableCell>
                          <TableCell>{`${range.startTime} - ${range.endTime}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Max Members Per Session: {availability.maxMembersPerSession}
                </Typography>
              </StyledPaper>
            </Grid>
          </>
        )}
      </Grid>

      {/* Time Range Dialog */}
      <Dialog open={openTimeDialog} onClose={() => setOpenTimeDialog(false)}>
        <DialogTitle>Add Time Range</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={newTimeRange.day}
                  label="Day"
                  onChange={(e) => setNewTimeRange({ ...newTimeRange, day: e.target.value })}
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
                >
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimeDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTimeRange} variant="contained" color="primary">
            Add Time Range
          </Button>
        </DialogActions>
      </Dialog>

      {/* Member Assignment Dialog */}
      <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)}>
        <DialogTitle>Assign Member</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMember?._id || ''}
              label="Select Member"
              onChange={(e) => {
                const member = mockUsers.find(m => m._id === e.target.value);
                setSelectedMember(member);
              }}
            >
              {mockUsers
                .filter(member => member.role === 'member' && !assignedMembers.some(m => m.memberId._id === member._id))
                .map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    {member.name} - {member.membershipType}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancel</Button>
          <Button onClick={handleAssignMember} variant="contained" color="primary">
            Assign Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoachAvailability; 