import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthForm from '../components/AuthForm'; // Import the reusable AuthForm

const LoginPage = () => {
  const { login, loading } = useApp(); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setError(null);
    try {
      await login(formData); 
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.');
    }
  };

  return (
    <AuthForm 
      type="login"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;