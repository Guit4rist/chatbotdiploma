// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Container,
  Paper,
  CircularProgress,
  Avatar,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box mt={12} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={user?.avatarUrl || ''}
              alt={user?.username}
              sx={{
                width: 100,
                height: 100,
                fontSize: 36,
                margin: '0 auto',
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email || 'No email provided'}
            </Typography>
            <Box mt={2}>
              <Button variant="contained" color="primary">
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <TextField
            fullWidth
            label="Preferred Language"
            value={user?.preferred_language || ''}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Language Level"
            value={user?.language_level || ''}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Current Level"
            value={user?.current_level ?? 1}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="XP"
            value={user?.xp ?? 0}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
