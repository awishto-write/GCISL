import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar';

const VolunteerDashboard = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [taskCount, setTaskCount] = useState(0); // Added state for task count

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

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/volunteer-tasks`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          await response.json();
         // const tasks = await response.json();
         // const count = tasks.length;

         
        } else {
          console.error('Error fetching tasks:', response.statusText);
        }

        
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [user]); // Ensure this effect re-runs when the user data changes


  useEffect(() => {
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
                setTaskCount(data.count); // Update the task count state
            } else {
                console.error('Error fetching task count:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching task count:', error);
        }
    };

    fetchTaskCount();
}, []);

  return (
    <div>
      <AdminNavBar role="VOLUNTEER" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
      <div style={dashboardStyle}>
        <VolunteerSidebar taskCount={taskCount} /> {/* Pass taskCount to the sidebar */}
        {console.log(taskCount)}
        <div style={contentStyle}>
          <h1>Welcome to the Volunteer Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

const dashboardStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const contentStyle = {
  marginLeft: '200px',
  padding: '1rem',
  width: '100%',
};

/* Add the following CSS to your global stylesheet or create a new one */

/* Responsive styles */
const responsiveStyles = `
  @media screen and (max-width: 768px) {
    .dashboard {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      margin: 0;
    }

    .content {
      margin-left: 0;
      padding: 0.5rem;
      width: 100%;
    }

    h1 {
      font-size: 20px;
      text-align: center;
    }
  }

  @media screen and (max-width: 480px) {
    h1 {
      font-size: 18px;
    }

    .content {
      padding: 0.3rem;
    }
  }
`;

// Inject styles into the document
const styleTag = document.createElement('style');
styleTag.innerHTML = responsiveStyles;
document.head.appendChild(styleTag);

export default VolunteerDashboard;