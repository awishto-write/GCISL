import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  // Handle log out
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('statusType'); // Remove user status if stored
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/volunteer-dashboard">Tasks</Link></li> {/* Link to Volunteer Dashboard */}
          <li><Link to="/volunteerlist">Volunteers</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/logs">Logs</Link></li>
          <li>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer' }}>
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;