import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  const { register, loading } = useApp(); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData); 
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.');
    }
  };

  return (
    <AuthForm 
      type="register"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default RegisterPage;