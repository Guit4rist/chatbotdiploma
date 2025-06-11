// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Paper,
  TextField,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Language as LanguageIcon,
  Lock as LockIcon,
  UploadFile as UploadFileIcon,
  Face as FaceIcon,
} from '@mui/icons-material';
import axios from '../api/axios';
import PageWrapper from '../components/layout/PageWrapper';
import { useAuth } from '../context/AuthContext';

const MotionPaper = motion(Paper);

const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Fluent'];

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [languageLevel, setLanguageLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { auth } = useAuth();

  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(res.data);
        setPreferredLanguage(res.data.preferred_language || '');
        setLanguageLevel(res.data.language_level || '');
        setEmail(res.data.email || '');
        if (res.data.avatar_url) {
          setAvatarPreview(res.data.avatar_url);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setSnackbarMessage('Failed to load settings');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update profile information
      await axios.put(
        `/users/${user.id}/profile`,
        {
          preferred_language: preferredLanguage,
          language_level: languageLevel,
          email: email,
          interface_language: user.interface_language,
          timezone: user.timezone,
          bio: user.bio,
          display_name: user.display_name
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );

      // Update password if provided
      if (password.trim() !== '') {
        await axios.post(
          `/users/${user.id}/change-password`,
          { new_password: password },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          }
        );
      }

      // Upload avatar if selected
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        const avatarRes = await axios.post(`/users/${user.id}/upload-avatar`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setAvatarPreview(avatarRes.data.avatar_url);
      }

      setSnackbarMessage('Settings saved successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setPassword(''); // Clear password field after successful save
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSnackbarMessage('Failed to save settings');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setAvatarPreview(previewURL);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Box mt={20} display="flex" justifyContent="center">
          <CircularProgress sx={{ color: '#E0E1DD' }} />
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <MotionPaper
        elevation={6}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 5,
          maxWidth: 700,
          mx: 'auto',
          mt: 8,
          backgroundColor: '#1B263B',
          color: '#E0E1DD',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#BFC9DA' }}>
          Manage your preferences and personal information.
        </Typography>

        {/* Profile Avatar */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <FaceIcon sx={{ mr: 1, color: '#90A4C4' }} />
            <Typography variant="h6" fontWeight={600}>
              Profile Avatar
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: '#32475b' }} />

          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={avatarPreview}
                sx={{ width: 72, height: 72, border: '2px solid #778DA9' }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{ color: '#E0E1DD', borderColor: '#90A4C4' }}
              >
                Upload New
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {file && (
                <Typography mt={1} sx={{ fontSize: 14, color: '#BFC9DA' }}>
                  {file.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Language Preferences */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <LanguageIcon sx={{ mr: 1, color: '#90A4C4' }} />
            <Typography variant="h6" fontWeight={600}>
              Language Preferences
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: '#32475b' }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Preferred Language (UI)"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{ style: { color: '#E0E1DD' } }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Language Level"
                value={languageLevel}
                onChange={(e) => setLanguageLevel(e.target.value)}
                InputLabelProps={{ style: { color: '#ccc' } }}
                InputProps={{ style: { color: '#E0E1DD' } }}
              >
                {levelOptions.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* Email Change Section */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#90A4C4', mb: 1 }}>
            Change Email
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#32475b' }} />
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#E0E1DD' } }}
          />
        </Box>

        {/* Security Section */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <LockIcon sx={{ mr: 1, color: '#90A4C4' }} />
            <Typography variant="h6" fontWeight={600}>
              Change Password
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: '#32475b' }} />

          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { color: '#E0E1DD' } }}
          />
        </Box>

        {/* Save Button */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{
                backgroundColor: '#778DA9',
                color: '#fff',
                px: 4,
                py: 1,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#90A4C4' },
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </motion.div>
        </Box>
      </MotionPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default SettingsPage;
