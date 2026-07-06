import axios from 'axios';

// 1. Base URL configuration
// By leaving this empty, requests will be made to the current origin (e.g., http://localhost:5173)
// and Vite's dev server proxy will forward them to the backend (http://127.0.0.1:8000)
// This completely bypasses CORS issues!
const API_URL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Request Interceptor
// Attaches the JWT token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// Handles global errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // If we receive a 401 Unauthorized, automatically log the user out
      if (error.response.status === 401) {
        console.warn('Unauthorized request. Logging out...');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Global error handling can be expanded here (e.g., dispatching a global toast event)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
