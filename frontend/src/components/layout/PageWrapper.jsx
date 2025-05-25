// src/components/layout/PageWrapper.jsx
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PageWrapper = ({ children, maxWidth = 'md' }) => (
  <Box
    sx={{
      position: 'relative',
      minHeight: '100vh',
      overflowX: 'hidden',
      bgcolor: '#0d1b2a',
      color: '#E0E1DD',
    }}
  >
    <MotionBox
      animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',
        height: '100%',
        backgroundImage: 'linear-gradient(270deg, #1B263B, #0d1b2a)',
        backgroundSize: '400% 400%',
        zIndex: 0,
      }}
    />
    <Container
      maxWidth={maxWidth}
      sx={{ position: 'relative', zIndex: 1, py: 8 }}
    >
      {children}
    </Container>
  </Box>
);

export default PageWrapper;
