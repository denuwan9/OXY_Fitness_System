import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserManager.css";
import { get, deleteUser, post } from "../services/ApiEndpoint";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import toast from "react-hot-toast";

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
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users); // Assuming the response contains a `users` array
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users");
      }
    };
    GetUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      // Fixed typo in the URL: 'delet' → 'delete'
      const request = await deleteUser(`/api/admin/delete/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        console.log(response);
        // Refresh the user list after deletion
        setUsers(users.filter(user => user._id !== id));
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
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
        } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
          errorMessage = "Phone number must be in the format (555) 123-4567.";
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
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(user.number)) {
      newErrors.number = "Phone number must be in the format (555) 123-4567.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to handle adding a new user
  const handleAddUser = () => {
    if (validateForm(newUser)) {
      const newUserId = users.length + 1; // Auto-increment ID
      setUsers([...users, { id: newUserId, ...newUser }]);
      setNewUser({
        fname: "",
        lname: "",
        email: "",
        address: "",
        city: "",
        number: "",
        password: "",
        role: "member",
      });
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
        role: userToEdit.role || "member",
      });
      setIsEditing(true);
    }
  };

  // Function to handle updating a user
  const handleUpdateUser = () => {
    if (validateForm(editUser)) {
      // Update local state
      setUsers(
        users.map((user) =>
          user._id === editUser.id ? { ...user, ...editUser } : user
        )
      );
      
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

  return (
    <div className="user-manager">
      {/* Left Side Menu */}
      <div className="left-side-menu">
        <div className="menu-logo">OXY FITNESS</div>
        <nav className="menu-nav">
          <ul>
            {/* Home Button */}
            <li>
              <Link to="/" className="menu-button">
                <span className="button-icon">🏠</span>
                <span className="button-text">Home</span>
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button onClick={handleLogout}>
                <span className="button-icon">🚪</span>
                <span className="button-text">Log out</span>
              </button>
            </li>
          </ul>
        </nav>
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
              value={newUser.role}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
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
              <option value="member">Member</option>
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
                <th>ID</th>
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
                    <td>{elem._id}</td>
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