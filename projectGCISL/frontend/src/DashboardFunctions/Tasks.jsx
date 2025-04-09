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
  // const [taskID, setEditingTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState('All'); // Ensure filter options remain the same
  const currentDate = new Date();
  const [editTask, setEditTask] = useState({
    title: "",
    creationDate: currentDate,
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

  const showNotificationExistingTask = (message) => {
    setNotification(message); // Set the message
    setTimeout(() => {
      setNotification(''); // Clear the message after 10 seconds
    }, 10000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchUserData = async () => {
      try {
        let res;
        if (process.env.NODE_ENV !== "production") {
          res = await fetch(`${apiUrl}/api/index/user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
        else {
          res = await fetch(`${apiUrl}/api/index`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "get-user" }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          //setUser(data);
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          });
          setEditTask((prev) => ({
            ...prev,
            createdBy: `${data.firstName} ${data.lastName}`,
          }));
        } else {
          console.error("Error fetching user");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const fetchTasks = async () => {
      try {
        let res;
        if (process.env.NODE_ENV !== "production") {
          res = await fetch(`${apiUrl}/api/index/tasks`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
        else {
          res = await fetch(`${apiUrl}/api/index`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "get-tasks" }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchTasks();
  }, []);

  const handleAddTestTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = process.env.REACT_APP_API_URL;
    const newTask = {
      action: "create-task",
      title: "TASK",
      creationDate: new Date(),
      dueDate: null,
      status: "None",
      description: "",
    };

    try {
      let res;
      if (process.env.NODE_ENV !== "production") {
        res = await fetch(`${apiUrl}/api/index/tasks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });
      }
      else {
        res = await fetch(`${apiUrl}/api/index`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        });
      }

      const result = await res.json();
      if (res.ok) {
        setTasks((prev) => [...prev, result]);
        showNotificationExistingTask("Task successfully created! Please edit the title.");
      } else {
        showNotificationExistingTask(result.message || "Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTask(task);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      let res;
      if (process.env.NODE_ENV !== "production") {
        res = await fetch(`${apiUrl}/api/index/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editTask),
        });
      }
      else {
        res = await fetch(`${apiUrl}/api/index`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "update-task", id: editingTaskId, ...editTask }),
        });
      }

      const updated = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t._id === editingTaskId ? updated : t)));
        setEditingTaskId(null);
      } else {
        showNotification(updated.message || "Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      let res;
      if (process.env.NODE_ENV !== "production") {
        res = await fetch(`${apiUrl}/api/index/tasks/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      else {
        res = await fetch(`${apiUrl}/api/index`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "delete-task", id }),
        });
      }

      if (res.status === 204) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
        showNotification("Task successfully deleted!");
      } else {
        console.error("Error deleting task:", await res.text());
      }
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  const handleClearAssignees = async (taskId) => {
    setIsClearing(true);
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found");
      setIsClearing(false);
      return;
    }
  
    const apiUrl = process.env.REACT_APP_API_URL;
  
    try {
      let clear;
      if (process.env.NODE_ENV !== "production") {
        clear = await fetch(`${apiUrl}/api/index/tasks/${taskId}/clear`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
      else {
        clear = await fetch(`${apiUrl}/api/index`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "clear-task-assignees", taskId }),
        });
      }
  
      if (!clear.ok) {
        throw new Error("Failed to clear assignees");
      }
      const result = await clear.json();
      console.log("Clear response:", result);
      
      // Update the specific task in state directly
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, assignedVolunteers: [] } 
            : task
        )
      );
      
      showNotification("Assignees cleared successfully!");
    } catch (err) {
      console.error("Error clearing assignees:", err);
      showNotification("Failed to clear assignees");
    } finally {
      setIsClearing(false);
    }
  };

  const getFilteredTasks = () => {
    return filter === 'All' ? tasks : tasks.filter(task => task.status === filter);
  };

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
          <div style={styles.filterStyle}>
            <button
              style={styles.filterButtonStyle(filter === "All")}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              style={styles.filterButtonStyle(filter === "None")}
              onClick={() => setFilter("None")}
            >
              None
            </button>
            <button
              style={styles.filterButtonStyle(filter === "In Progress")}
              onClick={() => setFilter("In Progress")}
            >
              In Progress
            </button>
            <button
              style={styles.filterButtonStyle(filter === "Completed")}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
            <button
              style={styles.filterButtonStyle(filter === "To Redo")}
              onClick={() => setFilter("To Redo")}
            >
              To Redo
            </button>
          </div>
          <button style={styles.addTaskButton} onClick={handleAddTestTask}>
            + Create Task
          </button>
        </div>
        <div style={styles.tasksList}>
          {getFilteredTasks().length > 0 ? (
            getFilteredTasks().map((task) => (
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
  filterStyle: {
    display: 'flex',
    gap: '1rem',
  },
  filterButtonStyle: (isActive) => ({
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: isActive ? '#4caf50' : '#ccc',
    color: isActive ? 'white' : 'black',
    cursor: 'pointer',
  }),
};

export default Tasks;