// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chatbotdiploma.onrender.com', // Your backend base URL
  withCredentials: true, // Required if using cookies/auth
});

export default instance;
