import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './ClassComponents/Navbar';
import HeroSection from './ClassComponents/HeroSection';
import Footer from './ClassComponents/Footer';
import Contact from './NavBarFunctions/Contact';
import About from './NavBarFunctions/About';
import Login from './NavBarFunctions/Login';
import Register from './NavBarFunctions/Register';
import GetInvolved from './NavBarFunctions/GetInvolved';
import AdminDashboard from './DashboardFunctions/AdminDashboard';
import VolunteerDashboard from './DashboardFunctions/VolunteerDashboard';
import ProtectedRoute from './ProtectedRoute';
import VolunteerList from './ClassComponents/VolunteerList';
import Logs from './ClassComponents/Logs';
import Reports from './ClassComponents/Reports';
import './App.css';


function AppContent() {
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
      {/* Conditionally render the Navbar based on the current path */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
         <Route path="/volunteer-dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/volunteerlist" element={<VolunteerList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logs" element={<Logs/>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}