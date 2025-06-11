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
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/axios';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsResponse, tipsResponse] = await Promise.all([
          api.get('/lessons'),
          api.get('/lessons/tips')
        ]);
        setLessons(lessonsResponse.data);
        setTips(tipsResponse.data.tips);
      } catch (error) {
        console.error('Error fetching lessons data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await api.post('/lessons/quiz/check', {
        lesson_id: selectedLesson.id,
        question_id: selectedLesson.content.questions[currentQuestion].id,
        answer: selectedAnswer,
        user_id: user.id
      });

      setIsCorrect(response.data.is_correct);
      setShowResult(true);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: newMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setMessageCount(prev => prev + 1);

    try {
      const response = await api.post('/chat/send', {
        message: newMessage,
        user_id: user.id,
        chat_session_id: null,
        language: user.preferred_language,
        conversation_style: 'formal'
      });

      const botMessage = {
        role: 'bot',
        content: response.data.bot_response
      };

      setMessages(prev => [...prev, botMessage]);

      // Check if we should show feedback
      if (messageCount + 1 >= selectedLesson.content.feedback_after_messages) {
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
                        {lesson.type === 'dialog' && (
                          <Typography variant="body2" color="text.secondary">
                            Scenario: {lesson.content.scenario}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => handleStartLesson(lesson)}
                        >
                          Start {lesson.type === 'dialog' ? 'Conversation' : 'Quiz'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {selectedLesson.title}
                </Typography>

                {selectedLesson.type === 'quiz' ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Question {currentQuestion + 1} of {selectedLesson.content.questions.length}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedLesson.content.questions[currentQuestion].question}
                    </Typography>

                    <FormControl component="fieldset">
                      <FormLabel component="legend">Select your answer:</FormLabel>
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
                            disabled={showResult}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {showResult && (
                      <Alert
                        severity={isCorrect ? "success" : "error"}
                        sx={{ mt: 2 }}
                      >
                        {isCorrect
                          ? 'Correct! Well done!'
                          : `Incorrect. The correct answer is: ${selectedLesson.content.questions[currentQuestion].correct_answer}`}
                      </Alert>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      {!showResult ? (
                        <Button
                          variant="contained"
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <Button variant="contained" onClick={handleNextQuestion}>
                          {currentQuestion < selectedLesson.content.questions.length - 1
                            ? 'Next Question'
                            : 'Finish Quiz'}
                        </Button>
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" paragraph>
                      {selectedLesson.content.scenario}
                    </Typography>

                    <Paper
                      sx={{
                        height: '400px',
                        overflow: 'auto',
                        mb: 2,
                        p: 2,
                        bgcolor: 'grey.50'
                      }}
                    >
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
                              bgcolor: message.role === 'user' ? 'primary.light' : 'grey.200'
                            }}
                          >
                            <Typography>{message.content}</Typography>
                          </Paper>
                        </Box>
                      ))}
                      <div ref={messagesEndRef} />
                    </Paper>

                    {showFeedback && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        You've completed {selectedLesson.content.feedback_after_messages} messages! 
                        Would you like to get feedback on your conversation?
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        endIcon={<SendIcon />}
                      >
                        Send
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Learning Tips Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LightbulbIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Learning Tips</Typography>
            </Box>
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
