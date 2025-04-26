import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Fade,
  Zoom,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Restaurant,
  Add,
  Edit,
  Delete,
  Info,
  LocalDining,
  BreakfastDining,
  LunchDining,
  DinnerDining,
  Cake,
  Save,
  CheckCircle,
  Warning,
  ExpandMore,
  FitnessCenter,
  Timer,
  TrendingUp,
  RestaurantMenu,
  LocalCafe,
  Fastfood,
  EmojiFoodBeverage,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultMeal = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
  calories: '',
  protein: '',
  carbs: '',
  fats: ''
};

const MealPlanManager = ({ mealPlans, onAddMealPlan, onUpdateMealPlan }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Initialize meal plan data with proper structure
  const [mealPlanData, setMealPlanData] = useState({
    name: '',
    description: '',
    membershipType: 'Silver',
    meals: DAYS.map(day => ({
      day,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    }))
  });

  useEffect(() => {
    const initializeMealPlan = async () => {
      try {
        setLoading(true);
        console.log('Initial mealPlans:', mealPlans);
        
        if (mealPlans && mealPlans.length > 0) {
          const existingPlan = mealPlans[0];
          console.log('Existing plan:', existingPlan);

          // Helper function to safely convert string to array
          const safeStringToArray = (str) => {
            if (!str) return [];
            if (Array.isArray(str)) return str;
            return str.split(',').map(item => item.trim()).filter(Boolean);
          };

          const initialData = {
            _id: existingPlan._id,
            name: existingPlan.name || '',
            description: existingPlan.description || '',
            membershipType: existingPlan.membershipType || 'Silver',
            meals: DAYS.map(day => {
              const found = existingPlan.meals?.find(m => m.day === day);
              if (!found) {
                return {
                  day,
                  breakfast: [],
                  lunch: [],
                  dinner: [],
                  snacks: [],
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fats: 0
                };
              }

              return {
                day: found.day,
                breakfast: safeStringToArray(found.breakfast),
                lunch: safeStringToArray(found.lunch),
                dinner: safeStringToArray(found.dinner),
                snacks: Array.isArray(found.snacks) ? found.snacks : [found.snacks].filter(Boolean),
                calories: found.calories || 0,
                protein: found.protein || 0,
                carbs: found.carbs || 0,
                fats: found.fats || 0
              };
            })
          };

          console.log('Setting initial data:', initialData);
          setMealPlanData(initialData);
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error initializing meal plan:', err);
        setError('Failed to load meal plan data');
      } finally {
        setLoading(false);
      }
    };

    initializeMealPlan();
  }, [mealPlans]);

  const handleInputChange = (day, field, value) => {
    try {
      console.log('Updating field:', { day, field, value });
      setMealPlanData(prev => {
        const updated = {
          ...prev,
          meals: prev.meals.map(meal => {
            if (meal.day === day) {
              // Handle nutritional fields separately
              if (['calories', 'protein', 'carbs', 'fats'].includes(field)) {
                const numValue = value === '' ? 0 : Number(value) || 0;
                console.log(`Updating nutritional value for ${day} - ${field}:`, numValue);
                return {
                  ...meal,
                  [field]: numValue
                };
              }
              // Handle other fields
              return {
                ...meal,
                [field]: value
              };
            }
            return meal;
          })
        };
        console.log('Updated meal plan data:', updated);
        return updated;
      });
    } catch (err) {
      console.error('Error updating input:', err);
      setError('Failed to update meal plan');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Current meal plan data:', mealPlanData);

      // Validate meal plan data
      if (!mealPlanData || !mealPlanData.meals || !Array.isArray(mealPlanData.meals)) {
        throw new Error('Invalid meal plan data structure');
      }

      // Format meals for backend
      const formattedMeals = mealPlanData.meals.map(meal => {
        if (!meal) return null;

        return {
          day: meal.day,
          breakfast: Array.isArray(meal.breakfast) ? meal.breakfast.join(', ') : meal.breakfast,
          lunch: Array.isArray(meal.lunch) ? meal.lunch.join(', ') : meal.lunch,
          dinner: Array.isArray(meal.dinner) ? meal.dinner.join(', ') : meal.dinner,
          snacks: Array.isArray(meal.snacks) ? meal.snacks.join(', ') : meal.snacks,
          nutritionalInfo: {
            calories: Number(meal.calories) || 0,
            protein: Number(meal.protein) || 0,
            carbs: Number(meal.carbs) || 0,
            fats: Number(meal.fats) || 0
          }
        };
      }).filter(Boolean);

      console.log('Formatted meals for backend:', formattedMeals);
      
      if (mealPlanData._id) {
        // Update existing meal plan
        console.log('Updating existing meal plan with ID:', mealPlanData._id);
        const updatePayload = {
          scheduleId: mealPlanData._id,
          membershipType: mealPlanData.membershipType || 'Silver',
          meals: formattedMeals
        };
        console.log('Update payload:', updatePayload);
        await onUpdateMealPlan(updatePayload);
      } else {
        // Create new meal plan
        console.log('Creating new meal plan');
        const createPayload = {
          ...mealPlanData,
          meals: formattedMeals,
          membershipType: mealPlanData.membershipType || 'Silver'
        };
        await onAddMealPlan(createPayload);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError(err.message || 'Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditing = () => {
    if (mealPlans && mealPlans.length > 0) {
      setShowConfirmDialog(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleConfirmEdit = () => {
    setShowConfirmDialog(false);
    setIsEditing(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const renderMealInput = (day, field, value, icon) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Tooltip title={`Add ${field} items`}>
        <IconButton size="small" color="primary">
          {icon}
        </IconButton>
      </Tooltip>
      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={value || []}
        onChange={(event, newValue) => handleInputChange(day, field, newValue)}
        renderInput={(params) => (
          <TextField 
            {...params} 
            variant="outlined" 
            size="small"
            fullWidth
            placeholder={`Add ${field} items...`}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                }
              }
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              {...getTagProps({ index })}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ 
                m: 0.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                }
              }}
            />
          ))
        }
      />
    </Box>
  );

  const renderNutritionInput = (day, field, value, label) => {
    const numericValue = value || 0;
    console.log(`Rendering nutrition input for ${day} - ${field}:`, numericValue);
    
    return (
      <TextField
        variant="outlined"
        type="number"
        value={numericValue}
        onChange={e => {
          const newValue = e.target.value === '' ? 0 : Number(e.target.value) || 0;
          handleInputChange(day, field, newValue);
        }}
        size="small"
        fullWidth
        label={label}
        InputProps={{
          endAdornment: <Typography variant="caption" color="text.secondary">g</Typography>
        }}
        sx={{ 
          '& .MuiOutlinedInput-root': { 
            borderRadius: 2,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
            }
          }
        }}
      />
    );
  };

  const renderDayContent = (day) => {
    const meal = mealPlanData.meals.find(m => m.day === day);
    if (!meal) return null;

    console.log(`Rendering day content for ${day}:`, meal);

    // Format numeric values for display
    const formattedMeal = {
      ...meal,
      calories: typeof meal.calories === 'string' ? parseFloat(meal.calories) || 0 : meal.calories || 0,
      protein: typeof meal.protein === 'string' ? parseFloat(meal.protein) || 0 : meal.protein || 0,
      carbs: typeof meal.carbs === 'string' ? parseFloat(meal.carbs) || 0 : meal.carbs || 0,
      fats: typeof meal.fats === 'string' ? parseFloat(meal.fats) || 0 : meal.fats || 0
    };

    console.log(`Formatted meal for ${day}:`, formattedMeal);

    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Breakfast Section */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalCafe sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Breakfast
                  </Typography>
                </Box>
                {renderMealInput(day, 'breakfast', meal.breakfast, <BreakfastDining color="primary" />)}
              </CardContent>
            </Card>
          </Grid>

          {/* Lunch Section */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantMenu sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Lunch
                  </Typography>
                </Box>
                {renderMealInput(day, 'lunch', meal.lunch, <LunchDining color="primary" />)}
              </CardContent>
            </Card>
          </Grid>

          {/* Dinner Section */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Fastfood sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Dinner
                  </Typography>
                </Box>
                {renderMealInput(day, 'dinner', meal.dinner, <DinnerDining color="primary" />)}
              </CardContent>
            </Card>
          </Grid>

          {/* Snacks Section */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiFoodBeverage sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Snacks
                  </Typography>
                </Box>
                {renderMealInput(day, 'snacks', meal.snacks, <Cake color="primary" />)}
              </CardContent>
            </Card>
          </Grid>

          {/* Nutrition Section */}
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenter sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Nutrition Information
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderNutritionInput(day, 'calories', formattedMeal.calories, 'Calories')}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderNutritionInput(day, 'protein', formattedMeal.protein, 'Protein')}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderNutritionInput(day, 'carbs', formattedMeal.carbs, 'Carbs')}
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {renderNutritionInput(day, 'fats', formattedMeal.fats, 'Fats')}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3, 
          p: 3, 
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Plan Name"
              value={mealPlanData.name || ''}
              onChange={e => setMealPlanData({ ...mealPlanData, name: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
              }}
              sx={{ height: 56 }}
              disabled={true} // Always disabled for existing plans
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description"
              value={mealPlanData.description || ''}
              onChange={e => setMealPlanData({ ...mealPlanData, description: e.target.value })}
              fullWidth
              variant="outlined"
              multiline
              rows={1}
              InputProps={{
                startAdornment: <Info sx={{ mr: 1, color: 'primary.main' }} />
              }}
              sx={{ height: 56 }}
              disabled={true} // Always disabled for existing plans
            />
          </Grid>
        </Grid>
      </Card>

      {!isEditing ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {mealPlans && mealPlans.length > 0 
              ? "You already have a meal plan. Would you like to edit it?"
              : "No meal plan found. Would you like to create one?"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartEditing}
            startIcon={mealPlans && mealPlans.length > 0 ? <EditIcon /> : <AddIcon />}
            sx={{ 
              mt: 2,
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            {mealPlans && mealPlans.length > 0 ? "Edit Meal Plan" : "Create Meal Plan"}
          </Button>
        </Box>
      ) : (
        <>
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Tabs
              value={selectedDay}
              onChange={(e, newValue) => setSelectedDay(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 120,
                  py: 2
                }
              }}
            >
              {DAYS.map((day, index) => (
                <Tab 
                  key={day} 
                  label={day} 
                  icon={<Timer />}
                  iconPosition="start"
                />
              ))}
            </Tabs>

            {renderDayContent(DAYS[selectedDay])}
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              startIcon={<Save />}
              disabled={loading}
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              {loading ? 'Saving...' : (mealPlanData._id ? 'Update Meal Plan' : 'Save Meal Plan')}
            </Button>
          </Box>
        </>
      )}

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Existing Meal Plan</DialogTitle>
        <DialogContent>
          <Typography>
            You already have a meal plan. You can edit the meals for each day. Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmEdit} variant="contained" color="primary">
            Continue Editing
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          variant="filled"
          icon={<CheckCircle />}
        >
          {mealPlanData._id ? 'Meal plan updated successfully!' : 'Meal plan saved successfully!'}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          variant="filled"
          icon={<Warning />}
        >
          Failed to {mealPlanData._id ? 'update' : 'save'} meal plan. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MealPlanManager; 