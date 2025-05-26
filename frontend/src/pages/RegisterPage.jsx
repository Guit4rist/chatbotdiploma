// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import {
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PageWrapper from '../components/layout/PageWrapper';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);


const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    locale: 'en',
    bio: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/users/', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <PageWrapper>
      <MotionPaper
        elevation={6}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 5,
          maxWidth: 600,
          mx: 'auto',
          backgroundColor: '#1B263B',
          color: '#E0E1DD',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Create an Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              required
              value={form.username}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              required
              type="email"
              value={form.email}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />
            <TextField
              label="Password"
              name="password"
              fullWidth
              required
              type="password"
              value={form.password}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />
            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              value={form.full_name}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />
            <TextField
              label="Preferred Language"
              name="locale"
              select
              fullWidth
              value={form.locale}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </TextField>
            <TextField
              label="Short Bio"
              name="bio"
              fullWidth
              multiline
              rows={3}
              value={form.bio}
              onChange={handleChange}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{ style: { color: '#E0E1DD' } }}
            />

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#778DA9',
                  '&:hover': { backgroundColor: '#90A4C4' },
                }}
              >
                Register
              </Button>
            </motion.div>
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/login')}
              sx={{ color: '#E0E1DD', mt: 1 }}
            >
              Already have an account? Login
            </Button>
          </Stack>
        </form>
      </MotionPaper>
    </PageWrapper>
  );
};

export default RegisterPage;
