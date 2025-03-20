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
  useMediaQuery
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
  Schedule
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockSchedules, mockUsers, mockGymLocations, mockWorkoutTypes } from '../mockData/scheduleData';

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

const MealPlanCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: "100%",
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

  useEffect(() => {
    if (user) {
      // Find the user's schedule from mock data
      const userSchedule = mockSchedules.find(s => s.userId === user.id);
      setSchedule(userSchedule);
    }
  }, [user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setOpenDialog(true);
  };

  const handleSubmitChange = () => {
    // Mock the schedule change request
    const updatedSchedule = {
      ...schedule,
      sessions: schedule.sessions.map((session) =>
        session.id === selectedSession.id
          ? { ...session, status: "rescheduled" }
          : session
      ),
    };
    setSchedule(updatedSchedule);
    setOpenDialog(false);
  };

  const handleDownloadReport = () => {
    // Mock the report download
    alert("Downloading schedule report...");
  };

  const getSessionsForDate = (date) => {
    if (!schedule) return [];
    return schedule.sessions.filter(
      (session) =>
        session.date.toDateString() === date.toDateString()
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

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Please log in to view your schedule
        </Typography>
      </Box>
    );
  }

  if (!schedule) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5">Loading schedule...</Typography>
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
              >
                Download Report
              </Button>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              {mockUsers.find(u => u.id === user.id)?.name} - {schedule.membershipType} Member
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
              onChange={handleDateChange}
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

        {/* Sessions and Meal Plan Section */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Sessions for Selected Date */}
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
                            {mockWorkoutTypes.find(wt => wt.name.toLowerCase().includes(session.type))?.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                              {session.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

            {/* Meal Plan */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Meal Plan
                </Typography>
                <MealPlanCard>
                  <CardContent>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant />
                        </ListItemIcon>
                        <ListItemText
                          primary="Breakfast"
                          secondary={schedule.mealPlan.breakfast}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lunch"
                          secondary={schedule.mealPlan.lunch}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant />
                        </ListItemIcon>
                        <ListItemText
                          primary="Dinner"
                          secondary={schedule.mealPlan.dinner}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Restaurant />
                        </ListItemIcon>
                        <ListItemText
                          primary="Snacks"
                          secondary={schedule.mealPlan.snacks.join(", ")}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </MealPlanCard>
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
              {selectedSession?.type} - {selectedSession?.date.toLocaleString()}
            </Typography>
            <TextField
              label="New Date"
              type="date"
              value={newDate || ""}
              onChange={(e) => setNewDate(new Date(e.target.value))}
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