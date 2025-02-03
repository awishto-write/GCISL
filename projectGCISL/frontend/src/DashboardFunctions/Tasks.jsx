import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import "react-datetime/css/react-datetime.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormatDate } from '../ClassComponents/FormatDate';
import DateInputWithIcon from '../ClassComponents/DateInputWithIcon';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [isLoading, setIsLoading] = useState(true); // Loading state added
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const currentDate = new Date();
  // const defaultDueDate = new Date(currentDate);
  // defaultDueDate.setDate(defaultDueDate.getDate() + 14); // Set 14 days from creation date
  const [editTask, setEditTask] = useState({
    title: "",
    creationDate: currentDate,
    //dueDate: defaultDueDate, //  
    dueDate: null,
    status: "None",
    description: "",
    createdBy: "",
  });
  
  const [isClearing, setIsClearing] = useState(false);
  const [notification, setNotification] = useState(''); // Stores the notification message

  const showNotification = (message) => {
    setNotification(message); // Set the message
    setTimeout(() => {
      setNotification(''); // Clear the message after 3 seconds
    }, 3000);
  };

  useEffect(() => {
    // Fetch the current user data
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
          // Update `editTask` with `createdBy` when user data is fetched
          setEditTask((prevTask) => ({
            ...prevTask,
            createdBy: `${data.firstName} ${data.lastName}`,
          }));
        } else {
          console.error("Error fetching user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetch completes
      }
    };
    fetchUserData();
    fetchTasks();
  }, []);

  const handleAddTestTask = async () => {
    const newTask = {
      title: "TASK",
      creationDate: new Date(), // Set current date for creation
      dueDate: null, // Leave due date empty
      status: "None",
      description: "",
      createdBy: `${user.firstName} ${user.lastName}`, // Use logged-in user details
    };

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      showNotification('Task successfully created!'); // Show notification
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTask(task);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks(
        tasks.map((task) => (task._id === editingTaskId ? updatedTask : task))
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
        showNotification('Task successfully deleted!'); 
      } 
      else {
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleClearAssignees = async (taskId) => {
    setIsClearing(true); // Indicate that the clearing process has started

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      setIsClearing(false); // Reset the state if there's an error
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/tasks/${taskId}/clear`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to clear assignees");
      }

      const result = await response.json();
      console.log(result.message);

      // Refresh the tasks list to reflect changes
      const apiUrlTask = process.env.REACT_APP_API_URL;
      const tasksResponse = await fetch(`${apiUrlTask}/api/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } else {
        console.error("Error fetching tasks data:", tasksResponse.statusText);
      }
    } catch (error) {
      console.error("Error clearing assignees:", error);
    } finally {
      setIsClearing(false); // Reset the state after the process is complete
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTask({ title: '', duration: '', document: '', status: '' });
  };

  

  const filteredTasks = filterStatus === 'All' ? tasks : tasks.filter(task => task.status === filterStatus);

  // Show "Loading..." if data is still being fetched
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AdminNavBar
        role="ADMIN"
        firstName={user.firstName}
        lastInitial={user.lastName.charAt(0)}
      />
       {notification && (
          <div style={styles.notificationStyle}>
              {notification}
          </div>
      )}
      <div style={styles.tasksPage}>
        <div style={styles.tasksHeader}>
          <h2>Tasks</h2>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.filterDropdown}
            >
              <option value="All">All</option>
              <option value="None">None</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="To Redo">To Redo</option>
            </select>
          </div>
          <button style={styles.addTaskButton} onClick={handleAddTestTask}>
            + Create Task
          </button>
        </div>
        <div style={styles.tasksList}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                isEditing={editingTaskId === task._id}
                editTask={editTask}
                setEditTask={setEditTask}
                onEdit={() => handleEditTask(task)}
                onSave={handleSaveEdit}
                onDelete={() => handleDeleteTask(task._id)}
                onClearAssignees={handleClearAssignees}
                onCancel={handleCancelEdit}
                isClearing={isClearing}
                user={user}
              />
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  isEditing,
  editTask,
  setEditTask,
  onEdit,
  onSave,
  onDelete,
  onClearAssignees,
  onCancel,
  isClearing,
}) => (
  <div style={styles.taskCard}>
    <div style={styles.icon}></div>
    <div style={styles.info}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) =>
              setEditTask({ ...editTask, title: e.target.value })
            }
            placeholder="Task Title"
            style={styles.input}/>
          <DatePicker
            selected={editTask.dueDate}
            onChange={(date) => setEditTask({ ...editTask, dueDate: date })}
            dateFormat="yyyy-MM-dd"
            placeholderText="Due Date"
            customInput={<DateInputWithIcon />} />
          <select
            value={editTask.status}
            onChange={(e) =>
              setEditTask({ ...editTask, status: e.target.value })
            }
            style={styles.input} >
            <option value="None">None</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="To Redo">To Redo</option>
          </select>
          <input
            type="text"
            value={editTask.description}
            onChange={(e) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
            placeholder="Task Description"
            style={styles.input} />
          <button
            style={styles.clearButton}
            onClick={() => onClearAssignees(task._id)}
            disabled={isClearing} >
            {isClearing ? "Clearing..." : "Clear Assignees"}
          </button>
        </>
      ) : (
        <>
          <h3 style={styles.taskTitle}>{task.title}</h3>
          <p style={styles.taskDetails}>
            <strong>Creation Date:</strong> {FormatDate(task.creationDate)}
          </p>
          <p style={styles.taskDetails}>
            <strong>Due Date:</strong> {task.dueDate ? FormatDate(task.dueDate) : "Not Set"}
          </p>
          <p style={styles.taskDetails}><strong>Status:</strong> {task.status || "None"}</p>
          <p style={styles.taskDetails}><strong>Description:</strong> {task.description || "None"}</p>
          <p style={styles.taskDetails}><strong>Created By:</strong> {task.createdBy || "N/A"}</p>
          
          {task.assignedVolunteers && task.assignedVolunteers.length > 0 && (
            <p style={styles.assignedVolunteer}>
              <strong>Assigned to:{" "}</strong>
              {task.assignedVolunteers
                .map(
                  (volunteer) => `${volunteer.firstName} ${volunteer.lastName}`
                )
                .join(", ")}
            </p>
          )}
        </>
      )}
    </div>
    <div style={styles.actions}>
      {isEditing ? (
        <>
        <button style={styles.defaultButton} onClick={onSave}>
          Save
        </button>
        <button style={styles.defaultButton} onClick={onCancel}>
          Cancel
        </button>
      </>
      ) : (
        <button style={styles.defaultButton} onClick={onEdit}>
          Edit
        </button>
      )}
      <button style={styles.defaultButton} onClick={onDelete}>
        Delete
      </button>
    </div>
  </div>
);    

const styles = {
  notificationStyle: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    fontSize: '1rem',
  },
  tasksPage: {
    padding: '2rem',
    paddingLeft: '180px',
    paddingTop: '70px',
    width: 'calc(100vw - 180px)',
    boxSizing: 'border-box',
  },
  tasksHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
  },
  addTaskButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  tasksList: {
    marginTop: '1rem',
  },
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '1rem',
    margin: '0.5rem 0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    marginRight: '1rem',
    backgroundColor: '#d9534f',
  },
  info: {
    flex: 1,
  },
  // taskTitle: {
  //   margin: '0 0 0.2rem 0',
  // },
  taskTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  duration: {
    color: '#666',
  },
  documentLink: {
    color: '#007bff',
    textDecoration: 'none',
    marginTop: '0.5rem',
    display: 'inline-block',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    margin: '0.2rem 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black',
    boxSizing: 'border-box',
  },
  defaultButton: {
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: 'black',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '0.5rem',
  },
  taskDetails: {
    marginBottom: '0.2rem', // Adds spacing between each detail
  },
  filterDropdown: {
    padding: '0.5rem',
    marginRight: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

export default Tasks;