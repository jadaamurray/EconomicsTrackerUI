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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { user, logout } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const mobile = useMediaQuery('(max-width:600px)');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);


  // Determine user role
  const isAdmin = user?.roles?.includes('Admin');
  const isLoggedIn = !!user;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  // Mobile navigation items
  const mobileNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Regions', path: '/regions' },
    { name: 'Indicators', path: '/indicators' },
    { name: 'Favourites', path: '/favourites' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {mobile && isLoggedIn && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: mobile ? '1.1rem' : '1.25rem'
            }}
          >
            Economics Tracker
          </Typography>
        </Box>

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
            // Logged-in Navigation - Desktop
            <>
              {!mobile && (
                <>
                  <Button color="inherit" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/regions">
                    Regions
                  </Button>
                  <Button color="inherit" component={Link} to="/indicators">
                    Indicators
                  </Button>
                  <Button color="inherit" component={Link} to="/favourites">
                    Favourites
                  </Button>
                  {isAdmin && (
                    <Button color="inherit" component={Link} to="/admin">
                      Admin
                    </Button>
                  )}
                </>
              )}

              {/* User Menu (Avatar) */}
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
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
                  Settings
                </MenuItem>
                {isAdmin && (
                  <MenuItem component={Link} to="/audit-logs" onClick={handleMenuClose}>
                    Admin Tools
                  </MenuItem>
                )}
                <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {mobileNavItems.map((item) => (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.path}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;