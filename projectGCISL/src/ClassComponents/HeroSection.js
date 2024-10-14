import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to <span>gciConnect!</span></h1>
        <p>gciConnect! is part of Washington State University's (WSU) Granger Cobb Institute for Senior Living (GCI) and serves as an innovative resource to keep the community informed and connected to WSU.</p>

        <p>
        WSU is one of the few universities in the country offering programs designed to:
        </p>
        <ul>
          <li>Promote senior living management as a fulfilling and impactful career path for students.</li>
          <li>Collaborate with industry leaders to uphold and advance evidence-based practices</li>
          <li>Enhance the quality of life for older adults in Washington and beyond</li>
        </ul>
      </div>
      <div className="hero-image">
        <img src="/AdobeStock_761709458.jpeg" alt="Senior Living Example" />
      </div>
    </section>
  );
};

export default HeroSection;