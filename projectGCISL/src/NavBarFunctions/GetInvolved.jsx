import React from 'react';
import './GetInvolved.css'; // Create and link this CSS file

const GetInvolved = () => {
  return (
    <div className="get-involved">
      <h1>Get Involved Now!</h1>
      <p className="welcome-text">Welcome! Discover how you can get involved with WSU via GCI in various impactful ways.</p>
      <div className="involvement-options">
        <div className="involvement-card">
          <img src="/research_placeholder.png" alt="Research Involvement" />
          <h2>Research Involvement</h2>
          <p>Contribute to groundbreaking research that shapes the future.</p>
          <a href="https://hd.wsu.edu/research-labs/gather-lab/" target="_blank" rel="noopener noreferrer">
            <button aria-label="Learn more about Research Involvement">Learn More</button>
          </a>
        </div>
        <div className="involvement-card">
          <img src="/research_placeholder.png" alt="Education & Mentorship" />
          <h2>Education & Mentorship</h2>
          <p>Help educate and mentor the next generation of leaders.</p>
          <a href="https://hd.wsu.edu/research-labs/gather-lab/" target="_blank" rel="noopener noreferrer"> {/* Update the link */}
            <button aria-label="Learn more about Research Involvement">Learn More</button>
          </a>
        </div>
        <div className="involvement-card">
          <img src="/research_placeholder.png" alt="Outreach & Charitable Contributions" />
          <h2>Outreach & Charitable Contributions</h2>
          <p>Engage in outreach and contribute to meaningful causes.</p>
          <a href="https://hd.wsu.edu/research-labs/gather-lab/" target="_blank" rel="noopener noreferrer"> {/* Update the link */}
            <button aria-label="Learn more about Research Involvement">Learn More</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default GetInvolved;