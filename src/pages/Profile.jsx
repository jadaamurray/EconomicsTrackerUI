import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  useMediaQuery
} from '@mui/material';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const { user } = useApp();
  const mobile = useMediaQuery('(max-width:600px)');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    roles: ''
  });

  // Initialise form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        roles: user.roles || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: mobile ? 2 : 4 }}>
        <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 4 }}>
          {/* Profile Picture Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: mobile ? '100%' : 200
          }}>
            <Avatar
              src={user?.avatar || '/default-avatar.jpg'}
              sx={{ 
                width: 120, 
                height: 120,
                mb: 2
              }}
            />
            {editMode && (
              <Button 
                variant="outlined" 
                size="small"
                component="label"
                sx={{ mb: 2 }}
              >
                Upload New
                <input type="file" hidden />
              </Button>
            )}
          </Box>

          {/* Profile Info Section */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5">
                {editMode ? 'Edit Profile' : 'My Profile'}
              </Typography>
              <Button 
                variant={editMode ? 'outlined' : 'contained'}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  disabled // email not editable
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>User Type:</strong> {user?.roles}
                </Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Change Password
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                >
                  Delete Account
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;