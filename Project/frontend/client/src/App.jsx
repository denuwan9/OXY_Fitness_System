import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login.jsx"; // Import your Login component
import Signup from "./Signup.jsx"; // Import your Signup component
import Profile from "./Profile.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add a default route (optional) */}
        <Route path="/" element={<Login />} /> {/* Default to Login page */}
      </Routes>
    </Router>
  );
};

export default App;