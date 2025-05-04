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
  Build,
  AccessTime,
  Event,
  Warning
} from '@mui/icons-material';

const EquipmentMaintenanceManager = ({ 
  maintenanceSchedules, 
  onAddSchedule, 
  onUpdateSchedule, 
  onDeleteSchedule 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    equipmentId: '',
    equipmentName: '',
    type: '',
    lastMaintenance: '',
    nextMaintenance: '',
    frequency: '',
    status: '',
    assignedTechnician: '',
    notes: '',
    priority: ''
  });

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleData({
        equipmentId: schedule.equipmentId,
        equipmentName: schedule.equipmentName,
        type: schedule.type,
        lastMaintenance: schedule.lastMaintenance,
        nextMaintenance: schedule.nextMaintenance,
        frequency: schedule.frequency,
        status: schedule.status,
        assignedTechnician: schedule.assignedTechnician,
        notes: schedule.notes,
        priority: schedule.priority
      });
    } else {
      setEditingSchedule(null);
      setScheduleData({
        equipmentId: '',
        equipmentName: '',
        type: '',
        lastMaintenance: '',
        nextMaintenance: '',
        frequency: '',
        status: '',
        assignedTechnician: '',
        notes: '',
        priority: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
    setScheduleData({
      equipmentId: '',
      equipmentName: '',
      type: '',
      lastMaintenance: '',
      nextMaintenance: '',
      frequency: '',
      status: '',
      assignedTechnician: '',
      notes: '',
      priority: ''
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
    if (window.confirm('Are you sure you want to delete this maintenance schedule?')) {
      onDeleteSchedule(scheduleId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Equipment Maintenance Schedules</Typography>
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
              <TableCell>Equipment</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Last Maintenance</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenanceSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Build />
                    {schedule.equipmentName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={schedule.type} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event />
                    {new Date(schedule.lastMaintenance).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime />
                    {new Date(schedule.nextMaintenance).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={schedule.status} 
                    size="small" 
                    color={getStatusColor(schedule.status)}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={schedule.priority} 
                    size="small" 
                    color={getPriorityColor(schedule.priority)}
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
          {editingSchedule ? 'Edit Maintenance Schedule' : 'Add New Maintenance Schedule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Equipment ID"
                value={scheduleData.equipmentId}
                onChange={(e) => setScheduleData({ ...scheduleData, equipmentId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Equipment Name"
                value={scheduleData.equipmentName}
                onChange={(e) => setScheduleData({ ...scheduleData, equipmentName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={scheduleData.type}
                  label="Type"
                  onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                >
                  <MenuItem value="Cardio">Cardio Equipment</MenuItem>
                  <MenuItem value="Strength">Strength Equipment</MenuItem>
                  <MenuItem value="Free Weights">Free Weights</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                  <MenuItem value="Machines">Machines</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={scheduleData.priority}
                  label="Priority"
                  onChange={(e) => setScheduleData({ ...scheduleData, priority: e.target.value })}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Maintenance Date"
                type="date"
                value={scheduleData.lastMaintenance}
                onChange={(e) => setScheduleData({ ...scheduleData, lastMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next Maintenance Date"
                type="date"
                value={scheduleData.nextMaintenance}
                onChange={(e) => setScheduleData({ ...scheduleData, nextMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={scheduleData.frequency}
                  label="Frequency"
                  onChange={(e) => setScheduleData({ ...scheduleData, frequency: e.target.value })}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Annually">Annually</MenuItem>
                </Select>
              </FormControl>
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
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned Technician"
                value={scheduleData.assignedTechnician}
                onChange={(e) => setScheduleData({ ...scheduleData, assignedTechnician: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={scheduleData.notes}
                onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                placeholder="Maintenance notes, issues, or observations"
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

export default EquipmentMaintenanceManager; 