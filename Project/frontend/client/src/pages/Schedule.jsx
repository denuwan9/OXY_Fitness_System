import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  Avatar,
  CardHeader,
  CardMedia
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
  Email,
  Phone,
  Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import scheduleService from '../services/scheduleService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
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

const SessionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const CoachCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const MealPlanCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const SchedulePage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [coachInfo, setCoachInfo] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (!user?.id) return;

        // Fetch user's schedules
        const scheduleResponse = await axios.get(`/api/schedules/user/${user.id}`);
        // Store all schedules
        setSchedule(scheduleResponse.data);

        // Fetch coach information from the first schedule
        if (scheduleResponse.data?.[0]?.coachId) {
          const coachResponse = await axios.get(`/api/coaches/${scheduleResponse.data[0].coachId}`);
          setCoachInfo(coachResponse.data);
        }

        // Fetch meal plan from the first schedule that has one
        const scheduleWithMealPlan = scheduleResponse.data.find(s => s.mealPlanId);
        if (scheduleWithMealPlan?.mealPlanId) {
          const mealPlanResponse = await axios.get(`/api/mealplans/${scheduleWithMealPlan.mealPlanId}`);
          setMealPlan(mealPlanResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDownloadReport = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        alert("Please log in to download your report");
        return;
      }
      await scheduleService.downloadScheduleReport(userId);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  const handleSubmitChange = async () => {
    try {
      const changeRequest = {
        sessionId: selectedSession.id,
        newDate: newDate,
        newTime: newTime,
        reason: reason
      };

      await axios.post('/api/schedules/change-request', changeRequest);
      
      // Refresh schedule data
      const updatedSchedule = await axios.get(`/api/schedules/user/${user.id}`);
      setSchedule(updatedSchedule.data);
      
      setOpenDialog(false);
      alert('Change request submitted successfully');
    } catch (error) {
      console.error('Error submitting change request:', error);
      alert('Failed to submit change request. Please try again.');
    }
  };

  const getSessionsForDate = (date) => {
    if (!schedule) return [];
    // Combine sessions from all schedules
    const allSessions = schedule.reduce((acc, s) => {
      if (s.sessions) {
        return [...acc, ...s.sessions];
      }
      return acc;
    }, []);
    
    return allSessions.filter(
      (session) => new Date(session.date).toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "success";
      case "rescheduled":
        return "warning";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const getWorkoutTypeIcon = (type) => {
    switch (type) {
      case "personal_training":
        return <FitnessCenter />;
      case "group_class":
        return <Event />;
      default:
        return <FitnessCenter />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">Loading your schedule...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">Error loading schedule: {error}</Typography>
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">No schedule found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h4" component="h1">
                My Schedule
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download />}
                onClick={handleDownloadReport}
                disabled={!user}
              >
                Download Report
              </Button>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.name} - {schedule?.membershipType} Member
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
                    <Typography variant="caption" sx={{ position: "absolute", bottom: 2, left: 2 }}>
                      {sessions.length} session(s)
                    </Typography>
                  </Box>
                ) : null;
              }}
            />
          </StyledPaper>
        </Grid>

        {/* Coach Information Section */}
        {coachInfo && (
          <Grid item xs={12} md={4}>
            <CoachCard>
              <CardHeader
                avatar={
                  <Avatar
                    src={coachInfo.profileImage || "https://via.placeholder.com/150"}
                    sx={{ width: 80, height: 80 }}
                  />
                }
                title={coachInfo.name}
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: 'gold' }} />
                    <Typography variant="body2">{coachInfo.rating}</Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {coachInfo.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Experience: {coachInfo.experience}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" />
                    <Typography variant="body2">{coachInfo.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" />
                    <Typography variant="body2">{coachInfo.phone}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </CoachCard>
          </Grid>
        )}

        {/* Meal Plan Section */}
        {mealPlan && (
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Your Meal Plan
              </Typography>
              <Grid container spacing={2}>
                {mealPlan.meals.map((meal, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <MealPlanCard>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {meal.day}
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon><Restaurant fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Breakfast" secondary={meal.breakfast} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Restaurant fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Lunch" secondary={meal.lunch} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Restaurant fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Dinner" secondary={meal.dinner} />
                          </ListItem>
                          {meal.snacks && (
                            <ListItem>
                              <ListItemIcon><Restaurant fontSize="small" /></ListItemIcon>
                              <ListItemText 
                                primary="Snacks" 
                                secondary={Array.isArray(meal.snacks) ? meal.snacks.join(', ') : meal.snacks} 
                              />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </MealPlanCard>
                  </Grid>
                ))}
              </Grid>
            </StyledPaper>
          </Grid>
        )}

        {/* Sessions Section */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Sessions for {selectedDate.toLocaleDateString()}
                </Typography>
                {getSessionsForDate(selectedDate).map((session) => (
                  <SessionCard key={session.id}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {session.workoutType}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                              {new Date(session.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" />
                            <Typography variant="body2">{session.location}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {session.notes}
                          </Typography>
                        </Box>
                        <Box>
                          <Chip
                            label={session.status}
                            color={getStatusColor(session.status)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Tooltip title="Request Change">
                            <IconButton
                              size="small"
                              onClick={() => handleSessionClick(session)}
                              disabled={session.status === "completed"}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </SessionCard>
                ))}
                {getSessionsForDate(selectedDate).length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                    No sessions scheduled for this date
                  </Typography>
                )}
              </StyledPaper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Change Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Schedule Change</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Current Session:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedSession?.workoutType} - {selectedSession?.date && new Date(selectedSession.date).toLocaleString()}
            </Typography>
            <TextField
              label="New Date"
              type="date"
              value={newDate || ""}
              onChange={(e) => setNewDate(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="New Time"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Reason for Change"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitChange}
            disabled={!newDate || !newTime || !reason}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage; 