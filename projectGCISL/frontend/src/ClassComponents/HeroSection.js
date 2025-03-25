import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "Promote senior living management as a fulfilling and impactful career path for students.",
    "Collaborate with industry leaders to uphold and advance evidence-based practices.",
    "Enhance the quality of life for older adults in Washington and beyond."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Welcome to <span>gciConnect!</span>
        </h1>
        <p>
          gciConnect! is part of Washington State University's (WSU) Granger Cobb Institute for Senior Living (gci)
          and serves as an innovative resource to keep the community informed and connected to WSU.
        </p>

        {/* Slideshow Section */}
        <div className="slideshow">
          {slides.map((slide, index) => (
            <p
              key={index}
              className={`slideshow-text ${index === currentSlide ? "active" : ""}`}
            >
              {slide}
            </p>
          ))}
        </div>
      </div>
      <div className="hero-image">
        <img src="/AdobeStock_761709458.jpeg" alt="Senior Living Example" />
      </div>
    </section>
  );
};

export default HeroSection;