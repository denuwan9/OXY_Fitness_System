import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./UserManager.css"; // Import the CSS file

const UserManager = () => {
  // Mock user data with roles
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      address: "123 Main Street",
      city: "New York",
      phone: "(555) 123-4567",
      password: "password123",
      role: "admin", // Added role field
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      address: "456 Elm Street",
      city: "Los Angeles",
      phone: "(555) 987-6543",
      password: "password456",
      role: "manager", // Added role field
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      address: "789 Oak Street",
      city: "Chicago",
      phone: "(555) 456-7890",
      password: "password789",
      role: "member", // Added role field
    },
  ]);

  // State for adding a new user
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
    password: "",
    role: "member", // Default role for new users
  });

  // State for updating a user
  const [editUser, setEditUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
    password: "",
    role: "", // Role for editing
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Mock user role (replace with actual role from your authentication system)
  const userRole = "admin"; // Can be "user", "manager", or "admin"

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in newUser) {
      setNewUser({ ...newUser, [name]: value });
    } else if (name in editUser) {
      setEditUser({ ...editUser, [name]: value });
    }

    // Validate input on change
    validateField(name, value);
  };

  // Function to validate a specific field
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
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

      case "phone":
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

    // Validate firstName
    if (!user.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(user.firstName)) {
      newErrors.firstName = "Only letters and spaces are allowed.";
      isValid = false;
    }

    // Validate lastName
    if (!user.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(user.lastName)) {
      newErrors.lastName = "Only letters and spaces are allowed.";
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

    // Validate phone
    if (!user.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
      isValid = false;
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(user.phone)) {
      newErrors.phone = "Phone number must be in the format (555) 123-4567.";
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
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        phone: "",
        password: "",
        role: "member", // Reset role to default
      }); // Clear input fields
    }
  };

  // Function to handle deleting a user
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Function to handle updating a user
  const handleUpdateUser = () => {
    if (validateForm(editUser)) {
      setUsers(
        users.map((user) =>
          user.id === editUser.id ? { ...user, ...editUser } : user
        )
      );
      setEditUser({
        id: null,
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        phone: "",
        password: "",
        role: "", // Clear role
      }); // Clear edit form
    }
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
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
              <Link to="/home" className="menu-button">
                <span className="button-icon">🏠</span>
                <span className="button-text">Home</span>
              </Link>
            </li>

            {/* Profile Button */}
            <li>
              <Link to="/profile" className="menu-button">
                <span className="button-icon">👤</span>
                <span className="button-text">Profile</span>
              </Link>
            </li>

            {/* Manage Profiles Button (Visible only to managers or admins) */}
            {(userRole === "manager" || userRole === "admin") && (
              <li>
                <Link to="/usermanager" className="menu-button">
                  <span className="button-icon">👥</span>
                  <span className="button-text">Manage Profiles</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>User Manager Dashboard</h1>

        {/* Add User Form */}
        <div className="add-user-form">
          <h2>Add New User</h2>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
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
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
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
            <option value="manager">Manager</option>
            <option value="member">Member</option>
            <option value="supplier">Supplier</option>
            <option value="trainer">Trainer</option>
          </select>
          <button className="action-button" onClick={handleAddUser}>
            Add User
          </button>
        </div>

        {/* Update User Form */}
        {editUser.id && (
          <div className="update-user-form">
            <h2>Update User</h2>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={editUser.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={editUser.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
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
              name="phone"
              value={editUser.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
            <input
              type="password"
              placeholder="Password"
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
              <option value="member">Member</option>
              <option value="supplier">Supplier</option>
              <option value="trainer">Trainer</option>
            </select>
            <button className="action-button" onClick={handleUpdateUser}>
              Update User
            </button>
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
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.phone}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => setEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;