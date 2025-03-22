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
  AccessTime,
  Event,
  Work
} from '@mui/icons-material';

const StaffScheduleManager = ({ 
  staffSchedules, 
  onAddSchedule, 
  onUpdateSchedule, 
  onDeleteSchedule 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({
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
  });

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleData({
        staffId: schedule.staffId,
        staffName: schedule.staffName,
        role: schedule.role,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        shift: schedule.shift,
        status: schedule.status,
        notes: schedule.notes,
        department: schedule.department
      });
    } else {
      setEditingSchedule(null);
      setScheduleData({
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
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    setScheduleData({
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
    });
  };

  const handleSubmit = () => {
    if (editingSchedule) {
      onUpdateSchedule(editingSchedule.id, scheduleData);
    } else {
      onAddSchedule(scheduleData);
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
              <TableCell>Staff Member</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    {schedule.staffName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={schedule.role} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={schedule.department} size="small" color="info" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event />
                    {schedule.day}
                    <AccessTime />
                    {schedule.startTime} - {schedule.endTime}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={schedule.shift} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={schedule.status} 
                    size="small" 
                    color={getStatusColor(schedule.status)}
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
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Staff ID"
                value={scheduleData.staffId}
                onChange={(e) => setScheduleData({ ...scheduleData, staffId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Staff Name"
                value={scheduleData.staffName}
                onChange={(e) => setScheduleData({ ...scheduleData, staffName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={scheduleData.role}
                  label="Role"
                  onChange={(e) => setScheduleData({ ...scheduleData, role: e.target.value })}
                >
                  <MenuItem value="Trainer">Trainer</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={scheduleData.department}
                  label="Department"
                  onChange={(e) => setScheduleData({ ...scheduleData, department: e.target.value })}
                >
                  <MenuItem value="Fitness">Fitness</MenuItem>
                  <MenuItem value="Administration">Administration</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Customer Service">Customer Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Day</InputLabel>
                <Select
                  value={scheduleData.day}
                  label="Day"
                  onChange={(e) => setScheduleData({ ...scheduleData, day: e.target.value })}
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
              <FormControl fullWidth>
                <InputLabel>Shift</InputLabel>
                <Select
                  value={scheduleData.shift}
                  label="Shift"
                  onChange={(e) => setScheduleData({ ...scheduleData, shift: e.target.value })}
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Afternoon">Afternoon</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                  <MenuItem value="Night">Night</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={scheduleData.startTime}
                onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={scheduleData.endTime}
                onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={scheduleData.status}
                  label="Status"
                  onChange={(e) => setScheduleData({ ...scheduleData, status: e.target.value })}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Working">Working</MenuItem>
                  <MenuItem value="Off">Off</MenuItem>
                  <MenuItem value="On Call">On Call</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={scheduleData.notes}
                onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                placeholder="Additional notes or special arrangements"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSchedule ? 'Update' : 'Add'} Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffScheduleManager; 