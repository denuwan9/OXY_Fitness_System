import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import CoachScheduleManager from './components/CoachScheduleManager';
import OperationManagerSchedule from './components/OperationManagerSchedule';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<Login />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/coach/schedule-manager" element={<CoachScheduleManager />} />
              <Route path="/operation-manager/schedule-requests" element={<OperationManagerSchedule />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;