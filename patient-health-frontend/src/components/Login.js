import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Inject global styles via <style> tag (only once)
const injectStyles = () => {
  const styleId = 'login-component-styles';
  if (document.getElementById(styleId)) return;

  const styles = `
    .login-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
    }

    .background {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(45deg, #1e3c72, #2a5298);
      z-index: -1;
    }

    .background span {
      position: absolute;
      display: block;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s infinite ease-in-out;
      opacity: 0.6;
    }

    .background span:nth-child(1) { width: 80px; height: 80px; left: 20%; top: 30%; }
    .background span:nth-child(2) { width: 100px; height: 100px; left: 70%; top: 10%; animation-delay: 2s; }
    .background span:nth-child(3) { width: 40px; height: 40px; left: 40%; top: 70%; animation-delay: 4s; }
    .background span:nth-child(4) { width: 60px; height: 60px; left: 80%; top: 60%; animation-delay: 1s; }
    .background span:nth-child(5) { width: 50px; height: 50px; left: 10%; top: 80%; animation-delay: 3s; }

    @keyframes float {
      0% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
      100% { transform: translateY(0) rotate(360deg); }
    }

    .login-form {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 40px;
      width: 380px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      color: white;
      text-align: center;
    }

    .login-form h2 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
    }

    .login-form p {
      margin: 0 0 30px;
      font-size: 16px;
      opacity: 0.9;
    }

    .input-group {
      position: relative;
      margin-bottom: 25px;
    }

    .input-group input {
      width: 100%;
      padding: 14px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: white;
      font-size: 16px;
      outline: none;
      transition: 0.3s;
    }

    .input-group input:focus,
    .input-group input:valid {
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
    }

    .input-group label {
      position: absolute;
      left: 14px;
      top: 14px;
      color: rgba(255, 255, 255, 0.7);
      pointer-events: none;
      transition: 0.3s ease;
    }

    .input-group input:focus ~ label,
    .input-group input:valid ~ label {
      top: -10px;
      left: 10px;
      font-size: 12px;
      background: linear-gradient(45deg, #6a11cb, #2575fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      padding: 0 4px;
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      margin-top: 10px;
      background: linear-gradient(45deg, #6a11cb, #2575fc);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-btn:hover:not(:disabled) {
      background: linear-gradient(45deg, #5a00b8, #1a60e0);
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(37, 117, 252, 0.3);
    }

    .login-btn:disabled {
      background: #888;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: rgba(255, 0, 0, 0.2);
      color: #ffcccc;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      border: 1px solid rgba(255, 0, 0, 0.3);
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = styleId;
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inject styles once when component mounts
  useEffect(() => {
    injectStyles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      onLogin();
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError('Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>

          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
              disabled={isLoading}
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              disabled={isLoading}
            />
            <label>Password</label>
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? <span className="spinner"></span> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}