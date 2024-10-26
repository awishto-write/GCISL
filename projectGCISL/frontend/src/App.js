import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router, Routes, and Route
import Navbar from './ClassComponents/Navbar'; // Assuming the Navbar component is inside a components folder
import HeroSection from './ClassComponents/HeroSection';
import Footer from './ClassComponents/Footer';
import Contact from './NavBarFunctions/Contact';  // Assuming Contact component exists
import About from './NavBarFunctions/About'; 
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import GetInvolved from './NavBarFunctions/GetInvolved';
import AdminDashboard from './DashboardFunctions/AdminDashboard';
import VolunteerDashboard from './DashboardFunctions/VolunteerDashboard';
import ProtectedRoute from './ProtectedRoute';  // Make sure this is implemented correctly
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <Navbar />
//       <HeroSection />
//       <Footer />
//       {/* Your other components */}
//     </div>
//   );
// }

// export default App;

export default function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* <Routes>
        </Routes> */}
        {/* Define routes for different pages */}
        {/* <HeroSection /> */}
        <Routes>
           {/* Home Route */}
          <Route path="/" element={<HeroSection />} />  
          {/* <Route path="/home" element={<HeroSection />} />    */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          {/* <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} /> */}
          <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}