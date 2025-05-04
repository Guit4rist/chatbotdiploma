// src/pages/HomePage.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to ChatBotApp
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Practice your language skills and simulate real conversations with our intelligent chatbot.
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center" mt={4}>
          <Button variant="contained" color="primary" onClick={() => navigate('/chat')}>
            Start Chatting
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default HomePage;
