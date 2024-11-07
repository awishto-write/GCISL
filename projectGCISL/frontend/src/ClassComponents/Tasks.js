import React from 'react';
import TaskCard from './TaskCard';

function Tasks() {
  const taskList = [
    
  ];

  return (
    <div className="tasks">
      <h3>TASKS</h3>
      <button className="create-task-btn">+ Create Task</button>
      <div className="task-list">
        {taskList.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default Tasks;