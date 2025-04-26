import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  useMediaQuery 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, logout } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const mobile = useMediaQuery('(max-width:600px)');

  // Determine user role
  const isAdmin = user?.roles?.includes('Admin');
  const isLoggedIn = !!user;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, #708090 0%, #566270 100%)',
      boxShadow: 'none'
    }}>
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        padding: mobile ? '0 12px' : '0 24px'
      }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 600,
            fontSize: mobile ? '1.1rem' : '1.25rem'
          }}
        >
          Economics Tracker
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: mobile ? 1 : 2 }}>
          {!isLoggedIn ? (
            // Guest Navigation
            <>
              <Button 
                color="inherit" 
                component={Link}
                to="/login"
                size={mobile ? "small" : "medium"}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link}
                to="/register"
                size={mobile ? "small" : "medium"}
              >
                Register
              </Button>
            </>
          ) : (
            // Logged-in Navigation
            <>
              {!mobile && (
                <>
                  <Button 
                    color="inherit" 
                    component={Link}
                    to="/dashboard"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link}
                    to="/regions"
                  >
                    Regions
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link}
                    to="/indicators"
                  >
                    Indicators
                  </Button>
                  <Button 
                    color="inherit" 
                    component={Link}
                    to="/favourites"
                  >
                    Favourites
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      color="inherit" 
                      component={Link}
                      to="/admin"
                    >
                      Admin
                    </Button>
                  )}
                </>
              )}

              {/* User Menu */}
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar 
                  alt={user.firstName || 'User'} 
                  src="/default-avatar.jpg"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem 
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  component={Link}
                  to="/settings"
                  onClick={handleMenuClose}
                >
                  Settings
                </MenuItem>
                {isAdmin && (
                  <MenuItem 
                    component={Link}
                    to="/audit-logs"
                    onClick={handleMenuClose}
                  >
                    Admin Tools
                  </MenuItem>
                )}
                <MenuItem onClick={() => {
                  handleMenuClose();
                  logout();
                }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;