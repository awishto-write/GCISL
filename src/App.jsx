import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import Navbar from './ClassComponents/Navbar';  // Navbar component
import Footer from './ClassComponents/Footer';  // Footer component
import Contact from './NavBarFunctions/Contact';  // Assuming Contact component exists
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import GetInvolved from './NavBarFunctions/GetInvolved';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* Define routes for different pages */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            <div>
              <p>Everyone is aging! We are living longer than ever before for the first time in the history of the world!
                The population shift will change our society and WSU researchers are actively working to answer the many specific questions about how we will adapt, such as:
                • How can we support people to age with dignity?
                • How can older adults stay engaged and connected?
                • How will family relationships between older and younger generations be affected by increased longevity?
                • How will we design and deliver services that best support older adults and their families?
                • How will our communities adapt to an aging population?
                WSU researchers may need your opinion and perspective in addressing these research questions. Your participation in research can help others and contributes to advancing knowledge about aging. If you’d like to explore some of the current research labs focused on aging research, check here.
              </p>
            </div>
          } />

          {/* Contact Page Route */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/get-involved" element={<GetInvolved />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}