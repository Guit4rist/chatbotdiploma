import axios from "./axios"; // your axios instance with auth headers

// Fetch chat sessions for the user
export const fetchChatSessions = async (user_id) => {
  const res = await axios.get(`/chat-sessions/user/${user_id}`);
  return res.data;
};

// Create a new chat session
export const createChatSession = async (user_id, title = "New Chat") => {
  const res = await axios.post("/chat-sessions/", { user_id, title });
  return res.data;
};

// Delete a chat session
export const deleteChatSession = async (chat_session_id) => {
  const res = await axios.delete(`/chat-sessions/${chat_session_id}`);
  return res.data;
};

// Send a message to the chatbot
export const sendMessageToBot = async ({
  message,
  user_id,
  chat_session_id,
  language = "English"
}) => {
  const payload = {
    message,
    user_id,
    chat_session_id,
    language,
  };
  
  console.log("Sending to bot:", {
  message,
  user_id,
  chat_session_id,
  language
});


  try {
    const res = await axios.post("/chat", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to send message to chatbot:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch conversation history (optionally filtered by session)
export const fetchConversationHistory = async (user_id, chat_session_id = null) => {
  const res = await axios.get(`/conversations/history/${user_id}`, {
    params: chat_session_id ? { chat_session_id } : {},
  });
  return res.data;
};
