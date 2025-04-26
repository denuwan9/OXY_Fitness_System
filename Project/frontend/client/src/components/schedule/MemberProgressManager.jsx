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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  TrendingUp,
  Assessment
} from '@mui/icons-material';

const MemberProgressManager = ({ 
  memberProgress, 
  onAddProgress, 
  onUpdateProgress, 
  onDeleteProgress 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [progressData, setProgressData] = useState({
    memberId: '',
    memberName: '',
    date: '',
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      legs: ''
    },
    performance: {
      strength: '',
      endurance: '',
      flexibility: ''
    },
    notes: ''
  });

  const handleOpenDialog = (progress = null) => {
    if (progress) {
      setEditingProgress(progress);
      setProgressData({
        memberId: progress.memberId,
        memberName: progress.memberName,
        date: progress.date,
        weight: progress.weight,
        bodyFat: progress.bodyFat,
        muscleMass: progress.muscleMass,
        measurements: progress.measurements,
        performance: progress.performance,
        notes: progress.notes
      });
    } else {
      setEditingProgress(null);
      setProgressData({
        memberId: '',
        memberName: '',
        date: '',
        weight: '',
        bodyFat: '',
        muscleMass: '',
        measurements: {
          chest: '',
          waist: '',
          hips: '',
          arms: '',
          legs: ''
        },
        performance: {
          strength: '',
          endurance: '',
          flexibility: ''
        },
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProgress(null);
    setProgressData({
      memberId: '',
      memberName: '',
      date: '',
      weight: '',
      bodyFat: '',
      muscleMass: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        legs: ''
      },
      performance: {
        strength: '',
        endurance: '',
        flexibility: ''
      },
      notes: ''
    });
  };

  const handleSubmit = () => {
    if (editingProgress) {
      onUpdateProgress(editingProgress.id, progressData);
    } else {
      onAddProgress(progressData);
    }
    handleCloseDialog();
  };

  const handleDelete = (progressId) => {
    if (window.confirm('Are you sure you want to delete this progress record?')) {
      onDeleteProgress(progressId);
    }
  };

  const calculateProgress = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Member Progress</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Progress Record
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Body Fat</TableCell>
              <TableCell>Muscle Mass</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memberProgress.map((progress) => (
              <TableRow key={progress.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    {progress.memberName}
                  </Box>
                </TableCell>
                <TableCell>{new Date(progress.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp />
                    {progress.weight} kg
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment />
                    {progress.bodyFat}%
                  </Box>
                </TableCell>
                <TableCell>{progress.muscleMass}%</TableCell>
                <TableCell>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" gutterBottom>
                      Strength: {progress.performance.strength}/10
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress.performance.strength * 10} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(progress)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(progress.id)}
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
          {editingProgress ? 'Edit Progress Record' : 'Add New Progress Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member ID"
                value={progressData.memberId}
                onChange={(e) => setProgressData({ ...progressData, memberId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member Name"
                value={progressData.memberName}
                onChange={(e) => setProgressData({ ...progressData, memberName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={progressData.date}
                onChange={(e) => setProgressData({ ...progressData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={progressData.weight}
                onChange={(e) => setProgressData({ ...progressData, weight: e.target.value })}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Body Fat (%)"
                type="number"
                value={progressData.bodyFat}
                onChange={(e) => setProgressData({ ...progressData, bodyFat: e.target.value })}
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Muscle Mass (%)"
                type="number"
                value={progressData.muscleMass}
                onChange={(e) => setProgressData({ ...progressData, muscleMass: e.target.value })}
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Body Measurements (cm)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Chest"
                    type="number"
                    value={progressData.measurements.chest}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      measurements: { ...progressData.measurements, chest: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Waist"
                    type="number"
                    value={progressData.measurements.waist}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      measurements: { ...progressData.measurements, waist: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hips"
                    type="number"
                    value={progressData.measurements.hips}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      measurements: { ...progressData.measurements, hips: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Arms"
                    type="number"
                    value={progressData.measurements.arms}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      measurements: { ...progressData.measurements, arms: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Legs"
                    type="number"
                    value={progressData.measurements.legs}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      measurements: { ...progressData.measurements, legs: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Performance Metrics (1-10)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Strength"
                    type="number"
                    value={progressData.performance.strength}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      performance: { ...progressData.performance, strength: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Endurance"
                    type="number"
                    value={progressData.performance.endurance}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      performance: { ...progressData.performance, endurance: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Flexibility"
                    type="number"
                    value={progressData.performance.flexibility}
                    onChange={(e) => setProgressData({
                      ...progressData,
                      performance: { ...progressData.performance, flexibility: e.target.value }
                    })}
                    InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={progressData.notes}
                onChange={(e) => setProgressData({ ...progressData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingProgress ? 'Update' : 'Add'} Progress Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberProgressManager; 