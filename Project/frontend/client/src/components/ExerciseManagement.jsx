import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
} from '@mui/material';
import {
  FitnessCenter,
  Add,
  Edit,
  Delete,
  Image,
  CheckCircle,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import exerciseService from '../services/exerciseService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
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
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#f5f5f5',
}));

const ExerciseManagement = ({ onAssignExercises, memberId }) => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [prevAssignedExercises, setPrevAssignedExercises] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    difficulty: 'beginner',
    sets: 3,
    reps: 12
  });
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    if (memberId) {
      exerciseService.getMemberExercises(memberId)
        .then((assigned) => {
          setSelectedExercises(assigned);
          setPrevAssignedExercises(assigned);
        })
        .catch(() => {
          setSelectedExercises([]);
          setPrevAssignedExercises([]);
        });
    } else {
      setSelectedExercises([]);
      setPrevAssignedExercises([]);
    }
  }, [memberId]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.getAllExercises();
      setExercises(data);
      setError(null);
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (exercise = null) => {
    if (exercise) {
      setEditingExercise(exercise);
      setNewExercise({ ...exercise });
    } else {
      setEditingExercise(null);
      setNewExercise({
        name: '',
        description: '',
        category: '',
        imageUrl: '',
        difficulty: 'beginner',
        sets: 3,
        reps: 12
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExercise(null);
    setNewExercise({
      name: '',
      description: '',
      category: '',
      imageUrl: '',
      difficulty: 'beginner',
      sets: 3,
      reps: 12
    });
  };

  const handleAddOrUpdateExercise = async () => {
    try {
      if (editingExercise) {
        // Update
        await exerciseService.updateExercise(editingExercise._id, newExercise);
        setSuccess('Exercise updated successfully');
      } else {
        // Create
        await exerciseService.createExercise(newExercise);
        setSuccess('Exercise added successfully');
      }
      handleCloseDialog();
      loadExercises();
    } catch (err) {
      setError('Failed to save exercise. Please try again.');
      console.error('Error saving exercise:', err);
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      await exerciseService.deleteExercise(id);
      setSuccess('Exercise deleted successfully');
      loadExercises();
    } catch (err) {
      setError('Failed to delete exercise. Please try again.');
      console.error('Error deleting exercise:', err);
    }
  };

  const handleExerciseSelect = async (exercise) => {
    const isSelected = selectedExercises.find(e => e._id === exercise._id);
    if (isSelected) {
      // Remove assignment immediately
      await exerciseService.removeExerciseAssignment(exercise._id, memberId);
      setSelectedExercises(prev => prev.filter(e => e._id !== exercise._id));
      setPrevAssignedExercises(prev => prev.filter(e => e._id !== exercise._id));
    } else {
      // Assign immediately
      await exerciseService.assignExercises([exercise._id], [memberId]);
      setSelectedExercises(prev => [...prev, exercise]);
      setPrevAssignedExercises(prev => [...prev, exercise]);
    }
  };

  const handleAssignExercises = async () => {
    if (selectedExercises.length > 0 || prevAssignedExercises.length > 0) {
      try {
        // Assign new ones (as before)
        await onAssignExercises(selectedExercises);

        // Remove unassigned ones
        const selectedIds = selectedExercises.map(e => e._id);
        const toRemove = prevAssignedExercises.filter(e => !selectedIds.includes(e._id));
        for (const ex of toRemove) {
          await exerciseService.removeExerciseAssignment(ex._id, memberId);
        }

        setPrevAssignedExercises(selectedExercises);
        setSuccess('Exercises updated successfully');
      } catch (err) {
        setError('Failed to update exercises. Please try again.');
        console.error('Error updating exercises:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exercise Management
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and assign exercises to members
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Available Exercises</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Add Exercise
              </Button>
            </Box>

            <Grid container spacing={3}>
              {exercises.map((exercise) => (
                <Grid item xs={12} sm={6} md={4} key={exercise._id}>
                  <ExerciseCard>
                    <ExerciseImage
                      image={exercise.imageUrl}
                      title={exercise.name}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Checkbox
                          checked={!!selectedExercises.find(e => e._id === exercise._id)}
                          onChange={() => handleExerciseSelect(exercise)}
                          color="primary"
                        />
                        <Typography variant="h6" gutterBottom sx={{ ml: 1 }}>
                          {exercise.name}
                        </Typography>
                      </Box>
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
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(exercise)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteExercise(exercise._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </ExerciseCard>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Selected Exercises
            </Typography>
            <List>
              {selectedExercises.map((exercise) => (
                <ListItem key={exercise._id}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets} sets x ${exercise.reps} reps`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleExerciseSelect(exercise)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          </StyledPaper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Exercise Name"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newExercise.description}
              onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={newExercise.category}
                onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
              >
                <MenuItem value="Strength">Strength</MenuItem>
                <MenuItem value="Cardio">Cardio</MenuItem>
                <MenuItem value="Core">Core</MenuItem>
                <MenuItem value="Flexibility">Flexibility</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Image URL"
              value={newExercise.imageUrl}
              onChange={(e) => setNewExercise({ ...newExercise, imageUrl: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={newExercise.difficulty}
                onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Sets"
              type="number"
              value={newExercise.sets}
              onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reps"
              value={newExercise.reps}
              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddOrUpdateExercise}
            disabled={!newExercise.name || !newExercise.description}
          >
            {editingExercise ? 'Update Exercise' : 'Add Exercise'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExerciseManagement; 