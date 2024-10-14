import React from 'react';
import Navbar from './ClassComponents/Navbar'; // Assuming the Navbar component is inside a components folder
import HeroSection from './ClassComponents/HeroSection';
import Footer from './ClassComponents/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <Footer />
      {/* Your other components */}
    </div>
  );
}

export default App;