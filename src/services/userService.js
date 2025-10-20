import api from './api';

export const userService = {
  // Profile
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
  uploadPhoto: (formData) => api.post('/api/user/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // Trips
  getTrips: (params) => api.get('/api/user/trips', { params }),
  getTrip: (id) => api.get(`/api/user/trips/${id}`),
  cancelTrip: (id) => api.put(`/api/user/trips/${id}/cancel`),

  // Booking
  requestRide: (data) => api.post('/api/user/trips/request', data),
  calculatePrice: (data) => api.post('/api/user/trips/calculate-price', data),

  // Payment
  getPaymentMethods: () => api.get('/api/user/payment/methods'),
  addPaymentMethod: (data) => api.post('/api/user/payment/methods', data),
  deletePaymentMethod: (id) => api.delete(`/api/user/payment/methods/${id}`),
  getPaymentHistory: () => api.get('/api/user/payment/history'),

  // Wallet
  getWallet: () => api.get('/api/user/wallet'),
  addFunds: (amount) => api.post('/api/user/wallet/add', { amount }),

  // Support
  createTicket: (data) => api.post('/api/user/support/tickets', data),
  getTickets: () => api.get('/api/user/support/tickets'),
};

export default userService;
