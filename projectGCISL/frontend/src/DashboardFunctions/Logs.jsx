import React, { useState, useEffect } from 'react';
import AdminNavBar from '../ClassComponents/AdminNavBar';
import { FormatDate } from '../ClassComponents/FormatDate';
import Sidebar from '../ClassComponents/SideBar';

const Logs = () => {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [logs, setLogs] = useState([]); // Logs data
  const [filter, setFilter] = useState('all'); // Current filter
 // const [selectedLogId, setSelectedLogId] = useState(null);
  const [selectedLogId, setSelectedLogId] = useState([]);
  const [notification, setNotification] = useState(''); // Stores the notification message
  const showNotification = (message) => {
      setNotification(message); // Set the message
      setTimeout(() => {
        setNotification(''); // Clear the message after 3 seconds
      }, 3000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        let response;
        if (process.env.NODE_ENV !== "production") {
          response = await fetch(`${apiUrl}/api/index/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
        
        else {
          response = await fetch(`${apiUrl}/api/index`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'get-user' }),
          });
        }

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.firstName, lastName: data.lastName });
        } else {
          console.error('Error fetching user:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        let response;

        if (process.env.NODE_ENV !== "production") {
          response = await fetch(`${apiUrl}/api/index/logs`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
        else {
          response = await fetch(`${apiUrl}/api/index`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'get-logs' }),
          });
        }

        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          console.error('Error fetching logs:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchUserData();
    fetchLogs();
  }, []);

  // Allowing to delete multiple logs at once
  const handleRowClick = (logId) => {
    setSelectedLogId((prevSelected) =>
      prevSelected.includes(logId)
        ? prevSelected.filter((id) => id !== logId)
        : [...prevSelected, logId]
    );
  };

  const handleDeleteLog = async () => {
    const token = localStorage.getItem('token');
    if (!token || selectedLogId.length === 0) return;
  
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const deletePromises = selectedLogId.map((logId) => {
        if (process.env.NODE_ENV !== "production") {
          return fetch(`${apiUrl}/api/index/logs/${logId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          return fetch(`${apiUrl}/api/index`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "delete-log", id: logId }),
          });
        }
      });
  
      const results = await Promise.all(deletePromises);
      const successfulDeletes = results.filter(res => res.ok).length;
  
      setLogs((prevLogs) => prevLogs.filter((log) => !selectedLogId.includes(log._id)));
      setSelectedLogId([]);
      showNotification(`${successfulDeletes} log(s) deleted`);
    } catch (err) {
      console.error("Bulk delete error:", err);
    }
  };
  
  // Filter logs based on the due date
  const getFilteredLogs = () => {
    const currentDate = new Date();

    switch (filter) {
      case "noDueDate":
          return logs.filter((log) => !log.dueDate); // Tasks without a due date
        case "passed":
      case 'passed':
         return logs.filter((log) => log.dueDate && new Date(log.dueDate) < currentDate); // Due date passed
         // Using the format as below also included the tasks with no due date
      case 'notPassed':
        return logs.filter((log) => new Date(log.dueDate) > currentDate); // Upcoming
      default:
        return logs; // All logs
    }
  };

return (
  <div>
    <AdminNavBar
      role="ADMIN"
      firstName={user.firstName}
      lastInitial={user.lastName.charAt(0)}
    />
    <div style={styles.dashboardStyle}>
      <Sidebar />
      <div style={styles.logsPage}>
        {/* Logs Header with Filters */}
        <div style={styles.logsHeader}>
          <h2 style={styles.logsTitle}>Logs</h2>
          <div style={styles.filterStyle}>
            <button
              style={styles.filterButtonStyle(filter === "all")}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              style={styles.filterButtonStyle(filter === "noDueDate")}
              onClick={() => setFilter("noDueDate")}
            >
              No Due Date
            </button>
            <button
              style={styles.filterButtonStyle(filter === "passed")}
              onClick={() => setFilter("passed")}
            >
              Overdue
            </button>
            <button
              style={styles.filterButtonStyle(filter === "notPassed")}
              onClick={() => setFilter("notPassed")}
            >
              Upcoming
            </button>
          </div>

          {selectedLogId.length > 0 && (
            <button
              style={styles.deleteButton}
              onClick={handleDeleteLog}
            >
              Delete {selectedLogId.length} Log(s)
            </button>
          )}
        </div>

        {/* Separating Bar */}
        <hr style={styles.separator} />

        {/* Logs Table */}
        {getFilteredLogs().length > 0 ? (
          <table style={styles.tableStyle}>
            <thead style={styles.tableHeaderStyle}>
              <tr>
                <th style={styles.cellStyle}>Action</th>
                <th style={styles.cellStyle}>Task Title</th>
                <th style={styles.cellStyle}>Task Assignees</th>
                <th style={styles.cellStyle}>Creation Date</th>
                <th style={styles.cellStyle}>Task Due Date</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredLogs().map((log) => (
                <tr
                  key={log._id}
                  style={{
                    ...styles.rowStyle,
                    backgroundColor: selectedLogId.includes(log._id) ? "#f0f8ff" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRowClick(log._id)}
                >
                  <td style={styles.cellStyle}>{log.action}</td>
                  <td style={styles.cellStyle}>{log.taskTitle}</td>
                  <td style={styles.cellStyle}>
                    {log.assignees.length > 0 ? log.assignees.join(", ") : "-"}
                  </td>
                  <td style={styles.cellStyle}>
                    {FormatDate(log.creationDate)}
                  </td>
                  <td style={styles.cellStyle}>
                    {log.dueDate ? FormatDate(log.dueDate) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No logs available for the selected filter.</p>
        )}
      </div>
    </div>

    {notification && <div style={styles.notificationStyle}>{notification}</div>}
  </div>
 );
}; 

const styles = {
  deleteButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "5px",
  },
  notificationStyle: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    fontSize: "1rem",
  },
  logsPage: {
    padding: '2rem',
    paddingLeft: '180px',
    paddingTop: '70px',
    width: 'calc(100vw - 180px)',
    boxSizing: 'border-box',
  },
  logsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
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
  separator: {
    border: 'none',
    borderBottom: '2px solid #ccc',
    marginBottom: '1rem',
  },
  tableStyle: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    backgroundColor: '#fff', // Background color for the table
  },
  tableHeaderStyle: {
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  rowStyle: {
    borderBottom: '1px solid #ddd',
  },
  cellStyle: {
    padding: '10px',
    border: '1px solid #ddd', // Clear borders for table cells
    textAlign: 'left',
    verticalAlign: 'middle',
  },
};

export default Logs;