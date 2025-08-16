import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Inject hospital-themed styles
const injectMedicalStyles = () => {
  const styleId = 'patient-record-styles';
  if (document.getElementById(styleId)) return;

  const styles = `
    .medical-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1b5e20;
      overflow: hidden;
    }

    .medical-bg-pattern {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image:
        radial-gradient(circle at 10% 20%, rgba(56, 142, 60, 0.08)),
        radial-gradient(circle at 90% 80%, rgba(56, 142, 60, 0.08));
      opacity: 0.6;
      z-index: 0;
    }

    .medical-content {
      position: relative;
      z-index: 1;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
      height: 100%;
      overflow-y: auto;
    }

    .record-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .record-header h1 {
      font-size: 32px;
      color: #1b5e20;
      margin: 0 0 8px 0;
    }

    .record-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(56, 142, 60, 0.15);
      padding: 24px;
      margin-bottom: 20px;
      border-left: 5px solid #43a047;
    }

    .record-card h3 {
      margin: 0 0 12px 0;
      color: #2e7d32;
      font-size: 20px;
    }

    .record-info {
      font-size: 16px;
      line-height: 1.7;
      color: #2e7d32;
    }

    .label {
      font-weight: 600;
      color: #1b5e20;
    }

    .error, .loading {
      text-align: center;
      font-size: 18px;
      color: #c62828;
      padding: 40px;
    }

    .loading::after {
      content: '...';
      animation: blink 1.5s steps(3, end) infinite;
    }

    @keyframes blink {
      0%, 80%, 100% { content: '.'; }
      26.66% { content: '..'; }
      53.33% { content: '...'; }
    }

    /* Form Styles */
    .add-record-form {
      display: grid;
      gap: 12px;
    }

    .input-wrapper {
      position: relative;
      margin-bottom: 20px;
    }

    .input-wrapper input,
    .input-wrapper textarea {
      width: 100%;
    }

    .input-wrapper input:focus + label,
    .input-wrapper textarea:focus + label,
    .input-wrapper input:not(:placeholder-shown) + label,
    .input-wrapper textarea:not(:placeholder-shown) + label {
      top: -10px;
      left: 8px;
      font-size: 12px;
      color: #2e7d32;
      font-weight: bold;
    }

    .add-record-form button {
      padding: 12px;
      background-color: #43a047;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
      transition: all 0.3s ease;
    }

    .add-record-form button:disabled {
      background-color: #81c784;
      cursor: not-allowed;
    }

    .delete-btn {
      background-color: #e53935;
      color: white;
      border: none;
      padding: 6px 10px;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 10px;
    }

    .delete-btn:hover {
      background-color: #c62828;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(15deg); }
      75% { transform: rotate(-15deg); }
    }

    @keyframes pulse {
      0% { opacity: 0; }
      50% { opacity: 0.3; }
      100% { opacity: 0; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
};

export default function PatientRecord() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null); // ✅ Fixed: Added missing state

  useEffect(() => {
    injectMedicalStyles();
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('patient-records/');
      console.log('Patient record response:', response.data);

      const data = Array.isArray(response.data) ? response.data : [response.data];
      setRecords(data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
      } else {
        setError('Failed to load records. Please try again later.');
      }
    }
  };

  const handleAddRecord = async (newRecord) => {
    setIsAdding(true);
    try {
      const response = await api.post('patient-records/', newRecord);
      console.log('Record created:', response.data);

      // Add new record and trigger pulse
      setRecords((prev) => [response.data, ...prev]);
      setLastAddedId(response.data.id); // Highlight new record
      setTimeout(() => setLastAddedId(null), 1000); // Remove pulse after animation

      // Optional: Success feedback
      // alert('✅ Record added successfully!');
    } catch (err) {
      console.error('Error adding record:', err.response?.data || err.message);
      alert('❌ Failed to add record:\n' + (err.response?.data?.detail || err.message));
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const full_name = formData.get('full_name').trim();
    const age = Number(formData.get('age'));
    const medical_history = formData.get('medical_history').trim();

    if (!full_name || !age || !medical_history) {
      alert('Please fill in all fields.');
      return;
    }
    if (age < 1 || age > 120) {
      alert('Please enter a valid age (1-120).');
      return;
    }

    handleAddRecord({ full_name, age, medical_history });
    e.target.reset();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');
    if (!confirmed) return;

    try {
      await api.delete(`patient-records/${id}/`);
      setRecords((prev) => prev.filter((record) => record.id !== id));
      alert('🗑️ Record deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('access_token');
        window.location.href = '/';
      } else if (err.response?.status === 404) {
        alert('Record not found.');
      } else {
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="medical-container">
        <div className="medical-bg-pattern"></div>
        <div className="medical-content">
          <p className="error">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container">
      <div className="medical-bg-pattern"></div>
      <div className="medical-content">
        {/* Page Header */}
        <div className="record-header">
          <h1>🩺 Patient Medical Records</h1>
        </div>

        {/* Add New Record Form */}
        <div
          className="record-card"
          style={{
            backgroundColor: '#f1f8e9',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h3
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                animation: 'wave 1.5s infinite',
              }}
            >
              ✍️
            </span>
            Add New Patient Record
          </h3>

          <form onSubmit={handleSubmit} className="add-record-form">
            {/* Full Name */}
            <div className="input-wrapper">
              <input
                name="full_name"
                type="text"
                placeholder=" "
                required
                autoComplete="off"
                style={{
                  padding: '14px',
                  border: '2px solid #c8e6c9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#43a047')}
                onBlur={(e) => (e.target.style.borderColor = '#c8e6c9')}
              />
              <label style={{
                position: 'absolute',
                left: '14px',
                top: '14px',
                color: '#666',
                fontSize: '16px',
                transition: '0.3s ease',
                pointerEvents: 'none',
                background: 'white',
                padding: '0 4px',
              }}>
                Full Name
              </label>
            </div>

            {/* Age */}
            <div className="input-wrapper">
              <input
                name="age"
                type="number"
                placeholder=" "
                required
                min="1"
                max="120"
                style={{
                  padding: '14px',
                  border: '2px solid #c8e6c9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#43a047')}
                onBlur={(e) => (e.target.style.borderColor = '#c8e6c9')}
              />
              <label style={{
                position: 'absolute',
                left: '14px',
                top: '14px',
                color: '#666',
                fontSize: '16px',
                transition: '0.3s ease',
                pointerEvents: 'none',
                background: 'white',
                padding: '0 4px',
              }}>
                Age
              </label>
            </div>

            {/* Medical History */}
            <div className="input-wrapper">
              <textarea
                name="medical_history"
                placeholder=" "
                required
                rows="3"
                style={{
                  padding: '14px',
                  border: '2px solid #c8e6c9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  resize: 'vertical',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#43a047')}
                onBlur={(e) => (e.target.style.borderColor = '#c8e6c9')}
              />
              <label style={{
                position: 'absolute',
                left: '14px',
                top: '14px',
                color: '#666',
                fontSize: '16px',
                transition: '0.3s ease',
                pointerEvents: 'none',
                background: 'white',
                padding: '0 4px',
              }}>
                Medical History
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAdding}
              style={{
                padding: '14px',
                backgroundColor: '#43a047',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isAdding ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                transform: isAdding ? 'scale(0.98)' : 'scale(1)',
                boxShadow: '0 4px 10px rgba(67, 160, 71, 0.2)',
              }}
              onMouseEnter={(e) => !isAdding && (e.target.style.backgroundColor = '#2e7d32')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#43a047')}
            >
              {isAdding ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderLeftColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                ></span>
              ) : (
                '💾 Save Record'
              )}
            </button>
          </form>

          {/* Success Pulse Overlay */}
          {lastAddedId && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                borderRadius: '12px',
                pointerEvents: 'none',
                animation: 'pulse 1s ease-out',
              }}
            ></div>
          )}
        </div>

        {/* Display Records */}
        {records.length === 0 ? (
          <p className="loading">No records found. Add one above!</p>
        ) : (
          records.map((record) => (
            <div className="record-card" key={record.id}>
              <h3>{record.full_name} (Age: {record.age})</h3>
              <div className="record-info">
                <p>
                  <span className="label">Medical History:</span>{' '}
                  {record.medical_history || 'N/A'}
                </p>
                <p>
                  <span className="label">Created On:</span>{' '}
                  {new Date(record.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => handleDelete(record.id)} className="delete-btn">
                🗑️ Delete Record
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}