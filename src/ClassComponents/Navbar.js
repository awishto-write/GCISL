import React from 'react';
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
          <h1 className="brand-logo">gciConnect!</h1>
        </div>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          <li><a href="#get-involved">Get Involved!</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="#about" className="active">About</a></li>
          <li><a href="#login" className="login-button">Log in</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;