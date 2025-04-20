import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/Login'; 
import Dashboard from './pages/Dashboard.jsx';
import Header from './components/Header';
import { useApp } from './context/AppContext.jsx';

// Pages where header should be hidden
const NO_HEADER_PATHS = ['/login', '/register'];

function App() {
  const { isAuthenticated } = useAuth(); // Get auth state from context
  const location = useLocation();

   // Check if header should be visible
   const showHeader = !NO_HEADER_PATHS.includes(location.pathname);
  return (
    <>
    {showHeader && <Header />}
    <main>
    < Routes >
    <Route path="/login" element={<LoginPage />} />
    <Route 
      path="/dashboard" 
      element={
        localStorage.getItem('authToken') ? 
          <Dashboard /> : 
          <Navigate to="/login" state={{ from: location }} replace />
      } 
    />
    <Route path="*" 
    element={isAuthenticated ? "/dashboard" : "/login"} replace
     />
  </Routes >
  </main>
  </>
  );
}

export default App;
