import axios from 'axios';

const API = axios.create({
  baseURL: 'https://gym-management-6wpz.onrender.com',
});

// Interceptor to add auth token to requests
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
