import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login.jsx"; // Import your Login component
import Signup from "./Signup.jsx"; // Import your Signup component
import Profile from "./Profile.jsx";
import UserManager from "./UserManager.jsx";
import Home from "./Home.jsx";

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