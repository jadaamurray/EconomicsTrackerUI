import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/Login'; 
import Dashboard from './pages/Dashboard.jsx';
import { useApp } from './context/AppContext.jsx';

function App() {
  return (
    < Routes >
    <Route path="/login" element={<LoginPage />} />
    <Route 
      path="/dashboard" 
      element={
        localStorage.getItem('authToken') ? 
          <Dashboard /> : 
          <Navigate to="/login" />
      } 
    />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes >
  );
}

export default App
