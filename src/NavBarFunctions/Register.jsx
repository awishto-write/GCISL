import React, { useState } from 'react';
import './Register.css'; // Importing the same CSS used by the old team's login page

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phoneNumber: '',
    confirmPhoneNumber: '',
    password: '',
    confirmPassword: '',
    ageRange: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
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
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            required
          />
          <label>Confirm Email Address</label>
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
            type="text"
            name="confirmPhoneNumber"
            value={formData.confirmPhoneNumber}
            onChange={handleChange}
            required
          />
          <label>Confirm Phone Number</label>
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
            name="ageRange"
            value={formData.ageRange}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Age Range</option>
            <option value="<55">&lt;55</option>
            <option value="55-65">55-65</option>
            <option value="66-75">66-75</option>
            <option value="75+">75+</option>
          </select>
        </div>
        <div className="field">
          <input type="submit" value="Submit" className="auth-btn" />
        </div>
      </form>
    </div>
  );
};

export default Register;
