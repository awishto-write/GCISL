import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar'; 
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar'; 

const VolunteerList = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [volunteers, setVolunteers] = useState([]);
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

        const userResponse = await fetch(`${apiUrl}/api/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({ firstName: userData.firstName, lastName: userData.lastName });

          const volunteersResponse = await fetch(`${apiUrl}/api/users?role=volunteer`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (volunteersResponse.ok) {
            const volunteersData = await volunteersResponse.json();
            setVolunteers(volunteersData);
          } else {
            console.error('Error fetching volunteers:', volunteersResponse.statusText);
          }
        } else {
          console.error('Error fetching user data:', userResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
        <VolunteerSidebar taskCount={taskCount}  />
        <div style={contentStyle}>
          <h2>Volunteers List</h2>
          <div style={styles.volunteersList}>
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <div key={volunteer._id} style={styles.volunteerCard}>
                  <h3 style={styles.volunteerName}>{volunteer.firstName} {volunteer.lastName}</h3>
                </div>
              ))
            ) : (
              <p>No volunteers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const dashboardStyle = {
  display: 'flex',
};

const contentStyle = {
  flex: 1,
  marginLeft: '200px',
  padding: '1rem',
  marginTop: '70px',
};

const styles = {
  volunteersList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  volunteerCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    margin: '0.5rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    width: '600px', // Matches the design you want
    textAlign: 'center', // Center the text inside the box
  },
  volunteerName: {
    margin: 0,
    fontSize: '1.2rem',
  },
};

export default VolunteerList;