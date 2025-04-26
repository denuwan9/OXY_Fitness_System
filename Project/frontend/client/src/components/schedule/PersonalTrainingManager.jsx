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
  FitnessCenter
} from '@mui/icons-material';

const PersonalTrainingManager = ({ 
  trainingSessions, 
  onAddSession, 
  onUpdateSession, 
  onDeleteSession 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionData, setSessionData] = useState({
    memberId: '',
    memberName: '',
    trainerId: '',
    trainerName: '',
    date: '',
    startTime: '',
    endTime: '',
    type: '',
    goals: '',
    notes: '',
    status: ''
  });

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setSessionData({
        memberId: session.memberId,
        memberName: session.memberName,
        trainerId: session.trainerId,
        trainerName: session.trainerName,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        type: session.type,
        goals: session.goals,
        notes: session.notes,
        status: session.status
      });
    } else {
      setEditingSession(null);
      setSessionData({
        memberId: '',
        memberName: '',
        trainerId: '',
        trainerName: '',
        date: '',
        startTime: '',
        endTime: '',
        type: '',
        goals: '',
        notes: '',
        status: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSession(null);
    setSessionData({
      memberId: '',
      memberName: '',
      trainerId: '',
      trainerName: '',
      date: '',
      startTime: '',
      endTime: '',
      type: '',
      goals: '',
      notes: '',
      status: ''
    });
  };

  const handleSubmit = () => {
    if (editingSession) {
      onUpdateSession(editingSession.id, sessionData);
    } else {
      onAddSession(sessionData);
    }
    handleCloseDialog();
  };

  const handleDelete = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this training session?')) {
      onDeleteSession(sessionId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Personal Training Sessions</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Session
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Trainer</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    {session.memberName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter />
                    {session.trainerName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Event />
                    {new Date(session.date).toLocaleDateString()}
                    <AccessTime />
                    {session.startTime} - {session.endTime}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={session.type} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={session.status} 
                    size="small" 
                    color={getStatusColor(session.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(session)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(session.id)}
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
          {editingSession ? 'Edit Training Session' : 'Add New Training Session'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member ID"
                value={sessionData.memberId}
                onChange={(e) => setSessionData({ ...sessionData, memberId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member Name"
                value={sessionData.memberName}
                onChange={(e) => setSessionData({ ...sessionData, memberName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trainer ID"
                value={sessionData.trainerId}
                onChange={(e) => setSessionData({ ...sessionData, trainerId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trainer Name"
                value={sessionData.trainerName}
                onChange={(e) => setSessionData({ ...sessionData, trainerName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={sessionData.date}
                onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={sessionData.status}
                  label="Status"
                  onChange={(e) => setSessionData({ ...sessionData, status: e.target.value })}
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={sessionData.startTime}
                onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={sessionData.endTime}
                onChange={(e) => setSessionData({ ...sessionData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={sessionData.type}
                  label="Type"
                  onChange={(e) => setSessionData({ ...sessionData, type: e.target.value })}
                >
                  <MenuItem value="Strength">Strength Training</MenuItem>
                  <MenuItem value="Cardio">Cardio</MenuItem>
                  <MenuItem value="Flexibility">Flexibility</MenuItem>
                  <MenuItem value="HIIT">HIIT</MenuItem>
                  <MenuItem value="CrossFit">CrossFit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Goals"
                multiline
                rows={2}
                value={sessionData.goals}
                onChange={(e) => setSessionData({ ...sessionData, goals: e.target.value })}
                placeholder="Specific goals for this training session"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={sessionData.notes}
                onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                placeholder="Additional notes or observations"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSession ? 'Update' : 'Add'} Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalTrainingManager; 