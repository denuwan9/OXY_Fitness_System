import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@mui/material';

const Navbar = () => {
  const user = true; // Replace with actual user authentication logic

  return (
    <div>
      {/* Inside the navigation menu items */}
      {user && (
        <>
          {/* Schedule Management Links */}
          <MenuItem component={Link} to="/schedule">
            My Schedule
          </MenuItem>
          
          {user.role === 'coach' && (
            <MenuItem component={Link} to="/coach/schedule-manager">
              Schedule Manager
            </MenuItem>
          )}
          
          {user.role === 'operation_manager' && (
            <MenuItem component={Link} to="/operation-manager/schedule-requests">
              Schedule Requests
            </MenuItem>
          )}
        </>
      )}
    </div>
  );
};

export default Navbar; 