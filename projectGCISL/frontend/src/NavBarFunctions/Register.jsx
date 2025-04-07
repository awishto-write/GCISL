// Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    statusType: '',
  });
  const navigate = useNavigate(); // For navigation after registration

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      //const response = await fetch(`${apiUrl}/api/register`, { 
      const response = await fetch(`${apiUrl}/api/index/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
       // alert('Registration successful!');
        alert('Registration successful! You can now login.');
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="wrapper-register">
      <form onSubmit={handleSubmit} className="form-register">
        <div className="title-register">Register</div>
        <div className="field">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <label>First Name</label>
        </div>
        <div className="field">
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <label>Last Name</label>
        </div>
        <div className="field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Email Address</label>
        </div>
        <div className="field">
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            pattern="^\+?[0-9]+$"
            title="Please enter a valid phone number (digits only, optional leading +)"
          />
          <label>Phone Number</label>
        </div>
        <div className="field">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}"
            title="Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
          />
          <label>Password</label>
        </div>
        <div className="field">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            onInput={(e) => {
              if (e.target.value !== formData.password) {
                e.target.setCustomValidity("Passwords do not match");
              } else {
                e.target.setCustomValidity("");
              }
            }}
          />
          <label>Confirm Password</label>
        </div>

        <div className="field">
          <select
            name="statusType"
            value={formData.statusType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <div className="field">
          <input type="submit" value="Submit" className="auth-btn" />
        </div>
        <p className="p-register">
          Already a member? <Link to="/login"> Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;