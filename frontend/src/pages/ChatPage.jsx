// ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Avatar,
  Slide,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }} aria-label="Bot is typing">
    {[...Array(3)].map((_, i) => (
      <Box
        key={i}
        component="span"
        sx={{
          width: 8,
          height: 8,
          bgcolor: '#0c2548',
          borderRadius: '50%',
          animation: `typingBounce 1.4s infinite`,
          animationDelay: `${i * 0.3}s`,
          display: 'inline-block',
        }}
      />
    ))}
    <style>
      {`
        @keyframes typingBounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}
    </style>
  </Box>
);

const ChatPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const data = [
        { id: '1', title: 'General Chat' },
        { id: '2', title: 'Spanish Practice' },
      ];
      setSessions(data);
      if (!selectedSessionId && data.length) setSelectedSessionId(data[0].id);
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const fetchMessages = async () => {
      const dummyMessages = [
        { sender: 'bot', text: 'Hello! How can I help you today?' },
        { sender: 'user', text: 'Hi! Can you help me practice English?' },
      ];
      setMessages(dummyMessages);
    };
    fetchMessages();
  }, [selectedSessionId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    setTimeout(async () => {
      const botResponse = {
        sender: 'bot',
        text:
          'Sure! Here is some **bold text**, _italic text_, `inline code`, and a list:\n\n- Item 1\n- Item 2\n- Item 3',
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
      setXp((prev) => prev + 10);
      if (xp + 10 >= 100) setLevel((l) => l + 1);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.sender === 'user';
    return (
      <Slide direction="up" in timeout={300} key={index}>
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            px: 0,
            py: 1,
          }}
        >
          {!isUser && (
            <Avatar sx={{ bgcolor: '#0c2548', width: 32, height: 32, mr: 1 }}>
              🤖
            </Avatar>
          )}
          <Box
            sx={{
              maxWidth: isMobile ? '85%' : '70%',
              p: 2,
              borderRadius: 3,
              bgcolor: isUser ? '#0c2548' : 'rgba(255, 255, 255, 0.08)',
              color: isUser ? '#fff' : '#e0e0e0',
              whiteSpace: 'pre-wrap',
              boxShadow: 4,
              backdropFilter: !isUser && 'blur(8px)',
              border: !isUser && '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.95rem',
              '& a': {
                color: '#82aaff',
                textDecoration: 'underline',
              },
            }}
          >
            <ReactMarkdown
              children={msg.text}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
                code: ({ node, inline, className, children, ...props }) => (
                  <Box
                    component="code"
                    sx={{
                      backgroundColor: '#212b45',
                      color: '#82aaff',
                      borderRadius: 1,
                      px: 0.5,
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                    }}
                    {...props}
                  >
                    {children}
                  </Box>
                ),
                ul: ({ node, ...props }) => (
                  <Box component="ul" sx={{ pl: 3, mb: 1 }} {...props} />
                ),
                li: ({ node, ...props }) => (
                  <Box component="li" sx={{ mb: 0.5 }} {...props} />
                ),
              }}
            />
          </Box>
          {isUser && (
            <Avatar sx={{ bgcolor: '#0c2548', width: 32, height: 32, ml: 1 }}>
              🧑
            </Avatar>
          )}
        </ListItem>
      </Slide>
    );
  };

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        height: '100vh',
        mt: 8,
        background: 'linear-gradient(135deg, #0c2548 0%, #163a61 50%, #0c2548 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid container sx={{ height: '100%' }}>
        {/* Sidebar */}
        <Grid item xs={12} sm={4} md={3} sx={{
          bgcolor: '#0c2548',
          color: '#fff',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          boxShadow: 3,
        }}>
          {/* Sidebar content here... */}
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} sm={8} md={9} sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
          <Typography variant="h4" align="center" color="#0c2548" mb={2} fontWeight="bold">
            Chat with AI
          </Typography>

          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <Chip label={`Level: ${level}`} color="primary" variant="outlined" />
            <Chip label={`XP: ${xp}`} color="secondary" variant="outlined" />
          </Box>

          <Paper
            elevation={4}
            sx={{
              flexGrow: 1,
              mb: 2,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 3,
              maxHeight: 'calc(100vh - 250px)', // reduced height
            }}
            ref={listRef}
          >
            {messages.map((msg, i) => renderMessage(msg, i))}
            {loading && <TypingIndicator />}
          </Paper>

          <Box display="flex" gap={1} alignItems="center">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
              }}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
