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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockChangeRequests } from '../mockData/scheduleData';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#2a2a2a',
  color: '#ffffff',
  margin: theme.spacing(2, 0),
}));

const OperationManagerSchedule = () => {
  const [changeRequests, setChangeRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // For testing, use mock change requests
    setChangeRequests(mockChangeRequests);
  }, []);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleApproveRequest = () => {
    // Mock request approval
    const updatedRequests = changeRequests.map(request => {
      if (request._id === selectedRequest._id) {
        return {
          ...request,
          status: 'approved',
        };
      }
      return request;
    });
    setChangeRequests(updatedRequests);
    setOpenDialog(false);
  };

  const handleRejectRequest = () => {
    // Mock request rejection
    const updatedRequests = changeRequests.map(request => {
      if (request._id === selectedRequest._id) {
        return {
          ...request,
          status: 'rejected',
        };
      }
      return request;
    });
    setChangeRequests(updatedRequests);
    setOpenDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
          Schedule Change Requests
        </Typography>

        <Grid container spacing={3}>
          {changeRequests.map((request) => (
            <Grid item xs={12} key={request._id}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        Member: {request.userId.name}
                      </Typography>
                      <Typography variant="body1">
                        Coach: {request.coachId.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Current Date: {new Date(request.currentDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requested Date: {new Date(request.newDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        sx={{ mr: 2 }}
                      />
                      {request.status === 'pending' && (
                        <>
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => handleViewRequest(request)}
                              color="primary"
                            >
                              <Check />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Change Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Current Schedule
              </Typography>
              <Typography variant="body1">
                Date: {new Date(selectedRequest.currentDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                Time: {selectedRequest.currentTime}
              </Typography>
              <Typography variant="body1">
                Workout Type: {selectedRequest.workoutType}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Requested Changes
              </Typography>
              <Typography variant="body1">
                New Date: {new Date(selectedRequest.newDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                New Time: {selectedRequest.newTime}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Member Information
              </Typography>
              <Typography variant="body1">
                Name: {selectedRequest.userId.name}
              </Typography>
              <Typography variant="body1">
                Membership Type: {selectedRequest.membershipType}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button onClick={handleRejectRequest} color="error">
            Reject
          </Button>
          <Button onClick={handleApproveRequest} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OperationManagerSchedule; 