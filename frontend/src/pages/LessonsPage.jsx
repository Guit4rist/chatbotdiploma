import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

// Demo data for lessons
const DEMO_LESSONS = [
  {
    id: 1,
    title: "Coffee Shop Conversation",
    description: "Practice ordering coffee and having a casual conversation at a coffee shop",
    type: "dialog",
    content: {
      scenario: "You're at a coffee shop. The barista greets you.",
      bot_role: "barista",
      initial_message: "Hi there! Welcome to our coffee shop. What can I get for you today?",
      feedback_after_messages: 5
    }
  },
  {
    id: 2,
    title: "Basic Grammar Quiz",
    description: "Test your knowledge of basic grammar rules",
    type: "quiz",
    content: {
      questions: [
        {
          id: 1,
          question: "Which sentence is grammatically correct?",
          options: [
            "I am going to the store yesterday",
            "I went to the store yesterday",
            "I going to the store yesterday",
            "I goes to the store yesterday"
          ],
          correct_answer: "I went to the store yesterday"
        },
        {
          id: 2,
          question: "Choose the correct article: ___ apple is red.",
          options: ["a", "an", "the", "none"],
          correct_answer: "an"
        },
        {
          id: 3,
          question: "Which is the correct past tense of 'go'?",
          options: ["goed", "went", "gone", "going"],
          correct_answer: "went"
        }
      ]
    }
  },
  {
    id: 3,
    title: "Vocabulary Quiz",
    description: "Test your knowledge of common vocabulary",
    type: "quiz",
    content: {
      questions: [
        {
          id: 1,
          question: "What is the opposite of 'hot'?",
          options: ["warm", "cold", "cool", "freezing"],
          correct_answer: "cold"
        },
        {
          id: 2,
          question: "Which word means 'very happy'?",
          options: ["sad", "angry", "delighted", "tired"],
          correct_answer: "delighted"
        },
        {
          id: 3,
          question: "What is a synonym for 'big'?",
          options: ["small", "tiny", "huge", "little"],
          correct_answer: "huge"
        }
      ]
    }
  }
];

// Demo data for learning tips
const DEMO_TIPS = [
  "Practice speaking every day, even if it's just for a few minutes",
  "Watch movies and TV shows in the language you're learning",
  "Use language learning apps to build vocabulary",
  "Find a language exchange partner to practice with",
  "Read books and articles in the target language",
  "Listen to podcasts and music in the language",
  "Keep a vocabulary notebook",
  "Set specific, achievable goals",
  "Don't be afraid to make mistakes",
  "Immerse yourself in the language as much as possible"
];

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Use demo data instead of API calls
    setLessons(DEMO_LESSONS);
    setTips(DEMO_TIPS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedLesson?.type === 'dialog') {
      setMessages([{
        role: 'bot',
        content: selectedLesson.content.initial_message
      }]);
      setMessageCount(0);
      setShowFeedback(false);
    }
  }, [selectedLesson]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const question = selectedLesson.content.questions[currentQuestion];
    const isAnswerCorrect = selectedAnswer === question.correct_answer;
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < selectedLesson.content.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setSelectedLesson(null);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: newMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setMessageCount(prev => prev + 1);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        role: 'bot',
        content: "That's a great response! Let's continue the conversation."
      };
      setMessages(prev => [...prev, botMessage]);

      if (messageCount + 1 >= selectedLesson.content.feedback_after_messages) {
        setShowFeedback(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // TOP: All imports remain unchanged
// Replace component body only

return (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Typography variant="h4" fontWeight={600} gutterBottom>
      Language Lessons
    </Typography>

    <Grid container spacing={4}>
      {/* Main Content Area */}
      <Grid item xs={12} md={9}>
        {!selectedLesson ? (
          <>
            <Typography variant="h5" gutterBottom>
              Choose a Lesson
            </Typography>
            <Grid container spacing={3}>
              {lessons.map((lesson) => (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: 3,
                      bgcolor: '#0c2548',
                      color: 'white',
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      {lesson.type === 'dialog' ? (
                        <ChatIcon sx={{ mr: 1, color: '#90caf9' }} />
                      ) : (
                        <QuizIcon sx={{ mr: 1, color: '#ffcc80' }} />
                      )}
                      <Typography variant="h6">{lesson.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="grey.300" mb={2}>
                      {lesson.description}
                    </Typography>
                    <Box mt="auto">
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={() => handleStartLesson(lesson)}
                        endIcon={<SchoolIcon />}
                      >
                        Start
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={2}>
              <Button variant="outlined" onClick={() => setSelectedLesson(null)} sx={{ mr: 2 }}>
                Back
              </Button>
              <Typography variant="h5">{selectedLesson.title}</Typography>
            </Box>

            {selectedLesson.type === 'quiz' ? (
              <Paper sx={{ p: 3, bgcolor: '#163a61', borderRadius: 2, color: 'white' }}>
                {!showResult ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Question {currentQuestion + 1} of {selectedLesson.content.questions.length}
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedLesson.content.questions[currentQuestion].question}
                    </Typography>
                    <FormControl>
                      <RadioGroup
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                      >
                        {selectedLesson.content.questions[currentQuestion].options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio sx={{ color: 'white' }} />}
                            label={<Typography color="white">{option}</Typography>}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                      >
                        Submit
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
                      {isCorrect ? "Correct!" : "Incorrect. Try again!"}
                    </Alert>
                    <Button variant="contained" onClick={handleNextQuestion}>
                      {currentQuestion < selectedLesson.content.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 3, bgcolor: '#163a61', borderRadius: 2, color: 'white' }}>
                <Typography variant="subtitle1" mb={2}>
                  {selectedLesson.content.scenario}
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#0c2548',
                    p: 2,
                    borderRadius: 2,
                    height: '300px',
                    overflowY: 'auto',
                    mb: 2,
                  }}
                >
                  {messages.map((msg, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                      mb={1}
                    >
                      <Box
                        sx={{
                          bgcolor: msg.role === 'user' ? '#1976d2' : '#37474f',
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          maxWidth: '70%',
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    endIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Box>
                {showFeedback && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Great job! You’ve reached the feedback point.
                  </Alert>
                )}
              </Paper>
            )}
          </>
        )}
      </Grid>

      {/* Sidebar Tips */}
      <Grid item xs={12} md={3}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: '#0c2548', // Dark blue background
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" mb={1}>
          <LightbulbIcon sx={{ color: '#fdd835', mr: 1 }} /> {/* Bright yellow bulb */}
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Learning Tips
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
        <List dense>
          {tips.slice(0, 6).map((tip, index) => (
            <ListItem key={index} sx={{ color: 'white' }}>
              <ListItemIcon>
                <SchoolIcon sx={{ color: '#90caf9' }} /> {/* Light blue icon */}
              </ListItemIcon>
              <ListItemText
                primary={tip}
                primaryTypographyProps={{ sx: { color: 'white' } }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      </Grid>
    </Grid>
  </Container>
);
};

export default LessonsPage;
