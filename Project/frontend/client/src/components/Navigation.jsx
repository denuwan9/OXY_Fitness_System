import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Divider,
  Box,
  Typography,
  Button
} from '@mui/material';
import { 
  Home, 
  Dashboard, 
  CalendarMonth, 
  AccessTime,
  Logout
} from '@mui/icons-material';

const Navigation = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    const items = [
      {
        label: 'Home',
        path: '/',
        icon: <Home />
      }
    ];

    if (user.role === 'manager') {
      items.push(
        {
          label: 'Manager Dashboard',
          path: '/schedule/manager-dashboard',
          icon: <Dashboard />
        },
        {
          label: 'Schedule Management',
          path: '/schedule/manager',
          icon: <CalendarMonth />
        }
      );
    } else if (user.role === 'coach' || user.role === 'instructor') {
      items.push(
        {
          label: 'My Schedule',
          path: '/schedule/instructor',
          icon: <CalendarMonth />
        },
        {
          label: 'Availability',
          path: '/schedule/availability',
          icon: <AccessTime />
        }
      );
    } else if (user.role === 'member' || user.role === 'user') {
      items.push(
        {
          label: 'My Schedule',
          path: '/schedule',
          icon: <CalendarMonth />
        }
      );
    }

    return items;
  };

  return (
    <Box>
      <List>
        {getNavItems().map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => onNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Navigation; 