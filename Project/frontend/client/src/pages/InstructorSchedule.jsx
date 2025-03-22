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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Person
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

const InstructorSchedule = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openMealPlanDialog, setOpenMealPlanDialog] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    time: '',
    workoutType: '',
    duration: '',
    notes: ''
  });
  const [mealPlanData, setMealPlanData] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  });

  // Filter members based on instructor/coach
  const members = mockUsers.filter(member => member.role === 'member');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    // Find member's schedule
    const memberSchedule = mockSchedules.find(s => s.userId === member.id);
    if (memberSchedule) {
      setScheduleData({
        time: memberSchedule.sessions[0]?.time || '',
        workoutType: memberSchedule.sessions[0]?.type || '',
        duration: memberSchedule.sessions[0]?.duration || '',
        notes: memberSchedule.sessions[0]?.notes || ''
      });
    }
  };

  const handleScheduleSubmit = () => {
    // Here you would typically make an API call to save the schedule
    console.log('Saving schedule:', scheduleData);
    setOpenScheduleDialog(false);
  };

  const handleMealPlanSubmit = () => {
    // Here you would typically make an API call to save the meal plan
    console.log('Saving meal plan:', mealPlanData);
    setOpenMealPlanDialog(false);
  };

  const handleDownloadReport = () => {
    // Implement PDF report generation
    console.log('Downloading report for member:', selectedMember?.id);
  };

  if (!user || (user.role !== 'instructor' && user.role !== 'coach')) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied. This page is for instructors and coaches only.
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
              Instructor Schedule Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage member schedules and meal plans
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Members List Section */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Members
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Membership</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.membershipType}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleMemberSelect(member)}
                          color={selectedMember?.id === member.id ? "primary" : "default"}
                        >
                          <Person />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>

        {/* Schedule Management Section */}
        <Grid item xs={12} md={8}>
          {selectedMember ? (
            <StyledPaper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Schedule for {selectedMember.name}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Schedule />}
                    onClick={() => setOpenScheduleDialog(true)}
                    sx={{ mr: 1 }}
                  >
                    Edit Schedule
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Restaurant />}
                    onClick={() => setOpenMealPlanDialog(true)}
                    sx={{ mr: 1 }}
                  >
                    Meal Plan
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                  >
                    Download Report
                  </Button>
                </Box>
              </Box>
              <StyledCalendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={({ date }) => {
                  const memberSchedule = mockSchedules.find(s => s.userId === selectedMember.id);
                  const sessions = memberSchedule?.sessions.filter(
                    session => session.date.toDateString() === date.toDateString()
                  );
                  return sessions?.length > 0 ? (
                    <Box sx={{ position: "relative", height: "100%" }}>
                      <Typography variant="caption" sx={{ position: "absolute", bottom: 2, left: 2 }}>
                        {sessions.length} session(s)
                      </Typography>
                    </Box>
                  ) : null;
                }}
              />
            </StyledPaper>
          ) : (
            <StyledPaper>
              <Typography variant="h6" color="text.secondary" align="center">
                Select a member to view and manage their schedule
              </Typography>
            </StyledPaper>
          )}
        </Grid>
      </Grid>

      {/* Schedule Dialog */}
      <Dialog open={openScheduleDialog} onClose={() => setOpenScheduleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Workout Type</InputLabel>
                <Select
                  value={scheduleData.workoutType}
                  label="Workout Type"
                  onChange={(e) => setScheduleData({ ...scheduleData, workoutType: e.target.value })}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScheduleDialog(false)}>Cancel</Button>
          <Button onClick={handleScheduleSubmit} variant="contained" color="primary">
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Meal Plan Dialog */}
      <Dialog open={openMealPlanDialog} onClose={() => setOpenMealPlanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Meal Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Breakfast"
                multiline
                rows={2}
                value={mealPlanData.breakfast}
                onChange={(e) => setMealPlanData({ ...mealPlanData, breakfast: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lunch"
                multiline
                rows={2}
                value={mealPlanData.lunch}
                onChange={(e) => setMealPlanData({ ...mealPlanData, lunch: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dinner"
                multiline
                rows={2}
                value={mealPlanData.dinner}
                onChange={(e) => setMealPlanData({ ...mealPlanData, dinner: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Snacks"
                multiline
                rows={2}
                value={mealPlanData.snacks}
                onChange={(e) => setMealPlanData({ ...mealPlanData, snacks: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMealPlanDialog(false)}>Cancel</Button>
          <Button onClick={handleMealPlanSubmit} variant="contained" color="primary">
            Save Meal Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorSchedule; 