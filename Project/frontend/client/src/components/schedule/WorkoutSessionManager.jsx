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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  AccessTime,
  CalendarToday,
  FitnessCenter
} from '@mui/icons-material';
import { mockWorkoutTypes } from '../../mockData/scheduleData';

const WorkoutSessionManager = ({ 
  sessions, 
  onAddSession, 
  onUpdateSession, 
  onDeleteSession,
  coachAvailability 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionData, setSessionData] = useState({
    type: '',
    date: '',
    startTime: '',
    duration: '',
    notes: '',
    maxParticipants: 1
  });

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setSessionData({
        type: session.type,
        date: session.date,
        startTime: session.startTime,
        duration: session.duration,
        notes: session.notes,
        maxParticipants: session.maxParticipants
      });
    } else {
      setEditingSession(null);
      setSessionData({
        type: '',
        date: '',
        startTime: '',
        duration: '',
        notes: '',
        maxParticipants: 1
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSession(null);
    setSessionData({
      type: '',
      date: '',
      startTime: '',
      duration: '',
      notes: '',
      maxParticipants: 1
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
    if (window.confirm('Are you sure you want to delete this session?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Workout Sessions</Typography>
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
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Max Participants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter />
                    {mockWorkoutTypes.find(t => t.id === session.type)?.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday />
                    {new Date(session.date).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime />
                    {session.startTime}
                  </Box>
                </TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>{session.maxParticipants}</TableCell>
                <TableCell>
                  <Chip
                    label={session.status}
                    color={
                      session.status === 'scheduled' ? 'success' :
                      session.status === 'completed' ? 'info' :
                      session.status === 'cancelled' ? 'error' : 'default'
                    }
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSession ? 'Edit Session' : 'Add New Session'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Workout Type</InputLabel>
                <Select
                  value={sessionData.type}
                  label="Workout Type"
                  onChange={(e) => setSessionData({ ...sessionData, type: e.target.value })}
                >
                  {mockWorkoutTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={sessionData.startTime}
                onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={sessionData.duration}
                  label="Duration"
                  onChange={(e) => setSessionData({ ...sessionData, duration: e.target.value })}
                >
                  <MenuItem value="30 minutes">30 minutes</MenuItem>
                  <MenuItem value="45 minutes">45 minutes</MenuItem>
                  <MenuItem value="60 minutes">60 minutes</MenuItem>
                  <MenuItem value="90 minutes">90 minutes</MenuItem>
                  <MenuItem value="120 minutes">120 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={sessionData.maxParticipants}
                onChange={(e) => setSessionData({ ...sessionData, maxParticipants: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={sessionData.notes}
                onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
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

export default WorkoutSessionManager; 