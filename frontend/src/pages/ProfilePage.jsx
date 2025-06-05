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
        const res = await axios.get('/me', {
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 4,
            mb: 4,
          }}
        >
          <Box position="relative">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: 40,
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
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </label>
          </Box>

          <Box flex={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {user?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email || 'No email provided'}
            </Typography>

            <Box mt={3}>
              <Button variant="text" onClick={() => setPasswordDialogOpen(true)}>
                Change Password
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            background: theme.palette.background.paper,
            borderRadius: 3,
            p: 3,
            boxShadow: 3,
          }}
        >
          <Typography><strong>Preferred Language:</strong> {user?.preferred_language || 'N/A'}</Typography>
          <Typography><strong>Language Level:</strong> {user?.language_level || 'N/A'}</Typography>
          <Typography><strong>Level:</strong> {user?.current_level ?? 1}</Typography>
          <Typography><strong>XP:</strong> {user?.current_xp ?? 0}</Typography>
        </Box>
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
