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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  FitnessCenter,
  Edit,
  Delete,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';
import userService from '../../services/userService';
import coachAvailabilityService from '../../services/coachAvailabilityService';

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
  const [activeTab, setActiveTab] = useState(0);
  const [requestTypeTab, setRequestTypeTab] = useState(0);
  const [changeRequests, setChangeRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachAssignments, setCoachAssignments] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has manager role
    if (!user || user.role !== 'manager') {
      setError('Access denied. Only managers can access this page.');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      console.log('Starting to load data...');
      setLoading(true);
      setError('');

      // Load all data in parallel
      console.log('Making API requests...');
      const [requests, membersData, coachesData] = await Promise.all([
        scheduleService.getChangeRequests().catch(err => {
          console.error('Error in getChangeRequests:', err);
          return [];
        }),
        userService.getMembers().catch(err => {
          console.error('Error in getMembers:', err);
          return [];
        }),
        userService.getCoaches().catch(err => {
          console.error('Error in getCoaches:', err);
          return [];
        })
      ]);

      console.log('API responses received:', {
        changeRequests: requests,
        members: membersData,
        coaches: coachesData
      });

      // Set the data
      setChangeRequests(requests || []);
      setMembers(membersData || []);
      setCoaches(coachesData || []);

      // Load coach assignments
      console.log('Loading coach assignments...');
      const assignments = {};
      for (const coach of coachesData || []) {
        try {
          const availability = await coachAvailabilityService.getCoachAvailability(coach._id);
          console.log(`Coach ${coach._id} availability:`, availability);
          assignments[coach._id] = availability?.assignedMembers || [];
        } catch (error) {
          console.error(`Error loading assignments for coach ${coach._id}:`, error);
          assignments[coach._id] = [];
        }
      }
      setCoachAssignments(assignments);
      console.log('Data loading completed');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Error loading data:', {
        error: err,
        message: errorMessage,
        status: err.response?.status
      });
      setError(`Failed to load data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Add effect to log state changes
  useEffect(() => {
    console.log('ChangeRequests state updated:', changeRequests);
  }, [changeRequests]);

  const handleApprove = async (scheduleId, requestId) => {
    try {
      if (!user || user.role !== 'manager') {
        setError('Access denied. Only managers can approve schedule changes.');
        return;
      }
      setLoading(true);
      
      // Find the request
      const request = changeRequests.find(req => req._id === requestId);
      if (!request) {
        setError('Request not found');
        return;
      }

      // Use the request's _id for the API call
      await scheduleService.approveScheduleChange(scheduleId, request._id);
      setSuccess('Schedule change approved successfully');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve schedule change');
      console.error('Error approving change:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (scheduleId, requestId) => {
    try {
      if (!user || user.role !== 'manager') {
        setError('Access denied. Only managers can reject schedule changes.');
        return;
      }
      setLoading(true);

      // Find the request
      const request = changeRequests.find(req => req._id === requestId);
      if (!request) {
        setError('Request not found');
        return;
      }

      // Use the request's _id for the API call
      await scheduleService.rejectScheduleChange(scheduleId, request._id);
      setSuccess('Schedule change rejected');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject schedule change');
      console.error('Error rejecting change:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMember = async (memberId, coachId) => {
    try {
      setLoading(true);
      
      // If no coach is selected, find the current coach and remove the assignment
      if (!coachId) {
        const currentCoach = coaches.find(coach => 
          coachAssignments[coach._id]?.some(assignment => 
            assignment.memberId._id === memberId
          )
        );
        if (currentCoach) {
          await coachAvailabilityService.removeMember(memberId);
          setCoachAssignments(prev => ({
            ...prev,
            [currentCoach._id]: (prev[currentCoach._id] || []).filter(
              assignment => assignment.memberId._id !== memberId
            )
          }));
          setSuccess('Member assignment removed successfully');
        }
        return;
      }

      // Assign member to new coach
      await coachAvailabilityService.assignMember(memberId, coachId);
      
      // Update local state
      setCoachAssignments(prev => ({
        ...prev,
        [coachId]: [...(prev[coachId] || []), { memberId: { _id: memberId } }]
      }));

      setSuccess('Member assigned successfully');
    } catch (error) {
      console.error('Error in handleAssignMember:', error);
      setError(error.message || 'Failed to assign member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, coachId) => {
    try {
      setLoading(true);
      await coachAvailabilityService.removeMember(memberId);
      
      // Update local state
      setCoachAssignments(prev => ({
        ...prev,
        [coachId]: (prev[coachId] || []).filter(assignment => assignment.memberId._id !== memberId)
      }));

      setSuccess('Member removed successfully');
    } catch (error) {
      setError('Failed to remove member');
      console.error('Error removing member:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChangeRequests = () => {
    console.log('Rendering change requests with state:', changeRequests);
    
    if (loading) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Loading change requests...
            </Typography>
          </Grid>
        </Grid>
      );
    }

    // Ensure we have an array of requests
    const requests = Array.isArray(changeRequests) ? changeRequests : [changeRequests].filter(Boolean);
    console.log('Processed requests for rendering:', requests);

    if (!requests || requests.length === 0) {
      console.log('No change requests to display');
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No schedule change requests
            </Typography>
          </Grid>
        </Grid>
      );
    }

    // Separate requests by type and status
    const memberRequests = requests.filter(req => {
      // If the userId is the same as the coachId in the schedule, it's a coach request
      return req.userId._id !== req.scheduleId.coachId;
    });
    const coachRequests = requests.filter(req => {
      // If the userId is the same as the coachId in the schedule, it's a coach request
      return req.userId._id === req.scheduleId.coachId;
    });
    const pendingMemberRequests = memberRequests.filter(req => req.status === 'pending');
    const pendingCoachRequests = coachRequests.filter(req => req.status === 'pending');
    const pastMemberRequests = memberRequests.filter(req => req.status !== 'pending');
    const pastCoachRequests = coachRequests.filter(req => req.status !== 'pending');

    console.log('Filtered requests:', {
      memberRequests,
      coachRequests,
      pendingMemberRequests,
      pendingCoachRequests,
      pastMemberRequests,
      pastCoachRequests
    });

    return (
      <Grid container spacing={3}>
        {/* Tabs for Member and Coach Requests */}
        <Grid item xs={12}>
          <Tabs
            value={requestTypeTab}
            onChange={(e, newValue) => setRequestTypeTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Member Requests" />
            <Tab label="Coach Requests" />
          </Tabs>
        </Grid>

        {/* Member Requests */}
        {requestTypeTab === 0 && (
          <>
            {/* Pending Member Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Pending Member Requests
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Current Schedule</TableCell>
                      <TableCell>Requested Schedule</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingMemberRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person />
                            <Typography>
                              {request.userId?.name || 'Unknown'}
                            </Typography>
                            <Chip
                              label={request.userId?.membershipType}
                              color={request.userId?.membershipType === 'Platinum' ? 'primary' : 
                                     request.userId?.membershipType === 'Gold' ? 'secondary' : 'default'}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          {request.scheduleId?.sessions?.[0]?.date ? 
                            new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'} at{' '}
                          {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {request.newDate ? 
                            new Date(request.newDate).toLocaleDateString() : 'N/A'} at{' '}
                          {request.newTime || 'N/A'}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={request.status === 'pending' ? 'warning' : 
                                   request.status === 'approved' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Past Member Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Past Member Requests
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Current Schedule</TableCell>
                      <TableCell>Requested Schedule</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastMemberRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person />
                            <Typography>
                              {request.userId?.name || 'Unknown'}
                            </Typography>
                            <Chip
                              label={request.userId?.membershipType}
                              color={request.userId?.membershipType === 'Platinum' ? 'primary' : 
                                     request.userId?.membershipType === 'Gold' ? 'secondary' : 'default'}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          {request.scheduleId?.sessions?.[0]?.date ? 
                            new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'} at{' '}
                          {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {request.newDate ? 
                            new Date(request.newDate).toLocaleDateString() : 'N/A'} at{' '}
                          {request.newTime || 'N/A'}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={request.status === 'approved' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}

        {/* Coach Requests */}
        {requestTypeTab === 1 && (
          <>
            {/* Pending Coach Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Pending Coach Requests
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Coach</TableCell>
                      <TableCell>Current Schedule</TableCell>
                      <TableCell>Requested Schedule</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingCoachRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FitnessCenter />
                            <Typography>
                              {request.userId?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {request.scheduleId?.sessions?.[0]?.date ? 
                            new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'} at{' '}
                          {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {request.newDate ? 
                            new Date(request.newDate).toLocaleDateString() : 'N/A'} at{' '}
                          {request.newTime || 'N/A'}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={request.status === 'pending' ? 'warning' : 
                                   request.status === 'approved' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Past Coach Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Past Coach Requests
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Coach</TableCell>
                      <TableCell>Current Schedule</TableCell>
                      <TableCell>Requested Schedule</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastCoachRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FitnessCenter />
                            <Typography>
                              {request.userId?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {request.scheduleId?.sessions?.[0]?.date ? 
                            new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'} at{' '}
                          {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {request.newDate ? 
                            new Date(request.newDate).toLocaleDateString() : 'N/A'} at{' '}
                          {request.newTime || 'N/A'}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={request.status === 'approved' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>
    );
  };

  const renderMembersList = () => {
    console.log('Rendering members list:', members);
    
    if (loading) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Loading members...
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (!members || members.length === 0) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No members found
            </Typography>
          </Grid>
        </Grid>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Membership Type</TableCell>
              <TableCell>Assigned Coach</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={member.profileImage} />
                    {member.name}
                  </Box>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Chip
                    label={member.membershipType}
                    color={member.membershipType === 'Platinum' ? 'primary' : 
                           member.membershipType === 'Gold' ? 'secondary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={coaches.find(coach => 
                        coachAssignments[coach._id]?.some(assignment => 
                          assignment.memberId._id === member._id
                        )
                      )?._id || ''}
                      onChange={(e) => handleAssignMember(member._id, e.target.value)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {coaches.map((coach) => (
                        <MenuItem key={coach._id} value={coach._id}>
                          {coach.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Tooltip title="Remove Assignment">
                    <IconButton
                      color="error"
                      onClick={() => {
                        const currentCoach = coaches.find(coach => 
                          coachAssignments[coach._id]?.some(assignment => 
                            assignment.memberId._id === member._id
                          )
                        );
                        if (currentCoach) {
                          handleRemoveMember(member._id, currentCoach._id);
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderCoachesList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Assigned Members</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coaches.map((coach) => (
            <TableRow key={coach._id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={coach.profileImage} />
                  {coach.name}
                </Box>
              </TableCell>
              <TableCell>{coach.email}</TableCell>
              <TableCell>{coach.specialization || 'General'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {coachAssignments[coach._id]?.map((assignment) => {
                    const member = members.find(m => m._id === assignment.memberId._id);
                    return member ? (
                      <Chip
                        key={member._id}
                        label={member.name}
                        size="small"
                        onDelete={() => handleRemoveMember(member._id, coach._id)}
                      />
                    ) : null;
                  })}
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <Select
                      value=""
                      onChange={(e) => {
                        const memberId = e.target.value;
                        if (memberId) {
                          handleAssignMember(memberId, coach._id);
                        }
                      }}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        <em>Assign Member</em>
                      </MenuItem>
                      {members
                        .filter(member => {
                          // Only show members not assigned to any coach
                          const assignedToAnyCoach = Object.values(coachAssignments).some(assignments =>
                            assignments.some(assignment => assignment.memberId._id === member._id)
                          );
                          return !assignedToAnyCoach;
                        })
                        .map((member) => (
                          <MenuItem key={member._id} value={member._id}>
                            {member.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
            Manager Dashboard
          </Typography>
        </StyledPaper>

        {/* Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Change Requests" icon={<AccessTime />} iconPosition="start" />
            <Tab label="Members" icon={<Person />} iconPosition="start" />
            <Tab label="Coaches" icon={<FitnessCenter />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Content based on active tab */}
        {activeTab === 0 && renderChangeRequests()}
        {activeTab === 1 && renderMembersList()}
        {activeTab === 2 && renderCoachesList()}
      </Box>
    </Container>
  );
};

export default ManagerSchedule; 