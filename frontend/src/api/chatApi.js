import axios from "./axios"; // your axios instance with auth headers

// Fetch chat sessions for the user
export const fetchChatSessions = async (userId) => {
  const res = await axios.get(`/chat-sessions/user/${userId}`);
  return res.data;
};

// Create a new chat session
export const createChatSession = async (userId, title = "New Chat") => {
  const res = await axios.post("/chat-sessions/", { user_id: userId, title });
  return res.data;
};

// Delete a chat session
export const deleteChatSession = async (sessionId) => {
  const res = await axios.delete(`/chat-sessions/${sessionId}`);
  return res.data;
};

// Send a message to the chatbot
export const sendMessageToBot = async ({
  message,
  userId,
  chatSessionId,
  language = "English"
}) => {
  const payload = {
    message,
    user_id: userId,
    chat_session_id: chatSessionId,
    language,
  };

  try {
    const res = await axios.post("/chat", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to send message to chatbot:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch conversation history (optional session filter)
export const fetchConversationHistory = async (userId, chatSessionId = null) => {
  const res = await axios.get(`/conversations/history/${userId}`, {
    params: chatSessionId ? { chat_session_id: chatSessionId } : {},
  });
  return res.data;
};
