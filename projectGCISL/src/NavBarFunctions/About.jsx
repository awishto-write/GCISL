import React, { useState } from 'react';
import './About.css';

const faqData = [
  {
    id: "item-4",
    question: "What is GCISL",
    answer:
      "GCISL is .",
  },
  {
    id: "item-1",
    question: "What exactly does this organization do?",
    answer:
      "NSBE provides resources and mentorship to students interested in STEM. We host workshops, engineering and networking events throughout the year to help our members learn and grow their skillset. We also attend a national conference during the Spring semester.",
  },
  {
    id: "item-5",
    question: "Do I need to be a certain age to join?",
    answer:
      "No, you don't need to be in an engineering major to join our club. We welcome students from all majors. While we target students in STEM fields, every member is an important part of our community.",
  },
  {
    id: "item-3",
    question: "How do I join GCISL",
    answer:
      "All you need to do is come to our meetings! We welcome all students to join us at our meetings, and we encourage you to bring a friend.",
  },
  {
    id: "item-2",
    question: "When are the meetings?",
    answer:
      "We meet once every two weeks on Wednesdays at 6:00 PM. The location of the meeting is in person at the Smith Center for Undergraduate Education (CUE) Room 218.",
  },
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
    // '/path/to/image1.jpg',
  `${process.env.PUBLIC_URL}/aboutUs1.jpeg`,
  `${process.env.PUBLIC_URL}/aboutUs2.jpeg`,
  // `${process.env.PUBLIC_URL}/darcie_Image.png`,
  // `${process.env.PUBLIC_URL}/cory_Image.png`,
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