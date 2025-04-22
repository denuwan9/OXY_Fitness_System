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
      setLoading(true);
      await coachAvailabilityService.assignMember(memberId);
      
      // Update local state
      setCoachAssignments(prev => ({
        ...prev,
        [coachId]: [...(prev[coachId] || []), { memberId: { _id: memberId } }]
      }));

      setSnackbar({
        open: true,
        message: 'Member assigned successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to assign member',
        severity: 'error'
      });
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

      setSnackbar({
        open: true,
        message: 'Member removed successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove member',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
                  <TableCell>Actions</TableCell>
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
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Coach">
                        <IconButton color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
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