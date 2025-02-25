import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Shared CSS file


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotForm, setShowForgotForm] = useState(false);
  const navigate = useNavigate();  
  const apiUrl = process.env.REACT_APP_API_URL;  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);  
        navigate(data.statusType === 'admin' ? '/admin-dashboard' : '/volunteer-dashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    if (!forgotEmail.trim()) {
      alert('Please enter your email.');
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          action: 'forgot-password',  // ✅ MUST match backend logic
        }),
      });
  
      const data = await response.json();
      alert(response.ok ? data.message : data.error);
      setForgotEmail('');
      setShowForgotForm(false);  
    } catch (error) {
      console.error('Error sending password:', error);
      alert('Error sending password. Please try again.');
    }
  };

  return (
    <div className="wrapper-login">
      <form className="form-login" onSubmit={handleSubmit}>
        

        <div className="field-login">
          <input
            type="email"
            name="email"A
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
            required
          />
          
        </div>

        <div className="field-login">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
         
        </div>

        <div className="field-login">
          <input type="submit" value="Login" className="auth-btn-login" />
        </div>

        <p className="p-login">
          Forgot your password?{' '}
          <span
            onClick={() => setShowForgotForm(!showForgotForm)}
            style={{ cursor: 'pointer', color: '#007bff' }}
          >
            Click here
          </span>
        </p>

        <p className="p-login">
          Not a member? <Link to="/register">Signup now</Link>
        </p>
      </form>

      {/* Forgot Password Form */}
      {showForgotForm && (
        <div className="forgot-password-container">
          <form onSubmit={handleForgotPassword} className="forgot-password-form">
            <h3>Forgot Password</h3>
            <input
              type="email"
              name="forgotEmail"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <button type="submit" className="auth-btn-login">Send Password</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForgotForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;