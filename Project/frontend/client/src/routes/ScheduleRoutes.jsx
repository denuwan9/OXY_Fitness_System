import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MemberSchedule from '../components/schedule/MemberSchedule';
import CoachSchedule from '../components/schedule/CoachSchedule';
import ManagerSchedule from '../components/schedule/ManagerSchedule';
import InstructorSchedule from '../pages/InstructorSchedule';
import CoachAvailability from '../pages/CoachAvailability';
import ManagerDashboard from '../pages/ManagerDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const ScheduleRoutes = () => {
  return (
    <Routes>
      {/* Member Schedule Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['member', 'user']}>
            <MemberSchedule />
          </ProtectedRoute>
        }
      />

      {/* Coach Availability Route */}
      <Route
        path="/availability"
        element={
          <ProtectedRoute allowedRoles={['coach', 'instructor']}>
            <CoachAvailability />
          </ProtectedRoute>
        }
      />

      {/* Instructor/Coach Schedule Management Route */}
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={['instructor', 'coach']}>
            <InstructorSchedule />
          </ProtectedRoute>
        }
      />

      {/* Manager Schedule Management Route */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerSchedule />
          </ProtectedRoute>
        }
      />

      {/* Manager Dashboard Route */}
      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ScheduleRoutes; 