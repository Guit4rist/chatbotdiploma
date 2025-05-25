// src/pages/HomePage.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionImg = motion('img');
const MotionButton = motion(Button);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section with Background Animation */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#0c2749',
          color: '#E0E1DD',
          py: 10,
        }}
      >
        {/* Animated Background */}
        <MotionBox
          animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200%',
            height: '100%',
            backgroundImage: 'linear-gradient(270deg, #0c2749, #0d1b2a)',
            backgroundSize: '400% 400%',
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <MotionPaper
            elevation={4}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ p: 5, textAlign: 'center', backgroundColor: '#0c2749' }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome to Language Chatbot
            </Typography>
            <Typography variant="h6" color="#E0E1DD" gutterBottom>
              Practice your language skills and simulate real conversations with our intelligent chatbot.
            </Typography>
            <MotionImg
              src="../images/chatbot1.png"
              alt="Chatbot Hero"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', maxWidth: 400, marginTop: 32, marginBottom: 32 }}
            />
            <Stack spacing={2} direction="row" justifyContent="center">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                variant="contained"
                color="primary"
                onClick={() => navigate('/chat')}
              >
                Start Chatting
              </MotionButton>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                variant="outlined"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Login
              </MotionButton>
            </Stack>
          </MotionPaper>
        </Container>
      </Box>

      {/* Feature Section 1 with Parallax Image */}
      <Box sx={{ py: 10, backgroundColor: '#0c2749', color: '#E0E1DD' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Parallax speed={-10}>
                <MotionImg
                  src="../images/chatbot2.png"
                  alt="AI Chat Feature"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  style={{ width: '100%', borderRadius: '12px' }}
                  whileHover={{ scale: 1.03 }}
                />
              </Parallax>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Real Conversations
              </Typography>
              <Typography variant="body1">
                Practice with realistic conversations powered by AI to improve your vocabulary, grammar, and fluency.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Section 2 with Parallax Image */}
      <Box sx={{ py: 10, backgroundColor: '#0d1b2a', color: '#E0E1DD' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Track Your Progress
              </Typography>
              <Typography variant="body1">
                Monitor your improvement over time through usage insights, gamified levels, and feedback.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Parallax speed={10}>
                <MotionImg
                  src="../images/chatbot3.png"
                  alt="Progress Tracking"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  style={{ width: '100%', borderRadius: '12px' }}
                  whileHover={{ scale: 1.03 }}
                />
              </Parallax>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#1B263B',
          color: '#E0E1DD',
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid #415A77',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          © {new Date().getFullYear()} Language Chatbot. All rights reserved.
        </Typography>
        <Typography variant="body2">
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 8px' }}>About</a>|
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 8px' }}>Contact</a>|
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 8px' }}>Privacy</a>
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
