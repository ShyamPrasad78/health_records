// src/components/StaffDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PatientRecordForm from './PatientRecordForm'; // Make sure this exists

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

export default function StaffDashboard() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('patient-records/');
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await api.delete(`patient-records/${id}/`);
        setRecords(records.filter((r) => r.id !== id));
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1>👨‍⚕️ Staff Dashboard</h1>
        <button onClick={handleLogout} style={logoutStyle}>
          🔐 Logout
        </button>
      </header>

      <PatientRecordForm onRecordAdded={fetchRecords} />

      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        records.map((rec) => (
          <div key={rec.id} style={cardStyle}>
            <h3>{rec.full_name} (Age: {rec.age})</h3>
            <p><strong>History:</strong> {rec.medical_history}</p>
            <button
              onClick={() => handleDelete(rec.id)}
              style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px' }}
            >
              🗑️ Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}