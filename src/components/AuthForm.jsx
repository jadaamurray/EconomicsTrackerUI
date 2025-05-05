// AuthForm.js
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Link,
} from '@mui/material';

const AuthForm = ({ type, onSubmit, loading, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        ...(type === 'register' && {
            fName: '',
            lName: ''
        })
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: 400,
                    p: 4,
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" align="center" mb={3}>
                    Economics Tracker
                </Typography>
                <Typography variant="h5" align="center" mb={3}>
                    {type === 'login' ? 'Login' : 'Register an Accoount'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {type === 'register' && (
                    <><TextField
                        fullWidth
                        label="First Name"
                        name="fName"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required /><TextField
                            fullWidth
                            label="Last Name"
                            name="lName"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required /></>
                )}

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    {...(type === 'register' && {
                        helperText: 'Password must be at least 6 characters'
                    })}
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 3 }}
                >
                    {loading ? <CircularProgress size={24} /> : type === 'login' ? 'Login' : 'Register'}
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    {type === 'login' ? (
                        <>Don't have an account?{' '}
                            <Link component={RouterLink} to="/register" underline="hover">
                                Register here
                            </Link>
                        </>
                    ) : (
                        <>Already have an account?{' '}
                            <Link component={RouterLink} to="/login" underline="hover">
                                Login here
                            </Link>
                        </>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default AuthForm;