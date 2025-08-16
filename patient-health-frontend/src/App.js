// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import PatientLogin from './components/PatientLogin';
import StaffLogin from './components/StaffLogin';
import PatientRegister from './components/PatientRegister';
import StaffRegister from './components/StaffRegister';
import PatientDashboard from './components/PatientDashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        // App.js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register/patient" element={<PatientRegister />} />
  <Route path="/register/staff" element={<StaffRegister />} />
  <Route path="/login/patient" element={<PatientLogin />} />
  <Route path="/login/staff" element={<StaffLogin />} />

  {/* Protected Routes - No role checking */}
  <Route
    path="/patient/dashboard"
    element={
      <ProtectedRoute>
        <PatientDashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/staff/dashboard"
    element={
      <ProtectedRoute>
        <StaffDashboard />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<Navigate to="/" />} />
</Routes>
      </div>
    </Router>
  );
}

// App.js
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  // ✅ Just check if token exists
  if (!token) {
    return <Navigate to="/" />;
  }

  return children; // ✅ Show content if logged in
};
export default App;