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
  LinearProgress,
  useTheme,
  Badge,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Person,
  FitnessCenter,
  Edit,
  Delete,
  Dashboard,
  CalendarMonth,
  Group,
  SportsGymnastics,
  Notifications,
  TrendingUp,
  Star,
  EmojiEvents,
  LocalFireDepartment,
  Bolt,
  Speed,
  Add,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import scheduleService from '../../services/scheduleService';
import userService from '../../services/userService';
import coachAvailabilityService from '../../services/coachAvailabilityService';
import Layout from '../layout/Layout';

// Styled components with modern theme and animations
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s, transform 0.3s',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  overflow: 'hidden',
  '& .MuiTableHead-root': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    '& .MuiTableCell-root': {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      fontSize: '1rem',
      padding: theme.spacing(2),
      borderBottom: 'none',
    },
  },
  '& .MuiTableBody-root': {
    '& .MuiTableRow-root': {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(2),
      fontSize: '0.95rem',
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  minWidth: 0,
  padding: theme.spacing(2, 3),
  transition: 'background-color 0.3s, color 0.3s',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(1),
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s, transform 0.3s',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.primary.contrastText,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-focused': {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: `${theme.palette.primary.main}20`,
    '&:hover': {
      backgroundColor: `${theme.palette.primary.main}30`,
    },
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  backgroundColor: status === 'pending' 
    ? `${theme.palette.warning.main}20`
    : status === 'approved' 
    ? `${theme.palette.success.main}20`
    : `${theme.palette.error.main}20`,
  color: status === 'pending' 
    ? theme.palette.warning.dark
    : status === 'approved' 
    ? theme.palette.success.dark
    : theme.palette.error.dark,
  border: `1px solid ${
    status === 'pending' 
      ? theme.palette.warning.main
      : status === 'approved' 
      ? theme.palette.success.main
      : theme.palette.error.main
  }`,
  transition: 'box-shadow 0.2s, transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: status === 'pending' 
      ? `${theme.palette.warning.main}30`
      : status === 'approved' 
      ? `${theme.palette.success.main}30`
      : `${theme.palette.error.main}30`,
  },
  '& .MuiChip-icon': {
    color: status === 'pending' 
      ? theme.palette.warning.main
      : status === 'approved' 
      ? theme.palette.success.main
      : theme.palette.error.main,
  },
}));

const MembershipChip = styled(Chip)(({ theme, type }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  backgroundColor: type === 'Platinum' 
    ? `${theme.palette.primary.main}20`
    : type === 'Gold' 
    ? `${theme.palette.secondary.main}20`
    : `${theme.palette.grey[500]}20`,
  color: type === 'Platinum' 
    ? theme.palette.primary.dark
    : type === 'Gold' 
    ? theme.palette.secondary.dark
    : theme.palette.grey[700],
  border: `1px solid ${
    type === 'Platinum' 
      ? theme.palette.primary.main
      : type === 'Gold' 
      ? theme.palette.secondary.main
      : theme.palette.grey[500]
  }`,
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s ease',
    backgroundColor: type === 'Platinum' 
      ? `${theme.palette.primary.main}30`
      : type === 'Gold' 
      ? `${theme.palette.secondary.main}30`
      : `${theme.palette.grey[500]}30`,
  },
  '& .MuiChip-icon': {
    color: type === 'Platinum' 
      ? theme.palette.primary.main
      : type === 'Gold' 
      ? theme.palette.secondary.main
      : theme.palette.grey[500],
  },
}));

const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
}));

const UserCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    border: `2px solid ${theme.palette.primary.main}`,
  },
  '& .user-info': {
    display: 'flex',
    flexDirection: 'column',
    '& .name': {
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    '& .email': {
      fontSize: '0.8rem',
      color: theme.palette.text.secondary,
    },
  },
}));

const DateCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  '& .date': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& .time': {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
}));

const ManagerSchedule = () => {
  const theme = useTheme();
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
  const [memberNameFilter, setMemberNameFilter] = useState('');
  const [coachNameFilter, setCoachNameFilter] = useState('');

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
      
      // Remove the approved request from the local state
      setChangeRequests(prevRequests => 
        prevRequests.filter(req => req._id !== requestId)
      );
      
      // Refresh the data
      await loadData();
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
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Pending Member Requests
              </Typography>
              <StyledTableContainer>
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
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                              <Person sx={{ color: '#fff' }} />
                            </Avatar>
                            <Typography fontWeight={600}>{request.userId?.name || 'Unknown'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.scheduleId?.sessions?.[0]?.date ? new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.newDate ? new Date(request.newDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.newTime || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={request.reason} arrow>
                            <Typography sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {request.reason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={request.status}
                            status={request.status}
                            size="small"
                            icon={
                              request.status === 'pending' ? <AccessTime /> :
                              request.status === 'approved' ? <CheckCircle /> :
                              <Cancel />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <ActionButton
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Approve
                            </ActionButton>
                            <ActionButton
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Reject
                            </ActionButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Grid>

            {/* Past Member Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: theme.palette.primary.main }}>
                Past Member Requests
              </Typography>
              <StyledTableContainer>
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
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                              <Person sx={{ color: '#fff' }} />
                            </Avatar>
                            <Typography fontWeight={600}>{request.userId?.name || 'Unknown'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.scheduleId?.sessions?.[0]?.date ? new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.newDate ? new Date(request.newDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.newTime || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={request.reason} arrow>
                            <Typography sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {request.reason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={request.status}
                            status={request.status}
                            size="small"
                            icon={
                              request.status === 'pending' ? <AccessTime /> :
                              request.status === 'approved' ? <CheckCircle /> :
                              <Cancel />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </DateCell>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Grid>
          </>
        )}

        {/* Coach Requests */}
        {requestTypeTab === 1 && (
          <>
            {/* Pending Coach Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Pending Coach Requests
              </Typography>
              <StyledTableContainer>
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
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                              <FitnessCenter sx={{ color: '#fff' }} />
                            </Avatar>
                            <Typography fontWeight={600}>{request.userId?.name || 'Unknown'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.scheduleId?.sessions?.[0]?.date ? new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.newDate ? new Date(request.newDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.newTime || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={request.reason} arrow>
                            <Typography sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {request.reason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={request.status}
                            status={request.status}
                            size="small"
                            icon={
                              request.status === 'pending' ? <AccessTime /> :
                              request.status === 'approved' ? <CheckCircle /> :
                              <Cancel />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <ActionButton
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Approve
                            </ActionButton>
                            <ActionButton
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(request.scheduleId._id, request._id)}
                              disabled={loading}
                            >
                              Reject
                            </ActionButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Grid>

            {/* Past Coach Requests */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 4, color: theme.palette.primary.main }}>
                Past Coach Requests
              </Typography>
              <StyledTableContainer>
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
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                              <FitnessCenter sx={{ color: '#fff' }} />
                            </Avatar>
                            <Typography fontWeight={600}>{request.userId?.name || 'Unknown'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.scheduleId?.sessions?.[0]?.date ? new Date(request.scheduleId.sessions[0].date).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.scheduleId?.sessions?.[0]?.time || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {request.newDate ? new Date(request.newDate).toLocaleDateString() : 'N/A'}
                            </Typography>
                            <Typography className="time">
                              {request.newTime || 'N/A'}
                            </Typography>
                          </DateCell>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={request.reason} arrow>
                            <Typography sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {request.reason}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={request.status}
                            status={request.status}
                            size="small"
                            icon={
                              request.status === 'pending' ? <AccessTime /> :
                              request.status === 'approved' ? <CheckCircle /> :
                              <Cancel />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <DateCell>
                            <Typography className="date">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </DateCell>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
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

    const filteredMembers = members.filter(member => {
      const matchesMemberName = member.name.toLowerCase().includes(memberNameFilter.toLowerCase());
      const assignedCoach = coaches.find(coach => 
        coachAssignments[coach._id]?.some(assignment => 
          assignment.memberId._id === member._id
        )
      );
      const matchesCoachName = assignedCoach ? 
        assignedCoach.name.toLowerCase().includes(coachNameFilter.toLowerCase()) : 
        coachNameFilter === '';

      return matchesMemberName && matchesCoachName;
    });

    return (
      <>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search members by name..."
              value={memberNameFilter}
              onChange={(e) => setMemberNameFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Person sx={{ color: 'primary.main', mr: 1 }} />
                ),
                sx: {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(33, 150, 243, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by assigned coach..."
              value={coachNameFilter}
              onChange={(e) => setCoachNameFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FitnessCenter sx={{ color: 'primary.main', mr: 1 }} />
                ),
                sx: {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(33, 150, 243, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
          </Grid>
        </Grid>
        <StyledTableContainer>
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
              {filteredMembers.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>
                    <UserCell>
                      <Avatar src={member.profileImage}>
                        {member.name?.charAt(0)}
                      </Avatar>
                      <Box className="user-info">
                        <Typography className="name">
                          {member.name}
                        </Typography>
                        <Typography className="email">
                          {member.email}
                        </Typography>
                      </Box>
                    </UserCell>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <MembershipChip
                      label={member.membershipType}
                      type={member.membershipType}
                      size="small"
                      icon={
                        member.membershipType === 'Platinum' ? <Star /> :
                        member.membershipType === 'Gold' ? <EmojiEvents /> :
                        <Person />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <StyledSelect
                        value={coaches.find(coach => 
                          coachAssignments[coach._id]?.some(assignment => 
                            assignment.memberId._id === member._id
                          )
                        )?._id || ''}
                        onChange={(e) => handleAssignMember(member._id, e.target.value)}
                      >
                        <StyledMenuItem value="">
                          <em>None</em>
                        </StyledMenuItem>
                        {coaches.map((coach) => (
                          <StyledMenuItem key={coach._id} value={coach._id}>
                            <Avatar 
                              src={coach.profileImage}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            >
                              {coach.name?.charAt(0)}
                            </Avatar>
                            {coach.name}
                          </StyledMenuItem>
                        ))}
                      </StyledSelect>
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
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: theme.palette.error.light,
                          },
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
        </StyledTableContainer>
      </>
    );
  };

  const renderCoachesList = () => (
    <StyledTableContainer>
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
                <UserCell>
                  <Avatar src={coach.profileImage}>
                    {coach.name?.charAt(0)}
                  </Avatar>
                  <Box className="user-info">
                    <Typography className="name">
                      {coach.name}
                    </Typography>
                    <Typography className="email">
                      {coach.email}
                    </Typography>
                  </Box>
                </UserCell>
              </TableCell>
              <TableCell>{coach.email}</TableCell>
              <TableCell>{coach.specialization || 'General'}</TableCell>
              <TableCell>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  p: 1,
                  minHeight: 48,
                }}>
                  {coachAssignments[coach._id]?.map((assignment) => {
                    const member = members.find(m => m._id === assignment.memberId._id);
                    return member ? (
                      <Chip
                        key={member._id}
                        avatar={<Avatar sx={{ width: 24, height: 24 }}>{member.name?.charAt(0)}</Avatar>}
                        label={member.name}
                        size="small"
                        sx={{
                          background: theme => theme.palette.primary.light,
                          color: theme => theme.palette.primary.contrastText,
                          fontWeight: 600,
                          boxShadow: 1,
                          mr: 0.5,
                          mb: 0.5,
                          '& .MuiChip-deleteIcon': {
                            color: theme => theme.palette.error.main,
                          },
                          '&:hover': {
                            boxShadow: 3,
                            background: theme => theme.palette.primary.main,
                          }
                        }}
                        onDelete={() => handleRemoveMember(member._id, coach._id)}
                      />
                    ) : null;
                  })}
                  <FormControl size="small" sx={{ minWidth: 160, ml: 1 }}>
                    <StyledSelect
                      value=""
                      displayEmpty
                      onChange={(e) => {
                        const memberId = e.target.value;
                        if (memberId) handleAssignMember(memberId, coach._id);
                      }}
                      renderValue={() => (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: theme => theme.palette.text.secondary }}>
                          <Add sx={{ fontSize: 18, mr: 0.5 }} />
                          Assign Member
                        </Box>
                      )}
                    >
                      <StyledMenuItem value="" disabled>
                        <em>Assign Member</em>
                      </StyledMenuItem>
                      {members
                        .filter(member => !Object.values(coachAssignments).some(assignments =>
                          assignments.some(assignment => assignment.memberId._id === member._id)
                        ))
                        .map((member) => (
                          <StyledMenuItem key={member._id} value={member._id}>
                            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{member.name?.charAt(0)}</Avatar>
                            {member.name}
                          </StyledMenuItem>
                        ))}
                    </StyledSelect>
                  </FormControl>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                }}
              >
                {success}
              </Alert>
            )}
          </Box>

          {/* Header Section with Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Dashboard className="card-icon" sx={{ 
                    fontSize: 40, 
                    color: theme.palette.primary.main, 
                    mr: 2,
                  }} />
                  <Typography variant="h6" color="textSecondary">
                    Total Requests
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {changeRequests.length}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    +12% from last month
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group className="card-icon" sx={{ 
                    fontSize: 40, 
                    color: theme.palette.success.main, 
                    mr: 2,
                  }} />
                  <Typography variant="h6" color="textSecondary">
                    Active Members
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {members.length}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ color: theme.palette.warning.main, mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {members.filter(m => m.membershipType === 'Platinum').length} Platinum Members
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SportsGymnastics className="card-icon" sx={{ 
                    fontSize: 40, 
                    color: theme.palette.warning.main, 
                    mr: 2,
                  }} />
                  <Typography variant="h6" color="textSecondary">
                    Active Coaches
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {coaches.length}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {coaches.length} Certified Trainers
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          </Grid>

          {/* Main Content */}
          <StyledPaper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
              >
                <StyledTab
                  icon={<CalendarMonth />}
                  label="Change Requests"
                  iconPosition="start"
                />
                <StyledTab
                  icon={<Group />}
                  label="Members"
                  iconPosition="start"
                />
                <StyledTab
                  icon={<SportsGymnastics />}
                  label="Coaches"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {loading && (
              <LinearProgress 
                sx={{ 
                  mb: 3, 
                }} 
              />
            )}

            {/* Content based on active tab */}
            <Box>
              {activeTab === 0 && renderChangeRequests()}
              {activeTab === 1 && renderMembersList()}
              {activeTab === 2 && renderCoachesList()}
            </Box>
          </StyledPaper>
        </Box>
      </Container>
    </Layout>
  );
};

export default ManagerSchedule; 