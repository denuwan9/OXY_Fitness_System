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
        setScheduleData({
          time: '',
          workoutType: '',
          duration: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error fetching member schedule:', error);
      setSelectedDate(new Date());
      setScheduleData({
        time: '',
        workoutType: '',
        duration: '',
        notes: ''
      });
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedDate(new Date(schedule.sessions[0].date));
    setScheduleData({
      time: schedule.sessions[0].time || '',
      workoutType: schedule.sessions[0].workoutType || '',
      duration: schedule.sessions[0].duration || '',
      notes: schedule.sessions[0].notes || ''
    });
    setOpenScheduleDialog(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!scheduleId) {
      setError('Invalid schedule ID');
      return;
    }

    try {
      await scheduleService.deleteSchedule(scheduleId);
      
      // Update local state to remove the deleted schedule
      setMemberSchedules(prev => ({
        ...prev,
        [selectedMember._id]: prev[selectedMember._id].filter(s => s._id !== scheduleId)
      }));
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

      let schedulePayload;
      if (editingSchedule) {
        // Update existing schedule
        const updatedSessions = editingSchedule.sessions.map(session => {
          if (new Date(session.date).toISOString().split('T')[0] === formattedDate) {
            return {
              ...session,
              time: scheduleData.time,
              duration: scheduleData.duration,
              workoutType: parseInt(scheduleData.workoutType),
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
            workoutType: parseInt(scheduleData.workoutType),
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
    const workoutTypes = {
      1: "Personal Training",
      2: "Group Class",
      3: "Cardio Session",
      4: "Strength Training"
    };
    return workoutTypes[workoutType] || 'Unknown';
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

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Workout Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>
                  {new Date(schedule.sessions[0].date).toLocaleDateString()}
                </TableCell>
                <TableCell>{schedule.sessions[0].time}</TableCell>
                <TableCell>{schedule.sessions[0].duration}</TableCell>
                <TableCell>
                  {getWorkoutTypeName(schedule.sessions[0].workoutType)}
                </TableCell>
                <TableCell>{schedule.sessions[0].status}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSchedule(schedule._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Meal Plan for {selectedMember.name}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Restaurant />}
            onClick={handleOpenMealPlanDialog}
          >
            Edit Meal Plan
          </Button>
        </Box>
        {schedule?.mealPlan?.meals ? (
          <Grid container spacing={2}>
            {schedule.mealPlan.meals.map((meal, index) => (
              <Grid item xs={12} key={meal._id || index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {meal.day}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="primary">
                          Breakfast
                        </Typography>
                        <Typography variant="body1">
                          {meal.breakfast}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="primary">
                          Lunch
                        </Typography>
                        <Typography variant="body1">
                          {meal.lunch}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="primary">
                          Dinner
                        </Typography>
                        <Typography variant="body1">
                          {meal.dinner}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" color="primary">
                          Snacks
                        </Typography>
                        <Typography variant="body1">
                          {Array.isArray(meal.snacks) ? meal.snacks.join(', ') : ''}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No meal plan assigned for this date
          </Typography>
        )}
      </StyledPaper>
    );
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
              Assigned Members
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
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
                      <TableCell>Name</TableCell>
                      <TableCell>Membership</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.membershipType}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleMemberSelect(member)}
                            color={selectedMember?._id === member._id ? "primary" : "default"}
                          >
                            <Person />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </StyledPaper>
        </Grid>

        {/* Schedule Management Section */}
        <Grid item xs={12} md={8}>
          {selectedMember ? (
            <>
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
                    const memberSchedule = memberSchedules[selectedMember._id];
                    if (!memberSchedule) return null;

                    // Combine all sessions from all schedules
                    const allSessions = memberSchedule.reduce((acc, schedule) => {
                      if (schedule.sessions && Array.isArray(schedule.sessions)) {
                        return [...acc, ...schedule.sessions];
                      }
                      return acc;
                    }, []);

                    // Filter sessions for the current date
                    const sessions = allSessions.filter(
                      session => new Date(session.date).toDateString() === date.toDateString()
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
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Existing Schedules
                  </Typography>
                  {renderScheduleTable()}
                </Box>
              </StyledPaper>
              {renderMealPlanSection()}
            </>
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
      <Dialog open={openScheduleDialog} onClose={handleCloseScheduleDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
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
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button onClick={handleScheduleSubmit} variant="contained" color="primary">
            {editingSchedule ? 'Update Schedule' : 'Save Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Meal Plan Dialog */}
      <Dialog open={openMealPlanDialog} onClose={() => setOpenMealPlanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Meal Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {mealPlanData.meals.map((meal, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
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
                  />
                </Grid>
              </React.Fragment>
            ))}
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