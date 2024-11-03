import React, { useState, useEffect } from 'react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', duration: '', document: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTestTask = async () => {
    const newTask = {
      title: 'TASK',
      duration: '(mm/dd/yyyy) - (mm/dd/yyyy)',
      document: '',
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTask(task);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task._id === editingTaskId ? updatedTask : task)));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={styles.tasksPage}>
      <div style={styles.tasksHeader}>
        <h2>Tasks</h2>
        <button style={styles.addTaskButton} onClick={handleAddTestTask}>+ Create Task</button>
      </div>
      <div style={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isEditing={editingTaskId === task._id}
            editTask={editTask}
            setEditTask={setEditTask}
            onEdit={() => handleEditTask(task)}
            onSave={handleSaveEdit}
            onDelete={() => handleDeleteTask(task._id)}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task, isEditing, editTask, setEditTask, onEdit, onSave, onDelete }) => (
  <div style={styles.taskCard}>
    <div style={styles.icon}>
      {/* Removed exclamation mark */}
    </div>
    <div style={styles.info}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTask.title}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            placeholder="Task Title"
            style={styles.input}
          />
          <input
            type="text"
            value={editTask.duration}
            onChange={(e) => setEditTask({ ...editTask, duration: e.target.value })}
            placeholder="Task Duration"
            style={styles.input}
          />
          <input
            type="text"
            value={editTask.document}
            onChange={(e) => setEditTask({ ...editTask, document: e.target.value })}
            placeholder="Task Document"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <h3 style={styles.taskTitle}>{task.title}</h3>
          <p style={styles.duration}>Duration: {task.duration}</p>
          {task.document && (
            <a href={`path/to/documents/${task.document}`} download style={styles.documentLink}>
              {task.document}
            </a>
          )}
        </>
      )}
    </div>
    <div style={styles.actions}>
      {isEditing ? (
        <button style={styles.defaultButton} onClick={onSave}>
          Save
        </button>
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
    margin: '0 0 0.2rem 0',
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
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
};

export default Tasks;
