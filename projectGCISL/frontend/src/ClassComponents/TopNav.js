import React from 'react';

function TopNav() {
  // Retrieve the user's name from localStorage
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');

  return (
    <div className="top-nav">
      <div className="top-nav-left">
        <h2>VOLUNTEER</h2>
        <h2>gciConnect</h2>
      </div>
      <div className="user-profile">
        <span>{firstName && lastName ? `${firstName} ${lastName}` : 'User'}</span>
      </div>
    </div>
  );
}

export default TopNav;