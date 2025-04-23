// to contain navigation to all of the pages stored at the top
//responsiveness to mobile devices
// clickable title
// dont use anchor - more than a single page, will refresh, use link
// link for every single navigable to page in the header
// can only see profile jeader is the user is logged in
//import '~/src/styles/header.css';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

//const isMobile = useMediaQuery('(max-width:600px)');

const Header = () => {
  const { user, logout, } = useApp();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo/Title */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          MyApp
        </Typography>

        {/* Conditional rendering based on auth */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Welcome, {user.firstName || 'User'}</Typography>
            <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;