import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  Assignment,
  Edit,
  Delete,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import userService from '../services/userService';
import coachAvailabilityService from '../services/coachAvailabilityService';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [members, setMembers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachAssignments, setCoachAssignments] = useState({});

  useEffect(() => {
    if (user && user.role === 'manager') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load members and coaches
      const [membersData, coachesData] = await Promise.all([
        userService.getMembers(),
        userService.getCoaches()
      ]);

      setMembers(membersData);
      setCoaches(coachesData);

      // Load coach assignments
      const assignments = {};
      for (const coach of coachesData) {
        try {
          const availability = await coachAvailabilityService.getCoachAvailability(coach._id);
          assignments[coach._id] = availability?.assignedMembers || [];
        } catch (error) {
          console.error(`Error loading assignments for coach ${coach._id}:`, error);
          assignments[coach._id] = [];
        }
      }
      setCoachAssignments(assignments);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMember = async (memberId, coachId) => {
    try {
      // Find the current coach if any
      const currentCoach = coaches.find(coach => 
        coachAssignments[coach._id]?.some(assignment => 
          assignment.memberId._id === memberId
        )
      );

      // If there's a current coach and it's different from the new coach, remove from current coach first
      if (currentCoach && currentCoach._id !== coachId) {
        await coachAvailabilityService.removeMember(memberId);
        // Update state immediately after successful removal
        setCoachAssignments(prev => ({
          ...prev,
          [currentCoach._id]: (prev[currentCoach._id] || []).filter(
            assignment => assignment.memberId._id !== memberId
          )
        }));
      }

      // If a new coach is selected, assign to that coach
      if (coachId) {
        const response = await coachAvailabilityService.assignMember(memberId, coachId);
        // Update state with the response data
        setCoachAssignments(prev => ({
          ...prev,
          [coachId]: [...(prev[coachId] || []), { memberId: { _id: memberId } }]
        }));
        setSnackbar({
          open: true,
          message: 'Member assigned successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Member assignment removed',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error in handleAssignMember:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to assign member',
        severity: 'error'
      });
    }
  };

  const handleRemoveMember = async (memberId, coachId) => {
    try {
      const response = await coachAvailabilityService.removeMember(memberId);
      // Update state immediately after successful removal
      setCoachAssignments(prev => ({
        ...prev,
        [coachId]: (prev[coachId] || []).filter(assignment => assignment.memberId._id !== memberId)
      }));

      setSnackbar({
        open: true,
        message: 'Member removed successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error in handleRemoveMember:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to remove member',
        severity: 'error'
      });
    }
  };

  // Add a function to refresh the data
  const refreshData = async () => {
    try {
      setLoading(true);
      const assignments = {};
      for (const coach of coaches) {
        try {
          const availability = await coachAvailabilityService.getCoachAvailability(coach._id);
          assignments[coach._id] = availability?.assignedMembers || [];
        } catch (error) {
          console.error(`Error loading assignments for coach ${coach._id}:`, error);
          assignments[coach._id] = [];
        }
      }
      setCoachAssignments(assignments);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to refresh data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to refresh data when needed
  useEffect(() => {
    if (user && user.role === 'manager') {
      refreshData();
    }
  }, [user, coaches]);

  if (!user || user.role !== 'manager') {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Access Denied. This page is for managers only.
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading data...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
          Manager Dashboard
        </Typography>

        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Members" icon={<Person />} iconPosition="start" />
            <Tab label="Coaches" icon={<FitnessCenter />} iconPosition="start" />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
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
                          onChange={(e) => {
                            const selectedCoachId = e.target.value;
                            if (selectedCoachId) {
                              handleAssignMember(member._id, selectedCoachId);
                            } else {
                              // If no coach is selected, find the current coach and remove the assignment
                              const currentCoach = coaches.find(coach => 
                                coachAssignments[coach._id]?.some(assignment => 
                                  assignment.memberId._id === member._id
                                )
                              );
                              if (currentCoach) {
                                handleRemoveMember(member._id, currentCoach._id);
                              }
                            }
                          }}
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
        )}

        {activeTab === 1 && (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
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
                              .filter(member =>
                                !coachAssignments[coach._id]?.some(
                                  assignment => assignment.memberId._id === member._id
                                )
                              )
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
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default ManagerDashboard; 