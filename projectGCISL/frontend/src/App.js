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
import Research from './NavBarFunctions/Research';
import AdminDashboard from './DashboardFunctions/AdminDashboard';
import Volunteers from './DashboardFunctions/Volunteers';
import Tasks from './DashboardFunctions/Tasks';
import Logs from './DashboardFunctions/Logs';
import Logout from './DashboardFunctions/Logout';
import VolunteerDashboard from './DashboardFunctions/VolunteerDashboard';
import ProtectedRoute from './ProtectedRoute';
import HeroSection from './ClassComponents/HeroSection';
import VolunteerSidebar from './ClassComponents/VolunteerSidebar';
import VolunteerList from './DashboardFunctions/VolunteerList';
import VolunteerTasks from './DashboardFunctions/VolunteerTasks';
import './App.css'; // Check

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [taskCount, setTaskCount] = useState(() => {
    const savedCount = localStorage.getItem('taskCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/user`, { 
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

  useEffect(() => {
    const fetchTaskCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/volunteer-task-count`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTaskCount(data.count);
          localStorage.setItem('taskCount', data.count);
        } else {
          console.error('Error fetching task count:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching task count:', error);
      }
    };

    fetchTaskCount();
  }, []);

  const isAdminPage = location.pathname === '/admin-dashboard' || location.pathname.startsWith('/dashboard');
  const isVolunteerPage = location.pathname === '/volunteer-dashboard' || location.pathname.startsWith('/vdashboard');

  return (
    <div className="App">
      {isAdminPage ? (
        <>
          <AdminNavBar role="ADMIN" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
          <SideBar />
        </>
      ) : isVolunteerPage ? (
        <>
          <AdminNavBar role="VOLUNTEER" firstName={user.firstName} lastInitial={user.lastName.charAt(0)} />
          <VolunteerSidebar taskCount={taskCount}/>
        </>
      ) : (
        <>
          <Navbar />
          <Footer />
        </>
      )}   

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/research" element={<Research />} />
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/volunteers" element={<ProtectedRoute><Volunteers user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/tasks" element={<ProtectedRoute><Tasks user={user} /></ProtectedRoute>} />
        <Route path="/dashboard/logs" element={<ProtectedRoute><Logs user={user} /></ProtectedRoute>} />
        {/* Volunteer Routes */}
        {/* Don't put user in VolunteerDashboard because it affects the task user anme for the admin */}
        <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/vdashboard/volunteers" element={<ProtectedRoute><VolunteerList user={user} /></ProtectedRoute>} />
        <Route path="/vdashboard/tasks" element={<ProtectedRoute><VolunteerTasks user={user} /></ProtectedRoute>} />
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
