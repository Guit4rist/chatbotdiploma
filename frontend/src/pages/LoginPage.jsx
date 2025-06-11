// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PageWrapper from '../components/layout/PageWrapper';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MotionPaper = motion(Paper);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('/login/', new URLSearchParams(form), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      const user = {
        username: form.username,
        id: response.data.user_id,
        // optionally include more user info from response if available
      };

      login(token, user); // update auth context
      navigate('/chat');  // redirect to main app
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <MotionPaper
        elevation={6}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        sx={{
          p: 6,
          maxWidth: 500,
          mx: 'auto',
          textAlign: 'center',
          backgroundColor: '#1B263B',
          borderRadius: 3,
          color: '#E0E1DD',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Login
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome back! Log in to continue practicing.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#778DA9',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#90A4C4' },
                }}
              >
                Log In
              </Button>
            </motion.div>

            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/register')}
              sx={{ color: '#E0E1DD' }}
            >
              Don&apos;t have an account? Register
            </Button>
          </Stack>
        </form>
      </MotionPaper>
    </PageWrapper>
  );
};

export default LoginPage;
