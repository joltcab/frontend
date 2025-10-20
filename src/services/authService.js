import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  adminLogin: async (credentials) => {
    console.log('📤 Sending admin login request:', { email: credentials.email });
    const response = await api.post('/api/auth/admin/login', credentials);
    console.log('📥 Admin login response:', response.data);
    console.log('🔑 Token in response:', response.data.token ? 'YES' : 'NO');
    
    if (response.data.token) {
      console.log('💾 Saving token to localStorage...');
      localStorage.setItem('token', response.data.token);
      console.log('✅ Token saved:', localStorage.getItem('token') ? 'YES' : 'NO');
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ User saved to localStorage');
      }
    } else {
      console.error('❌ No token in response!');
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login correcto según la ruta actual
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      window.location.href = '/admin';
    } else {
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
