import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar'; 
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar'; 
import './VolunteerList.css';

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
      <div className="dashboard">
        <VolunteerSidebar taskCount={taskCount} />
        <div className="content">
          <h2>Volunteers List</h2>
          <div className="volunteers-list">
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <div key={volunteer._id} className="volunteer-card">
                  <h3 className="volunteer-name">{volunteer.firstName} {volunteer.lastName}</h3>
                  <p className="volunteer-email">{volunteer.email}</p>
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

}
export default VolunteerList;
