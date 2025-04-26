import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Alert,
  FormHelperText
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

// Validation schema
const scheduleSchema = yup.object().shape({
  time: yup.string().required('Time is required'),
  workoutType: yup.string().required('Workout Type is required'),
  duration: yup.string().required('Duration is required'),
  notes: yup.string()
});

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
  const [selectedSession, setSelectedSession] = useState(null);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      time: '',
      workoutType: '',
      duration: '',
      notes: ''
    }
  });

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

      // Load schedules for each member
      const memberSchedulesData = {};
      for (const member of relevantMembers) {
        try {
          const schedules = await scheduleService.getUserSchedule(member._id);
          if (Array.isArray(schedules)) {
            // Process each schedule to include rescheduled information
            const processedSchedules = schedules.map(schedule => ({
              ...schedule,
              sessions: schedule.sessions.map(session => ({
                ...session,
                rescheduled: session.status === 'pending_reschedule',
                newDate: session.newDate || session.date,
                newTime: session.newTime || session.time
              }))
            }));
            memberSchedulesData[member._id] = processedSchedules;
          }
        } catch (error) {
          console.error(`Error loading schedules for member ${member._id}:`, error);
        }
      }
      
      setMemberSchedules(memberSchedulesData);
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
    try {
      setLoading(true);
      setError(null);
      setSelectedMember(member);
      setShowMemberActions(true);

      // Get member schedules
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
      } else {
        setSelectedDate(new Date());
      }

      // Reset form data
      setScheduleData({
        time: '',
        workoutType: '',
        duration: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error loading member schedules:', error);
      setError('Failed to load member schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMemberActions = () => {
    setShowMemberActions(false);
    setSelectedMember(null);
  };

  const handleEditSchedule = (schedule, session) => {
    // Find the complete schedule with meal plan from memberSchedules
    const completeSchedule = memberSchedules[selectedMember._id]?.find(s => s._id === schedule._id);
    
    // Set the editing schedule with the complete data including meal plan
    setEditingSchedule({
      ...schedule,
      mealPlan: completeSchedule?.mealPlan || null // Preserve the meal plan from the complete schedule
    });
    
    setSelectedDate(new Date(session.date));
    
    // Find the workout type ID from the name
    const workoutType = mockWorkoutTypes.find(type => type.name === session.workoutType);
    
    // Set form values for editing
    setValue('time', session.time || '');
    setValue('workoutType', workoutType ? workoutType.id.toString() : '');
    setValue('duration', session.duration || '');
    setValue('notes', session.notes || '');

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

  const handleScheduleSubmit = async (data) => {
    try {
      // Get the coach ID from the JWT token
      const token = localStorage.getItem('token');
      let coachId;
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        const payload = JSON.parse(jsonPayload);
        coachId = payload.userId;
      }

      if (!coachId) {
        setError('Coach ID not found. Please log in again.');
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
      const selectedWorkoutType = mockWorkoutTypes.find(type => type.id === parseInt(data.workoutType));
      if (!selectedWorkoutType) {
        setError('Invalid workout type');
        return;
      }

      const sessionData = {
        date: formattedDate,
        time: data.time,
        duration: data.duration,
        workoutType: selectedWorkoutType.name,
        notes: data.notes || '',
        status: 'scheduled'
      };

      let response;
      
      if (editingSchedule) {
        // Update existing schedule
        const updatedSessions = editingSchedule.sessions.map(session => {
          if (new Date(session.date).toISOString().split('T')[0] === new Date(editingSchedule.sessions[0].date).toISOString().split('T')[0]) {
            return {
              ...session,
              ...sessionData
            };
          }
          return session;
        });

        const schedulePayload = {
          userId: selectedMember._id,
          coachId: coachId,
          membershipType,
          scheduleType: 'weekday',
          sessions: updatedSessions,
          mealPlan: editingSchedule.mealPlan // Preserve the meal plan
        };

        console.log('Updating schedule:', schedulePayload);
        response = await scheduleService.updateSchedule(editingSchedule._id, schedulePayload);
      } else {
        // Create new schedule
        const schedulePayload = {
          userId: selectedMember._id,
          coachId: coachId,
          membershipType,
          scheduleType: 'weekday',
          sessions: [sessionData],
          mealPlan: null
        };

        console.log('Creating new schedule:', schedulePayload);
        response = await scheduleService.createSchedule(schedulePayload);
      }

      // Update local state
      if (response) {
        const updatedSchedules = { ...memberSchedules };
        if (editingSchedule) {
          updatedSchedules[selectedMember._id] = updatedSchedules[selectedMember._id].map(schedule => 
            schedule._id === editingSchedule._id ? response : schedule
          );
        } else {
          if (!updatedSchedules[selectedMember._id]) {
            updatedSchedules[selectedMember._id] = [];
          }
          updatedSchedules[selectedMember._id].push(response);
        }
        setMemberSchedules(updatedSchedules);
        setOpenScheduleDialog(false);
        reset();
        setEditingSchedule(null);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      setError(error.message || 'Failed to save schedule');
    }
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
    setEditingSchedule(null);
    reset();
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
      setMemberSchedules(prev => {
        const updatedSchedules = { ...prev };
        if (!updatedSchedules[selectedMember._id]) {
          updatedSchedules[selectedMember._id] = [];
        }
        
        const scheduleIndex = updatedSchedules[selectedMember._id].findIndex(s => s._id === schedule._id);
        if (scheduleIndex >= 0) {
          // Update the entire schedule object with the response
          updatedSchedules[selectedMember._id][scheduleIndex] = {
            ...updatedSchedules[selectedMember._id][scheduleIndex],
            mealPlan: response.mealPlan // Use the mealPlan from the response
          };
        }
        
        return updatedSchedules;
      });

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

    // Separate regular and rescheduled sessions
    const regularSessions = allSessions.filter(session => !session.rescheduled);
    const rescheduledSessions = allSessions.filter(session => session.rescheduled);

    // Sort sessions by date
    regularSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    rescheduledSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <>
        {/* Regular Sessions Table */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Current Schedule
        </Typography>
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            mb: 4
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
              {regularSessions.map((session) => (
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
                      <Tooltip title="Reschedule Session">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSession(session);
                            setOpenRescheduleDialog(true);
                          }}
                          sx={{
                            color: 'secondary.main',
                            '&:hover': {
                              backgroundColor: 'secondary.light',
                              color: 'secondary.contrastText',
                            },
                          }}
                        >
                          <Schedule />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Rescheduled Sessions Table */}
        {rescheduledSessions.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Pending Reschedule Requests
            </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                mb: 4
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Original Date</StyledTableCell>
                    <StyledTableCell>Original Time</StyledTableCell>
                    <StyledTableCell>New Date</StyledTableCell>
                    <StyledTableCell>New Time</StyledTableCell>
                    <StyledTableCell>Workout Type</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rescheduledSessions.map((session) => (
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Event sx={{ color: 'secondary.main' }} />
                          {new Date(session.newDate).toLocaleDateString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ color: 'secondary.main' }} />
                          {session.newTime}
                        </Box>
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
                          label="Pending Approval"
                          size="small"
                          color="warning"
                          icon={<Schedule />}
                        />
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </>
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
          mb: 3,
          borderBottom: '2px solid',
          borderColor: 'secondary.light',
          pb: 2
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <Restaurant sx={{ fontSize: 28, color: '#FF6B6B' }} />
            Meal Plan for {selectedMember.name}
          </Typography>
          <StyledButton
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
              }
            }}
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
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  overflow: 'visible',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  }
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -15,
                    left: 20,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {meal.day}
                    </Typography>
                  </Box>
                  <CardContent sx={{ pt: 4, pb: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{
                          p: 2.5,
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            borderColor: 'primary.main',
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'primary.light'
                          }}>
                            <Restaurant sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                              Breakfast
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{
                            color: 'text.primary',
                            fontSize: '1rem',
                            lineHeight: 1.6
                          }}>
                            {meal.breakfast || 'No breakfast planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{
                          p: 2.5,
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            borderColor: 'secondary.main',
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'secondary.light'
                          }}>
                            <Restaurant sx={{ color: 'secondary.main' }} />
                            <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                              Lunch
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{
                            color: 'text.primary',
                            fontSize: '1rem',
                            lineHeight: 1.6
                          }}>
                            {meal.lunch || 'No lunch planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{
                          p: 2.5,
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            borderColor: 'error.main',
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'error.light'
                          }}>
                            <Restaurant sx={{ color: 'error.main' }} />
                            <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                              Dinner
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{
                            color: 'text.primary',
                            fontSize: '1rem',
                            lineHeight: 1.6
                          }}>
                            {meal.dinner || 'No dinner planned'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{
                          p: 2.5,
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            borderColor: 'info.main',
                          }
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'info.light'
                          }}>
                            <Restaurant sx={{ color: 'info.main' }} />
                            <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                              Snacks
                            </Typography>
                          </Box>
                          {Array.isArray(meal.snacks) && meal.snacks.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {meal.snacks.map((snack, idx) => (
                                <Chip
                                  key={idx}
                                  label={snack}
                                  sx={{
                                    bgcolor: 'info.light',
                                    color: 'info.dark',
                                    fontWeight: 500,
                                    borderRadius: '16px',
                                    '&:hover': {
                                      bgcolor: 'info.main',
                                      color: 'white',
                                      transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body1" sx={{
                              color: 'text.primary',
                              fontSize: '1rem',
                              lineHeight: 1.6
                            }}>
                              No snacks planned
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 4,
            border: '2px dashed',
            borderColor: 'secondary.light',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: 'secondary.main',
              transform: 'scale(1.02)',
            }
          }}>
            <Restaurant sx={{ 
              fontSize: 64, 
              color: 'secondary.light',
              mb: 2,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              }
            }} />
            <Typography variant="h5" color="secondary.main" gutterBottom sx={{ fontWeight: 600 }}>
              No meal plan assigned for this date
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
              Create a personalized meal plan to help your client achieve their fitness goals
            </Typography>
            <StyledButton
              variant="contained"
              color="secondary"
              startIcon={<Restaurant />}
              onClick={handleOpenMealPlanDialog}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '28px',
                fontSize: '1.1rem'
              }}
            >
              Create Meal Plan
            </StyledButton>
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

  const handleRescheduleRequest = async () => {
    try {
      if (!selectedSession || !newDate || !newTime || !reason) {
        setError('Please fill in all fields');
        return;
      }

      const rescheduleData = {
        scheduleId: selectedSession.scheduleId,
        sessionId: selectedSession._id,
        newDate,
        newTime,
        reason,
        status: 'pending_reschedule'
      };

      const response = await scheduleService.requestReschedule(rescheduleData);

      // Update the local state to reflect the rescheduled session
      setMemberSchedules(prev => {
        const updatedSchedules = { ...prev };
        const memberSchedule = updatedSchedules[selectedMember._id];
        
        if (memberSchedule) {
          const scheduleIndex = memberSchedule.findIndex(s => s._id === selectedSession.scheduleId);
          if (scheduleIndex !== -1) {
            const sessionIndex = memberSchedule[scheduleIndex].sessions.findIndex(
              s => s._id === selectedSession._id
            );
            if (sessionIndex !== -1) {
              // Update the session with rescheduled information
              memberSchedule[scheduleIndex].sessions[sessionIndex] = {
                ...memberSchedule[scheduleIndex].sessions[sessionIndex],
                rescheduled: true,
                newDate,
                newTime,
                reason,
                status: 'pending_reschedule'
              };
            }
          }
        }
        
        return updatedSchedules;
      });

      setOpenRescheduleDialog(false);
      setSuccess('Reschedule request submitted successfully');
      setError(null);
      
      // Reset form fields
      setNewDate('');
      setNewTime('');
      setReason('');
    } catch (err) {
      setError('Failed to submit reschedule request');
    }
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
          <form onSubmit={handleSubmit(handleScheduleSubmit)}>
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
                    {...register('time')}
                    error={!!errors.time}
                    helperText={errors.time?.message}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.workoutType}>
                    <InputLabel>Workout Type</InputLabel>
                    <Select
                      {...register('workoutType')}
                      label="Workout Type"
                      sx={{ borderRadius: 2 }}
                    >
                      {mockWorkoutTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.workoutType?.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Duration"
                    {...register('duration')}
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    {...register('notes')}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
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
                type="submit"
                variant="contained" 
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {editingSchedule ? 'Update' : 'Add'} Schedule
              </Button>
            </DialogActions>
          </form>
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

        {/* Reschedule Dialog */}
        <Dialog
          open={openRescheduleDialog}
          onClose={() => setOpenRescheduleDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reschedule Session</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="New Date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="time"
                label="New Time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Reason for Reschedule"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRescheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleRescheduleRequest} color="primary">
              Submit Reschedule Request
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default InstructorSchedule; 