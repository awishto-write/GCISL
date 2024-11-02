import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVolunteer, setIsVolunteer] = useState(false); // New state for volunteer role
  const navigate = useNavigate();
  const apiUrl = 'https://gciconnect.vercel.app/api/login';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token for authentication

        // Redirect based on user status
        if (data.statusType === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.statusType === 'volunteer') {
          setIsVolunteer(true); // Set volunteer role to true
          navigate('/volunteer-dashboard'); // Automatically navigate to volunteer dashboard
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="wrapper-login">
      <form className="form-login" onSubmit={handleSubmit}>
        <div className="field-login">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required/>
          <label>Email Address</label>
        </div>
        <div className="field-login">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required/>
          <label>Password</label>
        </div>
        <div className="field-login">
          <input type="submit" value="Login" className="auth-btn-login" />
        </div>
        <p className="p-login">
          Not a member? <Link to="/register">Signup now</Link>
        </p>
      </form>

      {/* Conditional Link to Volunteer Dashboard */}
      {isVolunteer && (
        <div className="volunteer-dashboard-link">
          <p>Go to your <Link to="/volunteer-dashboard">Volunteer Dashboard</Link></p>
        </div>
      )}
    </div>
  );
};

export default Login;