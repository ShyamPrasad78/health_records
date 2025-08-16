// src/components/StaffLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from './AuthForm'; // ✅ Import

export default function StaffLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
// StaffLogin.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('token/', { username, password });
    const { access } = response.data; // ✅ Only need access token

    localStorage.setItem('access_token', access);
    // ✅ No need to save role

    // ✅ Go directly to staff dashboard
    navigate('/staff/dashboard');
  } catch (err) {
    setError('Invalid credentials');
  }
};

  return (
    <AuthForm
      title="Staff Login"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      buttonText="Login"
      linkText="Don't have an account?"
      linkAction={() => navigate('/register/staff')}
      linkLabel="Register"
    />
  );
}