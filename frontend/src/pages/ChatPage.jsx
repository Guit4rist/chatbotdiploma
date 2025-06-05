import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../context/AuthContext';
import TypingIndicator from '../components/TypingIndicator';

const ChatPage = () => {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const listRef = useRef(null);

  useEffect(() => {
    if (xp >= level * 100) {
      setLevel((prev) => prev + 1);
    }
  }, [xp, level]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      const data = await response.json();
      const aiMessage = {
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setXp((prevXp) => prevXp + (data.xp || 10));
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg, index) => (
    <ListItem
      key={index}
      sx={{
        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      <Box
        sx={{
          bgcolor: msg.sender === 'user' ? '#163a61' : '#0c2548',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 2,
          maxWidth: '70%',
          whiteSpace: 'pre-wrap',
        }}
      >
        {msg.text}
      </Box>
    </ListItem>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar placeholder */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              backgroundColor: '#0c2548',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sessions
            </Typography>
            {/* You can insert session list here */}
          </Paper>
        </Grid>

        {/* Chat and XP */}
        <Grid item xs={12} md={9}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold" color="white">
              Chat with AI
            </Typography>
            <Box display="flex" gap={1}>
              <Chip
                label={`Level ${level}`}
                color="primary"
                sx={{
                  bgcolor: '#2196f3',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip
                label={`${xp % 100} XP`}
                sx={{
                  bgcolor: '#1e1e1e',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>

          <Paper
            elevation={4}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              bgcolor: 'rgba(255,255,255,0.03)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              boxShadow: 6,
            }}
          >
            {/* Chat messages */}
            <List
              ref={listRef}
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                px: 2,
                py: 1,
              }}
            >
              {messages.map(renderMessage)}
              {loading && (
                <ListItem>
                  <TypingIndicator />
                </ListItem>
              )}
            </List>

            {/* Input area */}
            <Divider />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 2,
              }}
            >
              <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type your message..."
                variant="outlined"
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor: '#0c2548',
                  color: 'white',
                  '&:hover': { bgcolor: '#163a61' },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* XP Progress Bar */}
          <Box mt={2}>
            <Typography variant="body2" color="white" gutterBottom>
              XP Progress
            </Typography>
            <Box sx={{ position: 'relative', height: 20 }}>
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: 20,
                  bgcolor: '#1a1a1a',
                  borderRadius: 10,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: `${Math.min((xp % 100), 100)}%`,
                  height: 20,
                  bgcolor: '#2196f3',
                  borderRadius: 10,
                  transition: 'width 1s ease-in-out',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                }}
              >
                {`${xp % 100} / 100 XP`}
              </Typography>
            </Box>
          </Box>

          {/* Level up animation */}
          <Box
            sx={{
              position: 'fixed',
              top: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: '#0c2548',
              px: 3,
              py: 1,
              borderRadius: 3,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              boxShadow: 6,
              zIndex: 1000,
              opacity: xp % 100 === 0 && xp !== 0 ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          >
            🎉 Level Up! Now Level {level}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
