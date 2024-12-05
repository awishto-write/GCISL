import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar';

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [taskCount, setTaskCount] = useState(() => {
    // Initialize taskCount from localStorage, default to 0 if not present
    const savedCount = localStorage.getItem('taskCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    // Fetch the current user data
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
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
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
          const data = await response.json();
          setTasks(data);

           // Update task count and save it to localStorage
          const count = data.length;
          setTaskCount(count);
          localStorage.setItem('taskCount', count);

        } else if (response.status === 404) {
          console.log('No tasks assigned to this volunteer.');
          setTasks([]); // Clear tasks if none are assigned
        } else {
          console.error('Error fetching tasks:', response.statusText);
          setTasks([]);
          setTaskCount(0); // Reset task count
          localStorage.setItem('taskCount', 0);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  }, []);
  
  const updateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: updatedTask.status } : task
          )
        );
      } else {
        console.error('Error updating task status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <AdminNavBar
        role="VOLUNTEER"
        firstName={user.firstName}
        lastInitial={user.lastName.charAt(0)}
      />
      <div style={styles.dashboard}>
        {/* <VolunteerSidebar /> */}
        <VolunteerSidebar taskCount={taskCount} /> {/* Pass taskCount to Sidebar */}
        <div style={styles.content}>
          <h2>My Tasks</h2>
          <div style={styles.taskGrid}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <h3>{task.title}</h3>
                  <p>
                    <strong>Duration:</strong> {task.duration}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status || "None"}
                  </p>
                  <p>
                    <strong>Description:</strong> {task.description}
                  </p>

                  <div style={styles.actions}>
                    <div style={styles.dropdownContainer}>
                      <select
                        style={styles.statusSelect}
                        value={task.status || "None"}
                        onChange={(e) =>
                          updateTaskStatus(task._id, e.target.value)
                        }
                      >
                        <option value="None" disabled>
                          Select Status
                        </option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <span style={styles.dropdownArrow}>▼</span>
                    </div>
                  </div>
                
                </div>
              ))
            ) : (
              <p>No tasks assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    display: 'flex',
  },
  content: {
    marginLeft: '200px',
    padding: '1rem',
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  taskCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  statusButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  dropdownContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '200px', // Optional: Adjust the max width
    margin: '0.5rem auto',
  },
  statusSelect: {
    width: '100%',
    padding: '0.75rem', // Adjust padding for a button-like appearance
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    appearance: 'none', // Hides the default dropdown arrow
    textAlign: 'center',
  },
  
  dropdownArrow: {
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
    color: '#fff', // Match text color
    pointerEvents: 'none', // Prevent interaction with the arrow
  },
};

export default VolunteerTasks;
