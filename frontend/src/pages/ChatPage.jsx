import React, { useState, useEffect, useRef, useContext } from 'react';
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
import LinearProgress from '@mui/material/LinearProgress';
import {
  fetchChatSessions,
  createChatSession,
  deleteChatSession,
  fetchConversationHistory,
  sendMessageToBot,
} from "../api/chatApi";


// Animated typing dots component
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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
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

  if (authLoading) {
  return <CircularProgress />;
  }

  if (!user || !user.id) {
    return <div>User info not loaded. Check AuthContext.</div>;
  }


console.log("Fetching sessions for user:", user?.id);


 useEffect(() => {
  if (!user?.id) return;

  const load = async () => {
    try {
      console.log("Fetching sessions for user:", user.id);
      const data = await fetchChatSessions(user.id);
      setSessions(data);
      if (data.length) setSelectedSessionId(data[0].id);
    } catch (error) {
      console.error("Error loading chat sessions:", error);
    }
  };

  load();
}, [user]);


   // Load history when session changes
  useEffect(() => {
  if (!user?.id || !selectedSessionId) return;

  const loadHistory = async () => {
    try {
      const history = await fetchConversationHistory(user.id, selectedSessionId);
      setMessages(history.map(m => ({ sender: m.role, text: m.content })));
    } catch (error) {
      console.error("Error loading conversation history:", error);
    }
  };

  loadHistory();
}, [selectedSessionId, user]);

  // Scroll to bottom
  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const msg = input;
    setInput('');
    setLoading(true);

    try {
      const { response, xp_earned, current_level } = await sendMessageToBot({
        user_id: user.id,
        chat_session_id: selectedSessionId,
        message: msg,
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setXp(prev => prev + xp_earned);
      setLevel(current_level);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error communicating with AI.' }]);
    } finally {
      setLoading(false);
    }
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
                  <Box
                    component="ul"
                    sx={{ pl: 3, mb: 1 }}
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <Box
                    component="li"
                    sx={{ mb: 0.5 }}
                    {...props}
                  />
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

  const handleCreateSession = async () => {
  if (!newSessionTitle.trim()) return;
  try {
    const response = await axios.post('/chat_sessions/', {
      title: newSessionTitle.trim(),
    });
    const newSession = response.data;
    setSessions((prev) => [...prev, newSession]);
    setSelectedSessionId(newSession.id);
    setNewSessionTitle('');
    setCreating(false);
  } catch (err) {
    console.error('Failed to create session:', err);
  }
};

const handleRenameSession = async (sessionId) => {
  try {
    await axios.put(`/chat_sessions/${sessionId}`, {
      title: editedTitle,
    });
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: editedTitle } : s))
    );
    setEditingSessionId(null);
  } catch (err) {
    console.error('Failed to rename session:', err);
  }
};

const handleDeleteSession = async (sessionId) => {
  try {
    await axios.delete(`/chat_sessions/${sessionId}`);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (selectedSessionId === sessionId && sessions.length > 1) {
      const fallback = sessions.find((s) => s.id !== sessionId);
      setSelectedSessionId(fallback?.id || null);
    }
  } catch (err) {
    console.error('Failed to delete session:', err);
  }
};

console.log("user:", user); // Make sure it’s not undefined/null


  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        height: '100vh',
        mt: 8,
        // Subtle background gradient for visual depth
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
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            boxShadow: 3,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sessions</Typography>
            <Tooltip title="New Session">
              <IconButton size="small" color="inherit" onClick={() => setCreating(true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <List>
            {sessions.map((session) => (
              <ListItem
                key={session.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {editingSessionId === session.id ? (
                      <IconButton
                            edge="end"
                            onClick={() => handleRenameSession(session.id)}
                            sx={{ color: 'white' }}
                          >
                            <SaveIcon />
                          </IconButton>

                    ) : (
                      <>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setEditingSessionId(session.id);
                            setEditedTitle(session.title);
                          }}
                          sx={{ color: 'white' }}
                          aria-label="Rename session"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            edge="end"
                            onClick={() => handleDeleteSession(session.id)}
                            sx={{ color: 'white' }}
                            aria-label="Delete session"
                          >
                            <DeleteIcon />
                          </IconButton>

                      </>
                    )}
                  </Box>
                }
                disablePadding
              >
                <ListItemButton
                  selected={session.id === selectedSessionId}
                  onClick={() => setSelectedSessionId(session.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#163a61',
                      '&:hover': { backgroundColor: '#1d477a' },
                    },
                  }}
                >
                  {editingSessionId === session.id ? (
                    <TextField
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      size="small"
                      variant="standard"
                      fullWidth
                      sx={{ input: { color: 'white' } }}
                    />
                  ) : (
                    <ListItemText primary={session.title} />
                  )}
                </ListItemButton>
              </ListItem>

            ))}
          </List>
        </Grid>

        {/* Chat Area */}
        <Grid
          item
          xs={12}
          sm={8}
          md={9}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Typography variant="h4" align="center" color="#ffffff" mb={2} fontWeight="bold">
            Chat with AI
          </Typography>

          <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" mb={2} px={2}>
  <Typography variant="subtitle1" color="white">{`Level: ${level}`}</Typography>
  <Box sx={{ width: '100%', maxWidth: 400 }}>
    <LinearProgress
      variant="determinate"
      value={xp % 100}
      sx={{
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1d3557',
        '& .MuiLinearProgress-bar': {
          backgroundColor: '#00c853',
          transition: 'width 0.4s ease-in-out',
        },
        mt: 1,
      }}
    />
    <Typography variant="caption" color="white" align="center" display="block" mt={0.5}>
      {`${xp % 100} / 100 XP`}
    </Typography>
  </Box>
</Box>

          <Paper
            elevation={4}
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 6,
              backdropFilter: 'blur(12px)',
              p: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 70,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: 3,
                  zIndex: 10,
                }}
              >
                <TypingIndicator />
                <Typography ml={1} color="#e0e0e0" fontStyle="italic" variant="body2">
                  AI is typing...
                </Typography>
              </Box>
            )}

            <List
              ref={listRef}
              sx={{
                overflowY: 'auto',
                flexGrow: 1,
                pr: 1,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                },
              }}
            >
              {messages.map(renderMessage)}
            </List>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                placeholder="Type your message..."
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                variant="outlined"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#82aaff',
                    },
                  },
                }}
              />
              <Tooltip title="Send Message">
                <span>
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="large"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* New Session Dialog */}
      <Dialog open={creating} onClose={() => setCreating(false)}>
        <DialogTitle>Create New Session</DialogTitle>
        <DialogContent>
          <TextField
            label="Session Title"
            fullWidth
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(false)}>Cancel</Button>
          <Button
              disabled={!newSessionTitle.trim()}
              onClick={handleCreateSession}
            >
              Create
            </Button>

        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChatPage;
