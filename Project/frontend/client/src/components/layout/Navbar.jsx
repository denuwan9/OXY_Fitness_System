import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Inside the navigation menu items */}
      {user && (
        <>
          {/* Schedule Management Links */}
          {user.role === 'member' && (
            <MenuItem component={Link} to="/schedule">
              My Schedule
            </MenuItem>
          )}
          
          {(user.role === 'instructor' || user.role === 'coach') && (
            <>
              <MenuItem component={Link} to="/schedule/availability">
                Manage Availability
              </MenuItem>
              <MenuItem component={Link} to="/schedule/instructor">
                Manage Member Schedules
              </MenuItem>
            </>
          )}
          
          {user.role === 'operation_manager' && (
            <MenuItem component={Link} to="/schedule/manager">
              Schedule Requests
            </MenuItem>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar; 