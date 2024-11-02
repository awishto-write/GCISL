import React from 'react';
import Sidebar from '../ClassComponents/Sidebar';
import TopNav from '../ClassComponents/TopNav'; // Confirm the import path
import Tasks from '../ClassComponents/Tasks';

function VolunteerDashboard() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <TopNav />  {/* Ensure TopNav is included here */}
        <Tasks />
      </div>
    </div>
  );
}

export default VolunteerDashboard;