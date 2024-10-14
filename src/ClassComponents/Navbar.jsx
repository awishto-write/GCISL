import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand-logo-container">
        <h3 className="brand-logo">gciConnect</h3>
        <img 
          src="/GCISL_logo_fullcolor.png" 
          alt="Granger Cobb Institute Logo"
          className="logo"
        />
      </div>
      <div className="navbar-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li> {/* Updated to Link */}
          <li><Link to="/get-involved">Get Involved</Link></li> {/* Updated to Link */}
          <li><Link to="/contact">Contact Us</Link></li> {/* Updated to Link */}
          <li><Link to="/about" className="active">About</Link></li> {/* Updated to Link */}
          <li><Link to="/login" className="login-button">Log in</Link></li> {/* Updated to Link */}
        </ul>
      </div>
    </nav>
  );
}