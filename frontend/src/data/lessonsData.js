export const lessons = [
  {
    id: "scenario-hotel-checkin",
    title: "Scenario Dialog: Hotel Check-in",
    type: "scenario",
    steps: [
      { speaker: "ai", text: "Good evening! Welcome to the Grand Central Hotel. Do you have a reservation?" },
      { speaker: "user", expected: "Yes, I booked a room for two nights under the name John Smith." },
      { speaker: "ai", text: "Thank you, Mr. Smith. May I see your ID and credit card, please?" },
      { speaker: "user", expected: "Sure, here you go." },
      { speaker: "ai", text: "Perfect. You're in room 504. Here is your room key. Enjoy your stay!" },
    ],
    feedbackInstruction: "After your responses, the chatbot will provide feedback on your fluency and vocabulary usage."
  },
  {
    id: "quiz-greetings",
    title: "Quiz: Greetings and Introductions",
    type: "quiz",
    questions: [
      {
        question: "How do you say 'Nice to meet you' in a formal situation?",
        options: ["What's up?", "How's it going?", "Nice to meet you.", "Yo, nice to see ya!"],
        answer: 2
      },
      {
        question: "What is the correct response to 'How are you?'",
        options: ["I'm five.", "I’m fine, thank you.", "Because I said so.", "Go away."],
        answer: 1
      },
      {
        question: "Choose the correct introduction:",
        options: ["This my name John.", "Name I John.", "I John is name.", "My name is John."],
        answer: 3
      }
    ]
  }
];
