import React from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

function Reports() {
  return (
    <div>
      <TopNav />
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h1>Reports</h1>
          <p>This is the Reports page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
}

export default Reports;