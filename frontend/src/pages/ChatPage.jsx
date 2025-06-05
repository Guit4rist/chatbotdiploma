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
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Animated typing dots component
const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 0.5,
      }}
      aria-label="Bot is typing"
    >
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            width: 6,
            height: 6,
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

  // States for chat and sessions (same as before)
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

  // Fetch sessions on mount or when sessions change
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

  // Fetch messages when selectedSessionId changes
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

  // Scroll to bottom on messages update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message handler
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

  // Handle enter key send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render each chat message with markdown
  const renderMessage = (msg, index) => {
    const isUser = msg.sender === 'user';
    return (
      <Slide direction="up" in timeout={300} key={index}>
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            px: 0,
            py: 0.5,
          }}
        >
          {!isUser && (
            <Avatar sx={{ bgcolor: '#0c2548', width: 24, height: 24, mr: 0.75 }}>
              🤖
            </Avatar>
          )}
          <Box
            sx={{
              maxWidth: isMobile ? '80%' : '65%',
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: isUser ? '#0c2548' : 'rgba(255, 255, 255, 0.08)',
              color: isUser ? '#fff' : '#e0e0e0',
              whiteSpace: 'pre-wrap',
              boxShadow: 3,
              backdropFilter: !isUser && 'blur(6px)',
              border: !isUser && '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.85rem',
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
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                    {...props}
                  >
                    {children}
                  </Box>
                ),
                ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2.5, mb: 0.5 }} {...props} />,
                li: ({ node, ...props }) => <Box component="li" sx={{ mb: 0.25 }} {...props} />,
              }}
            />
          </Box>
          {isUser && (
            <Avatar sx={{ bgcolor: '#0c2548', width: 24, height: 24, ml: 0.75 }}>
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
        mt: 7,
        background: 'linear-gradient(135deg, #0c2548 0%, #163a61 50%, #0c2548 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            boxShadow: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Sessions
            </Typography>
            <Tooltip title="New Session">
              <IconButton size="small" color="inherit" onClick={() => setCreating(true)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <List
            dense
            sx={{ overflowY: 'auto', maxHeight: 'calc(100% - 80px)' }}
            aria-label="Chat sessions list"
          >
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                disablePadding
                secondaryAction={
                  <>
                    {editingSessionId === session.id ? (
                      <>
                        <Tooltip title="Save">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                              setEditingSessionId(null);
                              // Save logic here
                            }}
                            aria-label={`Save session title ${editedTitle}`}
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                              setEditingSessionId(session.id);
                              setEditedTitle(session.title);
                            }}
                            aria-label={`Edit session ${session.title}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => {
                              setSessions((prev) =>
                                prev.filter((s) => s.id !== session.id)
                              );
                              if (selectedSessionId === session.id)
                                setSelectedSessionId(
                                  sessions.length > 1 ? sessions[0].id : null
                                );
                            }}
                            aria-label={`Delete session ${session.title}`}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                }
                sx={{
                  bgcolor:
                    selectedSessionId === session.id
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                {editingSessionId === session.id ? (
                  <TextField
                    variant="standard"
                    size="small"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingSessionId(null);
                        // Save logic here
                      }
                    }}
                    inputProps={{ 'aria-label': 'Edit session title' }}
                    sx={{ color: '#fff' }}
                    fullWidth
                  />
                ) : (
                  <ListItemButton
                    onClick={() => setSelectedSessionId(session.id)}
                    sx={{ pl: 1.5 }}
                    aria-current={selectedSessionId === session.id ? 'true' : undefined}
                  >
                    <ListItemText
                      primary={session.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: '0.85rem',
                        fontWeight: selectedSessionId === session.id ? 'bold' : 'normal',
                      }}
                    />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>

          {/* XP and Level */}
          <Box mt="auto" pt={1} pb={0.5} textAlign="center">
            <Chip
              label={`Level ${level} — XP ${xp}/100`}
              color="primary"
              size="small"
              sx={{
                fontWeight: 'bold',
                fontSize: '0.75rem',
                bgcolor: 'rgba(255,255,255,0.15)',
              }}
              aria-label="User experience level and points"
            />
          </Box>
        </Grid>

        {/* Main chat area */}
        <Grid
          item
          xs={12}
          sm={8}
          md={9}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: '#163a61',
            p: isMobile ? 1 : 2,
          }}
        >
          <Paper
            ref={listRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 1,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              boxShadow: 1,
              mb: 1,
            }}
            aria-live="polite"
            aria-relevant="additions"
          >
            <List dense disablePadding>
              {messages.map((msg, i) => renderMessage(msg, i))}
              {loading && (
                <ListItem
                  sx={{
                    justifyContent: 'flex-start',
                    px: 0,
                    py: 0.5,
                  }}
                >
                  <Avatar
                    sx={{ bgcolor: '#0c2548', width: 24, height: 24, mr: 0.75 }}
                    aria-hidden="true"
                  >
                    🤖
                  </Avatar>
                  <Typography
                    sx={{ fontSize: '0.85rem', color: '#e0e0e0' }}
                    aria-label="Bot is typing"
                  >
                    <TypingIndicator />
                  </Typography>
                </ListItem>
              )}
            </List>
          </Paper>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.9rem',
                    },
                  }}
                  inputProps={{ 'aria-label': 'Chat input field' }}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Send message">
                  <span>
                    <IconButton
                      color="primary"
                      type="submit"
                      disabled={loading || !input.trim()}
                      aria-label="Send message"
                      size="large"
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* New session dialog */}
      <Dialog open={creating} onClose={() => setCreating(false)} aria-labelledby="new-session-dialog">
        <DialogTitle id="new-session-dialog" sx={{ fontSize: '1.25rem' }}>
          Create New Session
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Title"
            fullWidth
            variant="standard"
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            inputProps={{ 'aria-label': 'New session title' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(false)} size="small" aria-label="Cancel new session">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (newSessionTitle.trim()) {
                const newSession = {
                  id: (sessions.length + 1).toString(),
                  title: newSessionTitle.trim(),
                };
                setSessions((prev) => [...prev, newSession]);
                setSelectedSessionId(newSession.id);
                setNewSessionTitle('');
                setCreating(false);
              }
            }}
            size="small"
            disabled={!newSessionTitle.trim()}
            aria-label="Create new session"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChatPage;
