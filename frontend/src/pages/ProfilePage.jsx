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
  Snackbar,
  Alert,
} from '@mui/material';
import axios from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    preferred_language: '',
    language_level: '',
  });
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

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
        setFormData({
          preferred_language: res.data.preferred_language || '',
          language_level: res.data.language_level || '',
        });
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

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch('/profile/edit/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setSnack({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditing(false);
    } catch (error) {
      console.error(error);
      setSnack({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box mt={12} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 36,
                margin: '0 auto',
                bgcolor: theme.palette.primary.main,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {user?.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email || 'No email provided'}
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color={editing ? 'success' : 'primary'}
                onClick={editing ? handleSubmit : () => setEditing(true)}
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              {editing && (
                <Button sx={{ ml: 2 }} variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <TextField
            fullWidth
            label="Preferred Language"
            name="preferred_language"
            value={formData.preferred_language}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: !editing }}
          />
          <TextField
            fullWidth
            label="Language Level"
            name="language_level"
            value={formData.language_level}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: !editing }}
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

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((prev) => ({ ...prev, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
