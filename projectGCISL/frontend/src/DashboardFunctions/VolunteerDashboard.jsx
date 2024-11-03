import React from 'react';
import Sidebar from '../ClassComponents/Sidebar';
import TopNav from '../ClassComponents/TopNav';
import Tasks from '../ClassComponents/Tasks';

function VolunteerDashboard() {
  return (
    <div className="dashboard">
      <TopNav />
      <div className="dashboard-content">
        <Sidebar />
        <div className="content">
          <Tasks />
        </div>
      </div>
    </div>
  );
}

export default VolunteerDashboard;