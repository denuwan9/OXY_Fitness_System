import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
import {
  FitnessCenter,
  Restaurant,
  Event,
  AccessTime,
  Edit,
  Download,
  CalendarToday,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const MemberSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSchedule();
  }, [user]);

  const loadSchedule = async () => {
    try {
      const data = await scheduleService.getUserSchedule(user._id);
      setSchedule(data);
    } catch (err) {
      setError('Failed to load schedule');
    }
  };

  const handleRequestChange = async () => {
    try {
      await scheduleService.requestScheduleChange(user._id, {
        sessionId: selectedSession._id,
        newDate: newDate,
        newTime: newTime,
      });
      setSuccess('Schedule change requested successfully');
      loadSchedule();
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to request schedule change');
    }
  };

  const handleDownloadReport = async () => {
    try {
      await scheduleService.downloadScheduleReport(user._id);
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const getSessionsForDate = (date) => {
    if (!schedule || !schedule.sessions) return [];
    return schedule.sessions.filter(
      (session) => new Date(session.date).toDateString() === date.toDateString()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Header Section */}
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
          {schedule && (
            <Typography variant="subtitle1" color="text.secondary">
              Membership Type: {schedule.membershipType}
            </Typography>
          )}
        </StyledPaper>

        {/* Schedule Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Training Sessions
              </Typography>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
              />
              {getSessionsForDate(selectedDate).map((session) => (
                <StyledCard key={session._id}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ mr: 1 }} />
                          <Typography>{new Date(session.time).toLocaleTimeString()}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FitnessCenter sx={{ mr: 1 }} />
                          <Typography>{session.workoutType}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Chip
                            label={session.status}
                            color={getStatusColor(session.status)}
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            onClick={() => {
                              setSelectedSession(session);
                              setOpenDialog(true);
                            }}
                            disabled={session.status === 'completed'}
                          >
                            <Edit />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              ))}
            </StyledPaper>
          </Grid>

          {/* Meal Plan Section */}
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Meal Plan
              </Typography>
              {schedule?.mealPlan ? (
                <List>
                  {schedule.mealPlan.meals.map((meal, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant />
                        </ListItemIcon>
                        <ListItemText
                          primary={meal.day}
                          secondary={
                            <>
                              <Typography variant="body2">Breakfast: {meal.breakfast}</Typography>
                              <Typography variant="body2">Lunch: {meal.lunch}</Typography>
                              <Typography variant="body2">Dinner: {meal.dinner}</Typography>
                              <Typography variant="body2">
                                Snacks: {meal.snacks.join(', ')}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < schedule.mealPlan.meals.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No meal plan assigned yet</Typography>
              )}
            </StyledPaper>
          </Grid>
        </Grid>

        {/* Reschedule Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Request Schedule Change</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <DatePicker
                label="New Date"
                value={newDate}
                onChange={(date) => setNewDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              />
              <TimePicker
                label="New Time"
                value={newTime}
                onChange={(time) => setNewTime(time)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestChange} color="primary">
              Request Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MemberSchedule; 