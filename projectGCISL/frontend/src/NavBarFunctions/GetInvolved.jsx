import React from 'react';
import './GetInvolved.css'; // Create and link this CSS file

const GetInvolved = () => {
  return (
    <div className="get-involved">
      <h1>Get Involved Now!</h1>
      <p className="welcome-text">Welcome! Discover how you can get involved with WSU via GCI in various impactful ways.</p>
      <div className="involvement-options">
        <div className="involvement-card">
          <img src="/research_involvement.png" alt="Research Involvement" />
          <h2> <a href="https://hd.wsu.edu/research-labs/gather-lab/" target="_blank" rel="noopener noreferrer">
              Research Involvement </a>
          </h2>

          <p>
            Contribute to groundbreaking research that shapes the future. Join us in our research efforts as we explore the profound impact of an aging population on our society.  
          </p>
          <p>
            WSU researchers are dedicated to understanding how we can support individuals to age with dignity, keep older adults engaged and connected, foster family relationships across generations, and design services that best support aging individuals and their families. 
          </p>
          <p>
            Your insights and participation are invaluable in advancing our knowledge and making meaningful progress in this crucial area. If you're curious about our current research projects, you can check them out 
            <a href="https://hd.wsu.edu/research-labs/gather-lab/" target="_blank" rel="noopener noreferrer"> here</a>.
          </p>
          <a href={`/contact?reason=Research%20Involvement`} target="_blank" rel="noopener noreferrer">
              <button aria-label="Learn more about Research Involvement">Learn More</button>
          </a>
        </div>

        <div className="involvement-card">
          <img src="/education_mentorship.png" alt="Education & Mentorship" />
          <h2>Education & Mentorship</h2>
          <p>
            Help educate and mentor the next generation of leaders. WSU’s commitment to creating a world-class learning experience emphasizes the importance of intergenerational connections and lifelong learning.  
          </p>
          <p>
            By getting involved with gciConnect!, you can share your unique skills and knowledge with students and faculty, participate in mentorship programs, and engage in projects that enhance student learning and keep you connected with the campus community. 
          </p>
          <p>
            We encourage you to leverage your expertise and contribute to the education and mentorship opportunities available through gciConnect!.
          </p>
          <a href={`/contact?reason=Education%20%26%20Mentorship`} target="_blank" rel="noopener noreferrer">
              <button aria-label="Learn more about Education & Mentorship">Learn More</button>
          </a>
        </div>

        <div className="involvement-card">
          <img src="/outreach_charitable_contruibutions.png" alt="Outreach & Charitable Contributions" />
          <h2>Outreach & Charitable Contributions</h2>
          <p>
            Engage in outreach and contribute to meaningful causes. Engaging with community partners to address the evolving needs of our society is a key goal for WSU and the Granger Cobb Institute for Senior Living. 
          </p>
          <p>
            Stay informed about our latest initiatives, research, and projects. You can also support experiential learning and create scholarships to help students pursuing careers that benefit older adults and their families. 
          </p>
          <p>
            Your involvement and contributions are essential in driving positive change and supporting our mission. Contact us for more information or to get involved, and thank you for your commitment to making a difference.
          </p>
          <a href={`/contact?reason=Outreach%20%26%20Charitable%20Contributions`} target="_blank" rel="noopener noreferrer">
              <button aria-label="Learn more about Outreach & Charitable Contributions">Learn More</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default GetInvolved;