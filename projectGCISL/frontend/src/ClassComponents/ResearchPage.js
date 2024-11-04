import React from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

function ResearchPage() {
  return (
    <div>
      <TopNav />
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          <h1>Researches</h1>
          <p>This is the Researches page. Content will be added here soon.</p>
        </div>
      </div>
    </div>
  );
}

export default ResearchPage;