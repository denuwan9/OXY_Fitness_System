import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserManager.css";
import { get, deleteUser, post } from "../services/ApiEndpoint";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { generateUsersPDF } from "../services/PdfService";

const UserManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize users as an empty array instead of an empty string
  const [users, setUsers] = useState([]);
  console.log('this is users', users);
  
  useEffect(() => {
    const GetUsers = async () => {
        try {
            const request = await get('/api/admin/getuser');
            console.log('API Response:', request.data);
            
            // Handle both possible response structures
            const usersData = request.data.users || request.data.user;
            
            if (!usersData) {
                throw new Error("No users data found in response");
            }

            setUsers(Array.isArray(usersData) ? usersData : []);
            
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
        }
    };
    GetUsers();
}, []);

const handleDeleteUser = async (id) => {
  try {
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    // Show loading state
    const deletingToast = toast.loading('Deleting user...');

    // First check if user is admin
    const userToDelete = users.find(user => user._id === id);
    if (userToDelete?.role === 'admin') {
      toast.error("Cannot delete admin users", { id: deletingToast });
      return;
    }

    // Make POST request to match backend route
    const request = await axios.post(
      `http://localhost:6017/api/admin/delet/${id}`,
      {}, // empty data object
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    
    // Success handling
    if (request.status === 200) {
      toast.success(request.data.message, { id: deletingToast });
      
      // Optimistic update (immediate UI update)
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      
      // Alternative: Refetch for data consistency
      // const refreshRequest = await get('/api/admin/getuser');
      // setUsers(refreshRequest.data.users || []);
    }
  } catch (error) {
    console.error("Delete error details:", error);

    // Specific error handling
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        handleLogout();
      } else if (error.response.status === 403) {
        toast.error("Admin users cannot be deleted");
      } else {
        toast.error(error.response.data.message || "Failed to delete user");
      }
    } else if (error.request) {
      toast.error("No response from server. Please check your connection.");
    } else {
      toast.error("Delete request failed. Please try again.");
    }
  }
};


  // State for adding a new user
  const [newUser, setNewUser] = useState({
    fname: "",
    lname: "",
    email: "",
    address: "",
    city: "",
    number: "",
    password: "",
    role: "member", // Changed default from "user" to "member" to match options
  });

  // State for updating a user
  const [editUser, setEditUser] = useState({
    id: null,
    fname: "",
    lname: "",
    email: "",
    address: "",
    city: "",
    number: "",
    password: "",
    role: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    number: "",
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }

    // Validate input on change
    validateField(name, value);
  };

  // Logout button function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        throw new Error("No token found");
      }
  
      // Send logout request
      const response = await post(
        "/api/auth/logout",
        {}, // No body needed for logout
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
  
      if (response.status === 200) {
        localStorage.removeItem("token"); // Remove the token from localStorage
        dispatch(Logout()); // Update Redux state
        navigate("/login"); // Redirect to the login page
        toast.success(response.data.message); // Show success message
      }
    } catch (error) {
      console.error("Error during logout:", error);
  
      // Log the full error response
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error status:", error.response.status);
        console.log("Error headers:", error.response.headers);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
  
      // Handle token expiry
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Clear the expired token
        dispatch(Logout()); // Update Redux state
        navigate("/login"); // Redirect to the login page
        toast.error("Your session has expired. Please log in again.");
      } else {
        // Display specific error messages
        toast.error(error.response?.data?.message || "Logout failed. Please try again.");
      }
    }
  };


  // Function to generate PDF report
  const handleGeneratePDF = () => {
    if (users.length === 0) {
      toast.error("No users data available to generate PDF");
      return;
    }
    
    try {
      generateUsersPDF(users);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };


  // Function to validate a specific field
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "fname":
      case "lname":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = "Only letters and spaces are allowed.";
        }
        break;

      case "email":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Invalid email address.";
        }
        break;

      case "number":
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (!/^\+?[0-9\s\-\(\)]{8,20}$/.test(value)) {
          errorMessage = "Please enter a valid phone number (e.g., +1234567890).";
        }
        break;

      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  // Function to validate the entire form
  const validateForm = (user) => {
    let isValid = true;
    const newErrors = {};

    // Validate fname
    if (!user.fname.trim()) {
      newErrors.fname = "First Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(user.fname)) {
      newErrors.fname = "Only letters and spaces are allowed.";
      isValid = false;
    }

    // Validate lname
    if (!user.lname.trim()) {
      newErrors.lname = "Last Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(user.lname)) {
      newErrors.lname = "Only letters and spaces are allowed.";
      isValid = false;
    }

    // Validate email
    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }

    // Validate number
    if (!user.number.trim()) {
      newErrors.number = "Phone Number is required.";
      isValid = false;
    } else if (!/^\+?[0-9\s\-\(\)]{8,20}$/.test(user.number)) {
      newErrors.number = "Please enter a valid phone number (e.g., +1234567890).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  // Function to handle adding a new user
  const handleAddUser = async () => {
    // Password validation with direct toast messages
    if (!newUser.password) {
      toast.error("Password is required");
      return;
    }
    
    if (newUser.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/.test(newUser.password)) {
      toast.error("Password must contain: uppercase, lowercase, number, and special character");
      return;
    }
    
    if (newUser.password.length > 128) {
      toast.error("Password cannot exceed 128 characters");
      return;
    }
  
    // Then validate other form fields
    if (!validateForm(newUser)) {
      toast.error("Please fill all required fields correctly");
      return;
    }
  
    try {
      const addingToast = toast.loading('Adding user...');
  
      const response = await axios.post(
        "http://localhost:6017/api/auth/addUser",
        newUser,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        toast.success(response.data.message, { id: addingToast });
        setUsers([...users, response.data.user]);
        setNewUser({
          fname: "",
          lname: "",
          email: "",
          address: "",
          city: "",
          number: "",
          password: "",
          role: "user",
        });
      } else {
        toast.error(response.data.message, { id: addingToast });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Failed to add user"
      );
    }
  };

  // Modified: Function to set up editing mode for a user
  const setUpEditUser = (userId) => {
    const userToEdit = users.find(user => user._id === userId);
    if (userToEdit) {
      setEditUser({
        id: userToEdit._id,
        fname: userToEdit.fname,
        lname: userToEdit.lname,
        email: userToEdit.email,
        address: userToEdit.address || "",
        city: userToEdit.city || "",
        number: userToEdit.number || "",
        password: "", // Don't populate password for security reasons
        role: userToEdit.role || "user",
      });
      setIsEditing(true);
    }
  };

  // Function to handle updating a user
  const handleUpdateUser = async () => {
    if (!validateForm(editUser)) return;
  
    try {
      const updatingToast = toast.loading('Updating user...');
      
      // Remove id from the data we're sending
      const { id, ...updateData } = editUser;
      
      const response = await axios.put(
        `http://localhost:6017/api/admin/updateUser/${id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200) {
        toast.success(response.data.message, { id: updatingToast });
        
        // Update local state with the returned user data
        setUsers(users.map(user => 
          user._id === id ? { ...user, ...response.data.user } : user
        ));
        
        // Reset edit form
        setEditUser({
          id: null,
          fname: "",
          lname: "",
          email: "",
          address: "",
          city: "",
          number: "",
          password: "",
          role: "",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditUser({
      id: null,
      fname: "",
      lname: "",
      email: "",
      address: "",
      city: "",
      number: "",
      password: "",
      role: "",
    });
    setIsEditing(false);
  };
// Admin button navigation
const goToAdmin = () => {
  navigate("/admin");
};
  return (
    <div className="user-manager">
      {/* Left Side Menu */}
      <div className="left-side-menu">
  <div className="menu-logo2"onClick={() => navigate('/')}>OXY FITNESS</div>
  
  {/* Menu Buttons Container */}
  <div className="menu-nav">
    {/* Home Button */}
    <button onClick={() => navigate('/')} className="menu-button">
      <span className="button-icon">🏠</span>
      <span className="button-text">Home</span>
    </button>

    {/* Profile Button */}
    <button onClick={() => navigate('/profile')} className="menu-button">
      <span className="button-icon">👤</span>
      <span className="button-text">Profile</span>
    </button>

    

    {/* Admin Button */}
    {users?.role === "admin" ||(
      <button 
        onClick={goToAdmin} 
        className={`menu-button ${location.pathname.includes('/admin') ? 'active' : ''}`}
      >
        <span className="button-icon">👥</span>
        <span className="button-text">Manage Profiles</span>
      </button>
    )}

    

    {/* Get User Details PDF */}
    
            <button onClick={handleGeneratePDF} className="menu-button">
              <span className="button-icon">📄</span>
              <span className="button-text">User Details PDF</span> 
              </button>

              {/* Logout Button */}
    <button onClick={handleLogout} className="menu-button-logout">
      <span className="button-icon">🚪</span>
      <span className="button-text">Log out</span>
    </button>
            
  </div>
</div>


            
         

      {/* Main Content */}
      <div className="main-content">
        <h1>User Manager Dashboard</h1>

        {/* Add User Form */}
        {!isEditing ? (
          <div className="add-user-form">
            <h2>Add New User</h2>
            <input
              type="text"
              placeholder="First Name"
              name="fname"
              value={newUser.fname}
              onChange={handleInputChange}
            />
            {errors.fname && (
              <span className="error-message">{errors.fname}</span>
            )}
            <input
              type="text"
              placeholder="Last Name"
              name="lname"
              value={newUser.lname}
              onChange={handleInputChange}
            />
            {errors.lname && (
              <span className="error-message">{errors.lname}</span>
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={newUser.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={newUser.city}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              name="number"
              value={newUser.number}
              onChange={handleInputChange}
            />
            {errors.number && (
              <span className="error-message">{errors.number}</span>
            )}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
            />
            <select
              name="role"
              value={newUser.role || user}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="supplier">Supplier</option>
              <option value="trainer">Trainer</option>
            </select>
            <button className="action-button" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        ) : (
          <div className="update-user-form">
            <h2>Update User</h2>
            <input
              type="text"
              placeholder="First Name"
              name="fname"
              value={editUser.fname}
              onChange={handleInputChange}
            />
            {errors.fname && (
              <span className="error-message">{errors.fname}</span>
            )}
            <input
              type="text"
              placeholder="Last Name"
              name="lname"
              value={editUser.lname}
              onChange={handleInputChange}
            />
            {errors.lname && (
              <span className="error-message">{errors.lname}</span>
            )}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={editUser.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={editUser.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={editUser.city}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              name="number"
              value={editUser.number}
              onChange={handleInputChange}
            />
            {errors.number && (
              <span className="error-message">{errors.number}</span>
            )}
            <input
              type="password"
              placeholder="New Password"
              name="password"
              value={editUser.password}
              onChange={handleInputChange}
            />
            <select
              name="role"
              value={editUser.role}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="supplier">Supplier</option>
              <option value="trainer">Trainer</option>
            </select>
            <div className="button-group">
              <button className="action-button" onClick={handleUpdateUser}>
                Update User
              </button>
              <button className="action-button cancel-button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="users-table">
          <h2>User List</h2>
          <table>
            <thead>
              <tr>
                
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Added null/empty array check and better rendering */}
              {Array.isArray(users) && users.length > 0 ? (
                users.map((elem, index) => (
                  <tr key={index}>
                    
                    <td>{elem.fname}</td>
                    <td>{elem.lname}</td>
                    <td>{elem.email}</td>
                    <td>{elem.address}</td>
                    <td>{elem.city}</td>
                    <td>{elem.number}</td>
                    <td>{elem.role}</td>
                    <td>
                      <button
                        className="action-button"
                        onClick={() => setUpEditUser(elem._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDeleteUser(elem._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No users found or loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;