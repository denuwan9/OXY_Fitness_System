import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';
import exerciseService from '../../services/exerciseService';

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

  useEffect(() => {
    // Set the selected date to current date when component mounts
    setSelectedDate(new Date());
  }, []);

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
          
          // Update the schedule with the fetched exercises
          const updatedSchedule = processedSchedule.map(schedule => {
            // Get exercises for this specific schedule
            const scheduleExercises = exercises.filter(exercise => {
              // Check if the exercise is assigned to this schedule
              const isAssigned = exercise.assignedTo?.some(assignment => 
                assignment.memberId === user.id && 
                (!assignment.scheduleId || assignment.scheduleId === schedule._id)
              );
              return isAssigned;
            });

            // If no exercises are specifically assigned to this schedule,
            // use the first schedule's exercises as default
            if (scheduleExercises.length === 0 && processedSchedule[0] === schedule) {
              return {
                ...schedule,
                exercisePlan: {
                  exercises: exercises
                }
              };
            }

            return {
              ...schedule,
              exercisePlan: {
                exercises: scheduleExercises
              }
            };
          });
          
          console.log('Updated schedule with exercises:', updatedSchedule);
          setSchedule(updatedSchedule);
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

      await scheduleService.requestReschedule({
        scheduleId: parentSchedule._id, // Use the parent schedule's ID
        newDate,
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
    <Container>
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
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                My Schedule
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={handleDownloadReport}
              >
                Download Report
              </Button>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.name} - {schedule?.[0]?.membershipType} Member
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<CalendarToday />} label="Calendar" />
              <Tab icon={<FitnessCenter />} label="Exercise Plan" />
              <Tab icon={<Restaurant />} label="Meal Plan" />
              <Tab icon={<Schedule />} label="Sessions" />
            </Tabs>

            {/* Calendar Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
            <StyledCalendar
              onChange={setSelectedDate}
              value={selectedDate}
              defaultView="month"
              minDate={new Date()}
              tileDisabled={({ date }) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              tileContent={({ date }) => {
                const sessions = getSessionsForDate(date);
                return sessions.length > 0 ? (
                  <Box sx={{ position: "relative", height: "100%" }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: "absolute", 
                        bottom: 2, 
                        left: 2,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '0.7rem'
                      }}
                    >
                      {sessions.length} session(s)
                    </Typography>
                  </Box>
                ) : null;
              }}
            />
        </Grid>
                  <Grid item xs={12} md={4}>
        {coachInfo && (
                      <Box>
              <Typography variant="h6" gutterBottom>
                My Coach
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={coachInfo.profileImage}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{coachInfo.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coachInfo.specialization || 'Personal Trainer'}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">{coachInfo.email}</Typography>
                </Box>
                {coachInfo.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{coachInfo.phone}</Typography>
                  </Box>
                )}
              </Box>
                      </Box>
                    )}
                  </Grid>
          </Grid>
              </Box>
            )}

            {/* Exercise Plan Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Exercise Plan
                </Typography>
                <Grid container spacing={3}>
                  {schedule?.[0]?.exercisePlan?.exercises?.map((exercise, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ExerciseCard>
                        <ExerciseImage
                          image={exercise.imageUrl}
                          title={exercise.name}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {exercise.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {exercise.description}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Workout Details:
                            </Typography>
                            <Typography variant="body2">
                              Sets: {exercise.sets}
                            </Typography>
                            <Typography variant="body2">
                              Reps: {exercise.reps}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        </CardContent>
                      </ExerciseCard>
                    </Grid>
                  ))}
                  {(!schedule?.[0]?.exercisePlan?.exercises?.length) && (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No exercise plan available. Please contact your coach to set up an exercise plan.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Meal Plan Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Weekly Meal Plan
                </Typography>
                {mealPlan ? (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Breakfast</TableCell>
                          <TableCell>Lunch</TableCell>
                          <TableCell>Dinner</TableCell>
                          <TableCell>Snacks</TableCell>
                          <TableCell>Nutritional Info</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mealPlan.meals.map((meal) => (
                          <TableRow key={meal.day}>
                            <TableCell>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {meal.day}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {Array.isArray(meal.breakfast) ? (
                                  meal.breakfast.map((item, idx) => (
                                    <Chip
                                      key={idx}
                                      label={item}
                                      size="small"
                                      sx={{ bgcolor: 'primary.light', color: 'white' }}
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
                                    <Chip
                                      key={idx}
                                      label={item}
                                      size="small"
                                      sx={{ bgcolor: 'secondary.light', color: 'white' }}
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
                                    <Chip
                                      key={idx}
                                      label={item}
                                      size="small"
                                      sx={{ bgcolor: 'error.light', color: 'white' }}
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
                                    <Chip
                                      key={idx}
                                      label={snack}
                                      size="small"
                                      sx={{ bgcolor: 'info.light', color: 'white' }}
                                    />
                                  ))
                                ) : (
                                  <Typography variant="body2">{meal.snacks || 'No snacks'}</Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {meal.nutritionalInfo && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography variant="body2">
                                    Calories: {meal.nutritionalInfo.calories || 0}
                                  </Typography>
                                  <Typography variant="body2">
                                    Protein: {meal.nutritionalInfo.protein || 0}g
                                  </Typography>
                                  <Typography variant="body2">
                                    Carbs: {meal.nutritionalInfo.carbs || 0}g
                                  </Typography>
                                  <Typography variant="body2">
                                    Fats: {meal.nutritionalInfo.fats || 0}g
                                  </Typography>
                                </Box>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                <Typography variant="h6" gutterBottom>
                  All Sessions
                                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Workout Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedule?.map((scheduleItem) =>
                        scheduleItem.sessions?.map((session) => (
                          <TableRow key={session._id}>
                            <TableCell>
                              {new Date(session.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{session.time}</TableCell>
                            <TableCell>{session.workoutType}</TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(session.status)}
                                label={session.status}
                                color={getStatusColor(session.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {session.status === 'scheduled' && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    setSelectedSession(session);
                                    setOpenRescheduleDialog(true);
                                  }}
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
                            </Box>
            )}
            </StyledPaper>
          </Grid>
      </Grid>

      {/* Reschedule Dialog */}
      <Dialog open={openRescheduleDialog} onClose={() => setOpenRescheduleDialog(false)}>
        <DialogTitle>Request Reschedule</DialogTitle>
        <DialogContent>
          <TextField
            label="New Date"
            type="date"
            fullWidth
            margin="normal"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="New Time"
            type="time"
            fullWidth
            margin="normal"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Reason"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRescheduleDialog(false)}>Cancel</Button>
          <Button onClick={handleRescheduleRequest} variant="contained" color="primary">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MemberSchedule; 