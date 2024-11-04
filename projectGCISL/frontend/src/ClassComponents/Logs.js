import React from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

function LogsPage() {
  return (
    <div>
      <TopNav />
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h1>Logs</h1>
          <p>This is the Logs page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;