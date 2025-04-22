import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx"; 
import Signup from "./pages/Signup.jsx"; 
import Profile from "./pages/Profile.jsx";
import UserManager from "./pages/UserManager.jsx";
import Home from "./pages/Home.jsx";
import AdminLayouts from "./Layouts/AdminLayouts.jsx";
import UserLayout from "./Layouts/UserLayout.jsx";
import PublicLayouts from "./Layouts/PublicLayouts.jsx";
import { Toaster } from 'react-hot-toast';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const App = () => {
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
      </Routes>
    </Router>
  );
};

export default App;