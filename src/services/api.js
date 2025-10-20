import axios from 'axios';

// In development, use the proxy. In production, use the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies de sesión
});

// Interceptor para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir al login correcto según la ruta actual
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin';
      } else if (currentPath.startsWith('/driver')) {
        window.location.href = '/login';
      } else if (currentPath.startsWith('/user')) {
        window.location.href = '/login';
      } else if (currentPath.startsWith('/partner')) {
        window.location.href = '/login';
      } else if (currentPath.startsWith('/corporate')) {
        window.location.href = '/login';
      } else if (currentPath.startsWith('/dispatcher')) {
        window.location.href = '/login';
      } else if (currentPath.startsWith('/hotel')) {
        window.location.href = '/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
