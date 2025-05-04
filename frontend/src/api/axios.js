// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Your backend base URL
  withCredentials: true, // Required if using cookies/auth
});

export default instance;
