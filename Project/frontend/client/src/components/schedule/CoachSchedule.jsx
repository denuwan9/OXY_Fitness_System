import {
  Add,
  Download,
  FitnessCenter,
  Restaurant,
  Schedule
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import pdfService from '../../services/pdfService';
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CoachSchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  const [openMealDialog, setOpenMealDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [exercisePlan, setExercisePlan] = useState({
    exercises: []
  });
  const [mealPlan, setMealPlan] = useState({
    meals: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSchedules();
  }, [user]);

  const loadSchedules = async () => {
    try {
      // In a real application, you would fetch schedules assigned to this coach
      const response = await fetch('/api/schedules/coach/' + user._id);
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError('Failed to load schedules');
    }
  };

  const handleExercisePlanSubmit = async () => {
    try {
      await scheduleService.updateExercisePlan({
        scheduleId: selectedSchedule._id,
        day: selectedDay,
        exercises: exercisePlan.exercises,
      });
      setSuccess('Exercise plan updated successfully');
      setOpenExerciseDialog(false);
      loadSchedules();
    } catch (err) {
      setError('Failed to update exercise plan');
    }
  };

  const handleMealPlanSubmit = async () => {
    try {
      await scheduleService.assignMealPlan({
        scheduleId: selectedSchedule._id,
        membershipType: selectedSchedule.membershipType,
        meals: mealPlan.meals,
      });
      setSuccess('Meal plan assigned successfully');
      setOpenMealDialog(false);
      loadSchedules();
    } catch (err) {
      setError('Failed to assign meal plan');
    }
  };

  const handleRescheduleRequest = async () => {
    try {
      if (!selectedSession || !newDate || !newTime || !reason) {
        setError('Please fill in all fields');
        return;
      }

      await scheduleService.requestReschedule({
        scheduleId: selectedSchedule._id,
        sessionId: selectedSession._id,
        newDate,
        newTime,
        reason,
      });

      setOpenRescheduleDialog(false);
      setSuccess('Reschedule request submitted successfully');
      setError(null);
      loadSchedules();
    } catch (err) {
      setError('Failed to submit reschedule request');
    }
  };

  const addExercise = () => {
    setExercisePlan({
      ...exercisePlan,
      exercises: [
        ...exercisePlan.exercises,
        { name: '', sets: 0, reps: 0, weight: 0, duration: 0, notes: '' }
      ]
    });
  };

  const removeExercise = (index) => {
    const newExercises = [...exercisePlan.exercises];
    newExercises.splice(index, 1);
    setExercisePlan({ ...exercisePlan, exercises: newExercises });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercisePlan.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercisePlan({ ...exercisePlan, exercises: newExercises });
  };

  const handleDownloadSchedule = (schedule) => {
    if (!schedule) return;
    
    try {
      const doc = pdfService.generateSchedulePDF(schedule, schedule.user, user);
      pdfService.downloadPDF(doc, `schedule_${schedule.user.name}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating schedule PDF:', error);
      setError('Failed to generate schedule PDF');
    }
  };

  const handleDownloadWorkoutPlan = (schedule) => {
    if (!schedule || !schedule.exercisePlan) return;
    
    try {
      const doc = pdfService.generateWorkoutPlanPDF(schedule.exercisePlan, schedule.user);
      pdfService.downloadPDF(doc, `workout_plan_${schedule.user.name}_${schedule.exercisePlan.day}.pdf`);
    } catch (error) {
      console.error('Error generating workout plan PDF:', error);
      setError('Failed to generate workout plan PDF');
    }
  };

  const handleDownloadMealPlan = (schedule) => {
    if (!schedule || !schedule.mealPlan) return;
    
    try {
      const doc = pdfService.generateMealPlanPDF(schedule.mealPlan, schedule.user);
      pdfService.downloadPDF(doc, `meal_plan_${schedule.user.name}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating meal plan PDF:', error);
      setError('Failed to generate meal plan PDF');
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
          <Typography variant="h4" component="h1" gutterBottom>
            Coach Schedule Management
          </Typography>
        </StyledPaper>

        {/* Member Schedules */}
        <Grid container spacing={3}>
          {schedules.map((schedule) => (
            <Grid item xs={12} key={schedule._id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {schedule.user.name} - {schedule.membershipType} Membership
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Button
                        variant="outlined"
                        startIcon={<FitnessCenter />}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setOpenExerciseDialog(true);
                        }}
                        fullWidth
                      >
                        Manage Exercise Plan
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        variant="outlined"
                        startIcon={<Restaurant />}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setOpenMealDialog(true);
                        }}
                        fullWidth
                      >
                        Manage Meal Plan
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        variant="outlined"
                        startIcon={<Schedule />}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setSelectedSession(schedule.sessions[0]);
                          setOpenRescheduleDialog(true);
                        }}
                        fullWidth
                      >
                        Reschedule Session
                      </Button>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownloadSchedule(schedule)}
                      size="small"
                    >
                      Download Schedule
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownloadWorkoutPlan(schedule)}
                      size="small"
                    >
                      Download Workout Plan
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownloadMealPlan(schedule)}
                      size="small"
                    >
                      Download Meal Plan
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Exercise Plan Dialog */}
        <Dialog
          open={openExerciseDialog}
          onClose={() => setOpenExerciseDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Manage Exercise Plan</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {exercisePlan.exercises.map((exercise, index) => (
                <Card key={index} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Exercise Name"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Sets"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Reps"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Weight (kg)"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Duration (min)"
                        value={exercise.duration}
                        onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={exercise.notes}
                        onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        color="error"
                        onClick={() => removeExercise(index)}
                      >
                        Remove Exercise
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addExercise}
                sx={{ mt: 2 }}
              >
                Add Exercise
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenExerciseDialog(false)}>Cancel</Button>
            <Button onClick={handleExercisePlanSubmit} color="primary">
              Save Exercise Plan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Meal Plan Dialog */}
        <Dialog
          open={openMealDialog}
          onClose={() => setOpenMealDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Manage Meal Plan</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {DAYS.map((day) => (
                <Card key={day} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {day}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Breakfast"
                        value={mealPlan.meals.find(m => m.day === day)?.breakfast || ''}
                        onChange={(e) => {
                          const meals = [...mealPlan.meals];
                          const index = meals.findIndex(m => m.day === day);
                          if (index >= 0) {
                            meals[index] = { ...meals[index], breakfast: e.target.value };
                          } else {
                            meals.push({ day, breakfast: e.target.value, lunch: '', dinner: '', snacks: [] });
                          }
                          setMealPlan({ ...mealPlan, meals });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Lunch"
                        value={mealPlan.meals.find(m => m.day === day)?.lunch || ''}
                        onChange={(e) => {
                          const meals = [...mealPlan.meals];
                          const index = meals.findIndex(m => m.day === day);
                          if (index >= 0) {
                            meals[index] = { ...meals[index], lunch: e.target.value };
                          } else {
                            meals.push({ day, breakfast: '', lunch: e.target.value, dinner: '', snacks: [] });
                          }
                          setMealPlan({ ...mealPlan, meals });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dinner"
                        value={mealPlan.meals.find(m => m.day === day)?.dinner || ''}
                        onChange={(e) => {
                          const meals = [...mealPlan.meals];
                          const index = meals.findIndex(m => m.day === day);
                          if (index >= 0) {
                            meals[index] = { ...meals[index], dinner: e.target.value };
                          } else {
                            meals.push({ day, breakfast: '', lunch: '', dinner: e.target.value, snacks: [] });
                          }
                          setMealPlan({ ...mealPlan, meals });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Snacks (comma-separated)"
                        value={mealPlan.meals.find(m => m.day === day)?.snacks.join(', ') || ''}
                        onChange={(e) => {
                          const meals = [...mealPlan.meals];
                          const index = meals.findIndex(m => m.day === day);
                          const snacks = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          if (index >= 0) {
                            meals[index] = { ...meals[index], snacks };
                          } else {
                            meals.push({ day, breakfast: '', lunch: '', dinner: '', snacks });
                          }
                          setMealPlan({ ...mealPlan, meals });
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMealDialog(false)}>Cancel</Button>
            <Button onClick={handleMealPlanSubmit} color="primary">
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
    </Container>
  );
};

export default CoachSchedule; 