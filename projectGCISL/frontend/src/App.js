import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './ClassComponents/Navbar';
import Footer from './ClassComponents/Footer';
import AdminNavBar from './ClassComponents/AdminNavBar';
import SideBar from './ClassComponents/SideBar';
import Contact from './NavBarFunctions/Contact';
import About from './NavBarFunctions/About';
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import GetInvolved from './NavBarFunctions/GetInvolved';
import AdminDashboard from './DashboardFunctions/AdminDashboard';
import Volunteers from './DashboardFunctions/Volunteers';
import Tasks from './DashboardFunctions/Tasks';
import Researches from './DashboardFunctions/Researches';
import Logs from './DashboardFunctions/Logs';
import Logout from './DashboardFunctions/Logout';
import VolunteerDashboard from './DashboardFunctions/VolunteerDashboard';
import ProtectedRoute from './ProtectedRoute';
import HeroSection from './ClassComponents/HeroSection';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        //const apiUrl = 'http://localhost:5001/api/user'; //uncomment for local testing
        const apiUrl = 'https://gciconnect.vercel.app/api/user';
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.firstName, lastName: data.lastName });
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const isAdminPage = location.pathname === '/admin-dashboard' || location.pathname.startsWith('/dashboard');

  return (
    <div className="App">
      {isAdminPage ? (
        <>
          <AdminNavBar role="ADMIN" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
          <SideBar />
        </>
      ) : (
        <>
          <Navbar />
          <Footer />
        </>
      )}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard user={user} /></ProtectedRoute>} />
        <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/volunteers" element={<ProtectedRoute><Volunteers user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/researches" element={<ProtectedRoute><Researches user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/logs" element={<ProtectedRoute><Logs user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/logout" element={<ProtectedRoute><Logout user={user} /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}