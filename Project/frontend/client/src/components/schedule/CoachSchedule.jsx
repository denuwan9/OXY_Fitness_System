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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  Edit,
  Add,
  Delete,
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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CoachSchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  const [openMealDialog, setOpenMealDialog] = useState(false);
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Member: {schedule.userId.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {schedule.membershipType} Membership
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                  </Grid>
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
                        startIcon={<Delete />}
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
      </Box>
    </Container>
  );
};

export default CoachSchedule; 