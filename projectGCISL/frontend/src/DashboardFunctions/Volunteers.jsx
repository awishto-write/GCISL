import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import Sidebar from '../ClassComponents/SideBar';

const Volunteers = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [volunteers, setVolunteers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const env = process.env.REACT_APP_API_URL;
        const apiUrl = `${env}/api/user`;
        const volunteersApiUrl = `${env}/api/users?role=volunteer`;
        const tasksApiUrl = `${env}/api/tasks`;

        const userResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser({ firstName: userData.firstName, lastName: userData.lastName });

          const volunteersResponse = await fetch(volunteersApiUrl, {
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
            console.error('Error fetching volunteers data:', volunteersResponse.statusText);
          }

          const tasksResponse = await fetch(tasksApiUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
          } else {
            console.error('Error fetching tasks data:', tasksResponse.statusText);
          }
        } else {
          console.error('Error fetching user data:', userResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const refreshTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTasks(await response.json());
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAssignTask = async (volunteerId, taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    const task = tasks.find(t => t._id === taskId);
    if (!task) {
      console.error(`Task with ID ${taskId} not found`);
      return;
    }
  
    const isAssigned = task.assignedVolunteers.some(vol => vol._id === volunteerId);
  
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const endpoint = `${apiUrl}/api/tasks/${isAssigned ? 'remove' : 'assign'}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volunteerId, taskId }),
      });
  
      console.log('Request URL:', endpoint);
      console.log('Request body:', { volunteerId, taskId });
  
      if (response.ok) {
        await refreshTasks();
        setSelectedVolunteer(null);
        setHoveredTaskId(null);
      } else {
        const errorMessage = await response.json();
        console.error('Error assigning/removing task:', errorMessage);
      }
    } catch (error) {
      console.error('Error assigning/removing task:', error);
    }
  };   
  

  return (
    <div>
      <AdminNavBar role="ADMIN" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
      <div style={dashboardStyle}>
        <Sidebar />
        <div style={contentStyle}>
          <h2>Volunteers List</h2>
          <div style={styles.volunteersList}>
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => {
                const assignedTasks = tasks.filter(task => task.assignedVolunteers.some(vol => vol._id === volunteer._id));
                return (
                  <div key={volunteer._id} style={styles.volunteerCard}>
                    <div style={styles.volunteerInfo}>
                      <button onClick={() => setSelectedVolunteer(volunteer._id)} style={styles.menuButton}>
                        &#x22EE; {/* Three dots menu */}
                      </button>
                      <h3 style={styles.volunteerName}>
                        {volunteer.firstName} {volunteer.lastName}
                      </h3>
                      <p style={styles.volunteerEmail}>
                        {volunteer.email}
                      </p>
                      {assignedTasks.length > 0 && (
                        <span style={styles.assignedBadge}>
                          {assignedTasks.length} Task(s) Assigned: {assignedTasks.map((task) => task.title).join(', ')}
                        </span>
                      )}
                      {selectedVolunteer === volunteer._id && (
                        <div style={styles.dropdownMenu}>
                          {tasks.map((task) => (
                            <div
                              key={task._id}
                              style={{
                                ...styles.dropdownItem,
                                ...(task.assignedVolunteers.includes(volunteer._id) ? styles.dropdownItemActive : {}),
                                ...(hoveredTaskId === task._id && !task.assignedVolunteers.includes(volunteer._id)
                                  ? styles.dropdownItemHover
                                  : {}),
                              }}
                              onClick={() => handleAssignTask(volunteer._id, task._id)}
                              onMouseEnter={() => setHoveredTaskId(task._id)}
                              onMouseLeave={() => setHoveredTaskId(null)}
                            >
                              {task.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No volunteers available</p>
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
    position: 'relative',
    width: '600px',
  },
  volunteerInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    marginRight: '1rem',
  },
  volunteerName: {
    margin: '0',
    flex: 1,
  },
  volunteerEmail: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0.2rem 0',
  },
  assignedBadge: {
    marginTop: '0.5rem',
    backgroundColor: '#FFD700', // Gold color
    color: '#000',
    padding: '2px 8px',
    borderRadius: '5px',
    fontSize: '0.9rem',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '0',
    left: '3rem',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease', // Smooth transition for hover and active states
  },
  dropdownItemHover: {
    backgroundColor: '#f0f0f0', // Lighter shade for hover state
  },
  dropdownItemActive: {
    backgroundColor: '#b0b0b0', // Darker shade for active state
    fontWeight: 'bold',
    color: '#000',
  },
  assigned: {
    backgroundColor: '#d0d0d0',
    fontWeight: 'bold',
  },
};

export default Volunteers;
