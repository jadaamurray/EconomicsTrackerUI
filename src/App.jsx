import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import LoginPage from './pages/Login.jsx'; 
import Dashboard from './pages/Dashboard.jsx';
import RegionsPage from './pages/Regions.jsx';
import IndicatorsPage from './pages/Indicators.jsx';
import AdminPage from './pages/Admin.jsx';
import Header from './components/Header.jsx';

// Pages where header should be hidden
const NO_HEADER_PATHS = ['/login', '/register'];

function App() {
  const { user, loading, isAuthenticated } = useApp();
  const location = useLocation();

   // Check if header should be visible
   const showHeader = !NO_HEADER_PATHS.includes(location.pathname);

   if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  return (
    <ThemeProvider theme={theme}>
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
    <Route path="/regions"
    element={
      localStorage.getItem('authToken') ?
      <RegionsPage /> :
      <Navigate to="/login" state={{ from: location }} replace />
    }
    />
    <Route 
  path="/admin" 
  element={
    localStorage.getItem('authToken') ? 
      <AdminPage /> : 
      <Navigate to="/login" state={{ from: location }} replace />
  }
    />
    <Route path="/indicators"
    element={
      localStorage.getItem('authToken') ?
      <IndicatorsPage /> :
      <Navigate to="/login" state={{ from: location }} replace />
    }
/>
    <Route path="*" 
    element={isAuthenticated ? "/dashboard" : "/login"} replace
     />
  </Routes >
  </main>
  </>
  </ThemeProvider>

  );
}

export default App;
