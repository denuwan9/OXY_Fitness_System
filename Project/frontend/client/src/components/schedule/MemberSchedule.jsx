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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';

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

        setSchedule(scheduleData);

        // Handle coach data
        if (scheduleData.length > 0) {
          const firstSchedule = scheduleData[0];
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

      await scheduleService.requestReschedule({
        scheduleId: selectedSession._id,
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

        {/* Calendar Section */}
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Calendar View
            </Typography>
            <StyledCalendar
              onChange={setSelectedDate}
              value={selectedDate}
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
            
            {/* Selected Date Sessions */}
            {selectedDateSessions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sessions for {selectedDate.toLocaleDateString()}
                </Typography>
                {selectedDateSessions.map((session) => (
                  <StyledCard key={session._id}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" color="primary">
                            {session.workoutType}
                          </Typography>
                          <Typography variant="body1">
                            Time: {session.time}
                          </Typography>
                          <Typography variant="body1">
                            Duration: {session.duration} minutes
                          </Typography>
                          {session.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Notes: {session.notes}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedSession(session);
                            setOpenRescheduleDialog(true);
                          }}
                          sx={{ ml: 2 }}
                        >
                          Request Reschedule
                        </Button>
                      </Box>
                    </CardContent>
                  </StyledCard>
                ))}
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* Coach Information Section */}
        {coachInfo && (
          <Grid item xs={12} md={4}>
            <StyledPaper>
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
            </StyledPaper>
          </Grid>
        )}

        {/* Meal Plan Section */}
        {schedule?.[0]?.mealPlan && (
          <Grid item xs={12}>
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
                  My Meal Plan
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {schedule[0].mealPlan.meals.map((meal, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{
                      borderRadius: 4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      overflow: 'visible',
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
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
                        <Grid container spacing={2}>
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
            </StyledPaper>
          </Grid>
        )}
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