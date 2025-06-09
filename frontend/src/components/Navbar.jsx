// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getInitials = (username) =>
  username
    ? username
        .split(' ')
        .map((word) => word[0].toUpperCase())
        .join('')
    : '';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
};

const buttonStyle = {
  variant: 'outlined',
  sx: {
    color: '#ffffff',
    borderColor: '#E0E1DD',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '#1B263B',
      borderColor: '#E0E1DD',
    },
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    px: 2,
    py: 0.75,
  },
};


const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setDrawerOpen(false);
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    ...(isAuthenticated ? [{ label: 'Chat', path: '/chat' }] : []),
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          backgroundColor: '#0d1b2a',
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              letterSpacing: '0.5px',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            Language Chatbot
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250, p: 2 }} role="presentation">
                  <List>
                    {navItems.map(({ label, path }) => (
                      <ListItem
                        button
                        key={label}
                        component={Link}
                        to={path}
                        onClick={() => setDrawerOpen(false)}
                      >
                        <ListItemText primary={label} />
                      </ListItem>
                    ))}
                    {auth.isAuthenticated ? (
                      <>
                        <ListItem button onClick={handleProfile}>
                          <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button onClick={handleSettings}>
                          <ListItemText primary="Settings" />
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                          <ListItemText primary="Logout" />
                        </ListItem>
                      </>
                    ) : (
                      <>
                        <ListItem
                          button
                          component={Link}
                          to="/login"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem
                          button
                          component={Link}
                          to="/register"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <ListItemText primary="Register" />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {navItems.map(({ label, path }) => (
                <Button
                  key={label}
                  component={Link}
                  to={path}
                  {...buttonStyle}
                >
                  {label}
                </Button>
              ))}

              {auth.isAuthenticated ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleMenuOpen} size="small">
                      {auth.user?.username ? (
                        <Avatar
                          sx={{
                            bgcolor: stringToColor(auth.user.username),
                            width: 36,
                            height: 36,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(auth.user.username)}
                        </Avatar>
                      ) : (
                        <Avatar>
                          <AccountCircleIcon />
                        </Avatar>
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 4px 12px',
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" fontWeight={500}>
                        {auth.user?.username}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleSettings}>Settings</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    {...buttonStyle}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    {...buttonStyle}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
