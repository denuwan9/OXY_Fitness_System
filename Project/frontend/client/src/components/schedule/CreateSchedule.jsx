import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import scheduleService from '../../services/scheduleService';

const workoutTypes = [
  'Personal Training',
  'Group Class',
  'Cardio Session',
  'Strength Training',
  'HIIT Training',
  'Yoga Session'
];

const CreateSchedule = ({ userId, membershipType, onSuccess }) => {
  const [scheduleType, setScheduleType] = useState('weekday');
  const [sessions, setSessions] = useState([{
    date: new Date(),
    time: '09:00',
    duration: 60,
    workoutType: 'Personal Training',
    notes: '',
    status: 'scheduled'
  }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddSession = () => {
    setSessions([...sessions, {
      date: new Date(),
      time: '09:00',
      duration: 60,
      workoutType: 'Personal Training',
      notes: '',
      status: 'scheduled'
    }]);
  };

  const handleRemoveSession = (index) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const handleSessionChange = (index, field, value) => {
    const newSessions = [...sessions];
    newSessions[index] = {
      ...newSessions[index],
      [field]: value
    };
    setSessions(newSessions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate sessions
      if (sessions.length === 0) {
        throw new Error('At least one session is required');
      }

      // Format sessions data
      const formattedSessions = sessions.map(session => ({
        ...session,
        date: session.date.toISOString().split('T')[0],
        time: typeof session.time === 'string' ? session.time : session.time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }));

      const scheduleData = {
        userId,
        membershipType,
        scheduleType,
        sessions: formattedSessions
      };

      const response = await scheduleService.createSchedule(scheduleData);
      setSuccess(true);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Schedule
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Schedule created successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Schedule Type</InputLabel>
            <Select
              value={scheduleType}
              label="Schedule Type"
              onChange={(e) => setScheduleType(e.target.value)}
            >
              <MenuItem value="weekday">Weekday</MenuItem>
              <MenuItem value="weekend">Weekend</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {sessions.map((session, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Session {index + 1}
                    {sessions.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSession(index)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date"
                      value={session.date}
                      onChange={(newValue) => handleSessionChange(index, 'date', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Time"
                      value={session.time}
                      onChange={(newValue) => handleSessionChange(index, 'time', newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    value={session.duration}
                    onChange={(e) => handleSessionChange(index, 'duration', e.target.value)}
                    InputProps={{ inputProps: { min: 15, max: 180 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Workout Type</InputLabel>
                    <Select
                      value={session.workoutType}
                      label="Workout Type"
                      onChange={(e) => handleSessionChange(index, 'workoutType', e.target.value)}
                    >
                      {workoutTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    value={session.notes}
                    onChange={(e) => handleSessionChange(index, 'notes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ mt: 2, mb: 3 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddSession}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Add Session
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating Schedule...' : 'Create Schedule'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateSchedule; 