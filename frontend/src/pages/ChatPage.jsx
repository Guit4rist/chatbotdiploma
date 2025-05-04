// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(user?.current_level || 1);
  const [loading, setLoading] = useState(true);

  // Fetch conversation history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/users/${user.id}/conversations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const history = res.data.map((entry) => ({
          text: entry.message,
          sender: entry.role === 'user' ? 'user' : 'bot',
        }));

        setMessages(history);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(
        '/chat',
        {
          message: input,
          user_id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      const { response, xp_earned, current_level } = res.data;

      setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
      if (xp_earned) setXp((prev) => prev + xp_earned);
      if (current_level && current_level !== level) setLevel(current_level);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'An error occurred. Please try again later.', sender: 'bot' },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom align="center">
        Chat with AI
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        <Chip label={`Level: ${level}`} color="success" sx={{ mr: 1 }} />
        <Chip label={`XP: ${xp}`} color="info" />
      </Box>
      <Paper
        elevation={3}
        sx={{
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List
              sx={{
                overflowY: 'auto',
                flexGrow: 1,
                mb: 2,
                pr: 1,
              }}
            >
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent:
                      msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      maxWidth: '75%',
                      bgcolor: msg.sender === 'user' ? '#e3f2fd' : '#f1f8e9',
                      p: 1.5,
                      borderRadius: 2,
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Tooltip title="Send">
                <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ChatPage;
