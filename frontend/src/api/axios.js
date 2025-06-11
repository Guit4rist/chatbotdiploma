// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chatbotdiploma.onrender.com/api', // Updated to include /api prefix
  withCredentials: true, // Required if using cookies/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
