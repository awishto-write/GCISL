import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar'; 

const Logs = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [taskCount, setTaskCount] = useState(() => {
    // Initialize taskCount from localStorage, default to 0 if not present
    const savedCount = localStorage.getItem('taskCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/user`, { 
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.firstName, lastName: data.lastName });
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch task count
    const fetchTaskCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
  
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await fetch(`${apiUrl}/api/volunteer-task-count`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setTaskCount(data.count);
            localStorage.setItem('taskCount', data.count); // Save to localStorage
          } else {
            console.error('Error fetching task count:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching task count:', error);
        }
    };
  
    fetchUserData();
    fetchTaskCount();
  }, []);

  return (
    <div>
      <AdminNavBar role="VOLUNTEER" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
      <div style={dashboardStyle}>
        <VolunteerSidebar taskCount={taskCount} />
        <div style={contentStyle}>
          <h2>Logs Page</h2>
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

export default Logs;