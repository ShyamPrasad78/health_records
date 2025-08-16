// src/components/PatientRecordForm.jsx
import React, { useState } from 'react';
import api from '../services/api';

export default function PatientRecordForm({ onRecordAdded }) {
  const [full_name, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [medical_history, setMedicalHistory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('patient-records/', {
        full_name,
        age: Number(age),
        medical_history,
      });
      alert('✅ Record added!');
      if (onRecordAdded) onRecordAdded(response.data);
      // Reset form
      setFullName('');
      setAge('');
      setMedicalHistory('');
    } catch (err) {
      alert('❌ Failed to add record');
    }
  };

  return (
    <div style={{ marginBottom: '40px', padding: '20px', background: '#f1f8e9', borderRadius: '10px' }}>
      <h3>➕ Add Patient Record</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <input
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Medical History"
          value={medical_history}
          onChange={(e) => setMedicalHistory(e.target.value)}
          rows="3"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Save Record
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #c8e6c9',
  borderRadius: '6px',
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#43a047',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};