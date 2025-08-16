import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Inject hospital-themed styles
const injectHospitalStyles = () => {
  const styleId = 'hospital-profile-styles';
  if (document.getElementById(styleId)) return;

  const styles = `
    .hospital-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #0d47a1;
      overflow: hidden;
    }

    /* Subtle cross pattern background */
    .hospital-bg-pattern {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image:
        radial-gradient(circle at 20% 30%, rgba(25, 118, 210, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(25, 118, 210, 0.05) 0%, transparent 20%),
        repeating-conic-gradient(
          from 0deg,
          transparent 0deg 90deg,
          rgba(25, 118, 210, 0.03) 90deg 180deg
        );
      z-index: 0;
      pointer-events: none;
    }

    .hospital-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
    }

    .profile-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 96, 204, 0.15);
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
      border-left: 6px solid #0277bd;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .profile-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 96, 204, 0.2);
    }

    .hospital-icon {
      font-size: 60px;
      color: #d32f2f;
      margin-bottom: 16px;
    }

    .profile-card h2 {
      margin: 0 0 16px 0;
      color: #0d47a1;
      font-size: 28px;
      font-weight: 600;
    }

    .profile-info {
      font-size: 18px;
      line-height: 1.8;
      color: #1565c0;
      text-align: left;
    }

    .profile-info p {
      margin: 10px 0;
    }

    .profile-label {
      font-weight: 600;
      color: #0d47a1;
    }

    .loading, .error {
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

    @media (max-width: 600px) {
      .profile-card {
        padding: 30px;
        margin: 10px;
      }
      .profile-card h2 {
        font-size: 24px;
      }
      .profile-info {
        font-size: 16px;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  // Inject hospital styles once
  useEffect(() => {
    injectHospitalStyles();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('profile/');
        console.log('Profile response:', response.data);
        setProfile(response.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  if (error)
    return (
      <div className="hospital-container">
        <div className="hospital-bg-pattern"></div>
        <div className="hospital-content">
          <p className="error">❌ {error}</p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="hospital-container">
        <div className="hospital-bg-pattern"></div>
        <div className="hospital-content">
          <p className="loading">Loading your medical profile</p>
        </div>
      </div>
    );

  return (
    <div className="hospital-container">
      {/* Decorative Background */}
      <div className="hospital-bg-pattern"></div>

      {/* Main Content */}
      <div className="hospital-content">
        <div className="profile-card">
          {/* Medical Icon */}
          <div className="hospital-icon">🏥</div>
          <h2>Patient Profile</h2>

          <div className="profile-info">
            <p>
              <span className="profile-label">Name:</span>{' '}
              {profile.full_name || profile.username || 'N/A'}
            </p>
            <p>
              <span className="profile-label">Username:</span>{' '}
              {profile.username || 'N/A'}
            </p>
            <p>
              <span className="profile-label">Email:</span>{' '}
              {profile.email || 'N/A'}
            </p>
            <p>
              <span className="profile-label">Role:</span>{' '}
              {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Patient'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* Add this button inside your return JSX */}
<button
  onClick={() => (window.location.href = '/record')}
  style={{
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '600',
  }}
>
  📄 View Medical Record
</button>