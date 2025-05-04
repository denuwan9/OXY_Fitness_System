import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  LinearProgress,
  FormHelperText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  AccessTime,
  Event,
  Work
} from '@mui/icons-material';

// Validation schema
const schema = yup.object().shape({
  staffId: yup.string().required('Staff ID is required'),
  staffName: yup.string().required('Staff Name is required'),
  role: yup.string().required('Role is required'),
  day: yup.string().required('Day is required'),
  startTime: yup.string().required('Start Time is required'),
  endTime: yup.string().required('End Time is required'),
  shift: yup.string().required('Shift is required'),
  status: yup.string().required('Status is required'),
  department: yup.string().required('Department is required'),
  notes: yup.string()
});

const StaffScheduleManager = ({ 
  staffSchedules, 
  onAddSchedule, 
  onUpdateSchedule, 
  onDeleteSchedule 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      staffId: '',
      staffName: '',
      role: '',
      day: '',
      startTime: '',
      endTime: '',
      shift: '',
      status: '',
      notes: '',
      department: ''
    }
  });

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      // Set form values for editing
      Object.keys(schedule).forEach(key => {
        setValue(key, schedule[key]);
      });
    } else {
      setEditingSchedule(null);
      reset(); // Reset form to default values
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingSchedule) {
      onUpdateSchedule(editingSchedule.id, data);
    } else {
      onAddSchedule(data);
    }
    handleCloseDialog();
  };

  const handleDelete = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this staff schedule?')) {
      onDeleteSchedule(scheduleId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Working':
        return 'success';
      case 'Off':
        return 'error';
      case 'On Call':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Staff Schedules</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Schedule
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.staffId}</TableCell>
                <TableCell>{schedule.staffName}</TableCell>
                <TableCell>{schedule.role}</TableCell>
                <TableCell>{schedule.department}</TableCell>
                <TableCell>{schedule.day}</TableCell>
                <TableCell>{schedule.shift}</TableCell>
                <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                <TableCell>
                  <Chip
                    label={schedule.status}
                    color={getStatusColor(schedule.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(schedule)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(schedule.id)}
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
          {editingSchedule ? 'Edit Staff Schedule' : 'Add New Staff Schedule'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Staff ID"
                  {...register('staffId')}
                  error={!!errors.staffId}
                  helperText={errors.staffId?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Staff Name"
                  {...register('staffName')}
                  error={!!errors.staffName}
                  helperText={errors.staffName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...register('role')}
                    label="Role"
                  >
                    <MenuItem value="Trainer">Trainer</MenuItem>
                    <MenuItem value="Instructor">Instructor</MenuItem>
                    <MenuItem value="Receptionist">Receptionist</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                  </Select>
                  <FormHelperText>{errors.role?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    {...register('department')}
                    label="Department"
                  >
                    <MenuItem value="Fitness">Fitness</MenuItem>
                    <MenuItem value="Administration">Administration</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Customer Service">Customer Service</MenuItem>
                  </Select>
                  <FormHelperText>{errors.department?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.day}>
                  <InputLabel>Day</InputLabel>
                  <Select
                    {...register('day')}
                    label="Day"
                  >
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                  </Select>
                  <FormHelperText>{errors.day?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.shift}>
                  <InputLabel>Shift</InputLabel>
                  <Select
                    {...register('shift')}
                    label="Shift"
                  >
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Afternoon">Afternoon</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                    <MenuItem value="Night">Night</MenuItem>
                  </Select>
                  <FormHelperText>{errors.shift?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  {...register('startTime')}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  {...register('endTime')}
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    {...register('status')}
                    label="Status"
                  >
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="Working">Working</MenuItem>
                    <MenuItem value="Off">Off</MenuItem>
                    <MenuItem value="On Call">On Call</MenuItem>
                  </Select>
                  <FormHelperText>{errors.status?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  {...register('notes')}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  placeholder="Additional notes or special arrangements"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingSchedule ? 'Update' : 'Add'} Schedule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default StaffScheduleManager; 