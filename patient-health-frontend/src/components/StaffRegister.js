// src/components/StaffRegister.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthForm from './AuthForm';

export default function StaffRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Register
    await api.post('register/staff/', { username, email, password });

    // Login
    const loginResponse = await api.post('token/', { username, password });
    const { access } = loginResponse.data;

    localStorage.setItem('access_token', access);
    // ✅ No role saving

    // Go to dashboard
    navigate('/staff/dashboard');
  } catch (err) {
    setError('Registration failed');
  }
};

  return (
    <AuthForm
      title="Register as Staff"
      onSubmit={handleSubmit}
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      showEmail={true}
      buttonText="Create Account"
      linkText="Already have an account?"
      linkAction={() => navigate('/login/staff')}
      linkLabel="Login"
    />
  );
}