// ...imports remain the same
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Check';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const ChatPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(user?.current_level || 1);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [listening, setListening] = useState(false);
  const listRef = useRef();
  const recognitionRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/chat_sessions/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setSessions(res.data);
      if (res.data.length > 0 && !selectedSessionId) {
        setSelectedSessionId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const fetchMessages = async (sessionId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/chat_sessions/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const history = res.data.map((msg) => ({
        text: msg.message,
        sender: msg.role === 'user' ? 'user' : 'bot',
      }));
      setMessages(history);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedSessionId) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(
        `/chat_sessions/${selectedSessionId}/chat`,
        { message: input },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      const { response, xp_earned, current_level } = res.data;
      setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
      speakText(response);
      if (xp_earned) setXp((prev) => prev + xp_earned);
      if (current_level && current_level !== level) setLevel(current_level);
    } catch (err) {
      console.error('Send error:', err);
      setMessages((prev) => [
        ...prev,
        { text: '⚠️ An error occurred. Please try again later.', sender: 'bot' },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await axios.post(
        '/chat_sessions/',
        { title: newSessionTitle || 'New Chat' },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      setNewSessionTitle('');
      setCreating(false);
      fetchSessions();
      setSelectedSessionId(res.data.id);
    } catch (err) {
      console.error('Create session error:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`/chat_sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      if (sessionId === selectedSessionId) setSelectedSessionId(null);
      fetchSessions();
    } catch (err) {
      console.error('Delete session error:', err);
    }
  };

  const handleRenameSession = async (sessionId) => {
    try {
      await axios.put(
        `/chat_sessions/${sessionId}`,
        { title: editedTitle },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      setEditingSessionId(null);
      fetchSessions();
    } catch (err) {
      console.error('Rename session error:', err);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => prev + ' ' + transcript);
    };

    recognitionRef.current.onend = () => setListening(false);

    setListening(true);
    recognitionRef.current.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.sender === 'user';
    return (
      <ListItem key={index} sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && <Avatar sx={{ bgcolor: '#1565c0', width: 32, height: 32, mr: 1 }}>🤖</Avatar>}
        <Box
          sx={{
            maxWidth: isMobile ? '85%' : '70%',
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? '#1976d2' : '#e3f2fd',
            color: isUser ? '#fff' : '#000',
            whiteSpace: 'pre-wrap',
            boxShadow: 2,
          }}
        >
          <ListItemText primary={msg.text} />
        </Box>
        {isUser && <Avatar sx={{ bgcolor: '#1565c0', width: 32, height: 32, ml: 1 }}>🧑</Avatar>}
      </ListItem>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Sessions</Typography>
              <Tooltip title="New Session">
                <IconButton size="small" color="primary" onClick={() => setCreating(true)}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <List>
              {sessions.map((session) => (
                <ListItem
                  key={session.id}
                  secondaryAction={
                    <>
                      {editingSessionId === session.id ? (
                        <IconButton edge="end" onClick={() => handleRenameSession(session.id)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={() => handleDeleteSession(session.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    selected={session.id === selectedSessionId}
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    {editingSessionId === session.id ? (
                      <TextField
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        size="small"
                        variant="standard"
                      />
                    ) : (
                      <ListItemText primary={session.title} />
                    )}
                  </ListItemButton>
                  <Tooltip title="Rename">
                    <IconButton onClick={() => {
                      setEditingSessionId(session.id);
                      setEditedTitle(session.title);
                    }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="h4" align="center" gutterBottom>
            Chat with AI
          </Typography>

          <Box display="flex" justifyContent="center" mb={2}>
            <Chip label={`Level: ${level}`} color="success" variant="outlined" sx={{ mr: 1 }} />
            <Chip label={`XP: ${xp}`} color="info" variant="outlined" />
          </Box>

          <Paper
            elevation={4}
            sx={{
              height: { xs: '65vh', sm: '70vh' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: theme.palette.background.paper,
            }}
          >
            {loading ? (
              <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <List ref={listRef} sx={{ overflowY: 'auto', flexGrow: 1, pr: 1 }}>
                  {messages.map(renderMessage)}
                </List>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    variant="outlined"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ backgroundColor: theme.palette.background.default }}
                  />
                  <Tooltip title="Speak">
                    <IconButton color={listening ? 'error' : 'primary'} onClick={startListening} sx={{ ml: 1 }}>
                      <MicIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send">
                    <IconButton color="primary" onClick={handleSend} disabled={!input.trim()} sx={{ ml: 1 }}>
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create Session Dialog */}
      <Dialog open={creating} onClose={() => setCreating(false)}>
        <DialogTitle>Create New Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newSessionTitle}
            onChange={(e) => setNewSessionTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreating(false)}>Cancel</Button>
          <Button onClick={handleCreateSession} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

console.log("Chat page loaded");


export default ChatPage;

