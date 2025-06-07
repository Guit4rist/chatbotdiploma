const LessonPage = () => {
  const [responsesMap, setResponsesMap] = useState({});
  const [userInputMap, setUserInputMap] = useState({});
  const [stepMap, setStepMap] = useState({});

  const handleNext = (lessonId) => {
    const currentInput = userInputMap[lessonId] || '';
    const currentResponses = responsesMap[lessonId] || [];
    const currentStep = stepMap[lessonId] || 0;

    if (currentInput.trim()) {
      setResponsesMap({ ...responsesMap, [lessonId]: [...currentResponses, currentInput] });
      setUserInputMap({ ...userInputMap, [lessonId]: '' });
      setStepMap({ ...stepMap, [lessonId]: currentStep + 1 });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Lessons</Typography>

      {lessons.map((lesson) => {
        const responses = responsesMap[lesson.id] || [];
        const userInput = userInputMap[lesson.id] || '';
        const currentStep = stepMap[lesson.id] || 0;

        return (
          <Box key={lesson.id} sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom>{lesson.title}</Typography>

            {lesson.type === 'scenario' && (
              <>
                {lesson.steps.slice(0, currentStep + 1).map((step, idx) => (
                  <Card key={idx} sx={{ mb: 1, backgroundColor: step.speaker === 'ai' ? '#e0f7fa' : '#fce4ec' }}>
                    <CardContent>
                      <Typography><strong>{step.speaker === 'ai' ? 'AI' : 'You'}:</strong> {step.text || responses[idx]}</Typography>
                    </CardContent>
                  </Card>
                ))}

                {currentStep < lesson.steps.length && lesson.steps[currentStep].speaker === 'user' && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Your Response"
                      value={userInput}
                      onChange={(e) => setUserInputMap({ ...userInputMap, [lesson.id]: e.target.value })}
                    />
                    <Button variant="contained" onClick={() => handleNext(lesson.id)}>Submit</Button>
                  </Box>
                )}

                {currentStep === lesson.steps.length && (
                  <Typography sx={{ mt: 2 }}>{lesson.feedbackInstruction}</Typography>
                )}
              </>
            )}

            {lesson.type === 'quiz' && (
              <>
                {lesson.questions.map((q, idx) => (
                  <Card key={idx} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography><strong>Q{idx + 1}:</strong> {q.question}</Typography>
                      {q.options.map((opt, i) => (
                        <Typography key={i}>{String.fromCharCode(65 + i)}. {opt}</Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Box>
        );
      })}
    </Container>
  );
};
