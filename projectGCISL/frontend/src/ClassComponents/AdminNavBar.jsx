import React from 'react';

const Navbar = ({ role, firstName, lastInitial }) => {
  return (
    <nav style={navbarStyle}>
      <div style={leftStyle}>
        gciConnect <span style={roleStyle}>{role}</span>
      </div>
      <div style={rightStyle}>
        {firstName && lastInitial ? `${firstName} ${lastInitial}.` : 'Loading...'}
      </div>
    </nav>
  );
};

const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#a32436',
  color: 'white',
  padding: '1.5rem',
  position: 'fixed',
  width: '100%',
  top: '0',
  left: '0',
  zIndex: '1000', // Ensures it stays on top
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)' // Adds the shadow effect
};

const leftStyle = {
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center'
};

const roleStyle = {
  marginLeft: '10px',
  fontWeight: 'bold'
};

const rightStyle = {
  textAlign: 'right'
};

export default Navbar;