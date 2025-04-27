import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ModernCalendar.css';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  CalendarToday,
  Download,
  Restaurant,
  FitnessCenter,
  Person,
  Schedule,
  Star,
  Email,
  Phone,
  Event,
  AccessTime,
  CheckCircle,
  Warning,
  Info,
  EmojiFoodBeverage,
  LunchDining,
  DinnerDining,
  Fastfood,
  LocalDining,
  LocalCafe,
  LocalPizza,
  Cake,
  RestaurantMenu,
  Egg,
  Icecream,
  LocalDrink,
  LocalBar,
  LocalDiningOutlined,
  Repeat,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';
import exerciseService from '../../services/exerciseService';
import coachAvailabilityService from '../../services/coachAvailabilityService';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  margin: theme.spacing(2, 0),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  "& .react-calendar__tile": {
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  "& .react-calendar__tile--active": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const ExerciseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ExerciseImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const CoachCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 60%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.getContrastText(theme.palette.primary.light),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const CoachAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[2],
}));

const ModernCalendarWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const TodayTile = {
  border: '2px solid #1976d2',
  borderRadius: '50%',
  background: '#e3f2fd',
  color: '#1976d2',
  fontWeight: 700,
};

// Modern glassmorphism/gradient background for main area
const DashboardBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(4, 0),
}));

// Glassmorphism card
const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  padding: theme.spacing(4),
}));

// Floating session badge
const FloatingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: 8,
    right: 8,
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(33,150,243,0.25)',
    fontWeight: 700,
    fontSize: '0.85rem',
    padding: '8px',
    background: theme.palette.primary.main,
    color: '#fff',
  },
}));

// Modern Coach Card with floating effect
const ModernCoachCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #e3f0ff 60%, #f9f9f9 100%)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  padding: theme.spacing(4, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const ModernCoachAvatar = styled(Avatar)(({ theme }) => ({
  width: 110,
  height: 110,
  marginBottom: theme.spacing(2),
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3],
}));

const ContactButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 20,
  fontWeight: 600,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
  color: '#fff',
  boxShadow: '0 2px 8px rgba(33,150,243,0.15)',
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 60%, ${theme.palette.secondary.dark} 100%)`,
  },
}));

// Helper: Convert day name to next date string
function getNextDateForDay(dayName) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = daysOfWeek.indexOf(dayName);
  let diff = targetIndex - todayIndex;
  if (diff <= 0) diff += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + diff);
  return nextDate.toISOString().split('T')[0];
}

// Modern meal chip with icon
const MealChip = ({ label, color, icon }) => (
  <Chip
    icon={icon}
    label={label}
    size="medium"
    sx={{
      bgcolor: color,
      color: '#fff',
      fontWeight: 600,
      fontSize: '1rem',
      px: 1.5,
      py: 0.5,
      mb: 0.5,
      boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
      '& .MuiChip-icon': { color: '#fff', fontSize: 22 }
    }}
  />
);

// Modern dialog Paper
const ModernDialogPaper = (props) => (
  <Paper
    elevation={8}
    sx={{
      borderRadius: 4,
      background: 'linear-gradient(120deg, #f5f7fa 0%, #e3f0ff 100%)',
      boxShadow: '0 12px 48px rgba(33,150,243,0.15)',
      p: 0
    }}
    {...props}
  />
);

const getExerciseProgressKey = (userId, sessionId) => `exerciseProgress_${userId}_${sessionId}`;

const MemberSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [coachInfo, setCoachInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [exercisePlans, setExercisePlans] = useState({});
  const [rescheduledSessions, setRescheduledSessions] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [coachAvailability, setCoachAvailability] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});

  // Set initial date and session when component mounts
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  // Update selected session when schedule data is loaded
  useEffect(() => {
    if (schedule) {
      const today = new Date();
      const sessionsForToday = getSessionsForDate(today);
      if (sessionsForToday.length > 0) {
        setSelectedSession(sessionsForToday[0]);
      }
    }
  }, [schedule]);

  useEffect(() => {
    if (user?.id && selectedSession) {
      const key = getExerciseProgressKey(user.id, selectedSession._id);
      const stored = localStorage.getItem(key);
      setExerciseProgress(stored ? JSON.parse(stored) : {});
    }
  }, [user, selectedSession]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.id) {
          console.error('No user ID available');
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        console.log('Fetching schedule for user ID:', user.id);
        const scheduleData = await scheduleService.getUserSchedule(user.id);
        console.log('Received schedule data:', scheduleData);

        if (!Array.isArray(scheduleData)) {
          console.error('Invalid schedule data format:', scheduleData);
          setError('Invalid schedule data received');
          setLoading(false);
          return;
        }

        // Process the schedule data
        const processedSchedule = scheduleData.map(schedule => {
          console.log('Processing schedule:', schedule);
          return {
            ...schedule,
            sessions: schedule.sessions.map(session => ({
              ...session,
              date: new Date(session.date),
              rescheduled: session.status === 'pending_reschedule' || session.status === 'rescheduled'
            }))
          };
        });

        console.log('Processed schedule data:', processedSchedule);
        setSchedule(processedSchedule);

        // Fetch exercises assigned to the member
        try {
          console.log('Fetching exercises for member:', user.id);
          const exercises = await exerciseService.getMemberExercises(user.id);
          console.log('Received exercises:', exercises);
          
          if (!exercises || !Array.isArray(exercises)) {
            console.error('Invalid exercises data received:', exercises);
            return;
          }

          console.log('Number of exercises received:', exercises.length);
          setExercisePlans({ exercises });
        } catch (exerciseError) {
          console.error('Error fetching exercises:', exerciseError);
          console.error('Error details:', {
            message: exerciseError.message,
            response: exerciseError.response?.data,
            status: exerciseError.response?.status
          });
        }

        // Fetch meal plan data for all schedules that have mealPlan reference
        const mealPlanPromises = processedSchedule
          .filter(schedule => schedule.mealPlan)
          .map(async schedule => {
            try {
              console.log('Fetching meal plan for schedule:', schedule._id);
              const mealPlanData = await scheduleService.getMealPlan(schedule._id);
              console.log('Received meal plan data for schedule:', schedule._id, mealPlanData);
              return { scheduleId: schedule._id, mealPlan: mealPlanData };
            } catch (mealPlanError) {
              console.error('Error fetching meal plan for schedule:', schedule._id, mealPlanError);
              return null;
            }
          });

        const mealPlanResults = await Promise.all(mealPlanPromises);
        const validMealPlans = mealPlanResults.filter(result => result !== null);
        
        if (validMealPlans.length > 0) {
          // Use the most recent meal plan (assuming the first one in the array is the most recent)
          setMealPlan(validMealPlans[0].mealPlan);
        }

        // Handle coach data
        if (processedSchedule.length > 0) {
          const firstSchedule = processedSchedule[0];
          if (firstSchedule.coachId && typeof firstSchedule.coachId === 'object') {
            console.log('Coach data from schedule:', firstSchedule.coachId);
            setCoachInfo(firstSchedule.coachId);
          } else if (firstSchedule.coachId) {
            console.log('Fetching coach info for ID:', firstSchedule.coachId);
            try {
              const coachData = await scheduleService.getCoachInfo(firstSchedule.coachId);
              console.log('Received coach data:', coachData);
              setCoachInfo(coachData);
            } catch (coachError) {
              console.error('Error fetching coach data:', coachError);
              // Don't set error state here to allow schedule display even if coach fetch fails
            }
          } else {
            console.log('No coach assigned to the schedule');
          }
        }

        // Process rescheduled sessions
        const rescheduled = processedSchedule.reduce((acc, schedule) => {
          const rescheduledSessions = schedule.sessions.filter(
            session => session.status === 'pending_reschedule' || session.status === 'rescheduled'
          );
          return [...acc, ...rescheduledSessions];
        }, []);
        setRescheduledSessions(rescheduled);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to load schedule data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDownloadReport = async () => {
    try {
      setError(null);
      const report = await scheduleService.generateReport(user.id);
      const blob = new Blob([report], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fitness-report-${user.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      setError(error.response?.data?.message || 'Failed to download report');
    }
  };

  const handleRescheduleRequest = async () => {
    try {
      if (!selectedSession || !newDate || !newTime || !reason) {
        setError('Please fill in all fields');
        return;
      }

      console.log('Selected session for reschedule:', selectedSession);
      console.log('Schedule data:', schedule);
      
      // Find the parent schedule that contains this session
      const parentSchedule = schedule.find(s => 
        s.sessions.some(sess => sess._id === selectedSession._id)
      );
      
      if (!parentSchedule) {
        setError('Could not find the parent schedule for this session');
        return;
      }

      console.log('Parent schedule found:', parentSchedule);

      // Convert day name to next date string
      const isoDate = getNextDateForDay(newDate);

      await scheduleService.requestReschedule({
        scheduleId: parentSchedule._id, // Use the parent schedule's ID
        sessionId: selectedSession._id, // Add sessionId for backend
        newDate: isoDate, // Send as YYYY-MM-DD
        newTime,
        reason,
      });

      setOpenRescheduleDialog(false);
      setSuccess('Reschedule request submitted successfully');
      setError(null);
      const updatedSchedule = await scheduleService.getUserSchedule(user.id);
      setSchedule(updatedSchedule);
    } catch (error) {
      console.error('Error submitting reschedule request:', error);
      setError(error.response?.data?.message || 'Failed to submit reschedule request');
    }
  };

  const getSessionsForDate = (date) => {
    if (!schedule || !Array.isArray(schedule)) {
      console.log('Invalid schedule data:', schedule);
      return [];
    }

    console.log('Getting sessions for date:', date.toDateString());
    const sessions = schedule.reduce((acc, scheduleItem) => {
      if (scheduleItem && Array.isArray(scheduleItem.sessions)) {
        const sessionsForDate = scheduleItem.sessions.filter(session => 
          session && session.date && 
          new Date(session.date).toDateString() === date.toDateString()
        );
        console.log('Sessions found in schedule item:', sessionsForDate);
        return [...acc, ...sessionsForDate];
      }
      return acc;
    }, []);

    console.log('Total sessions found for date:', sessions.length);
    return sessions;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const sessionsForDate = getSessionsForDate(date);
    if (sessionsForDate.length > 0) {
      setSelectedSession(sessionsForDate[0]);
    } else {
      setSelectedSession(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'success';
      case 'rescheduled':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle />;
      case 'rescheduled':
        return <Warning />;
      case 'completed':
        return <Info />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Info />;
    }
  };

  const handleOpenRescheduleDialog = async (session) => {
    setSelectedSession(session);
    setOpenRescheduleDialog(true);
    setNewDate('');
    setNewTime('');
    setReason('');
    setError(null);
    // Fetch coach availability for the session's coach
    let coachId = null;
    if (session && session.coachId) {
      coachId = typeof session.coachId === 'object' ? session.coachId._id : session.coachId;
    } else if (coachInfo && coachInfo._id) {
      coachId = coachInfo._id;
    }
    if (coachId) {
      try {
        const availability = await coachAvailabilityService.getCoachAvailability(coachId);
        setCoachAvailability(availability);
      } catch (err) {
        setCoachAvailability(null);
        setError('Failed to load coach availability.');
      }
    }
  };

  const isExerciseAvailable = (exercise) => {
    if (!selectedSession) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(selectedSession.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  };

  const handleExerciseCheck = (exerciseId, checked) => {
    if (!selectedSession) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(selectedSession.date);
    sessionDate.setHours(0, 0, 0, 0);

    // Allow unchecking even for past sessions
    const isUnchecking = !checked && exerciseProgress[exerciseId];
    if (!isUnchecking && sessionDate.getTime() !== today.getTime()) {
      setError('You can only complete exercises for today\'s sessions');
      return;
    }

    const key = getExerciseProgressKey(user.id, selectedSession._id);
    const updated = { ...exerciseProgress, [exerciseId]: checked };
    setExerciseProgress(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user?.id) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Please log in to view your schedule
        </Alert>
      </Container>
    );
  }

  const selectedDateSessions = getSessionsForDate(selectedDate);

  return (
    <>
      <Header />
      <DashboardBackground>
        <Container maxWidth={false} disableGutters>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              {success}
            </Alert>
          )}
          <Grid container spacing={3}>
            {/* Header Section */}
            <Grid item xs={12}>
              <GlassCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main' }}>
                    My Schedule
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                    sx={{ borderRadius: 20, fontWeight: 600 }}
                  >
                    Download Report
                  </Button>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  {user?.name} - {schedule?.[0]?.membershipType} Member
                </Typography>
              </GlassCard>
            </Grid>

            {/* Tabs Section */}
            <Grid item xs={12}>
              <GlassCard>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, '& .MuiTab-root': { fontWeight: 700, fontSize: '1.1rem' } }}
                >
                  <Tab icon={<CalendarToday />} label="Calendar" />
                  <Tab icon={<FitnessCenter />} label="Exercise Plan" />
                  <Tab icon={<Restaurant />} label="Meal Plan" />
                  <Tab icon={<Schedule />} label="Sessions" />
                </Tabs>

                {/* Calendar Tab */}
                {activeTab === 0 && (
                  <Box sx={{ p: { xs: 1, md: 3 } }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <ModernCalendarWrapper>
                          <StyledCalendar
                            onChange={handleDateClick}
                            value={selectedDate}
                            defaultView="month"
                            minDate={new Date()}
                            navigationLabel={({ date, label, locale, view }) => {
                              return (
                                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: 'primary.main', mb: 1 }}>
                                  {label}
                                </Typography>
                              );
                            }}
                            nextLabel={<span className="modern-cal-arrow">›</span>}
                            prevLabel={<span className="modern-cal-arrow">‹</span>}
                            next2Label={null}
                            prev2Label={null}
                            formatShortWeekday={(locale, date) =>
                              date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
                            }
                            tileContent={({ date }) => {
                              const sessions = getSessionsForDate(date);
                              return sessions.length > 0 ? (
                                <span className="modern-cal-dot" />
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
                          />
                        </ModernCalendarWrapper>
                        {/* Session List Below Calendar */}
                        <Box sx={{ mt: 4 }}>
                          {getSessionsForDate(selectedDate).length > 0 ? (
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                                Sessions on {selectedDate.toLocaleDateString()}
                              </Typography>
                              <List>
                                {getSessionsForDate(selectedDate).map((session, idx) => (
                                  <ListItem 
                                    key={session._id || idx} 
                                    alignItems="flex-start" 
                                    button
                                    onClick={() => {
                                      setSelectedSession(session);
                                      setActiveTab(1); // Switch to Exercise Plan tab
                                    }}
                                    sx={{ 
                                      mb: 1, 
                                      borderRadius: 2, 
                                      boxShadow: 1, 
                                      background: selectedSession?._id === session._id ? 'rgba(33,150,243,0.1)' : '#f5f7fa',
                                      cursor: 'pointer',
                                      '&:hover': {
                                        background: 'rgba(33,150,243,0.15)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s ease-in-out'
                                      }
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                          <Event sx={{ color: 'primary.main', mr: 1 }} />
                                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {session.workoutType}
                      </Typography>
                                        </Box>
                                      }
                                      secondary={
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                          <Typography variant="body2" color="text.secondary">
                        Time: {session.time}
                      </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Status: <Chip label={session.status} color={getStatusColor(session.status)} size="small" />
                        </Typography>
                                        </Box>
                                      }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<FitnessCenter />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedSession(session);
                                          setActiveTab(1);
                                        }}
                                        sx={{ 
                                          borderRadius: 20,
                                          textTransform: 'none',
                                          '&:hover': {
                                            background: 'rgba(33,150,243,0.1)'
                                          }
                                        }}
                                      >
                                        View Exercises
                                      </Button>
                                    </Box>
                                  </ListItem>
                                ))}
                              </List>
                            </Paper>
                          ) : (
                            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: 'center', background: '#f9f9f9' }}>
                              <Typography variant="body1" color="text.secondary">
                                No sessions for this day.
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {coachInfo && (
                          <ModernCoachCard>
                            <ModernCoachAvatar src={coachInfo.profileImage} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: 'primary.main' }}>
                              {coachInfo.name}
                  </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
                      {coachInfo.specialization || 'Personal Trainer'}
                    </Typography>
                            <Divider sx={{ width: '100%', my: 2, bgcolor: 'rgba(33,150,243,0.15)' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" color="primary" />
                                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>{coachInfo.email}</Typography>
                  </Box>
                  {coachInfo.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Phone fontSize="small" color="primary" />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{coachInfo.phone}</Typography>
                    </Box>
                  )}
                </Box>
                            <ContactButton
                              startIcon={<Email />}
                              href={`mailto:${coachInfo.email}`}
                            >
                              Contact Coach
                            </ContactButton>
                          </ModernCoachCard>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Exercise Plan Tab */}
                {activeTab === 1 && (
                  <Box sx={{ p: 3 }}>
                    <GlassCard sx={{ mb: 3, p: 3, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', background: 'rgba(33,150,243,0.07)' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                          Exercise Plan Progress
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={
                            100 * (Object.values(exerciseProgress).filter(Boolean).length) /
                            (exercisePlans?.exercises?.length || 0)
                          }
                          sx={{ height: 16, borderRadius: 8, background: '#e3f2fd', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2196F3 60%, #21CBF3 100%)' } }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 120, textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: Object.values(exerciseProgress).filter(Boolean).length === (exercisePlans?.exercises?.length || 0) ? 'success.main' : 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                          {Object.values(exerciseProgress).filter(Boolean).length} / {exercisePlans?.exercises?.length || 0} completed
                          {Object.values(exerciseProgress).filter(Boolean).length === (exercisePlans?.exercises?.length || 0) && <CheckCircle color="success" />}
                        </Typography>
                      </Box>
                    </GlassCard>

                    {selectedSession && (
                      <Paper sx={{ p: 2, mb: 3, background: 'rgba(33,150,243,0.05)', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                          Current Session: {selectedSession.workoutType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {new Date(selectedSession.date).toLocaleDateString()} | Time: {selectedSession.time}
                        </Typography>
                      </Paper>
                    )}

                    <Grid container spacing={3}>
                      {exercisePlans?.exercises?.map((exercise, index) => {
                        const completed = !!exerciseProgress[exercise._id];
                        const isAvailable = isExerciseAvailable(exercise);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <ExerciseCard
                              sx={{
                                position: 'relative',
                                opacity: !isAvailable ? 0.7 : 1,
                                filter: !isAvailable ? 'grayscale(0.7)' : 'none',
                                border: completed ? '2px solid #4caf50' : '2px solid transparent',
                                boxShadow: completed ? '0 0 0 2px #4caf5033' : undefined,
                                transition: 'box-shadow 0.2s, border 0.2s, opacity 0.2s',
                                '&:hover': { boxShadow: '0 4px 24px rgba(33,150,243,0.12)', transform: 'translateY(-2px)' }
                              }}
                            >
                              <Box sx={{ position: 'relative' }}>
                                <ExerciseImage
                                  image={exercise.imageUrl}
                                  title={exercise.name}
                                  sx={{ filter: !isAvailable ? 'grayscale(0.7) brightness(0.8)' : 'none' }}
                                />
                                {completed && (
                                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: '50%' }}>
                                    <CheckCircle color="success" sx={{ fontSize: 36 }} />
                                  </Box>
                                )}
                                {!isAvailable && (
                                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: '50%' }}>
                                    <Warning color="warning" sx={{ fontSize: 36 }} />
                                  </Box>
                                )}
                              </Box>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                  <Checkbox
                                    checked={completed}
                                    onChange={e => handleExerciseCheck(exercise._id, e.target.checked)}
                                    color="success"
                                    disabled={!isAvailable && !completed}
                                    sx={{ mr: 1, '& .MuiSvgIcon-root': { fontSize: 32 } }}
                                  />
                                  <Typography variant="h6" gutterBottom sx={{ textDecoration: completed ? 'line-through' : 'none', fontWeight: 700 }}>
                                    {exercise.name}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {exercise.description}
                                </Typography>
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <FitnessCenter sx={{ fontSize: 18, color: 'primary.main' }} />
                                    <Typography variant="body2">Sets: {exercise.sets}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Repeat sx={{ fontSize: 18, color: 'secondary.main' }} />
                                    <Typography variant="body2">Reps: {exercise.reps}</Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                                  <Chip
                                    label={exercise.difficulty}
                                    color={exercise.difficulty === 'beginner' ? 'success' : 'warning'}
                                    size="small"
                                  />
                                  <Chip
                                    label={exercise.category}
                                    color="primary"
                                    size="small"
                                  />
                                </Box>
                                {!isAvailable && (
                                  <Alert severity="warning" sx={{ mt: 2 }}>
                                    {new Date(selectedSession.date) < new Date() 
                                      ? 'This exercise is from a past session'
                                      : 'This exercise is for a future session'}
                                  </Alert>
                                )}
                              </CardContent>
                            </ExerciseCard>
                          </Grid>
                        );
                      })}
                      {(!exercisePlans?.exercises?.length) && (
                        <Grid item xs={12}>
                          <Alert severity="info" sx={{ mt: 2 }}>
                            No exercises assigned yet. Please contact your coach to set up your exercise plan.
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {/* Meal Plan Tab */}
                {activeTab === 2 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                      Weekly Meal Plan
                    </Typography>
                    {mealPlan ? (
                      <GlassCard sx={{ mt: 2, p: 0, overflow: 'auto', width: '100%' }}>
                        <TableContainer component={Box} sx={{ width: '100%' }}>
                          <Table sx={{ minWidth: 700, width: '100%' }}>
                            <TableHead>
                              <TableRow sx={{ background: 'rgba(33,150,243,0.07)' }}>
                                <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'primary.main' }}>Day</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Breakfast</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Lunch</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Dinner</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Snacks</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nutritional Info</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {mealPlan.meals.map((meal) => (
                                <TableRow key={meal.day} hover sx={{ borderBottom: '2px solid #e3eafc' }}>
                                  <TableCell sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
                                    {meal.day}
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      {Array.isArray(meal.breakfast) ? (
                                        meal.breakfast.map((item, idx) => (
                                          <MealChip
                                            key={idx}
                                            label={item}
                                            color={'#2196f3'}
                                            icon={<EmojiFoodBeverage />}
                                          />
                                        ))
                                      ) : (
                                        <Typography variant="body2">{meal.breakfast || 'Not specified'}</Typography>
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      {Array.isArray(meal.lunch) ? (
                                        meal.lunch.map((item, idx) => (
                                          <MealChip
                                            key={idx}
                                            label={item}
                                            color={'#ab47bc'}
                                            icon={<LunchDining />}
                                          />
                                        ))
                                      ) : (
                                        <Typography variant="body2">{meal.lunch || 'Not specified'}</Typography>
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                      {Array.isArray(meal.dinner) ? (
                                        meal.dinner.map((item, idx) => (
                                          <MealChip
                                            key={idx}
                                            label={item}
                                            color={'#e53935'}
                                            icon={<DinnerDining />}
                                          />
                                        ))
                                      ) : (
                                        <Typography variant="body2">{meal.dinner || 'Not specified'}</Typography>
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {Array.isArray(meal.snacks) ? (
                                        meal.snacks.map((snack, idx) => (
                                          <MealChip
                                            key={idx}
                                            label={snack}
                                            color={'#00bcd4'}
                                            icon={<Fastfood />}
                                          />
                                        ))
                                      ) : (
                                        <Typography variant="body2">{meal.snacks || 'No snacks'}</Typography>
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {meal.nutritionalInfo && (
                                      <Card elevation={0} sx={{ p: 1.5, borderRadius: 2, background: 'linear-gradient(90deg,#e3f2fd 60%,#fff 100%)', minWidth: 150 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalDining sx={{ fontSize: 18, color: 'primary.main' }} /> Calories: {meal.nutritionalInfo.calories || 0}
                                          </Typography>
                                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Egg sx={{ fontSize: 18, color: '#ab47bc' }} /> Protein: {meal.nutritionalInfo.protein || 0}g
                                          </Typography>
                                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalPizza sx={{ fontSize: 18, color: '#ff9800' }} /> Carbs: {meal.nutritionalInfo.carbs || 0}g
                                          </Typography>
                                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocalBar sx={{ fontSize: 18, color: '#e53935' }} /> Fats: {meal.nutritionalInfo.fats || 0}g
                                          </Typography>
                                        </Box>
                                      </Card>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </GlassCard>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No meal plan available. Please contact your coach to set up a meal plan.
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Sessions Tab */}
                {activeTab === 3 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                      All Sessions
                    </Typography>
                    <GlassCard sx={{ mt: 2, p: 0, overflow: 'auto', width: '100%' }}>
                      <TableContainer component={Box} sx={{ width: '100%' }}>
                        <Table sx={{ minWidth: 700, width: '100%' }}>
                          <TableHead>
                            <TableRow sx={{ background: 'rgba(33,150,243,0.07)' }}>
                              <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Workout Type</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {schedule?.map((scheduleItem) =>
                              scheduleItem.sessions?.map((session) => (
                                <TableRow key={session._id} hover sx={{ borderBottom: '2px solid #e3eafc', transition: 'background 0.2s' }}>
                                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.05rem' }}>
                                    {new Date(session.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>{session.time}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FitnessCenter sx={{ color: 'primary.main' }} />
                                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{session.workoutType}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      icon={getStatusIcon(session.status)}
                                      label={session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                      color={getStatusColor(session.status)}
                                      size="medium"
                                      sx={{ fontWeight: 700, fontSize: '1rem', px: 1.5, py: 0.5 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {session.status === 'scheduled' && (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Schedule />}
                                        sx={{ borderRadius: 20, fontWeight: 600, background: 'linear-gradient(90deg, #2196F3 60%, #21CBF3 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(33,150,243,0.10)' }}
                                        onClick={() => handleOpenRescheduleDialog(session)}
                                      >
                                        Request Reschedule
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </GlassCard>
                  </Box>
                )}
              </GlassCard>
            </Grid>
          </Grid>

          {/* Reschedule Dialog */}
          <Dialog
            open={openRescheduleDialog}
            onClose={() => setOpenRescheduleDialog(false)}
            PaperComponent={ModernDialogPaper}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle sx={{
              background: 'linear-gradient(90deg, #2196F3 60%, #21CBF3 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.3rem',
              borderRadius: '16px 16px 0 0',
              pb: 2,
              mb: 1
            }}>
              Request Reschedule
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              {selectedSession && (
                <Box sx={{ mb: 3, p: 2, borderRadius: 2, background: 'rgba(33,150,243,0.07)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Current Session
                  </Typography>
                  <Typography variant="body2">
                    <CalendarToday sx={{ fontSize: 18, mr: 0.5, color: 'primary.main' }} /> {new Date(selectedSession.date).toLocaleDateString()} &nbsp; | &nbsp;
                    <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'secondary.main' }} /> {selectedSession.time}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter sx={{ fontSize: 18, color: 'primary.main' }} /> {selectedSession.workoutType}
                  </Typography>
                </Box>
              )}
              {coachAvailability && coachAvailability.availability && coachAvailability.availability.length > 0 ? (
                <>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel><CalendarToday sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />Day</InputLabel>
                    <Select
                      value={newDate}
                      label="Day"
                      onChange={(e) => {
                        setNewDate(e.target.value);
                        setNewTime('');
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      {coachAvailability.availability.map((day) => (
                        <MenuItem key={day.day} value={day.day}>
                          <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} /> {day.day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel><AccessTime sx={{ fontSize: 18, mr: 1, color: 'secondary.main' }} />Time Range</InputLabel>
                    <Select
                      value={newTime}
                      label="Time Range"
                      onChange={(e) => setNewTime(e.target.value)}
                      disabled={!newDate}
                      sx={{ borderRadius: 2 }}
                    >
                      {coachAvailability.availability
                        .find(day => day.day === newDate)?.timeRanges.map((range) => (
                          <MenuItem key={`${range.startTime}-${range.endTime}`} value={`${range.startTime}-${range.endTime}`}>
                            <AccessTime sx={{ fontSize: 18, mr: 1, color: 'secondary.main' }} /> {`${range.startTime} - ${range.endTime}`}
                          </MenuItem>
                        )) || []}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Reason for Reschedule"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ borderRadius: 2, mb: 2 }}
                  />
                </>
              ) : (
                <Alert severity="info">Coach availability not set or unavailable.</Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenRescheduleDialog(false)} sx={{ borderRadius: 20, fontWeight: 600 }}>
                Cancel
              </Button>
              <Button
                onClick={handleRescheduleRequest}
                variant="contained"
                color="primary"
                disabled={!newDate || !newTime || !reason}
                startIcon={<Schedule />}
                sx={{ borderRadius: 20, fontWeight: 700, background: 'linear-gradient(90deg, #2196F3 60%, #21CBF3 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(33,150,243,0.10)' }}
              >
                Submit Request
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </DashboardBackground>
      <Footer />
    </>
  );
};

export default MemberSchedule; 