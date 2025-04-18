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
    const fetchUserDataAndVolunteers = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        let userResponse;

        // Fetch user
        if (process.env.NODE_ENV !== "production") {
          userResponse = await fetch(`${apiUrl}/api/index/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
        else {
          userResponse = await fetch(`${apiUrl}/api/index`, {
            method:'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
              body: JSON.stringify({ action: 'get-user' }),
          }
        );
        }
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({ firstName: userData.firstName, lastName: userData.lastName });
          let volunteerResponse;

          if (process.env.NODE_ENV !== "production") { 
            volunteerResponse = await fetch(`${apiUrl}/api/index/users?role=volunteer`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }

          else {
            volunteerResponse = await fetch(`${apiUrl}/api/index`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'get-users',
                role: 'volunteer'
              }),
            });
          }

          if (volunteerResponse.ok) {
            const data = await volunteerResponse.json();
            setVolunteers(data);
          }
        }

      } catch (err) {
        console.error('Error fetching user or volunteers:', err);
      }
    };
  
    const fetchTaskCount = async () => {
      const token = localStorage.getItem('token');
      let response;
      if (!token) return;
  
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        if (process.env.NODE_ENV !== "production") {
          response = await fetch(`${apiUrl}/api/index/volunteer-task-count`, {
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
            body: JSON.stringify({ action: "volunteer-task-count" }),
          });
        }
  
        if (response.ok) {
          const data = await response.json();
          setTaskCount(data.count);
          localStorage.setItem('taskCount', data.count);
        }
      } catch (err) {
        console.error('Error fetching task count:', err);
      }
    };
  
    fetchUserDataAndVolunteers();
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

const dashboardStyle = {
  display: 'flex',
  minWidth: '100%' ,
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
  volunteerEmail: {
    color: '#666',
  },
};
const responsiveStyles = `
  @media screen and (max-width: 768px) {
    .content {
      margin-left: 0; /* Remove sidebar offset on small screens */
      width: 100%;
      padding: 0.5rem;
    }

    .volunteer-card {
      width: 90%; /* Cards take full width on small screens */
      display: flex;
    }
  }

  @media screen and (max-width: 480px) {
    .volunteer-card {
      width: 100%;
      padding: 0.8rem;
    }

    .volunteer-name {
      font-size: 1rem;
    }

    .volunteer-email {
      font-size: 0.9rem;
    }
  }
`;

// Inject responsive styles into the document
const styleTag = document.createElement('style');
styleTag.innerHTML = responsiveStyles;
document.head.appendChild(styleTag);
export default VolunteerList;