import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx"; // Import your Login component
import Signup from "./pages/Signup.jsx"; // Import your Signup component
import Profile from "./pages/Profile.jsx";
import UserManager from "./pages/UserManager.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <Router>
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