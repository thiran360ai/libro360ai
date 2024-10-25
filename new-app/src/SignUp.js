import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student',
    college: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://9823-59-97-51-97.ngrok-free.app/api/quiz/users/create/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration successful!');

      // Store username in localStorage
      localStorage.setItem('username', formData.username);

      // Update the App state for logged in user
      setIsLoggedIn(true);
      setUsername(formData.username);

      // Redirect to home
      navigate('/libro360/Dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="input-container">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div className="input-container">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="College"
            required
          />
        </div>
        <div className="input-container">
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div><br></br>
        <div className="button-container">
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
        <div className="login-link">
          <span>Already have an account? </span>
          <button type="button" className="login-btn" onClick={() => navigate('/libro360/LoginPage')}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;