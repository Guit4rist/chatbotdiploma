// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chatbotdiploma.onrender.com/api', // Updated to include /api prefix
  withCredentials: true, // Required if using cookies/auth
});

export default instance;
