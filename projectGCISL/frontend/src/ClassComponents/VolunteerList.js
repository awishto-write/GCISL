import React, { useEffect, useState } from 'react';
import TopNav from './TopNav'; // Make sure the path is correct
import Sidebar from './Sidebar'; // Make sure the path is correct

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);

  useEffect(() => {
    // Fetch volunteers from the backend
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/volunteers');
        const data = await response.json();
        
        setVolunteers(data); // Set the complete list of volunteers
        setFilteredVolunteers(data); // Set the initial filtered list to display all volunteers
      } catch (error) {
        console.error('Failed to fetch volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  // Filter volunteers based on the search term
  useEffect(() => {
    const results = volunteers.filter(volunteer =>
      `${volunteer.firstName} ${volunteer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVolunteers(results);
  }, [searchTerm, volunteers]);

  return (
    <div>
      <TopNav /> {/* Render TopNav at the top */}
      <div className="dashboard">
        <Sidebar /> {/* Render Sidebar on the left */}
        <div className="content volunteer-list">
          <h2>Volunteer List</h2>
          <input
            type="text"
            placeholder="Search for a volunteer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <ul>
            {filteredVolunteers.map((volunteer, index) => (
              <li key={index} className="volunteer-item">
                <strong>{volunteer.firstName} {volunteer.lastName}</strong>
                <p>{volunteer.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VolunteerList;