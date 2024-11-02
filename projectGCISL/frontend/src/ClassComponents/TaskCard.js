import React from 'react';

function TaskCard({ task }) {
  return (
    <div className="task-card" style={{ borderColor: task.color }}>
      <h4>{task.title}</h4>
      <p>Duration: {task.duration}</p>
      {task.linkText && (
        <a href={task.linkUrl} className="task-link">
          {task.linkText}
        </a>
      )}
      <div className="task-actions">
        <button className="edit-btn">✏️</button>
        <button className="delete-btn">🗑️</button>
      </div>
    </div>
  );
}

export default TaskCard;