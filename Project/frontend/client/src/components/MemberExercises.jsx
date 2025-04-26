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
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const MemberExercises = ({ memberId }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // In a real application, you would fetch exercises from an API
    const fetchExercises = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                name: 'Push-ups',
                description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps',
                category: 'Strength',
                imageUrl: '/images/exercises/pushup.jpg',
                difficulty: 'beginner',
                sets: 3,
                reps: 12,
              },
              {
                id: 2,
                name: 'Squats',
                description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes',
                category: 'Strength',
                imageUrl: '/images/exercises/squat.jpg',
                difficulty: 'beginner',
                sets: 3,
                reps: 15,
              },
              {
                id: 3,
                name: 'Plank',
                description: 'An isometric core exercise that improves stability and endurance',
                category: 'Core',
                imageUrl: '/images/exercises/plank.jpg',
                difficulty: 'beginner',
                sets: 3,
                reps: '30 seconds',
              },
            ]);
          }, 1000);
        });
        setExercises(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exercises');
        setLoading(false);
      }
    };

    fetchExercises();
  }, [memberId]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(exercise => exercise.category === selectedCategory);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Exercise Program
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View and track your assigned exercises
        </Typography>
      </Box>

      <StyledPaper>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          sx={{ mb: 3 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Strength" value="Strength" />
          <Tab label="Cardio" value="Cardio" />
          <Tab label="Core" value="Core" />
          <Tab label="Flexibility" value="Flexibility" />
        </Tabs>

        <Grid container spacing={3}>
          {filteredExercises.map((exercise) => (
            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
              <ExerciseCard>
                <ExerciseImage
                  image={exercise.imageUrl}
                  title={exercise.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {exercise.name}
                  </Typography>
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
                    <Chip
                      label={exercise.category}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </ExerciseCard>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default MemberExercises; 