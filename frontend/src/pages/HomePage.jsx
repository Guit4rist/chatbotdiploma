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
  Divider,
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
      {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#0c1f33',
            color: '#E0E1DD',
            py: { xs: 10, md: 14 },
          }}
        >
          <MotionBox
            animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '100%',
              background: 'linear-gradient(270deg, #0c1f33, #0c2749, #0d1b2a)',
              backgroundSize: '400% 400%',
              filter: 'blur(80px)',
              zIndex: 0,
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <MotionPaper
              elevation={10}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              sx={{
                p: { xs: 4, sm: 6 },
                textAlign: 'center',
                backdropFilter: 'blur(14px)',
                backgroundColor: 'rgba(13, 27, 42, 0.85)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 4,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Master Languages Through Conversation
              </Typography>
              <Typography variant="h6" color="#E0E1DD" sx={{ mb: 3 }}>
                Engage in realistic, AI-powered chat to improve your fluency, grammar, and speaking confidence.
              </Typography>
              <Typography variant="body1" color="#E0E1DD" sx={{ mb: 4, opacity: 0.9 }}>
                Whether you're a beginner or an advanced learner, our intelligent assistant helps you practice in a natural, intuitive, and fun way.
              </Typography>
              <MotionImg
                src="../images/chatbot1.png"
                alt="Chatbot Hero"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  marginTop: 24,
                  marginBottom: 32,
                }}
              />
              <Stack spacing={2} direction="row" justifyContent="center">
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/chat')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Start Chatting
                </MotionButton>
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: '#90caf9',
                    color: '#90caf9',
                    '&:hover': {
                      borderColor: '#64b5f6',
                      color: '#64b5f6',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    },
                  }}
                >
                  Login
                </MotionButton>
              </Stack>
            </MotionPaper>
          </Container>
        </Box>


      {/* Feature Section 1 */}
      <Box sx={{ py: 10, background: 'linear-gradient(to bottom, #0c2749, #0d1b2a)', color: '#E0E1DD' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Parallax speed={-10}>
                <MotionImg
                  src="../images/chatbot2.png"
                  alt="AI Chat Feature"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.03 }}
                />
              </Parallax>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Real Conversations
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Practice with realistic, AI-driven dialogues that help improve your vocabulary, grammar, and fluency through immersive chat scenarios.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Section 2 */}
      <Box sx={{ py: 10, background: 'linear-gradient(to bottom, #0d1b2a, #0c2749)', color: '#E0E1DD' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Track Your Progress
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                See your improvement over time with detailed progress tracking, gamified achievements, and language feedback insights.
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
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.03 }}
                />
              </Parallax>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 🚀 Future Updates Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(to bottom, #0c2749, #0c1f33)', color: '#E0E1DD' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 6, textAlign: 'center' }}>
            Future Updates
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <MotionImg
                src="../images/update1.png"
                alt="Multiplayer Practice"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.03 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 3 }}>
                Multiplayer Chat Practice
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Join group chat sessions and interact with peers to enhance your language skills together.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionImg
                src="../images/update2.png"
                alt="Voice Conversations"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
                whileHover={{ scale: 1.03 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 3 }}>
                Voice Conversation Mode
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Communicate with the chatbot using your voice — speech recognition and synthesis make it feel natural.
              </Typography>
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
        <Divider variant="middle" sx={{ my: 1, bgcolor: '#415A77' }} />
        <Typography variant="body2">
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 12px' }}>About</a>|
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 12px' }}>Contact</a>|
          <a href="#" style={{ color: '#E0E1DD', textDecoration: 'none', margin: '0 12px' }}>Privacy</a>
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
