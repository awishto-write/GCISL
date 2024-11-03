// SideBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <ul style={listStyle}>
        <li style={listItemStyle}><SidebarLink to="/dashboard/volunteers">Volunteers</SidebarLink></li>
        <li style={listItemStyle}><SidebarLink to="/dashboard/tasks">Tasks</SidebarLink></li>
        <li style={listItemStyle}><SidebarLink to="/dashboard/researches">Researches</SidebarLink></li>
        <li style={listItemStyle}><SidebarLink to="/dashboard/logs">Logs</SidebarLink></li>
        <li style={listItemStyle}><SidebarLink to="/dashboard/logout">Logout</SidebarLink></li>
      </ul>
    </div>
  );
};

const sidebarStyle = {
  width: '150px', 
  backgroundColor: 'white',
  color: 'black',
  padding: '0',
  height: '100vh',
  position: 'fixed',
  top: '4rem',
  left: '0',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column'
};

const listItemStyle = {
  padding: 0,
  margin: 0
};

const linkStyle = {
  color: 'black',
  textDecoration: 'none',
  display: 'block',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '0',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'background-color 0.3s, box-shadow 0.3s'
};

const SidebarLink = ({ to, children }) => (
  <Link
    to={to}
    style={linkStyle}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#f0f0f0';
      e.target.style.boxShadow = 'inset 0 0 5px #aaa';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '';
      e.target.style.boxShadow = '';
    }}
  >
    {children}
  </Link>
);

export default Sidebar;
