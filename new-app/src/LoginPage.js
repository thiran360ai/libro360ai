import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setUsername, setUserRole }) => {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://9823-59-97-51-97.ngrok-free.app/api/quiz/users/login/', {
        username,
        password,
      });

      // Assuming the API response contains the user role
      const role = response.data.role; // Adjust based on actual API response structure

      setSuccess('Login successful!');
      setUsername(username);
      setUserRole(role); // Set the user role in state
      setIsLoggedIn(true);

      // Save username and role to localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('role', role); // Save role in localStorage

      navigate('/libro360/Dashboard');
    } catch (error) {
      console.log(error.response || error); // Log the error details
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="user-name">
            <input
              type="text"
              value={username}
              onChange={(e) => setLocalUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="user-password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="login-button-log">
            <button type="submit">Login</button>
          </div>
        </form>
        <div className="signup-link">
          <span>Don't have an account?</span>
          <button className="signup-btn" onClick={() => navigate('/libro360/SignUp')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
