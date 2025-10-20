import api from './api';

const adminService = {
  // Dashboard stats
  getDashboardStats: () => api.get('/api/admin/dashboard/stats'),

  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  createUser: (data) => api.post('/api/admin/users', data),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Drivers
  getDrivers: (params) => api.get('/api/admin/drivers', { params }),
  getDriver: (id) => api.get(`/api/admin/drivers/${id}`),
  createDriver: (data) => api.post('/api/admin/drivers', data),
  updateDriver: (id, data) => api.put(`/api/admin/drivers/${id}`, data),
  deleteDriver: (id) => api.delete(`/api/admin/drivers/${id}`),
  suspendDriver: (id) => api.put(`/api/admin/drivers/${id}/suspend`),

  // Trips
  getTrips: (params) => api.get('/api/admin/trips', { params }),
  getTrip: (id) => api.get(`/api/admin/trips/${id}`),

  // Earnings
  getEarnings: (params) => api.get('/api/admin/earnings', { params }),
  getEarningsByPayment: () => api.get('/api/admin/earnings/by-payment'),
  getTopDrivers: () => api.get('/api/admin/earnings/top-drivers'),

  // Promo Codes
  getPromos: (params) => api.get('/api/admin/promos', { params }),
  getPromo: (id) => api.get(`/api/admin/promos/${id}`),
  createPromo: (data) => api.post('/api/admin/promos', data),
  updatePromo: (id, data) => api.put(`/api/admin/promos/${id}`, data),
  deletePromo: (id) => api.delete(`/api/admin/promos/${id}`),
  deactivatePromo: (id) => api.put(`/api/admin/promos/${id}/deactivate`),

  // Cities & Zones
  getCities: (params) => api.get('/api/admin/cities', { params }),
  getCity: (id) => api.get(`/api/admin/cities/${id}`),
  createCity: (data) => api.post('/api/admin/cities', data),
  updateCity: (id, data) => api.put(`/api/admin/cities/${id}`, data),
  deleteCity: (id) => api.delete(`/api/admin/cities/${id}`),

  // Settings
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (data) => api.put('/api/admin/settings', data),

  // Reviews
  getReviews: (params) => api.get('/api/admin/reviews', { params }),
  getReview: (id) => api.get(`/api/admin/reviews/${id}`),
  deleteReview: (id) => api.delete(`/api/admin/reviews/${id}`),

  // Service Types
  getServiceTypes: (params) => api.get('/api/admin/service-types', { params }),
  getServiceType: (id) => api.get(`/api/admin/service-types/${id}`),
  createServiceType: (data) => api.post('/api/admin/service-types', data),
  updateServiceType: (id, data) => api.put(`/api/admin/service-types/${id}`, data),
  deleteServiceType: (id) => api.delete(`/api/admin/service-types/${id}`),

  // Documents
  getDocuments: (params) => api.get('/api/admin/documents', { params }),
  getDocument: (id) => api.get(`/api/admin/documents/${id}`),
  approveDocument: (id) => api.put(`/api/admin/documents/${id}/approve`),
  rejectDocument: (id, data) => api.put(`/api/admin/documents/${id}/reject`, data),

  // Transactions
  getTransactions: (params) => api.get('/api/admin/transactions', { params }),
  getTransaction: (id) => api.get(`/api/admin/transactions/${id}`),
  getPendingPayments: (params) => api.get('/api/admin/transactions/pending', { params }),
  processPayment: (id, data) => api.post(`/api/admin/transactions/${id}/process`, data),

  // Notifications
  sendMassNotification: (data) => api.post('/api/admin/notifications/mass', data),
  sendMassSMS: (data) => api.post('/api/admin/notifications/mass-sms', data),
  getNotifications: (params) => api.get('/api/admin/notifications', { params }),

  // Admins
  getAdmins: (params) => api.get('/api/admin/admins', { params }),
  getAdmin: (id) => api.get(`/api/admin/admins/${id}`),
  createAdmin: (data) => api.post('/api/admin/admins', data),
  updateAdmin: (id, data) => api.put(`/api/admin/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/api/admin/admins/${id}`),

  // Corporate
  getCorporate: (params) => api.get('/api/admin/corporate', { params }),
  getCorporateAccount: (id) => api.get(`/api/admin/corporate/${id}`),
  createCorporate: (data) => api.post('/api/admin/corporate', data),
  updateCorporate: (id, data) => api.put(`/api/admin/corporate/${id}`, data),
  deleteCorporate: (id) => api.delete(`/api/admin/corporate/${id}`),

  // Dispatchers
  getDispatchers: (params) => api.get('/api/admin/dispatchers', { params }),
  getDispatcher: (id) => api.get(`/api/admin/dispatchers/${id}`),
  createDispatcher: (data) => api.post('/api/admin/dispatchers', data),
  updateDispatcher: (id, data) => api.put(`/api/admin/dispatchers/${id}`, data),
  deleteDispatcher: (id) => api.delete(`/api/admin/dispatchers/${id}`),

  // Partners
  getPartners: (params) => api.get('/api/admin/partners', { params }),
  getPartner: (id) => api.get(`/api/admin/partners/${id}`),
  createPartner: (data) => api.post('/api/admin/partners', data),
  updatePartner: (id, data) => api.put(`/api/admin/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/api/admin/partners/${id}`),

  // Hotels
  getHotels: (params) => api.get('/api/admin/hotels', { params }),
  getHotel: (id) => api.get(`/api/admin/hotels/${id}`),
  createHotel: (data) => api.post('/api/admin/hotels', data),
  updateHotel: (id, data) => api.put(`/api/admin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/api/admin/hotels/${id}`),

  // Support
  getSupportTickets: (params) => api.get('/api/admin/support', { params }),
  getSupportTicket: (id) => api.get(`/api/admin/support/${id}`),
  updateSupportTicket: (id, data) => api.put(`/api/admin/support/${id}`, data),
  closeSupportTicket: (id) => api.put(`/api/admin/support/${id}/close`),

  // Referrals
  getUserReferrals: (params) => api.get('/api/admin/referrals/users', { params }),
  getDriverReferrals: (params) => api.get('/api/admin/referrals/drivers', { params }),

  // Scheduled Trips
  getScheduledTrips: (params) => api.get('/api/admin/schedules', { params }),
  getScheduledTrip: (id) => api.get(`/api/admin/schedules/${id}`),
  cancelScheduledTrip: (id, data) => api.put(`/api/admin/schedules/${id}/cancel`, data),

  // User Documents
  getUserDocuments: (params) => api.get('/api/admin/user-documents', { params }),
  approveUserDocument: (id) => api.put(`/api/admin/user-documents/${id}/approve`),
  rejectUserDocument: (id, data) => api.put(`/api/admin/user-documents/${id}/reject`, data),

  // Promo Usage
  getUsedPromos: (params) => api.get('/api/admin/promos/usage', { params }),

  // Chat History
  getChatHistory: (params) => api.get('/api/admin/chat-history', { params }),
  getChatMessages: (chatId) => api.get(`/api/admin/chat-history/${chatId}/messages`),

  // Wallet
  getWalletTransactions: (params) => api.get('/api/admin/wallet-transactions', { params }),
  addWalletCredit: (userId, data) => api.post(`/api/admin/wallet/${userId}/credit`, data),
  deductWalletBalance: (userId, data) => api.post(`/api/admin/wallet/${userId}/debit`, data),

  // Provider Documents
  getProviderDocuments: (providerId) => api.get(`/api/admin/providers/${providerId}/documents`),
  getProviderDocument: (id) => api.get(`/api/admin/provider-documents/${id}`),
  updateProviderDocument: (id, data) => api.put(`/api/admin/provider-documents/${id}`, data),
  approveProviderDocument: (id) => api.put(`/api/admin/provider-documents/${id}/approve`),
  rejectProviderDocument: (id, data) => api.put(`/api/admin/provider-documents/${id}/reject`, data),

  // Provider Vehicles
  getProviderVehicles: (params) => api.get('/api/admin/provider-vehicles', { params }),
  getProviderVehicle: (id) => api.get(`/api/admin/provider-vehicles/${id}`),
  updateProviderVehicle: (id, data) => api.put(`/api/admin/provider-vehicles/${id}`, data),
  deleteProviderVehicle: (id) => api.delete(`/api/admin/provider-vehicles/${id}`),

  // Vehicle Documents
  getVehicleDocuments: (params) => api.get('/api/admin/vehicle-documents', { params }),
  getVehicleDocument: (id) => api.get(`/api/admin/vehicle-documents/${id}`),
  updateVehicleDocument: (id, data) => api.put(`/api/admin/vehicle-documents/${id}`, data),
  approveVehicleDocument: (id) => api.put(`/api/admin/vehicle-documents/${id}/approve`),
  rejectVehicleDocument: (id, data) => api.put(`/api/admin/vehicle-documents/${id}/reject`, data),

  // Provider Bank Details
  getProviderBankDetails: (params) => api.get('/api/admin/provider-bank-details', { params }),
  
  // Provider Tracking
  getOnlineProviders: (params) => api.get('/api/admin/providers/online', { params }),
  
  // Provider Referrals
  getProviderReferralHistory: (params) => api.get('/api/admin/provider-referrals/history', { params }),
  getProviderReferralReport: (params) => api.get('/api/admin/provider-referrals/report', { params }),

  // Trip Management
  getTrip: (id) => api.get(`/api/admin/trips/${id}`),
  getTripEarning: (id) => api.get(`/api/admin/trips/${id}/earning`),
  getActiveTrips: (params) => api.get('/api/admin/trips/active', { params }),

  // Provider Earnings
  getProviderDailyEarnings: (params) => api.get('/api/admin/provider-earnings/daily', { params }),
  getProviderWeeklyEarnings: (params) => api.get('/api/admin/provider-earnings/weekly', { params }),
  getProviderEarnings: (params) => api.get('/api/admin/provider-earnings', { params }),
  getProviderEarningsReport: (params) => api.get('/api/admin/provider-earnings/report', { params }),
  
  // Provider Payments
  getPendingPayments: (params) => api.get('/api/admin/provider-payments/pending', { params }),
  processPayments: (data) => api.post('/api/admin/provider-payments/process', data),
  getProviderPaymentHistory: (params) => api.get('/api/admin/provider-payments/history', { params }),

  // Mass Communications
  sendMassNotification: (data) => api.post('/api/admin/notifications/mass', data),
  sendMassSMS: (data) => api.post('/api/admin/sms/mass', data),
  
  // Promo Codes
  getPromoCode: (id) => api.get(`/api/admin/promo-codes/${id}`),
  createPromoCode: (data) => api.post('/api/admin/promo-codes', data),
  updatePromoCode: (id, data) => api.put(`/api/admin/promo-codes/${id}`, data),
  
  // Reviews
  getReview: (id) => api.get(`/api/admin/reviews/${id}`),
  approveReview: (id) => api.put(`/api/admin/reviews/${id}/approve`),
  rejectReview: (id, data) => api.put(`/api/admin/reviews/${id}/reject`, data),
  deleteReview: (id) => api.delete(`/api/admin/reviews/${id}`),

  // Configuration
  getCity: (id) => api.get(`/api/admin/cities/${id}`),
  createCity: (data) => api.post('/api/admin/cities', data),
  updateCity: (id, data) => api.put(`/api/admin/cities/${id}`, data),
  
  getServiceType: (id) => api.get(`/api/admin/service-types/${id}`),
  createServiceType: (data) => api.post('/api/admin/service-types', data),
  updateServiceType: (id, data) => api.put(`/api/admin/service-types/${id}`, data),
  
  getCancellationReasons: (params) => api.get('/api/admin/cancellation-reasons', { params }),
  createCancellationReason: (data) => api.post('/api/admin/cancellation-reasons', data),
  updateCancellationReason: (id, data) => api.put(`/api/admin/cancellation-reasons/${id}`, data),
  deleteCancellationReason: (id) => api.delete(`/api/admin/cancellation-reasons/${id}`),
  
  getTermsAndPrivacySettings: () => api.get('/api/admin/settings/terms-privacy'),
  updateTermsAndPrivacySettings: (data) => api.put('/api/admin/settings/terms-privacy', data),
  
  getInstallationSettings: () => api.get('/api/admin/settings/installation'),
  updateInstallationSettings: (data) => api.put('/api/admin/settings/installation', data),

  // Business Accounts
  getCorporateAccount: (id) => api.get(`/api/admin/corporate/${id}`),
  createCorporateAccount: (data) => api.post('/api/admin/corporate', data),
  updateCorporateAccount: (id, data) => api.put(`/api/admin/corporate/${id}`, data),
  
  getDispatcher: (id) => api.get(`/api/admin/dispatchers/${id}`),
  createDispatcher: (data) => api.post('/api/admin/dispatchers', data),
  updateDispatcher: (id, data) => api.put(`/api/admin/dispatchers/${id}`, data),
  
  getHotel: (id) => api.get(`/api/admin/hotels/${id}`),
  createHotel: (data) => api.post('/api/admin/hotels', data),
  updateHotel: (id, data) => api.put(`/api/admin/hotels/${id}`, data),
  
  getPartner: (id) => api.get(`/api/admin/partners/${id}`),
  createPartner: (data) => api.post('/api/admin/partners', data),
  updatePartner: (id, data) => api.put(`/api/admin/partners/${id}`, data),

  // Countries
  getCountries: (params) => api.get('/api/admin/countries', { params }),
  getCountry: (id) => api.get(`/api/admin/countries/${id}`),
  createCountry: (data) => api.post('/api/admin/countries', data),
  updateCountry: (id, data) => api.put(`/api/admin/countries/${id}`, data),
  deleteCountry: (id) => api.delete(`/api/admin/countries/${id}`),

  // Languages
  getLanguages: (params) => api.get('/api/admin/languages', { params }),
  getLanguage: (id) => api.get(`/api/admin/languages/${id}`),
  createLanguage: (data) => api.post('/api/admin/languages', data),
  updateLanguage: (id, data) => api.put(`/api/admin/languages/${id}`, data),
  deleteLanguage: (id) => api.delete(`/api/admin/languages/${id}`),

  // Email Templates
  getEmailTemplates: (params) => api.get('/api/admin/email-templates', { params }),
  getEmailTemplate: (id) => api.get(`/api/admin/email-templates/${id}`),
  createEmailTemplate: (data) => api.post('/api/admin/email-templates', data),
  updateEmailTemplate: (id, data) => api.put(`/api/admin/email-templates/${id}`, data),
  deleteEmailTemplate: (id) => api.delete(`/api/admin/email-templates/${id}`),

  // SMS Templates
  getSMSTemplates: (params) => api.get('/api/admin/sms-templates', { params }),
  getSMSTemplate: (id) => api.get(`/api/admin/sms-templates/${id}`),
  createSMSTemplate: (data) => api.post('/api/admin/sms-templates', data),
  updateSMSTemplate: (id, data) => api.put(`/api/admin/sms-templates/${id}`, data),
  deleteSMSTemplate: (id) => api.delete(`/api/admin/sms-templates/${id}`),

  // Block/Unblock Users
  blockUser: (id, data) => api.put(`/api/admin/users/${id}/block`, data),
  unblockUser: (id) => api.put(`/api/admin/users/${id}/unblock`),

  // Approve Drivers
  approveDriver: (id) => api.put(`/api/admin/drivers/${id}/approve`),

  // City Service Type Associations
  getCityServiceTypes: (params) => api.get('/api/admin/city-service-types', { params }),
  getCityServiceType: (id) => api.get(`/api/admin/city-service-types/${id}`),
  createCityServiceType: (data) => api.post('/api/admin/city-service-types', data),
  updateCityServiceType: (id, data) => api.put(`/api/admin/city-service-types/${id}`, data),
  deleteCityServiceType: (id) => api.delete(`/api/admin/city-service-types/${id}`),
};

export default adminService;
