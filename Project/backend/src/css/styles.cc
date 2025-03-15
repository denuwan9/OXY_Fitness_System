/* General Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    font-family: 'Poppins', sans-serif;
    background: url('https://wallpapercave.com/wp/wp3325897.jpg') no-repeat center center fixed;
    background-size: cover;
    color: #fff;
    overflow: auto; /* Allow scrolling */
  }
  
  /* Overlay for better readability */
  body::before {
    content: '';
    position: fixed; /* Fixed to cover the entire viewport */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: -1;
  }
  
  .register-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-in-out;
    margin: 20px auto; /* Add margin for spacing */
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .register-box h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #fff;
    text-align: center;
  }
  
  .register-box p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #e0e0e0;
    text-align: center;
  }
  
  .register-box h2 {
    font-size: 1.5rem;
    margin: 20px 0 10px;
    color: #fff;
  }
  
  .input-group {
    margin-bottom: 15px;
    position: relative;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: #e0e0e0;
    ;
    transition: all 0.3s ease;
  }
  
  .input-group input,
  .input-group select,
  .input-group textarea {
    width: 100%;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: background 0.3s ease, transform 0.3s ease;
  }
  
  .input-group input:focus,
  .input-group select:focus,
  .input-group textarea:focus {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }
  
  .input-group textarea {
    resize: vertical;
  }
  
  .input-group p {
    margin-bottom: 10px;
    color: #e0e0e0;
  }
  
  .input-group label input[type="radio"],
  .input-group label input[type="checkbox"] {
    margin-right: 10px;
  }
  
  .register-btn {
    width: 100%;
    padding: 10px;
    background: #2575fc;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }
  
  .register-btn:hover {
    background: #6a11cb;
    transform: translateY(-2px);
  }
  
  /* Floating Labels */
  .input-group input:focus ~ label,
  .input-group input:not(:placeholder-shown) ~ label,
  .input-group select:focus ~ label,
  .input-group select:not(:placeholder-shown) ~ label,
  .input-group textarea:focus ~ label,
  .input-group textarea:not(:placeholder-shown) ~ label {
    top: -10px;
    font-size: 0.8rem;
    color: #ffffff;
  }
  
  /* Radio and Checkbox Styling */
  .input-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .input-group label input[type="radio"],
  .input-group label input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #2575fc;
    border-radius: 50%;
    margin-right: 10px;
    transition: all 0.3s ease;
  }
  
  .input-group label input[type="radio"]:checked,
  .input-group label input[type="checkbox"]:checked {
    background: #2575fc;
  }
  
  .input-group label input[type="checkbox"] {
    border-radius: 4px;
  }
  
  
  /* login page*/
  /* Login Page Styles */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('https://via.placeholder.com/1920x1080') no-repeat center center fixed;
    background-size: cover;
    color: #fff;
    overflow: auto;
  }
  
  .login-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: -1;
  }
  
  .login-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-in-out;
  }
  
  .login-box h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #fff;
    text-align: center;
  }
  
  .login-box p {
    font-size: 1rem;
    margin-bottom: 20px;
    color: #e0e0e0;
    text-align: center;
  }
  
  .login-btn {
    width: 100%;
    padding: 10px;
    background: #2575fc;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }
  
  .login-btn:hover {
    background: #6a11cb;
    transform: translateY(-2px);
  }
  
  .links {
    margin-top: 20px;
    text-align: center;
  }
  
  .links a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .links a:hover {
    color: #2575fc;
  }
  
  /* profile page */
  /* Profile Page Styles */
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('https://via.placeholder.com/1920x1080') no-repeat center center fixed;
    background-size: cover;
    color: #fff;
    overflow: auto;
  }
  
  .profile-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: -1;
  }
  
  .profile-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-in-out;
  }
  
  .profile-box h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #fff;
    text-align: center;
  }
  
  .profile-info .input-group {
    margin-bottom: 15px;
  }
  
  .profile-info input {
    width: 100%;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 1rem;
    outline: none;
    transition: background 0.3s ease;
  }
  
  .profile-info input:focus {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }
  
  .action-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .edit-btn {
    background: #2575fc;
    color: #fff;
  }
  
  .edit-btn:hover {
    background: #6a11cb;
    transform: translateY(-2px);
  }
  
  .logout-btn {
    background: #ff4b5c;
    color: #fff;
  }
  
  .logout-btn:hover {
    background: #ff1c34;
    transform: translateY(-2px);
  }