import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
          {/* <li><a href="/">Home</a></li> */}
          <li><Link to="/">Home</Link></li> 
          <li><Link to="/get-involved">Get Involved</Link></li> 
          <li><Link to="/contact">Contact Us</Link></li> {/* Updated to Link */}
          <li><Link to="/about" className="active">About</Link></li> {/* Updated to Link */}
          <li><Link to="/login" className="login-button">Log in</Link></li> {/* Updated to Link */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;