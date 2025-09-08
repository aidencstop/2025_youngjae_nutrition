import axios from 'axios';

const baseURL = import.meta?.env?.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,          // 절대 http://localhost:8000 쓰지 말 것
  timeout: 20000,
  withCredentials: false, // 토큰 인증이면 false 권장
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
