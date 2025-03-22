import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const ManagerSchedule = () => {
  const { user } = useAuth();
  const [changeRequests, setChangeRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadChangeRequests();
  }, []);

  const loadChangeRequests = async () => {
    try {
      // In a real application, you would fetch pending change requests
      const response = await fetch('/api/schedules/change-requests');
      const data = await response.json();
      setChangeRequests(data);
    } catch (err) {
      setError('Failed to load change requests');
    }
  };

  const handleApprove = async (scheduleId, sessionId) => {
    try {
      await scheduleService.approveScheduleChange(scheduleId, sessionId);
      setSuccess('Schedule change approved successfully');
      loadChangeRequests();
    } catch (err) {
      setError('Failed to approve schedule change');
    }
  };

  const handleReject = async (scheduleId, sessionId) => {
    try {
      // In a real application, you would have a reject endpoint
      await fetch(`/api/schedules/reject-change/${scheduleId}/${sessionId}`, {
        method: 'PUT',
      });
      setSuccess('Schedule change rejected');
      loadChangeRequests();
    } catch (err) {
      setError('Failed to reject schedule change');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Header Section */}
        <StyledPaper>
          <Typography variant="h4" component="h1" gutterBottom>
            Schedule Change Requests
          </Typography>
        </StyledPaper>

        {/* Change Requests */}
        <Grid container spacing={3}>
          {changeRequests.map((request) => (
            <Grid item xs={12} key={request._id}>
              <StyledCard>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Person sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          Member: {request.userId.name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography>
                          Current: {new Date(request.currentDate).toLocaleDateString()} at{' '}
                          {request.currentTime}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography>
                          Requested: {new Date(request.newDate).toLocaleDateString()} at{' '}
                          {request.newTime}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(request.scheduleId, request.sessionId)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(request.scheduleId, request.sessionId)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
          {changeRequests.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No pending schedule change requests
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ManagerSchedule; 