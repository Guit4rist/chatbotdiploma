// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          Language Buddy
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>
            Home
          </Button>
          {auth.isAuthenticated && (
            <Button color="inherit" component={Link} to="/chat" sx={{ mx: 1 }}>
              Chat
            </Button>
          )}
          {auth.isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
