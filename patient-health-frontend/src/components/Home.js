// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>🏥 Hospital Portal</h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        Are you a Patient or Staff member?
      </p>

      <div style={{ display: 'flex', gap: '30px' }}>
        <button
          onClick={() => navigate('/login/patient')}
          style={buttonStyle}
        >
          👤 I'm a Patient
        </button>
        <button
          onClick={() => navigate('/login/staff')}
          style={{ ...buttonStyle, backgroundColor: '#d32f2f' }}
        >
          👨‍⚕️ I'm Staff
        </button>
      </div>

      <div style={{ marginTop: '40px', fontSize: '16px' }}>
        <p>New here?</p>
        <button
          onClick={() => navigate('/register/patient')}
          style={{ ...linkStyle, marginRight: '15px' }}
        >
          Register as Patient
        </button>
        <button
          onClick={() => navigate('/register/staff')}
          style={linkStyle}
        >
          Register as Staff
        </button>
      </div>
    </div>
  );
}

// ✅ Styles (defined below the component)
const buttonStyle = {
  padding: '16px 32px',
  fontSize: '18px',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: '#0277bd',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'transform 0.2s',
};

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#bbdefb',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '16px',
};