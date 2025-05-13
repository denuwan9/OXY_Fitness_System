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
  Delete,
  InfoOutlined,
  WarningAmberOutlined,
  SpaOutlined,
  Block
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockSchedules, mockWorkoutTypes } from '../mockData/scheduleData';
import coachAvailabilityService from '../services/coachAvailabilityService';
import userService from '../services/userService';
import scheduleService from '../services/scheduleService';
import ExerciseManagement from '../components/ExerciseManagement';
import exerciseService from '../services/exerciseService';
import MealPlanManager from '../components/schedule/MealPlanManager';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  backdropFilter: 'blur(8px)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
  },
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  "& .react-calendar__tile": {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    transition: 'all 0.2s ease-in-out',
    "&:hover": {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      transform: 'scale(1.05)',
    },
  },
  "& .react-calendar__tile--active": {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
  },
  "& .react-calendar__month-view__days__day--weekend": {
    color: theme.palette.error.main,
  },
  "& .react-calendar__tile--now": {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
  },
  "& .react-calendar__tile--disabled": {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.action.disabled,
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: 0.5,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontWeight: 500,
  '&.MuiTableCell-head': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: '#fff',
    fontWeight: 600,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
  },
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    transform: 'scale(1.01)',
  },
}));

// Validation schema
const scheduleSchema = yup.object().shape({
  day: yup.string().required('Day is required'),
  time: yup.string().required('Time range is required'),
  workoutType: yup.string().required('Workout type is required'),
  duration: yup.string().required('Duration is required'),
  notes: yup.string()
});

const InstructorSchedule = () => {
  console.log('InstructorSchedule component rendering'); // Debug log

  const { user } = useAuth();
  console.log('Current user:', user); // Debug log

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openMealPlanDialog, setOpenMealPlanDialog] = useState(false);
  const [memberSchedules, setMemberSchedules] = useState({});
  const [instructorAvailability, setInstructorAvailability] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    day: '',
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
  const [memberError, setMemberError] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showMemberActions, setShowMemberActions] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState('');
  const [showExerciseManagement, setShowExerciseManagement] = useState(false);
  const [showError, setShowError] = useState(false);
  const [preferences, setPreferences] = useState(null);

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
      day: '',
      time: '',
      workoutType: '',
      duration: '',
      notes: ''
    }
  });

  useEffect(() => {
    console.log('Component mounted'); // Debug log
    loadAssignedMembers();
  }, [user]);

  useEffect(() => {
    if (user) {
      loadInstructorAvailability();
    }
  }, [user]);

  const fetchMealPlan = async (memberId) => {
    try {
      const response = await scheduleService.getUserSchedule(memberId);
      console.log('Fetched schedules response:', response); // Debug log
      
      if (response && Array.isArray(response)) {
        setMemberSchedules(prev => ({
          ...prev,
          [memberId]: response
        }));
        return response;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      // If 404 error, it means no schedules exist yet - this is normal for new members
      if (error.response?.status === 404) {
        console.log('No schedules found for member - this is normal for new members');
        setMemberSchedules(prev => ({
          ...prev,
          [memberId]: []
        }));
        return []; // Return empty array instead of throwing error
      }
      setError(`Failed to load meal plan: ${error.message || 'Unknown error'}`);
      setShowError(true);
      throw error; // Re-throw other errors
    }
  };

  const loadAssignedMembers = async () => {
    try {
      setLoading(true);
      setMemberError(null);
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
          console.log(`Schedules for member ${member._id}:`, schedules);
          
          if (Array.isArray(schedules)) {
            // Process each schedule to include rescheduled information
            const processedSchedules = schedules.map(schedule => ({
              ...schedule,
              sessions: schedule.sessions.map(session => ({
                ...session,
                rescheduled: session.status === 'pending_reschedule',
                newDate: session.newDate || session.date,
                newTime: session.newTime || session.time,
                status: session.status || 'scheduled' // Ensure status is set
              })).filter(session => 
                session.status !== 'approved' && 
                session.status !== 'rejected'
              )
            }));
            memberSchedulesData[member._id] = processedSchedules;
            console.log(`Processed schedules for member ${member._id}:`, processedSchedules);
          }
        } catch (error) {
          console.error(`Error loading schedules for member ${member._id}:`, error);
        }
      }
      
      console.log('Final memberSchedulesData:', memberSchedulesData);
      setMemberSchedules(memberSchedulesData);
    } catch (err) {
      setMemberError('Failed to load assigned members. Please try again later.');
      console.error('Error loading assigned members:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInstructorAvailability = async () => {
    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      const availability = await coachAvailabilityService.getCoachAvailability(userId);
      console.log('Loaded Instructor Availability:', availability);
      setInstructorAvailability(availability);
    } catch (error) {
      console.error('Error loading instructor availability:', error);
      setError('Failed to load instructor availability');
      setShowError(true);
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

      // Fetch member schedules and meal plans
      try {
        const schedules = await fetchMealPlan(member._id);
        
        // Combine all sessions from all schedules
        const allSessions = schedules.reduce((acc, schedule) => {
          if (schedule.sessions && Array.isArray(schedule.sessions)) {
            return [...acc, ...schedule.sessions];
          }
          return acc;
        }, []);

        if (allSessions.length > 0) {
          // Sort sessions by date
          allSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
          const nextSession = allSessions[0];
          // Keep the current month view but update the selected date
          const currentDate = new Date();
          setSelectedDate(currentDate);
        } else {
          // If no sessions, set to current date
          setSelectedDate(new Date());
        }
      } catch (error) {
        // If 404 error, it means no schedules exist yet - this is normal for new members
        if (error.response?.status === 404) {
          console.log('No schedules found for member - this is normal for new members');
          setMemberSchedules(prev => ({
            ...prev,
            [member._id]: []
          }));
        } else {
          throw error; // Re-throw other errors
        }
      }

      // Reset form data
      setScheduleData({
        day: '',
        time: '',
        workoutType: '',
        duration: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error loading member schedules:', error);
      setError(`Failed to load member schedules: ${error.message || 'Unknown error'}`);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMemberActions = () => {
    setShowMemberActions(false);
    setSelectedMember(null);
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
      setShowError(true);
    }
  };

  const getCurrentSessionsForTimeSlot = (date, time) => {
    console.log('Checking capacity for:', { date, time });
    console.log('Current memberSchedules:', memberSchedules);

    // Get all sessions from all members for the selected time slot
    const allSessions = Object.values(memberSchedules).reduce((acc, schedules) => {
      if (Array.isArray(schedules)) {
        const memberSessions = schedules.reduce((sessionAcc, schedule) => {
          if (schedule.sessions && Array.isArray(schedule.sessions)) {
            const filteredSessions = schedule.sessions.filter(session => {
              // Convert session date to YYYY-MM-DD format
              const sessionDate = new Date(session.date).toISOString().split('T')[0];
              
              // Get start time from session time range
              const sessionTime = session.time.split('-')[0].trim();
              
              // Get start time from target time range
              const targetTime = time.split('-')[0].trim();
              
              // Log the comparison details
              console.log('Comparing session:', {
                sessionDate,
                sessionTime,
                targetDate: date,
                targetTime,
                matches: sessionDate === date && 
                        sessionTime === targetTime && 
                        session.status !== 'cancelled' &&
                        session.status !== 'pending_reschedule'
              });
              
              // Only count active sessions
              return sessionDate === date && 
                     sessionTime === targetTime && 
                     session.status !== 'cancelled' &&
                     session.status !== 'pending_reschedule';
            });
            
            // Log found sessions for this schedule
            if (filteredSessions.length > 0) {
              console.log('Found sessions for schedule:', { 
                scheduleId: schedule._id, 
                sessions: filteredSessions,
                scheduleDetails: schedule
              });
            }
            
            return [...sessionAcc, ...filteredSessions];
          }
          return sessionAcc;
        }, []);
        return [...acc, ...memberSessions];
      }
      return acc;
    }, []);

    // Log total sessions found
    console.log('Total sessions found:', allSessions.length);
    console.log('Sessions details:', allSessions);
    
    return allSessions;
  };

  // Add a new function to check if a member has a session at a specific time
  const hasMemberSessionAtTime = (memberId, date, time) => {
    const memberSessions = memberSchedules[memberId] || [];
    return memberSessions.some(schedule => 
      schedule.sessions.some(session => 
        new Date(session.date).toISOString().split('T')[0] === date &&
        session.time.split('-')[0].trim() === time.split('-')[0].trim() &&
        session.status !== 'cancelled' &&
        session.status !== 'pending_reschedule'
      )
    );
  };

  const handleOpenScheduleDialog = async () => {
    if (!selectedMember) {
      setError('Please select a member first');
      return;
    }
    // Fetch preferences for the selected member
    try {
      const prefs = await scheduleService.getMealPlanPreferences(selectedMember._id);
      setPreferences(prefs);
    } catch {
      setPreferences(null);
    }
    // Reset form with default values
    reset({
      day: '',
      time: '',
      workoutType: '',
      duration: '',
      notes: ''
    });
    setSelectedDate(new Date());
    setOpenScheduleDialog(true);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Convert the selected day to a date
      const selectedDay = data.day;
      // Get current date in IST
      const now = new Date();
      const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const today = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
      // Calculate days until next occurrence of selected day
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay);
      const currentDayIndex = today.getDay();
      let daysToAdd = dayIndex - currentDayIndex;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Move to next week if the day has already passed
      }
      // Create target date
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      // Format date as YYYY-MM-DD (ISO format)
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Split the time range into start and end times
      const [startTime, endTime] = data.time.split('-').map(time => time.trim());

      // Get the workout type name from mockWorkoutTypes
      const selectedWorkoutType = mockWorkoutTypes.find(type => type.id === parseInt(data.workoutType));
      if (!selectedWorkoutType) {
        throw new Error('Invalid workout type selected');
      }

      // Debug logging
      console.log('Schedule Payload Debug:', {
        selectedDay,
        targetDate: targetDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        formattedDate,
        startTime,
        endTime,
        workoutType: selectedWorkoutType.name
      });

      const scheduleData = {
        memberId: selectedMember._id,
        date: formattedDate,
        time: startTime,
        endTime: endTime,
        workoutType: selectedWorkoutType.name,
        duration: data.duration,
        notes: data.notes,
        status: 'scheduled'
      };

      console.log('Creating new schedule:', scheduleData);
      const response = await scheduleService.createSchedule(scheduleData);
      
      // Update the local state with the new schedule
      setMemberSchedules(prev => {
        const updatedSchedules = { ...prev };
        if (!updatedSchedules[selectedMember._id]) {
          updatedSchedules[selectedMember._id] = [];
        }
        updatedSchedules[selectedMember._id].push(response);
        return updatedSchedules;
      });

      setOpenScheduleDialog(false);
      reset();
      setSuccess('Schedule added successfully');
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.message || 'Failed to create schedule');
      setShowError(true);
    } finally {
      setLoading(false);
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

  const handleSaveMealPlan = async (mealPlanData) => {
    try {
      if (!selectedMember) {
        setError('Please select a member first');
        return;
      }

      // Validate meal plan data
      if (!mealPlanData || !mealPlanData.meals || !Array.isArray(mealPlanData.meals)) {
        throw new Error('Invalid meal plan data structure');
      }

      let schedule = memberSchedules[selectedMember._id]?.[0];
      if (!schedule) {
        // Auto-create a new schedule if none exists
        const newSchedule = await scheduleService.createSchedule({
          userId: selectedMember._id,
          coachId: user._id,
          membershipType: selectedMember.membershipType || 'Silver',
          scheduleType: 'weekday',
          sessions: [],
          mealPlan: null
        });
        schedule = newSchedule;
        // Update local state with new schedule
        setMemberSchedules(prev => ({
          ...prev,
          [selectedMember._id]: [newSchedule, ...(prev[selectedMember._id] || [])]
        }));
      }

      // Format meals for backend
      const formattedMeals = mealPlanData.meals.map(meal => ({
        day: meal.day,
        breakfast: Array.isArray(meal.breakfast) ? meal.breakfast.join(', ') : meal.breakfast,
        lunch: Array.isArray(meal.lunch) ? meal.lunch.join(', ') : meal.lunch,
        dinner: Array.isArray(meal.dinner) ? meal.dinner.join(', ') : meal.dinner,
        snacks: Array.isArray(meal.snacks) ? meal.snacks.join(', ') : meal.snacks,
        nutritionalInfo: {
          calories: Number(meal.nutritionalInfo?.calories) || 0,
          protein: Number(meal.nutritionalInfo?.protein) || 0,
          carbs: Number(meal.nutritionalInfo?.carbs) || 0,
          fats: Number(meal.nutritionalInfo?.fats) || 0
        }
      }));

      const mealPlanPayload = {
        scheduleId: schedule._id,
        membershipType: selectedMember.membershipType || 'Silver',
        meals: formattedMeals
      };

      console.log('Saving meal plan payload:', mealPlanPayload);
      const response = await scheduleService.assignMealPlan(mealPlanPayload);
      console.log('Meal plan save response:', response);

      // Update the local state with the new meal plan
      setMemberSchedules(prev => {
        const updatedSchedules = { ...prev };
        if (!updatedSchedules[selectedMember._id]) {
          updatedSchedules[selectedMember._id] = [];
        }
        
        const scheduleIndex = updatedSchedules[selectedMember._id].findIndex(s => s._id === schedule._id);
        if (scheduleIndex >= 0) {
          // Update the existing schedule with the new meal plan
          updatedSchedules[selectedMember._id][scheduleIndex] = {
            ...updatedSchedules[selectedMember._id][scheduleIndex],
            mealPlan: response.mealPlan
          };
        }
        
        return updatedSchedules;
      });

      setError(null);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      setError(error.message || 'Failed to save meal plan. Please try again.');
      setShowError(true);
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (!selectedMember) {
        setScheduleError('Please select a member first');
        return;
      }
      await scheduleService.downloadScheduleReport(selectedMember._id);
    } catch (error) {
      console.error('Error downloading report:', error);
      setScheduleError('Failed to download report. Please try again.');
      setShowError(true);
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

  const formatDuration = (duration) => {
    // Convert duration to minutes
    const totalMinutes = parseInt(duration);
    if (isNaN(totalMinutes)) return '0 minutes';

    // Calculate hours and remaining minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format the duration string
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
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
                      label={formatDuration(session.duration)}
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

    // Get all schedules for the selected member
    const memberSchedulesList = memberSchedules[selectedMember._id] || [];
    
    // Prepare mealPlans prop for MealPlanManager
    let mealPlans = [];
    if (memberSchedulesList.length > 0) {
      // Find any schedule with a meal plan
      const scheduleWithMealPlan = memberSchedulesList.find(s => s.mealPlan);
      if (scheduleWithMealPlan) {
        const formattedMealPlan = {
          _id: scheduleWithMealPlan.mealPlan._id,
          name: '7-Day Meal Plan',
          description: 'Weekly meal plan',
          meals: scheduleWithMealPlan.mealPlan.meals.map(meal => ({
            day: meal.day,
            breakfast: meal.breakfast.split(',').map(item => item.trim()),
            lunch: meal.lunch.split(',').map(item => item.trim()),
            dinner: meal.dinner.split(',').map(item => item.trim()),
            snacks: Array.isArray(meal.snacks) ? meal.snacks : [meal.snacks],
            calories: meal.nutritionalInfo?.calories || 0,
            protein: meal.nutritionalInfo?.protein || 0,
            carbs: meal.nutritionalInfo?.carbs || 0,
            fats: meal.nutritionalInfo?.fats || 0
          }))
        };
        mealPlans = [formattedMealPlan];
      }
    }
    
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
        </Box>
        {/* Member Preferences Display */}
        {selectedMember && (
          <Box sx={{
            mb: 3,
            p: 3,
            bgcolor: '#fffde7',
            borderRadius: 3,
            border: '1.5px solid #ffe082',
            boxShadow: '0 2px 8px rgba(255, 193, 7, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            position: 'relative',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningAmberOutlined sx={{ color: '#fbc02d', mr: 1 }} />
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 700 }}>
                Member Preferences & Guidelines
              </Typography>
              <InfoOutlined sx={{ color: '#bdb76b', ml: 1 }} titleAccess="These preferences are important for safe and personalized meal planning." />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpaOutlined sx={{ color: '#43a047' }} />
              <Typography><b>Diet Type:</b> {selectedMember.dietType || 'Not specified'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Block sx={{ color: selectedMember.allergies && selectedMember.allergies.length > 0 ? '#e53935' : '#bdbdbd' }} />
              <Typography>
                <b>Allergies:</b> {Array.isArray(selectedMember.allergies) && selectedMember.allergies.length > 0
                  ? selectedMember.allergies.map((a, i) => (
                      <span key={i} style={{
                        background: '#ffebee',
                        color: '#c62828',
                        borderRadius: '8px',
                        padding: '2px 8px',
                        marginRight: 6,
                        fontWeight: 600,
                        fontSize: '0.95em',
                        display: 'inline-block',
                      }}>{a}</span>
                    ))
                  : 'None'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <InfoOutlined sx={{ color: '#1976d2', mt: '2px' }} />
              <Typography><b>Special Guidelines:</b> {selectedMember.specialGuidelines || 'None'}</Typography>
            </Box>
          </Box>
        )}
        {memberSchedulesList.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            background: '#f5f5f5',
            borderRadius: 2,
            border: '1px dashed #bdbdbd'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Schedule Created Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Please create a schedule for this member first before adding a meal plan.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Schedule />}
              onClick={handleOpenScheduleDialog}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                }
              }}
            >
              Create Schedule
            </Button>
          </Box>
        ) : (
          <MealPlanManager
            mealPlans={mealPlans}
            onAddMealPlan={handleSaveMealPlan}
            onUpdateMealPlan={handleSaveMealPlan}
          />
        )}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        )}
      </StyledPaper>
    );
  };

  const handleRescheduleRequest = async () => {
    if (!newDate || !newTime || !reason) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }

    // Calculate the target date string in IST
    const now = new Date();
    const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const today = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(newDate);
    const currentDayIndex = today.getDay();
    let daysToAdd = dayIndex - currentDayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    // Format date as YYYY-MM-DD in IST
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const [startTime] = newTime.split('-');

    // Find the selected time range and its capacity
    const selectedDayAvailability = instructorAvailability?.availability.find(day => day.day === newDate);
    const selectedTimeRange = selectedDayAvailability?.timeRanges.find(
      range => range.startTime === startTime.trim()
    );
    if (!selectedTimeRange) {
      setError('Selected time range is not available');
      setShowError(true);
      return;
    }

    // Get current sessions for this slot
    const currentSessions = getCurrentSessionsForTimeSlot(formattedDate, startTime.trim());
    if (currentSessions.length >= selectedTimeRange.capacity) {
      setError('This time slot has reached its maximum capacity');
      setShowError(true);
      return;
    }

    try {
      const rescheduleData = {
        scheduleId: selectedSession.scheduleId,
        sessionId: selectedSession._id,
        newDate: formattedDate,
        newTime: startTime.trim(),
        endTime: selectedTimeRange.endTime,
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
                newDate: formattedDate,
                newTime: startTime.trim(),
                endTime: selectedTimeRange.endTime,
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
      setShowError(true);
    }
  };

  const handleAssignExercises = async (exercises) => {
    try {
      if (!selectedMember) {
        setError('Please select a member first');
        return;
      }

      const exerciseIds = exercises.map(exercise => exercise._id);
      await exerciseService.assignExercises(exerciseIds, [selectedMember._id]);
      setSuccess('Exercises assigned successfully');
      setShowExerciseManagement(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign exercises');
      setShowError(true);
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
        minHeight: '100vh',
        mt: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/gym-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 0,
        }
      }}>
        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <Grid item xs={12}>
            <StyledPaper>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
                }
              }}>
                <Box>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}>
                    Instructor Schedule Management
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ 
                    fontWeight: 400,
                    opacity: 0.8,
                  }}>
                    Manage member schedules and meal plans efficiently
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Removed download report button from here */}
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
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                  borderRadius: '2px',
                }
              }}>
                <Person sx={{ fontSize: 28 }} />
                Assigned Members
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={40} sx={{ color: 'primary.main' }} />
                </Box>
              ) : memberError ? (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {memberError}
                </Alert>
              ) : members.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
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
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Person sx={{ color: 'primary.main' }} />
                              {member.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={member.membershipType} 
                              size="small" 
                              color={member.membershipType === 'Platinum' ? 'primary' : 
                                     member.membershipType === 'Gold' ? 'secondary' : 'default'}
                              sx={{
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleMemberSelect(member)}
                              color={selectedMember?._id === member._id ? "primary" : "default"}
                              sx={{
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'primary.contrastText',
                                  transform: 'scale(1.1)',
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
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<Schedule />}
                    onClick={handleOpenScheduleDialog}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                      }
                    }}
                  >
                    Add Schedule
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<FitnessCenter />}
                    onClick={() => setShowExerciseManagement(!showExerciseManagement)}
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                      }
                    }}
                  >
                    {showExerciseManagement ? 'Back to Schedule' : 'Manage Exercises'}
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="success"
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
                      }
                    }}
                  >
                    Download Report
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    color="error"
                    onClick={handleCloseMemberActions}
                    sx={{
                      borderColor: 'error.main',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        borderColor: 'error.dark',
                        color: 'error.contrastText',
                      }
                    }}
                  >
                    Close Actions
                  </StyledButton>
                </Box>

                {showExerciseManagement ? (
                  <ExerciseManagement onAssignExercises={handleAssignExercises} memberId={selectedMember?._id} />
                ) : (
                  <>
                    <StyledPaper>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: '60px',
                          height: '3px',
                          background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                          borderRadius: '2px',
                        }
                      }}>
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
                        defaultView="month"
                        minDate={new Date()}
                        tileDisabled={({ date }) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
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
                                color: '#fff',
                                backgroundColor: 'rgba(33, 150, 243, 0.9)',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                              }}>
                                {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          ) : null;
                        }}
                        tileClassName={({ date, view }) => {
                          let classes = 'modern-cal-tile';
                          if (date.toDateString() === new Date().toDateString() && view === 'month') {
                            classes += ' modern-cal-today';
                          }
                          if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                            classes += ' modern-cal-selected';
                          }
                          return classes;
                        }}
                        navigationLabel={({ date, label, locale, view }) => (
                          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main', mb: 1 }}>
                            {label}
                          </Typography>
                        )}
                        nextLabel={<span className="modern-cal-arrow">›</span>}
                        prevLabel={<span className="modern-cal-arrow">‹</span>}
                        next2Label={null}
                        prev2Label={null}
                        formatShortWeekday={(locale, date) =>
                          date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
                        }
                      />
                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontWeight: 600,
                          color: 'primary.main',
                          mb: 2,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            width: '40px',
                            height: '2px',
                            background: 'linear-gradient(90deg, #2196F3, #21CBF3)',
                            borderRadius: '2px',
                          }
                        }}>
                          Existing Schedules
                        </Typography>
                        {renderScheduleTable()}
                      </Box>
                    </StyledPaper>
                    {renderMealPlanSection()}
                  </>
                )}
              </>
            ) : (
              <StyledPaper>
                <Box sx={{ 
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                }}>
                  <Person sx={{ 
                    fontSize: 64, 
                    color: 'primary.main',
                    opacity: 0.5,
                    mb: 2
                  }} />
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                  }}>
                    Select a member to view and manage their schedule
                  </Typography>
                  <Typography color="text.secondary" sx={{ 
                    maxWidth: '400px',
                    margin: '0 auto',
                    opacity: 0.8,
                  }}>
                    Click on a member from the list to view their schedule and available actions.
                  </Typography>
                </Box>
              </StyledPaper>
            )}
          </Grid>
        </Grid>

        {/* Schedule Dialog */}
        <Dialog
          open={openScheduleDialog}
          onClose={() => setOpenScheduleDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '12px 12px 0 0',
          }}>
            Add Schedule
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {/* Show member preferences at the top */}
            {preferences && (
              <Paper sx={{ p: 2, mb: 3, background: '#f5f5f5' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Special Schedule Request
                </Typography>
                <div>
                  {preferences.specialScheduleRequest
                    ? preferences.specialScheduleRequest
                    : 'None'}
                </div>
              </Paper>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.day}>
                    <InputLabel>Day</InputLabel>
                    <Select
                      {...register('day')}
                      label="Day"
                      value={watch('day') || ''}
                      onChange={(e) => {
                        setValue('day', e.target.value);
                        // Get current date in IST (GMT+5:30)
                        const now = new Date();
                        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
                        const today = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
                        const selectedDay = e.target.value;
                        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay);
                        const currentDayIndex = today.getDay();
                        let daysToAdd = dayIndex - currentDayIndex;
                        if (daysToAdd <= 0) {
                          daysToAdd += 7;
                        }
                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + daysToAdd);
                        console.log('Day Selection Debug:', {
                          selectedDay,
                          currentISTDate: istDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                          today: today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                          currentDayIndex,
                          dayIndex,
                          daysToAdd,
                          calculatedDate: targetDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
                        });
                      }}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      {instructorAvailability?.availability.map((day) => (
                        <MenuItem key={day.day} value={day.day}>
                          {day.day}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.day?.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.time}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                      {...register('time')}
                      label="Time Range"
                      value={watch('time') || ''}
                      onChange={(e) => {
                        setValue('time', e.target.value);
                        const selectedTime = e.target.value;
                        const selectedDay = watch('day');
                        // Get current date in IST
                        const now = new Date();
                        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
                        const today = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
                        // Calculate target date based on selected day
                        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay);
                        const currentDayIndex = today.getDay();
                        let daysToAdd = dayIndex - currentDayIndex;
                        if (daysToAdd <= 0) {
                          daysToAdd += 7;
                        }
                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + daysToAdd);
                        console.log('Time Range Selection:', {
                          selectedDay,
                          selectedTime,
                          targetDate: targetDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
                        });
                      }}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      {(() => {
                        const selectedDay = watch('day');
                        console.log('Selected Day:', selectedDay);
                        console.log('Full Instructor Availability:', instructorAvailability);

                        if (!selectedDay) {
                          console.log('No day selected');
                          return [];
                        }

                        if (!instructorAvailability?.availability) {
                          console.log('No instructor availability data');
                          return [];
                        }

                        // Get current date in IST
                        const now = new Date();
                        const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
                        const today = new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate());
                        
                        // Calculate target date based on selected day
                        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(selectedDay);
                        const currentDayIndex = today.getDay();
                        
                        let daysToAdd = dayIndex - currentDayIndex;
                        if (daysToAdd <= 0) {
                          daysToAdd += 7;
                        }
                        
                          const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + daysToAdd);
                        
                        // Format the date for display
                        const displayDate = targetDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'Asia/Kolkata'
                        });

                        // Format date for internal use
                        const formattedDate = targetDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          timeZone: 'Asia/Kolkata'
                        }).split('/').reverse().join('-');

                        // Get available time ranges for the selected day
                        const selectedDayAvailability = instructorAvailability.availability.find(day => day.day === selectedDay);
                        console.log('Selected Day Availability:', selectedDayAvailability);

                        if (!selectedDayAvailability) {
                          console.log('No availability found for selected day');
                          return [];
                        }

                        if (!selectedDayAvailability.timeRanges || !Array.isArray(selectedDayAvailability.timeRanges)) {
                          console.log('No time ranges found for selected day');
                          return [];
                        }

                        console.log('Time Range Debug:', {
                          selectedDay,
                          today: today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                          targetDate: targetDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                          displayDate,
                          formattedDate,
                          availableTimeRanges: selectedDayAvailability.timeRanges
                        });

                        // Show all time ranges for debugging
                        const timeRanges = selectedDayAvailability.timeRanges.map((range, index) => {
                          console.log(`Processing time range ${index}:`, range);
                          
                          if (!range || !range.startTime) {
                            console.log('Invalid time range:', range);
                            return null;
                          }

                          // Calculate current sessions for this time slot across all members
                          const currentSessions = getCurrentSessionsForTimeSlot(formattedDate, range.startTime);
                          const availableCapacity = range.capacity - currentSessions.length;

                          // Check if member already has a session at this time
                          const hasExistingSession = hasMemberSessionAtTime(selectedMember._id, formattedDate, range.startTime);

                          console.log('Time Range Details:', {
                            time: `${range.startTime} - ${range.endTime}`,
                            capacity: range.capacity,
                            currentSessions: currentSessions.length,
                            availableCapacity,
                            hasExistingSession
                          });

                          return (
                            <MenuItem 
                              key={`${range.startTime}-${range.endTime}`} 
                              value={`${range.startTime}-${range.endTime}`}
                              disabled={hasExistingSession || availableCapacity <= 0}
                            >
                              {`${range.startTime} - ${range.endTime} (${availableCapacity} slots available) - ${displayDate}`}
                            </MenuItem>
                          );
                        }).filter(Boolean);

                        console.log('Final time ranges to display:', timeRanges);
                        return timeRanges;
                      })()}
                    </Select>
                    <FormHelperText>{errors.time?.message}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.workoutType}>
                    <InputLabel>Workout Type</InputLabel>
                    <Select
                      {...register('workoutType')}
                      label="Workout Type"
                      value={watch('workoutType') || ''}
                      onChange={(e) => setValue('workoutType', e.target.value)}
                      sx={{ 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
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
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      } 
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    {...register('notes')}
                    multiline
                    rows={4}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      } 
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  onClick={() => setOpenScheduleDialog(false)}
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
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    }
                  }}
                >
                  Add Schedule
                </Button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog
          open={openRescheduleDialog}
          onClose={() => setOpenRescheduleDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(8px)',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '12px 12px 0 0',
          }}>
            Reschedule Session
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {/* Show special schedule request at the top */}
            {preferences && (
              <Paper sx={{ p: 2, mb: 3, background: '#f5f5f5' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Special Schedule Request
                </Typography>
                <div>
                  {preferences.specialScheduleRequest
                    ? preferences.specialScheduleRequest
                    : 'None'}
                </div>
              </Paper>
            )}
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={newDate}
                  label="Day"
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setNewTime('');
                  }}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {instructorAvailability?.availability.map((day) => (
                    <MenuItem key={day.day} value={day.day}>
                      {day.day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={newTime}
                  label="Time Range"
                  onChange={(e) => setNewTime(e.target.value)}
                  disabled={!newDate}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {instructorAvailability?.availability
                    .find(day => day.day === newDate)?.timeRanges
                    .filter(range => {
                      // Calculate current sessions for this time slot across all members
                      const currentDate = new Date().toISOString().split('T')[0];
                      const currentSessions = getCurrentSessionsForTimeSlot(currentDate, range.startTime);
                      const availableCapacity = range.capacity - currentSessions.length;
                      console.log('Reschedule time range capacity check:', {
                        range: `${range.startTime}-${range.endTime}`,
                        capacity: range.capacity,
                        currentSessions: currentSessions.length,
                        availableCapacity
                      });
                      return availableCapacity > 0;
                    })
                    .map((range) => {
                      // Calculate current sessions for this time slot across all members
                      const currentDate = new Date().toISOString().split('T')[0];
                      const currentSessions = getCurrentSessionsForTimeSlot(currentDate, range.startTime);
                      const availableCapacity = range.capacity - currentSessions.length;

                      return (
                        <MenuItem 
                          key={`${range.startTime}-${range.endTime}`} 
                          value={`${range.startTime}-${range.endTime}`}
                        >
                          {`${range.startTime} - ${range.endTime} (${availableCapacity} slots available)`}
                        </MenuItem>
                      );
                    }) || []}
                </Select>
                {!newDate && (
                  <FormHelperText>Please select a day first</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                label="Reason for Reschedule"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                multiline
                rows={4}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  } 
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
            <Button 
              onClick={() => {
                setOpenRescheduleDialog(false);
                setNewDate('');
                setNewTime('');
                setReason('');
              }}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRescheduleRequest}
              variant="contained"
              color="primary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                }
              }}
            >
              Submit Reschedule Request
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showError && !!error}
          autoHideDuration={4000}
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MuiAlert 
            onClose={() => setShowError(false)} 
            severity="error" 
            variant="filled"
            sx={{ fontWeight: 600 }}
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default InstructorSchedule; 