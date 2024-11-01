// Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    //const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    //const apiUrl = process.env.REACT_APP_API_URL || 'https://gciconnect.vercel.app';
    //const apiUrl = process.env.REACT_APP_API_URL;
    const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://gciconnect.vercel.app'
  : 'http://localhost:5001';

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
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
          />
          <label>Confirm Password</label>
        </div>
        <div className="field">
          <select
            name="statusType"
            value={formData.statusType}
            onChange={handleChange}
            required>
            <option value="" disabled>Select Status</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>
          {/* <label>Select Status</label>  */}
          {/*  Added the label above and commented the one that was in "option" */}
        </div>
        <div className="field">
          <input type="submit" value="Submit" className="auth-btn" />
        </div>
        {/* <p className="p-register">
          Already a member? <Link to="/login">Login here</Link>
        </p> */}
        {/* Plan to add something related to login */}
      </form>
    </div>
  );
};

export default Register;
