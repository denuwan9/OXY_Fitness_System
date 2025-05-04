import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx"; 
import Signup from "./pages/Signup.jsx"; 
import Profile from "./pages/Profile.jsx"
import UserManager from "./pages/UserManager.jsx";
import Home from "./pages/Home.jsx";
import AdminLayouts from "./Layouts/AdminLayouts.jsx";
import UserLayout from "./Layouts/UserLayout.jsx";
import PublicLayouts from "./Layouts/PublicLayouts.jsx";
import { Toaster } from 'react-hot-toast';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import ScheduleRoutes from './routes/ScheduleRoutes';
import Unauthorized from './pagesShcedule/Unauthorized.jsx';
import CoachScheduleManager from './components/CoachScheduleManager';
import OperationManagerSchedule from './components/OperationManagerSchedule';
import { useAuth } from './contexts/AuthContext';

import MemberSchedule from "./components/schedule/MemberSchedule.jsx";
function AppContent() {
  const { user } = useAuth();
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path ='/' element={<UserLayout/>}>
        <Route index element={<Home />} />
        </Route>
        

        <Route path ='/admin' element={<AdminLayouts />}>
        <Route index element={<UserManager />} />
        </Route>

        <Route path="/" element={<PublicLayouts />}>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        </Route>

        <Route path="/profile" element={<Profile />} />
        <Route path="/usermanager" element={<UserManager />} />
       
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset_password/:id/:token" element={<ResetPassword />}></Route>
        
        {/* Add a default route (optional) */}
        <Route path="/" element={<Home />} /> {/* Default to Login page */}


        <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Schedule Routes */}
          <Route path="/schedule/*" element={<ScheduleRoutes />} />
          <Route path="/schedule" element={<ScheduleRoutes />} />
          <Route path="/coach/schedule-manager" element={<CoachScheduleManager />} />
          <Route path="/operation-manager/schedule-requests" element={<OperationManagerSchedule />} />
      </Routes>
    </Router>
  );
};
function App() {
  return (
    <AuthProvider>
      
        <AppContent />
      
    </AuthProvider>
  );
}
export default App;