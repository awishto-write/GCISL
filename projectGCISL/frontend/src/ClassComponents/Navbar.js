import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand-logo-container">
          <img 
            src="/GCISL_logo_fullcolor.png" 
            alt="Granger Cobb Institute Logo"
            className="logo"
          />
          <h1 className="brand-logo">gciConnect</h1>
        </div>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          <li><NavLink to="/" className="navbar-item" activeClassName="active">Home</NavLink></li> 
          <li><NavLink to="/get-involved" className="navbar-item" activeClassName="active">Get Involved</NavLink></li> 
          <li><NavLink to="/contact" className="navbar-item" activeClassName="active">Contact Us</NavLink></li>
          <li><NavLink to="/about" className="navbar-item" activeClassName="active">About</NavLink></li>
          <li><NavLink to="/login" className="navbar-item login-button" activeClassName="active">Log in</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;