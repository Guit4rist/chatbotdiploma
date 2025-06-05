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

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pl: 1,
      }}
      aria-label="Bot is typing"
    >
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
};

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
                ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 3, mb: 1 }} {...props} />,
                li: ({ node, ...props }) => <Box component="li" sx={{ mb: 0.5 }} {...props} />,
              }}
            />
          </Box>
          {isUser && (
            <Avatar sx={{ bgcolor: '#0c2548', width: 32, height: 32, ml: 1 }}>🧑</Avatar>
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
        height: '100vh',         // full viewport height
        mt: 0,                  // remove top margin so no overflow
        px: 0,                  // no horizontal padding to use full width
        background: 'linear-gradient(135deg, #0c2548 0%, #163a61 50%, #0c2548 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',      // prevent page scroll
      }}
    >
      <Grid container sx={{ height: '100%' }}>
        {/* Sidebar */}
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          sx={{
            bgcolor: '#0c2548',
            color: '#fff',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',        // full height of container
            overflowY: 'auto',    // scroll inside sidebar if needed
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat Sessions
          </Typography>
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {sessions.map((session) => (
              <ListItem key={session.id} disablePadding>
                <ListItemButton
                  selected={selectedSessionId === session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                >
                  <ListItemText primary={session.title} />
                </ListItemButton>
                {/* Session edit & delete buttons could be added here */}
              </ListItem>
            ))}
          </List>

          {/* Create session form */}
          <Box mt={2}>
            {creating ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="New session title"
                />
                <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      if (newSessionTitle.trim()) {
                        setSessions((prev) => [
                          ...prev,
                          { id: Date.now().toString(), title: newSessionTitle.trim() },
                        ]);
                        setNewSessionTitle('');
                        setCreating(false);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setCreating(false);
                      setNewSessionTitle('');
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={() => setCreating(true)}
                fullWidth
                sx={{ mt: 1 }}
              >
                New Session
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            Level: {level} | XP: {xp}
          </Typography>
        </Grid>

        {/* Chat area */}
        <Grid
          item
          xs={12}
          sm={8}
          md={9}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',          // full height container
            bgcolor: 'rgba(255,255,255,0.03)',
            p: 2,
            overflow: 'hidden',      // prevent whole chat area scroll
          }}
        >
          {/* Message list */}
          <List
            ref={listRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',      // scroll chat messages here
              mb: 1,
              pb: 1,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 4,
              },
            }}
          >
            {messages.map(renderMessage)}
            {loading && (
              <ListItem sx={{ justifyContent: 'flex-start', px: 0 }}>
                <Avatar sx={{ bgcolor: '#0c2548', width: 32, height: 32, mr: 1 }}>🤖</Avatar>
                <TypingIndicator />
              </ListItem>
            )}
          </List>

          {/* Input area */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              pt: 1,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <TextField
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Type your message..."
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              sx={{
                bgcolor: '#163a61',
                borderRadius: 2,
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#82aaff',
                },
              }}
              inputProps={{ 'aria-label': 'Chat input' }}
            />
            <Tooltip title="Send message">
              <span>
                <IconButton
                  color="primary"
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                >
                  {loading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
