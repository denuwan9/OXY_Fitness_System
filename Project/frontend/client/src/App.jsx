import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx"; 
import Signup from "./pages/Signup.jsx"; 
import Profile from "./pages/Profile.jsx";
import UserManager from "./pages/UserManager.jsx";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="usermanager" element={<UserManager />} />
        
        {/* Add a default route (optional) */}
        <Route path="/" element={<Home />} /> {/* Default to Login page */}
      </Routes>
    </Router>
  );
};

export default App;