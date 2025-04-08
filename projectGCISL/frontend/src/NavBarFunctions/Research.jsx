import React from 'react';
import './Research.css'; 

const researchData = [
  {
    title: "Neuropsychology and Aging Laboratory",
    description: "The Neuropsychology and Aging Laboratory focuses on understanding cognitive aging, brain function, and neurodegenerative diseases. The research explores interventions to promote cognitive health in older adults.",
    link: "https://labs.wsu.edu/neuropsychology-aging/",
    image: "/neuroAgingLab.png", 
  },
  {
    title: "GATHER (Generating Aging and Translational Health Equity Research)",
    description: "GATHER is dedicated to addressing health equity for aging populations by conducting research on social determinants of health and improving healthcare accessibility for older adults.",
    link: "https://hd.wsu.edu/research-labs/gather-lab/",
    image: "/gatherLab.png",
  },
  {
    // title: "[Future Research Title]",
    title: "[Coming Soon]",
    description: "Information about future research projects will be available soon. Stay tuned for updates.",
    link: "#", // No real link yet
    image: "/comingSoon.png", 
  },
];

const Research = () => {
  return (
    <div className="research">
      <h1>Welcome to the Current Active Research at WSU</h1>

      <table className="research-table">
        <tbody>
          {researchData.map((item, index) => (
            <tr key={index}>
              {/* Image Column */}
              <td className="research-image-cell">
                <img src={item.image} alt={item.title} className="research-image" />
              </td>

              {/* Title Column */}
              <td className="research-title-cell">
                <h2 className="research-title">{item.title}</h2>
              </td>

              {/* Description + Link Column */}
              <td className="research-info-cell">
                <p>{item.description}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Research;
