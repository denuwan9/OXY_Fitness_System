import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Restaurant,
  AccessTime
} from '@mui/icons-material';

const MealPlanManager = ({ 
  mealPlans, 
  onAddMealPlan, 
  onUpdateMealPlan, 
  onDeleteMealPlan 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [mealPlanData, setMealPlanData] = useState({
    name: '',
    description: '',
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setMealPlanData({
        name: plan.name,
        description: plan.description,
        breakfast: plan.breakfast,
        lunch: plan.lunch,
        dinner: plan.dinner,
        snacks: plan.snacks,
        calories: plan.calories,
        protein: plan.protein,
        carbs: plan.carbs,
        fats: plan.fats
      });
    } else {
      setEditingPlan(null);
      setMealPlanData({
        name: '',
        description: '',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
    setMealPlanData({
      name: '',
      description: '',
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    });
  };

  const handleSubmit = () => {
    if (editingPlan) {
      onUpdateMealPlan(editingPlan.id, mealPlanData);
    } else {
      onAddMealPlan(mealPlanData);
    }
    handleCloseDialog();
  };

  const handleDelete = (planId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      onDeleteMealPlan(planId);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Meal Plans</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Meal Plan
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Calories</TableCell>
              <TableCell>Macros</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Restaurant />
                    {plan.name}
                  </Box>
                </TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>{plan.calories} kcal</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`P: ${plan.protein}g`} size="small" />
                    <Chip label={`C: ${plan.carbs}g`} size="small" />
                    <Chip label={`F: ${plan.fats}g`} size="small" />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(plan)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Meal Plan' : 'Add New Meal Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                value={mealPlanData.name}
                onChange={(e) => setMealPlanData({ ...mealPlanData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={mealPlanData.description}
                onChange={(e) => setMealPlanData({ ...mealPlanData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Meals
              </Typography>
              <Grid container spacing={2}>
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
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Nutritional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Calories"
                    type="number"
                    value={mealPlanData.calories}
                    onChange={(e) => setMealPlanData({ ...mealPlanData, calories: e.target.value })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Protein (g)"
                    type="number"
                    value={mealPlanData.protein}
                    onChange={(e) => setMealPlanData({ ...mealPlanData, protein: e.target.value })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Carbohydrates (g)"
                    type="number"
                    value={mealPlanData.carbs}
                    onChange={(e) => setMealPlanData({ ...mealPlanData, carbs: e.target.value })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fats (g)"
                    type="number"
                    value={mealPlanData.fats}
                    onChange={(e) => setMealPlanData({ ...mealPlanData, fats: e.target.value })}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingPlan ? 'Update' : 'Add'} Meal Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlanManager; 