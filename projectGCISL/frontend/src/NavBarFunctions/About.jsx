import React, { useState } from 'react';
import './About.css';

const faqData = [
  {
    id: "item-4",
    question: "How does the Granger Cobb Institute advance senior living?",
    answer: "Through education, research, and collaboration."
  },
  {
    id: "item-1",
    question: "Are events organized to connect students and industry leaders?",
    answer: "Yes, forums are planned to foster discussions and connections."
  },
  {
    id: "item-5",
    question: "What does the institute do to improve life for older adults?",
    answer: "It runs initiatives to enhance wellness and care."
  },
  {
    id: "item-3",
    question: "How are hospitality principles used in senior living education?",
    answer: "By blending hospitality with senior care management."
  },
  {
    id: "item-2",
    question: "What are the institute’s goals for the senior living industry?",
    answer: "To drive innovation and improve industry standards."
  }
];

// Accordion Component
const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-section">
      {faqData.map((item, index) => (
        <div key={item.id} className="faq-item">
          <div
            className={`faq-question ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            {item.question}
            <span className="dropdown-icon">{activeIndex === index ? '▲' : '▼'}</span>
          </div>
          {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
        </div>
      ))}
    </div>
  );
};

// Image Carousel Component
const images = [
  `${process.env.PUBLIC_URL}/aboutUs2.jpeg`,
  `${process.env.PUBLIC_URL}/aboutUs3.jpg`,
  `${process.env.PUBLIC_URL}/aboutUs4.webp`,
  `${process.env.PUBLIC_URL}/aboutUs5.jpg`,
  `${process.env.PUBLIC_URL}/aboutUs6.jpg`,
];

const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="image-carousel">
      <img src={images[currentImageIndex]} alt="Carousel" />
      <button onClick={prevSlide} className="carousel-arrow left-arrow">◀</button>
      <button onClick={nextSlide} className="carousel-arrow right-arrow">▶</button>
    </div>
  );
};

// Main About Page Component
export default function About(){
  return (
    <div className="about-page">
      {/* Add spacing between navbar and FAQ */}
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions (FAQ)</h1>
        <Accordion />
      </div>

      {/* Stylish Separator */}
      <div className="section-separator">
        <h2 className="peek-title">Take a Peek</h2>
        <div className="separator-line"></div>
        <h3 className="gallery-title">At the Picture Gallery</h3>
      </div>

      {/* Image Gallery */}
      <div className="image-gallery">
        <ImageCarousel />
      </div>
    </div>
  );
};
