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
  Group,
  AccessTime,
  Event,
  Person
} from '@mui/icons-material';

const ClassScheduleManager = ({ 
  classSchedules, 
  onAddClass, 
  onUpdateClass, 
  onDeleteClass 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classData, setClassData] = useState({
    name: '',
    instructor: '',
    type: '',
    day: '',
    startTime: '',
    endTime: '',
    capacity: '',
    currentParticipants: '',
    room: '',
    description: '',
    requirements: ''
  });

  const handleOpenDialog = (classSchedule = null) => {
    if (classSchedule) {
      setEditingClass(classSchedule);
      setClassData({
        name: classSchedule.name,
        instructor: classSchedule.instructor,
        type: classSchedule.type,
        day: classSchedule.day,
        startTime: classSchedule.startTime,
        endTime: classSchedule.endTime,
        capacity: classSchedule.capacity,
        currentParticipants: classSchedule.currentParticipants,
        room: classSchedule.room,
        description: classSchedule.description,
        requirements: classSchedule.requirements
      });
    } else {
      setEditingClass(null);
      setClassData({
        name: '',
        instructor: '',
        type: '',
        day: '',
        startTime: '',
        endTime: '',
        capacity: '',
        currentParticipants: '',
        room: '',
        description: '',
        requirements: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClass(null);
    setClassData({
      name: '',
      instructor: '',
      type: '',
      day: '',
      startTime: '',
      endTime: '',
      capacity: '',
      currentParticipants: '',
      room: '',
      description: '',
      requirements: ''
    });
  };

  const handleSubmit = () => {
    if (editingClass) {
      onUpdateClass(editingClass.id, classData);
    } else {
      onAddClass(classData);
    }
    handleCloseDialog();
  };

  const handleDelete = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      onDeleteClass(classId);
    }
  };

  const calculateOccupancy = (current, capacity) => {
    return (current / capacity) * 100;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Class Schedules</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Class
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Name</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classSchedules.map((classSchedule) => (
              <TableRow key={classSchedule.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group />
                    {classSchedule.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    {classSchedule.instructor}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={classSchedule.type} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event />
                    {classSchedule.day}
                    <AccessTime />
                    {classSchedule.startTime} - {classSchedule.endTime}
                  </Box>
                </TableCell>
                <TableCell>{classSchedule.room}</TableCell>
                <TableCell>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" gutterBottom>
                      {classSchedule.currentParticipants}/{classSchedule.capacity}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateOccupancy(classSchedule.currentParticipants, classSchedule.capacity)} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(classSchedule)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(classSchedule.id)}
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
          {editingClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class Name"
                value={classData.name}
                onChange={(e) => setClassData({ ...classData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor"
                value={classData.instructor}
                onChange={(e) => setClassData({ ...classData, instructor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={classData.type}
                  label="Type"
                  onChange={(e) => setClassData({ ...classData, type: e.target.value })}
                >
                  <MenuItem value="Yoga">Yoga</MenuItem>
                  <MenuItem value="Pilates">Pilates</MenuItem>
                  <MenuItem value="Spinning">Spinning</MenuItem>
                  <MenuItem value="Zumba">Zumba</MenuItem>
                  <MenuItem value="CrossFit">CrossFit</MenuItem>
                  <MenuItem value="Strength">Strength Training</MenuItem>
                  <MenuItem value="Cardio">Cardio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={classData.day}
                  label="Day"
                  onChange={(e) => setClassData({ ...classData, day: e.target.value })}
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={classData.startTime}
                onChange={(e) => setClassData({ ...classData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={classData.endTime}
                onChange={(e) => setClassData({ ...classData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={classData.capacity}
                onChange={(e) => setClassData({ ...classData, capacity: e.target.value })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Participants"
                type="number"
                value={classData.currentParticipants}
                onChange={(e) => setClassData({ ...classData, currentParticipants: e.target.value })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room"
                value={classData.room}
                onChange={(e) => setClassData({ ...classData, room: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={classData.description}
                onChange={(e) => setClassData({ ...classData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                multiline
                rows={2}
                value={classData.requirements}
                onChange={(e) => setClassData({ ...classData, requirements: e.target.value })}
                placeholder="Any special requirements or prerequisites for the class"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingClass ? 'Update' : 'Add'} Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassScheduleManager; 