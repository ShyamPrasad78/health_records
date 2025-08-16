// src/components/PatientDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ✅ Define styles
const pageStyle = {
  minHeight: '100vh',
  padding: '40px',
  fontFamily: 'Arial, sans-serif',
  background: '#f0f4f8',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  padding: '10px 20px',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const logoutStyle = {
  padding: '8px 16px',
  backgroundColor: '#d32f2f',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cardStyle = {
  padding: '20px',
  background: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '20px',
};

export default function PatientDashboard() {
  const [record, setRecord] = useState(null);
  const navigate = useNavigate();

// PatientDashboard.js
useEffect(() => {
  const token = localStorage.getItem('access_token');
  console.log('🔑 Token:', token); // ✅ Check if token exists

  if (!token) {
    navigate('/'); // Redirect if no token
    return;
  }

  const fetchRecord = async () => {
    try {
      const response = await api.get('patient/my-record/');
      setRecord(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/');
      }
    }
  };

  fetchRecord();
}, [navigate]);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!record) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1>🩺 My Medical Record</h1>
        <button onClick={handleLogout} style={logoutStyle}>
          🔐 Logout
        </button>
      </header>

      <div style={cardStyle}>
        <p><strong>Name:</strong> {record.full_name}</p>
        <p><strong>Age:</strong> {record.age}</p>
        <p><strong>Medical History:</strong> {record.medical_history}</p>
      </div>
    </div>
  );
}