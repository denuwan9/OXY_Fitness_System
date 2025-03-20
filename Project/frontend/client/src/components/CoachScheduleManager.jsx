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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockSchedules, mockUsers } from '../mockData/scheduleData';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  margin: theme.spacing(2, 0),
}));

const CoachScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mealPlan, setMealPlan] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: [],
  });
  const [newSnack, setNewSnack] = useState('');

  useEffect(() => {
    // For testing, use all schedules assigned to Coach Sarah (ID: '4')
    const coachSchedules = mockSchedules.filter(s => s.coachId === '4');
    setSchedules(coachSchedules);
  }, []);

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setOpenDialog(true);
  };

  const handleUpdateSchedule = () => {
    // Mock schedule update
    const updatedSchedules = schedules.map(s => {
      if (s._id === selectedSchedule._id) {
        return selectedSchedule;
      }
      return s;
    });
    setSchedules(updatedSchedules);
    setOpenDialog(false);
  };

  const handleAssignMealPlan = () => {
    // Mock meal plan assignment
    const updatedSchedules = schedules.map(s => {
      if (s._id === selectedSchedule._id) {
        return {
          ...s,
          mealPlan,
        };
      }
      return s;
    });
    setSchedules(updatedSchedules);
    setOpenDialog(false);
  };

  const handleAddSnack = () => {
    if (newSnack.trim()) {
      setMealPlan({
        ...mealPlan,
        snacks: [...mealPlan.snacks, newSnack.trim()],
      });
      setNewSnack('');
    }
  };

  const handleRemoveSnack = (index) => {
    setMealPlan({
      ...mealPlan,
      snacks: mealPlan.snacks.filter((_, i) => i !== index),
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
          Schedule Management
        </Typography>

        <Grid container spacing={3}>
          {schedules.map((schedule) => {
            const member = mockUsers.members.find(m => m._id === schedule.userId);
            return (
              <Grid item xs={12} key={schedule._id}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">
                        Member: {member?.name}
                      </Typography>
                      <Tooltip title="Edit Schedule">
                        <IconButton
                          onClick={() => handleEditSchedule(schedule)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body1">
                      Membership Type: {schedule.membershipType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Sessions: {schedule.sessions.length}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Schedule</DialogTitle>
        <DialogContent>
          {selectedSchedule && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sessions
              </Typography>
              {selectedSchedule.sessions.map((session, index) => (
                <Card key={index} sx={{ mb: 2, backgroundColor: '#2a2a2a' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          value={new Date(session.date).toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newSessions = [...selectedSchedule.sessions];
                            newSessions[index].date = e.target.value;
                            setSelectedSchedule({
                              ...selectedSchedule,
                              sessions: newSessions,
                            });
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Time"
                          type="time"
                          value={session.time}
                          onChange={(e) => {
                            const newSessions = [...selectedSchedule.sessions];
                            newSessions[index].time = e.target.value;
                            setSelectedSchedule({
                              ...selectedSchedule,
                              sessions: newSessions,
                            });
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Workout Type</InputLabel>
                          <Select
                            value={session.workoutType}
                            onChange={(e) => {
                              const newSessions = [...selectedSchedule.sessions];
                              newSessions[index].workoutType = e.target.value;
                              setSelectedSchedule({
                                ...selectedSchedule,
                                sessions: newSessions,
                              });
                            }}
                          >
                            <MenuItem value="Cardio">Cardio</MenuItem>
                            <MenuItem value="Strength Training">Strength Training</MenuItem>
                            <MenuItem value="Flexibility">Flexibility</MenuItem>
                            <MenuItem value="HIIT">HIIT</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Meal Plan
            </Typography>
            <TextField
              fullWidth
              label="Breakfast"
              value={mealPlan.breakfast}
              onChange={(e) => setMealPlan({ ...mealPlan, breakfast: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Lunch"
              value={mealPlan.lunch}
              onChange={(e) => setMealPlan({ ...mealPlan, lunch: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Dinner"
              value={mealPlan.dinner}
              onChange={(e) => setMealPlan({ ...mealPlan, dinner: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Snack"
                value={newSnack}
                onChange={(e) => setNewSnack(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddSnack}>
                Add
              </Button>
            </Box>
            <Box>
              {mealPlan.snacks.map((snack, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    p: 1,
                    backgroundColor: '#2a2a2a',
                    borderRadius: 1,
                  }}
                >
                  <Typography>{snack}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSnack(index)}
                    color="error"
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateSchedule} color="primary">
            Update Schedule
          </Button>
          <Button onClick={handleAssignMealPlan} color="secondary">
            Assign Meal Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CoachScheduleManager; 