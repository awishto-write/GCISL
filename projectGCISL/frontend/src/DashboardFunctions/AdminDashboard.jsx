import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import Sidebar from '../ClassComponents/SideBar';

const AdminDashboard = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        let response;

        if (process.env.NODE_ENV !== "production") {
          response = await fetch(`${apiUrl}/api/index/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          response = await fetch(`${apiUrl}/api/index`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ action: "get-user" }),
          });
        }

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.firstName, lastName: data.lastName });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
  
    fetchUserData();
  }, []);  

  return (
    <div>
      <AdminNavBar role="ADMIN" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
      <div style={dashboardStyle}>
        <Sidebar />
        <div style={contentStyle}>
          <h1>Welcome to the Admin Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

const dashboardStyle = {
  display: 'flex',
};

const contentStyle = {
  marginLeft: '200px',
  padding: '1rem',
};

export default AdminDashboard;