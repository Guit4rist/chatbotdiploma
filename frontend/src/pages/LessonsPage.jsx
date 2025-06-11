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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Language Lessons
      </Typography>

      <Grid container spacing={4}>
        {/* Lessons Section */}
        <Grid item xs={12} md={8}>
          {!selectedLesson ? (
            <>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Available Lessons
              </Typography>
              <Grid container spacing={3}>
                {lessons.map((lesson) => (
                  <Grid item xs={12} sm={6} key={lesson.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          {lesson.type === 'dialog' ? (
                            <ChatIcon color="primary" sx={{ mr: 1 }} />
                          ) : (
                            <QuizIcon color="primary" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="h6" component="h2">
                            {lesson.title}
                          </Typography>
                        </Box>
                        <Typography color="text.secondary" paragraph>
                          {lesson.description}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleStartLesson(lesson)}
                        >
                          Start Lesson
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Box display="flex" alignItems="center" mb={3}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedLesson(null)}
                  sx={{ mr: 2 }}
                >
                  Back to Lessons
                </Button>
                <Typography variant="h5">
                  {selectedLesson.title}
                </Typography>
              </Box>

              {selectedLesson.type === 'quiz' ? (
                <Paper sx={{ p: 3 }}>
                  {!showResult ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Question {currentQuestion + 1} of {selectedLesson.content.questions.length}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedLesson.content.questions[currentQuestion].question}
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={selectedAnswer}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                        >
                          {selectedLesson.content.questions[currentQuestion].options.map((option, index) => (
                            <FormControlLabel
                              key={index}
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                        >
                          Submit Answer
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
                        {isCorrect ? "Correct!" : "Incorrect. Try again!"}
                      </Alert>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNextQuestion}
                      >
                        {currentQuestion < selectedLesson.content.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                      </Button>
                    </Box>
                  )}
                </Paper>
              ) : (
                <Paper sx={{ p: 3, height: '60vh', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    {messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                            color: message.role === 'user' ? 'white' : 'text.primary'
                          }}
                        >
                          <Typography>{message.content}</Typography>
                        </Paper>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                </Paper>
              )}
            </>
          )}
        </Grid>

        {/* Tips Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon color="primary" sx={{ mr: 1 }} />
              Learning Tips
            </Typography>
            <List>
              {tips.map((tip, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                  {index < tips.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LessonsPage;
