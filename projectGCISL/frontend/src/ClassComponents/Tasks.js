import React from 'react';
import TaskCard from './TaskCard';

function Tasks() {
  const taskList = [
    {
      id: 1,
      title: 'Assist For Research',
      duration: 'October 22, 2024 - October 30, 2024',
      linkText: 'Download File: Registration Form.pdf',
      linkUrl: '#',
      color: 'teal'
    },
    {
      id: 2,
      title: 'Conduct Survey for Health Data',
      duration: 'October 15, 2024 - November 15, 2024',
      linkText: 'Survey Link',
      linkUrl: '#',
      color: 'red'
    },
    {
      id: 3,
      title: 'Orientation and Training',
      duration: 'November 22, 2022 - November 25, 2022',
      color: 'red'
    }
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