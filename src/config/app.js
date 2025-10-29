/**
 * App Configuration
 */

export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'JoltCab',
  version: import.meta.env.VITE_APP_VERSION || '2.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  
  // Branding
  logo: '/logo.png',
  favicon: '/favicon.ico',
  
  // Colors
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4CAF50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196F3',
  },
  
  // Features
  features: {
    aiMatching: true,
    dynamicPricing: true,
    whatsappBooking: true,
    realtime: true,
    verification: true,
    payments: true,
  },
  
  // Map
  map: {
    defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York
    defaultZoom: 12,
  },
};

export default appConfig;
