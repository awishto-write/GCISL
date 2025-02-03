import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import VolunteerSidebar from '../ClassComponents/VolunteerSidebar';
import { FormatDate } from '../ClassComponents/FormatDate';

const VolunteerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [taskCount, setTaskCount] = useState(() => {
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
          const count = data.length;
          setTaskCount(count);
          localStorage.setItem('taskCount', count);
        } else if (response.status === 404) {
          console.log('No tasks assigned to this volunteer.');
          setTasks([]);
        } else {
          console.error('Error fetching tasks:', response.statusText);
          setTasks([]);
          setTaskCount(0);
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

        // Update the progress count in the frontend
        if (newStatus === 'Completed') {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId
                ? { ...task, progressCount: (task.progressCount || 0) + 1 }
                : task
            )
          );
        }
      } else {
        console.error('Error updating task status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <AdminNavBar role="VOLUNTEER" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
      <div style={styles.dashboard}>
        <VolunteerSidebar taskCount={taskCount} />
        <div style={styles.content}>
          <div style={styles.tasksHeader}>
            <h2>My Tasks</h2>
          </div>
          <div style={styles.tasksList}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task._id} style={styles.taskCard}>
                  <div style={styles.taskInfo}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <p style={styles.taskDetails}><strong>Due Date:</strong> {FormatDate(task.dueDate) || "Not Set"}</p>
                    <p style={styles.taskDetails}><strong>Status:</strong> {task.status || "None"}</p>
                    <p style={styles.taskDetails}><strong>Description:</strong> {task.description || "None"}</p>
                    <p style={styles.taskDetails}><strong>Created By:</strong> {task.createdBy || "N/A"}</p>
                    <p style={styles.taskDetails}><strong>Progress:</strong> {(task.progressCount || 0)}/{task.assignees.length || 1}</p>
                    <div style={styles.actions}>
                      <div style={styles.dropdownContainer}>
                        <select
                          style={styles.statusSelect}
                          value={task.status || "None"}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
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
    marginLeft: '180px', // Aligns with the sidebar
    padding: '2rem',
    width: 'calc(100vw - 180px)', // Adjust width based on the sidebar
    boxSizing: 'border-box',
  },

  tasksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #ccc', // Separating bar like in Admin Tasks
    paddingBottom: '0.5rem',
    marginBottom: '1rem', // Space below the header
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column', // Stack tasks vertically
    gap: '1rem', // Space between tasks
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    width: '100%', // Full width
  },
  
  icon: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    backgroundColor: '#d9534f',
    marginRight: '1rem',
  },
  taskInfo: {
    flex: 1, // Allow task details to stretch
  },
  taskTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },

  actions: {
    display: 'flex',
    gap: '1rem',
      marginTop: '1rem',
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
  taskDetails: {
    marginBottom: '0.2rem', // Adds spacing between each detail
  },
};

export default VolunteerTasks;