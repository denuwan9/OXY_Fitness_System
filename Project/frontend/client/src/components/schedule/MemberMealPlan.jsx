import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  Restaurant,
  LocalDining,
  FitnessCenter,
  AccessTime
} from '@mui/icons-material';

const MemberMealPlan = ({ mealPlan }) => {
  const [currentDayMealPlan, setCurrentDayMealPlan] = useState(null);

  useEffect(() => {
    if (mealPlan) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[new Date().getDay()];
      const todayPlan = mealPlan.meals.find(meal => meal.day === currentDay);
      setCurrentDayMealPlan(todayPlan);
    }
  }, [mealPlan]);

  if (!currentDayMealPlan) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No meal plan available for today
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          mb: 3,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Restaurant /> Today's Meal Plan
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime /> {currentDayMealPlan.day}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Meals
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><LocalDining color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Breakfast" 
                    secondary={currentDayMealPlan.breakfast}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><LocalDining color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Lunch" 
                    secondary={currentDayMealPlan.lunch}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon><LocalDining color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Dinner" 
                    secondary={currentDayMealPlan.dinner}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
                {currentDayMealPlan.snacks && currentDayMealPlan.snacks.length > 0 && (
                  <>
                    <Divider />
                    <ListItem>
                      <ListItemIcon><LocalDining color="primary" /></ListItemIcon>
                      <ListItemText 
                        primary="Snacks" 
                        secondary={currentDayMealPlan.snacks.join(', ')}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Nutritional Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter color="primary" />
                  <Typography variant="body1">
                    Calories: {currentDayMealPlan.nutritionalInfo.calories} kcal
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter color="primary" />
                  <Typography variant="body1">
                    Protein: {currentDayMealPlan.nutritionalInfo.protein}g
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter color="primary" />
                  <Typography variant="body1">
                    Carbs: {currentDayMealPlan.nutritionalInfo.carbs}g
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter color="primary" />
                  <Typography variant="body1">
                    Fats: {currentDayMealPlan.nutritionalInfo.fats}g
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberMealPlan; 