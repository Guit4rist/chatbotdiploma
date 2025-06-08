import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
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
        const res = await axios.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
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
      const avatarUrl = `${import.meta.env.VITE_API_URL || ''}/static/avatars/user_${user.id}_${file.name}`;
      setAvatarPreview(avatarUrl);

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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(to bottom right, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        pt: 10,
        pb: 6,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, mb: 6 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
            <Box position="relative">
              <Avatar
                src={avatarPreview}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 40,
                  border: `3px solid ${theme.palette.primary.main}`,
                  boxShadow: 4,
                }}
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
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </label>
            </Box>

            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user?.username}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user?.email || 'No email provided'}
              </Typography>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Profile Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <Typography><strong>Preferred Language:</strong> {user?.preferred_language || 'N/A'}</Typography>
            <Typography><strong>Language Level:</strong> {user?.language_level || 'N/A'}</Typography>
            <Typography><strong>Level:</strong> {user?.current_level ?? 1}</Typography>
            <Typography><strong>XP:</strong> {user?.current_xp ?? 0}</Typography>
          </Box>
        </Paper>
      </Container>

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
    </Box>
  );
};

export default ProfilePage;
