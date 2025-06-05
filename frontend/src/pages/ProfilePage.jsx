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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    preferred_language: '',
    language_level: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          preferred_language: res.data.preferred_language || '',
          language_level: res.data.language_level || '',
        });
        if (res.data.avatar_url) {
          setAvatarPreview(res.data.avatar_url);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnack({ open: true, message: 'Profile updated successfully.', severity: 'success' });
      setEditing(false);
    } catch (error) {
      console.error(error);
      setSnack({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await axios.post('/profile/upload-avatar/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatarPreview(URL.createObjectURL(file));
      setSnack({ open: true, message: 'Avatar uploaded successfully.', severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnack({ open: true, message: 'Failed to upload avatar.', severity: 'error' });
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post('/profile/change-password/', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnack({ open: true, message: 'Password changed successfully.', severity: 'success' });
      setPasswordDialogOpen(false);
      setPasswordData({ current_password: '', new_password: '' });
    } catch (error) {
      console.error(error);
      setSnack({ open: true, message: 'Failed to change password.', severity: 'error' });
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
            <Box position="relative" display="inline-block">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 36,
                  margin: '0 auto',
                  bgcolor: theme.palette.primary.main,
                }}
                src={avatarPreview}
              >
                {getInitials(user?.username)}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-avatar"
                type="file"
                onChange={handleAvatarUpload}
              />
              <label htmlFor="upload-avatar">
                <IconButton component="span" sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>
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
                {editing ? 'Save' : 'Edit Profile'}
              </Button>
              {editing && (
                <Button sx={{ ml: 2 }} variant="outlined" color="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button sx={{ ml: 2 }} variant="text" onClick={() => setPasswordDialogOpen(true)}>
                Change Password
              </Button>
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
            label="Level"
            value={user?.current_level ?? 1}
            margin="normal"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="XP"
            value={user?.current_xp ?? 0}
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

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordData.current_password}
            onChange={(e) => setPasswordData((p) => ({ ...p, current_password: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData((p) => ({ ...p, new_password: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
