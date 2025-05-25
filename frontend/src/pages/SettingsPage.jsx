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
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import PageWrapper from '../components/layout/PageWrapper';

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(res.data);
        setPreferredLanguage(res.data.preferred_language || '');
        setLanguageLevel(res.data.language_level || '');
      } catch (error) {
        console.error('Failed to fetch settings:', error);
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
      await axios.put(
        `/users/${user.id}/profile`,
        {
          preferred_language: preferredLanguage,
          language_level: languageLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
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
          maxWidth: 600,
          mx: 'auto',
          mt: 10,
          backgroundColor: '#1B263B',
          color: '#E0E1DD',
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#ccc' }}>
          Update your language preferences and learning level.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Preferred Language"
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    backgroundColor: '#778DA9',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#90A4C4' },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </MotionPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default SettingsPage;
