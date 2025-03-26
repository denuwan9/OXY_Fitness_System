import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Event,
  LocationOn,
  AccessTime,
  Edit,
  Download,
  CheckCircle,
  Cancel,
  Schedule,
  Person,
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockSchedules, mockWorkoutTypes } from '../mockData/scheduleData';
import coachAvailabilityService from '../services/coachAvailabilityService';
import userService from '../services/userService';
import scheduleService from '../services/scheduleService';

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

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  "& .react-calendar__tile": {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  },
  "& .react-calendar__tile--active": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
  "& .react-calendar__month-view__days__day--weekend": {
    color: theme.palette.error.main,
  },
  "& .react-calendar__tile--now": {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
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

const InstructorSchedule = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openMealPlanDialog, setOpenMealPlanDialog] = useState(false);
  const [memberSchedules, setMemberSchedules] = useState({});
  const [scheduleData, setScheduleData] = useState({
    time: '',
    workoutType: '',
    duration: '',
    notes: ''
  });
  const [mealPlanData, setMealPlanData] = useState({
    meals: [{
      day: 'Monday',
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: []
    }]
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showMemberActions, setShowMemberActions] = useState(false);

  useEffect(() => {
    loadAssignedMembers();
  }, [user]);

  const loadAssignedMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const assignedMembers = await coachAvailabilityService.getAssignedMembers();
      const allMembers = await userService.getMembers();
      
      console.log('Assigned Members:', assignedMembers);
      console.log('All Members:', allMembers);
      
      // Filter members to show only those assigned to this instructor
      const relevantMembers = allMembers.filter(member => {
        const isAssigned = assignedMembers.some(assigned => {
          console.log('Comparing:', {
            memberId: member._id,
            assignedMemberId: assigned.memberId._id,
            isMatch: member._id === assigned.memberId._id
          });
          return member._id === assigned.memberId._id;
        });
        return isAssigned;
      });
      
      console.log('Relevant Members:', relevantMembers);
      setMembers(relevantMembers);
    } catch (err) {
      setError('Failed to load assigned members. Please try again later.');
      console.error('Error loading assigned members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMemberSelect = async (member) => {
    setSelectedMember(member);
    setShowMemberActions(true);
    try {
      const memberSchedules = await scheduleService.getUserSchedule(member._id);
      console.log('Received schedules:', memberSchedules);
      
      // Ensure memberSchedules is an array
      const schedulesArray = Array.isArray(memberSchedules) ? memberSchedules : [memberSchedules];
      
      // Store all schedules for this member
      setMemberSchedules(prev => ({
        ...prev,
        [member._id]: schedulesArray
      }));
      
      // Combine all sessions from all schedules
      const allSessions = schedulesArray.reduce((acc, schedule) => {
        if (schedule.sessions && Array.isArray(schedule.sessions)) {
          return [...acc, ...schedule.sessions];
        }
        return acc;
      }, []);

      if (allSessions.length > 0) {
        // Sort sessions by date
        allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextSession = allSessions[0];
        setSelectedDate(new Date(nextSession.date));
        setScheduleData({
          time: nextSession.time || '',
          workoutType: nextSession.workoutType || '',
          duration: nextSession.duration || '',
          notes: nextSession.notes || ''
        });
      } else {
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.error('Error loading member schedules:', error);
      setError('Failed to load member schedules');
    }
  };

  const handleCloseMemberActions = () => {
    setShowMemberActions(false);
    setSelectedMember(null);
  };

  const handleEditSchedule = (schedule, session) => {
    setEditingSchedule(schedule);
    setSelectedDate(new Date(session.date));
    setScheduleData({
      time: session.time || '',
      workoutType: session.workoutType || '',
      duration: session.duration || '',
      notes: session.notes || ''
    });
    setOpenScheduleDialog(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!scheduleId) {
      setError('Invalid schedule ID');
      return;
    }

    try {
      // Call the delete schedule service
      await scheduleService.deleteSchedule(scheduleId);
      
      // Update local state to remove the deleted schedule
      setMemberSchedules(prev => ({
        ...prev,
        [selectedMember._id]: prev[selectedMember._id].filter(s => s._id !== scheduleId)
      }));

      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Failed to delete schedule. Please try again.');
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      if (!selectedMember || !scheduleData.time || !scheduleData.workoutType || !scheduleData.duration) {
        setError('Please fill in all required fields');
        return;
      }

      // Get the member's actual membership type
      const member = members.find(m => m._id === selectedMember._id);
      if (!member) {
        setError('Member not found');
        return;
      }

      // Validate membership type
      const validMembershipTypes = ['Platinum', 'Gold', 'Silver'];
      const membershipType = validMembershipTypes.includes(member.membershipType) 
        ? member.membershipType 
        : 'Silver';

      // Format the date to ISO string
      const formattedDate = selectedDate.toISOString().split('T')[0];

      // Get the workout type name from mockWorkoutTypes
      const selectedWorkoutType = mockWorkoutTypes.find(type => type.id === parseInt(scheduleData.workoutType));
      if (!selectedWorkoutType) {
        setError('Invalid workout type');
        return;
      }

      let schedulePayload;
      if (editingSchedule) {
        // Update existing schedule
        const updatedSessions = editingSchedule.sessions.map(session => {
          // Update the session that matches the original date
          if (new Date(session.date).toISOString().split('T')[0] === new Date(editingSchedule.sessions[0].date).toISOString().split('T')[0]) {
            return {
              ...session,
              date: formattedDate, // Update with new date
              time: scheduleData.time,
              duration: scheduleData.duration,
              workoutType: selectedWorkoutType.name,
              notes: scheduleData.notes || '',
              status: session.status // Preserve existing status
            };
          }
          return session;
        });

        schedulePayload = {
          _id: editingSchedule._id,
          userId: selectedMember._id,
          coachId: user._id,
          membershipType,
          scheduleType: 'weekday',
          sessions: updatedSessions
        };
      } else {
        // Create new schedule
        schedulePayload = {
          userId: selectedMember._id,
          coachId: user._id,
          membershipType,
          scheduleType: 'weekday',
          sessions: [{
            date: formattedDate,
            time: scheduleData.time,
            duration: scheduleData.duration,
            workoutType: selectedWorkoutType.name,
            notes: scheduleData.notes || '',
            status: 'scheduled'
          }]
        };
      }

      console.log('Submitting schedule:', schedulePayload);
      const response = await scheduleService.saveSchedule(schedulePayload);
      
      // Update local state with the response
      setMemberSchedules(prev => ({
        ...prev,
        [selectedMember._id]: prev[selectedMember._id].map(s => 
          s._id === response._id ? response : s
        )
      }));

      setOpenScheduleDialog(false);
      setEditingSchedule(null);
      setError(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError('Failed to save schedule. Please try again.');
    }
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setEditingSchedule(null);
    setScheduleData({
      time: '',
      workoutType: '',
      duration: '',
      notes: ''
    });
  };

  const handleOpenMealPlanDialog = () => {
    const schedule = memberSchedules[selectedMember._id]?.find(s => 
      new Date(s.sessions[0].date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    );

    if (schedule?.mealPlan) {
      setMealPlanData({
        meals: schedule.mealPlan.meals
      });
    } else {
      // Initialize with default meal plan structure
      setMealPlanData({
        meals: [{
          day: 'Monday',
          breakfast: '',
          lunch: '',
          dinner: '',
          snacks: []
        }]
      });
    }
    setOpenMealPlanDialog(true);
  };

  const handleMealPlanSubmit = async () => {
    try {
      if (!selectedMember) {
        setError('Please select a member first');
        return;
      }

      const schedule = memberSchedules[selectedMember._id]?.find(s => 
        new Date(s.sessions[0].date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
      );

      if (!schedule) {
        setError('Please create a schedule first before adding a meal plan');
        return;
      }

      const mealPlanPayload = {
        scheduleId: schedule._id,
        membershipType: selectedMember.membershipType,
        meals: mealPlanData.meals
      };

      const response = await scheduleService.assignMealPlan(mealPlanPayload);
      
      // Update the local state with the new meal plan
      setMemberSchedules(prev => ({
        ...prev,
        [selectedMember._id]: prev[selectedMember._id].map(s => {
          if (s._id === schedule._id) {
            return {
              ...s,
              mealPlan: response
            };
          }
          return s;
        })
      }));

      setOpenMealPlanDialog(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error saving meal plan:', error);
      setError('Failed to save meal plan. Please try again.');
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (!selectedMember) {
        setError('Please select a member first');
        return;
      }
      await scheduleService.downloadScheduleReport(selectedMember._id);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
    }
  };

  const getWorkoutTypeName = (workoutType) => {
    // If workoutType is already a string, return it
    if (typeof workoutType === 'string') {
      return workoutType;
    }
    
    // If it's a number, find the corresponding workout type from mockWorkoutTypes
    const type = mockWorkoutTypes.find(t => t.id === parseInt(workoutType));
    return type ? type.name : 'Unknown';
  };

  const renderScheduleTable = () => {
    if (!selectedMember || !memberSchedules[selectedMember._id]) {
      return null;
    }

    const schedules = memberSchedules[selectedMember._id];
    if (!Array.isArray(schedules)) {
      console.error('Schedules is not an array:', schedules);
      return null;
    }

    // Combine all sessions from all schedules
    const allSessions = schedules.reduce((acc, schedule) => {
      if (schedule.sessions && Array.isArray(schedule.sessions)) {
        return [...acc, ...schedule.sessions.map(session => ({
          ...session,
          scheduleId: schedule._id
        }))];
      }
      return acc;
    }, []);

    // Sort sessions by date
    allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
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
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell>Workout Type</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allSessions.map((session) => (
              <StyledTableRow key={`${session.scheduleId}-${session.date}`}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event sx={{ color: 'primary.main' }} />
                    {new Date(session.date).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: 'primary.main' }} />
                    {session.time}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${session.duration} min`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getWorkoutTypeName(session.workoutType)}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={session.status}
                    size="small"
                    color={session.status === 'scheduled' ? 'success' : 
                           session.status === 'completed' ? 'primary' : 'error'}
                    icon={session.status === 'scheduled' ? <Schedule /> :
                          session.status === 'completed' ? <CheckCircle /> : <Cancel />}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit Schedule">
                      <IconButton
                        size="small"
                        onClick={() => handleEditSchedule(schedules.find(s => s._id === session.scheduleId), session)}
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
                    <Tooltip title="Delete Schedule">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSchedule(session.scheduleId)}
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
    );
  };

  const renderMealPlanSection = () => {
    if (!selectedMember) return null;

    const schedule = memberSchedules[selectedMember._id]?.find(s => 
      new Date(s.sessions[0].date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
    );

    return (
      <StyledPaper>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <Restaurant sx={{ fontSize: 28 }} />
            Meal Plan for {selectedMember.name}
          </Typography>
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<Restaurant />}
            onClick={handleOpenMealPlanDialog}
          >
            Edit Meal Plan
          </StyledButton>
        </Box>
        {schedule?.mealPlan?.meals ? (
          <Grid container spacing={3}>
            {schedule.mealPlan.meals.map((meal, index) => (
              <Grid item xs={12} key={meal._id || index}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 3,
                      color: 'secondary.main',
                    }}>
                      <Event sx={{ fontSize: 24 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {meal.day}
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Restaurant sx={{ fontSize: 20 }} />
                            Breakfast
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {meal.breakfast || 'No breakfast planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Restaurant sx={{ fontSize: 20 }} />
                            Lunch
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {meal.lunch || 'No lunch planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Restaurant sx={{ fontSize: 20 }} />
                            Dinner
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {meal.dinner || 'No dinner planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Restaurant sx={{ fontSize: 20 }} />
                            Snacks
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Array.isArray(meal.snacks) && meal.snacks.length > 0 ? (
                              meal.snacks.map((snack, idx) => (
                                <Chip
                                  key={idx}
                                  label={snack}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No snacks planned
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}>
            <Restaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No meal plan assigned for this date
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click the "Edit Meal Plan" button to create one
            </Typography>
          </Box>
        )}
      </StyledPaper>
    );
  };

  const handleOpenScheduleDialog = () => {
    if (!selectedMember) {
      setError('Please select a member first');
      return;
    }
    setScheduleData({
      time: '',
      workoutType: '',
      duration: '',
      notes: ''
    });
    setSelectedDate(new Date());
    setEditingSchedule(null);
    setOpenScheduleDialog(true);
  };

  if (!user || (user.role !== 'instructor' && user.role !== 'coach')) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Access Denied. This page is for instructors and coaches only.
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ 
        p: 4, 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        mt: 2 // Add margin top to prevent header overlap
      }}>
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
                    Instructor Schedule Management
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Manage member schedules and meal plans efficiently
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                  >
                    Download Report
                  </StyledButton>
                </Box>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Members List Section */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Person sx={{ fontSize: 28 }} />
                Assigned Members
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              ) : members.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No members assigned to you yet.
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Membership</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member) => (
                        <StyledTableRow key={member._id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={member.membershipType} 
                              size="small" 
                              color={member.membershipType === 'Platinum' ? 'primary' : 
                                     member.membershipType === 'Gold' ? 'secondary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleMemberSelect(member)}
                              color={selectedMember?._id === member._id ? "primary" : "default"}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'primary.contrastText',
                                },
                              }}
                            >
                              <Person />
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </StyledPaper>
          </Grid>

          {/* Schedule Management Section */}
          <Grid item xs={12} md={8}>
            {selectedMember && showMemberActions ? (
              <>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<Schedule />}
                    onClick={handleOpenScheduleDialog}
                  >
                    Add Schedule
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<Restaurant />}
                    onClick={handleOpenMealPlanDialog}
                  >
                    Add Meal Plan
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="error"
                    onClick={handleCloseMemberActions}
                  >
                    Close Actions
                  </StyledButton>
                </Box>

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
                      Schedule for {selectedMember.name}
                    </Typography>
                  </Box>
                  <StyledCalendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileContent={({ date }) => {
                      const memberSchedule = memberSchedules[selectedMember._id];
                      if (!memberSchedule) return null;

                      const allSessions = memberSchedule.reduce((acc, schedule) => {
                        if (schedule.sessions && Array.isArray(schedule.sessions)) {
                          return [...acc, ...schedule.sessions];
                        }
                        return acc;
                      }, []);

                      const sessions = allSessions.filter(
                        session => new Date(session.date).toDateString() === date.toDateString()
                      );

                      return sessions?.length > 0 ? (
                        <Box sx={{ 
                          position: "relative", 
                          height: "100%",
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}>
                          <Typography variant="caption" sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                            backgroundColor: 'primary.light',
                            padding: '2px 6px',
                            borderRadius: '12px',
                          }}>
                            {sessions.length} session(s)
                          </Typography>
                        </Box>
                      ) : null;
                    }}
                  />
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 2,
                    }}>
                      Existing Schedules
                    </Typography>
                    {renderScheduleTable()}
                  </Box>
                </StyledPaper>
                {renderMealPlanSection()}
              </>
            ) : (
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Select a member to view and manage their schedule
                </Typography>
                <Typography color="text.secondary">
                  Click on a member from the list to view their schedule and available actions.
                </Typography>
              </StyledPaper>
            )}
          </Grid>
        </Grid>

        {/* Schedule Dialog */}
        <Dialog 
          open={openScheduleDialog} 
          onClose={handleCloseScheduleDialog} 
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
            {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Workout Type</InputLabel>
                  <Select
                    value={scheduleData.workoutType}
                    label="Workout Type"
                    onChange={(e) => setScheduleData({ ...scheduleData, workoutType: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    {mockWorkoutTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={scheduleData.duration}
                  onChange={(e) => setScheduleData({ ...scheduleData, duration: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button 
              onClick={handleCloseScheduleDialog}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleScheduleSubmit} 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {editingSchedule ? 'Update Schedule' : 'Save Schedule'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Meal Plan Dialog */}
        <Dialog 
          open={openMealPlanDialog} 
          onClose={() => setOpenMealPlanDialog(false)} 
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
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            fontWeight: 600,
          }}>
            Edit Meal Plan
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {mealPlanData.meals.map((meal, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: 'secondary.main',
                    }}>
                      {meal.day}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Breakfast"
                      multiline
                      rows={2}
                      value={meal.breakfast}
                      onChange={(e) => {
                        const newMeals = [...mealPlanData.meals];
                        newMeals[index] = { ...newMeals[index], breakfast: e.target.value };
                        setMealPlanData({ ...mealPlanData, meals: newMeals });
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Lunch"
                      multiline
                      rows={2}
                      value={meal.lunch}
                      onChange={(e) => {
                        const newMeals = [...mealPlanData.meals];
                        newMeals[index] = { ...newMeals[index], lunch: e.target.value };
                        setMealPlanData({ ...mealPlanData, meals: newMeals });
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dinner"
                      multiline
                      rows={2}
                      value={meal.dinner}
                      onChange={(e) => {
                        const newMeals = [...mealPlanData.meals];
                        newMeals[index] = { ...newMeals[index], dinner: e.target.value };
                        setMealPlanData({ ...mealPlanData, meals: newMeals });
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Snacks (comma-separated)"
                      multiline
                      rows={2}
                      value={meal.snacks.join(', ')}
                      onChange={(e) => {
                        const newMeals = [...mealPlanData.meals];
                        newMeals[index] = { 
                          ...newMeals[index], 
                          snacks: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        };
                        setMealPlanData({ ...mealPlanData, meals: newMeals });
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button 
              onClick={() => setOpenMealPlanDialog(false)}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMealPlanSubmit} 
              variant="contained" 
              color="secondary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              Save Meal Plan
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default InstructorSchedule; 