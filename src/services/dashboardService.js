import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: () => api.get('/api/admin/dashboard/stats'),

  // ============ USERS ============
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  createUser: (data) => api.post('/api/admin/users', data),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  blockUser: (id) => api.put(`/api/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/api/admin/users/${id}/unblock`),

  // ============ DRIVERS/PROVIDERS ============
  getDrivers: (params) => api.get('/api/admin/drivers', { params }),
  getDriver: (id) => api.get(`/api/admin/drivers/${id}`),
  createDriver: (data) => api.post('/api/admin/drivers', data),
  updateDriver: (id, data) => api.put(`/api/admin/drivers/${id}`, data),
  deleteDriver: (id) => api.delete(`/api/admin/drivers/${id}`),
  approveDriver: (id) => api.put(`/api/admin/drivers/${id}/approve`),
  suspendDriver: (id) => api.put(`/api/admin/drivers/${id}/suspend`),

  // ============ TRIPS ============
  getTrips: (params) => api.get('/api/admin/trips', { params }),
  getTrip: (id) => api.get(`/api/admin/trips/${id}`),

  // ============ EARNINGS ============
  getEarnings: (params) => api.get('/api/admin/earnings', { params }),
  getEarningsByPayment: () => api.get('/api/admin/earnings/by-payment'),
  getTopDrivers: () => api.get('/api/admin/earnings/top-drivers'),
  
  // Provider Earnings
  getProviderDailyEarnings: (params) => api.get('/api/admin/earnings/provider/daily', { params }),
  getProviderWeeklyEarnings: (params) => api.get('/api/admin/earnings/provider/weekly', { params }),
  getProviderAnalytics: (params) => api.get('/api/admin/earnings/provider/analytics', { params }),
  getProviderEarningsSummary: (providerId, params) => api.get(`/api/admin/earnings/provider/${providerId}/summary`, { params }),
  
  // Partner Earnings
  getPartnerWeeklyEarnings: (params) => api.get('/api/admin/earnings/partner/weekly', { params }),
  
  // Leaderboard
  getEarningsLeaderboard: (params) => api.get('/api/admin/earnings/leaderboard', { params }),

  // ============ PAYMENTS ============
  getPaymentTransactions: (params) => api.get('/api/admin/payments/transactions', { params }),
  getPaymentTransaction: (id) => api.get(`/api/admin/payments/transactions/${id}`),
  getPaymentStatistics: (params) => api.get('/api/admin/payments/statistics', { params }),
  getProviderPaymentHistory: (providerId, params) => api.get(`/api/admin/payments/provider/${providerId}`, { params }),
  getUserPaymentHistory: (userId, params) => api.get(`/api/admin/payments/user/${userId}`, { params }),
  getDailyRevenue: (params) => api.get('/api/admin/payments/revenue/daily', { params }),
  getRevenueByPaymentMethod: (params) => api.get('/api/admin/payments/revenue/by-method', { params }),
  getPendingPayouts: (params) => api.get('/api/admin/payments/pending-payouts', { params }),
  approvePayment: (id) => api.put(`/api/admin/payments/transactions/${id}/approve`),

  // ============ PROMO CODES ============
  getPromos: (params) => api.get('/api/admin/promos', { params }),
  getPromo: (id) => api.get(`/api/admin/promos/${id}`),
  createPromo: (data) => api.post('/api/admin/promos', data),
  updatePromo: (id, data) => api.put(`/api/admin/promos/${id}`, data),
  deletePromo: (id) => api.delete(`/api/admin/promos/${id}`),
  deactivatePromo: (id) => api.put(`/api/admin/promos/${id}/deactivate`),

  // ============ CITIES ============
  getCities: (params) => api.get('/api/admin/cities', { params }),
  getCity: (id) => api.get(`/api/admin/cities/${id}`),
  createCity: (data) => api.post('/api/admin/cities', data),
  updateCity: (id, data) => api.put(`/api/admin/cities/${id}`, data),
  deleteCity: (id) => api.delete(`/api/admin/cities/${id}`),

  // ============ COUNTRIES ============
  getCountries: (params) => api.get('/api/admin/countries', { params }),
  getCountry: (id) => api.get(`/api/admin/countries/${id}`),
  createCountry: (data) => api.post('/api/admin/countries', data),
  updateCountry: (id, data) => api.put(`/api/admin/countries/${id}`, data),
  deleteCountry: (id) => api.delete(`/api/admin/countries/${id}`),

  // ============ SERVICE TYPES ============
  getServiceTypes: (params) => api.get('/api/admin/service-types', { params }),
  getServiceType: (id) => api.get(`/api/admin/service-types/${id}`),
  createServiceType: (data) => api.post('/api/admin/service-types', data),
  updateServiceType: (id, data) => api.put(`/api/admin/service-types/${id}`, data),
  deleteServiceType: (id) => api.delete(`/api/admin/service-types/${id}`),

  // ============ CANCELLATION REASONS ============
  getCancellationReasons: (params) => api.get('/api/admin/cancellation-reasons', { params }),
  createCancellationReason: (data) => api.post('/api/admin/cancellation-reasons', data),
  updateCancellationReason: (id, data) => api.put(`/api/admin/cancellation-reasons/${id}`, data),
  deleteCancellationReason: (id) => api.delete(`/api/admin/cancellation-reasons/${id}`),

  // ============ REVIEWS ============
  getReviews: (params) => api.get('/api/admin/reviews', { params }),
  approveReview: (id) => api.put(`/api/admin/reviews/${id}/approve`),
  deleteReview: (id) => api.delete(`/api/admin/reviews/${id}`),

  // ============ WALLET TRANSACTIONS ============
  getWalletTransactions: (params) => api.get('/api/admin/wallet-transactions', { params }),
  getWalletHistory: (params) => api.get('/api/admin/wallet/history', { params }),
  getWalletTransaction: (id) => api.get(`/api/admin/wallet/transactions/${id}`),
  createWalletTransaction: (data) => api.post('/api/admin/wallet/transactions', data),
  updateWalletTransactionStatus: (id, data) => api.put(`/api/admin/wallet/transactions/${id}/status`, data),
  getWalletBalance: (params) => api.get('/api/admin/wallet/balance', { params }),
  getWalletStatistics: (params) => api.get('/api/admin/wallet/statistics', { params }),

  // ============ REFERRALS ============
  getUserReferrals: (params) => api.get('/api/admin/referrals/users', { params }),
  getDriverReferrals: (params) => api.get('/api/admin/referrals/drivers', { params }),

  // ============ LANGUAGES ============
  getLanguages: (params) => api.get('/api/admin/languages', { params }),
  createLanguage: (data) => api.post('/api/admin/languages', data),
  updateLanguage: (id, data) => api.put(`/api/admin/languages/${id}`, data),
  deleteLanguage: (id) => api.delete(`/api/admin/languages/${id}`),

  // ============ EMAIL TEMPLATES ============
  getEmailTemplates: (params) => api.get('/api/admin/email-templates', { params }),
  createEmailTemplate: (data) => api.post('/api/admin/email-templates', data),
  updateEmailTemplate: (id, data) => api.put(`/api/admin/email-templates/${id}`, data),
  deleteEmailTemplate: (id) => api.delete(`/api/admin/email-templates/${id}`),

  // ============ SMS TEMPLATES ============
  getSMSTemplates: (params) => api.get('/api/admin/sms-templates', { params }),
  createSMSTemplate: (data) => api.post('/api/admin/sms-templates', data),
  updateSMSTemplate: (id, data) => api.put(`/api/admin/sms-templates/${id}`, data),
  deleteSMSTemplate: (id) => api.delete(`/api/admin/sms-templates/${id}`),

  // ============ SETTINGS ============
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (data) => api.put('/api/admin/settings', data),
  
  // ============ INSTALLATION SETTINGS ============
  getInstallationSettings: () => api.get('/api/admin/installation-settings'),
  updateInstallationSettings: (data) => api.put('/api/admin/installation-settings', data),
  
  // ============ IMAGE UPLOAD ============
  uploadImage: (formData) => api.post('/api/admin/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // ============ CORPORATE ============
  getCorporates: (params) => api.get('/api/admin/corporates', { params }),
  getCorporate: (id) => api.get(`/api/admin/corporates/${id}`),
  createCorporate: (data) => api.post('/api/admin/corporates', data),
  updateCorporate: (id, data) => api.put(`/api/admin/corporates/${id}`, data),
  deleteCorporate: (id) => api.delete(`/api/admin/corporates/${id}`),
  blockCorporate: (id) => api.put(`/api/admin/corporates/${id}/block`),
  unblockCorporate: (id) => api.put(`/api/admin/corporates/${id}/unblock`),
  getCorporateEmployees: (corporateId, params) => api.get(`/api/admin/corporates/${corporateId}/employees`, { params }),

  // ============ DISPATCHERS ============
  getDispatchers: (params) => api.get('/api/admin/dispatchers', { params }),
  getDispatcher: (id) => api.get(`/api/admin/dispatchers/${id}`),
  createDispatcher: (data) => api.post('/api/admin/dispatchers', data),
  updateDispatcher: (id, data) => api.put(`/api/admin/dispatchers/${id}`, data),
  deleteDispatcher: (id) => api.delete(`/api/admin/dispatchers/${id}`),
  activateDispatcher: (id) => api.put(`/api/admin/dispatchers/${id}/activate`),
  deactivateDispatcher: (id) => api.put(`/api/admin/dispatchers/${id}/deactivate`),

  // ============ HOTELS ============
  getHotels: (params) => api.get('/api/admin/hotels', { params }),
  getHotel: (id) => api.get(`/api/admin/hotels/${id}`),
  createHotel: (data) => api.post('/api/admin/hotels', data),
  updateHotel: (id, data) => api.put(`/api/admin/hotels/${id}`, data),
  deleteHotel: (id) => api.delete(`/api/admin/hotels/${id}`),
  blockHotel: (id) => api.put(`/api/admin/hotels/${id}/block`),
  unblockHotel: (id) => api.put(`/api/admin/hotels/${id}/unblock`),

  // ============ PARTNERS ============
  getPartners: (params) => api.get('/api/admin/partners', { params }),
  getPartner: (id) => api.get(`/api/admin/partners/${id}`),
  createPartner: (data) => api.post('/api/admin/partners', data),
  updatePartner: (id, data) => api.put(`/api/admin/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/api/admin/partners/${id}`),
  activatePartner: (id) => api.put(`/api/admin/partners/${id}/activate`),
  deactivatePartner: (id) => api.put(`/api/admin/partners/${id}/deactivate`),

  // ============ SUPPORT ============
  getSupportTickets: (params) => api.get('/api/admin/support', { params }),
  getSupportTicket: (id) => api.get(`/api/admin/support/${id}`),
  createSupportTicket: (data) => api.post('/api/admin/support', data),
  updateSupportTicket: (id, data) => api.put(`/api/admin/support/${id}`, data),
  closeSupportTicket: (id) => api.put(`/api/admin/support/${id}/close`),
  reopenSupportTicket: (id) => api.put(`/api/admin/support/${id}/reopen`),
  assignSupportTicket: (id, data) => api.put(`/api/admin/support/${id}/assign`, data),

  // ============ DOCUMENTS ============
  getDocumentTypes: (params) => api.get('/api/admin/documents/types', { params }),
  createDocumentType: (data) => api.post('/api/admin/documents/types', data),
  getProviderDocuments: (providerId) => api.get(`/api/admin/documents/provider/${providerId}`),
  uploadProviderDocument: (providerId, formData) => api.post(`/api/admin/documents/provider/${providerId}`, formData),
  verifyProviderDocument: (id) => api.put(`/api/admin/documents/provider/${id}/verify`),
  getUserDocuments: (userId) => api.get(`/api/admin/documents/user/${userId}`),
  uploadUserDocument: (userId, formData) => api.post(`/api/admin/documents/user/${userId}`, formData),
  getVehicleDocuments: (vehicleId) => api.get(`/api/admin/documents/vehicle/${vehicleId}`),
  uploadVehicleDocument: (vehicleId, formData) => api.post(`/api/admin/documents/vehicle/${vehicleId}`, formData),

  // ============ PRICING ============
  getCityServicePricing: (params) => api.get('/api/admin/pricing/city-service-types', { params }),
  getCityServicePrice: (id) => api.get(`/api/admin/pricing/city-service-types/${id}`),
  createCityServicePricing: (data) => api.post('/api/admin/pricing/city-service-types', data),
  updateCityServicePricing: (id, data) => api.put(`/api/admin/pricing/city-service-types/${id}`, data),
  deleteCityServicePricing: (id) => api.delete(`/api/admin/pricing/city-service-types/${id}`),
  
  // Zones
  getZones: (params) => api.get('/api/admin/pricing/zones', { params }),
  createZone: (data) => api.post('/api/admin/pricing/zones', data),
  updateZone: (id, data) => api.put(`/api/admin/pricing/zones/${id}`, data),
  deleteZone: (id) => api.delete(`/api/admin/pricing/zones/${id}`),
  
  // Red Zones
  getRedZones: (params) => api.get('/api/admin/pricing/red-zones', { params }),
  createRedZone: (data) => api.post('/api/admin/pricing/red-zones', data),
  updateRedZone: (id, data) => api.put(`/api/admin/pricing/red-zones/${id}`, data),
  deleteRedZone: (id) => api.delete(`/api/admin/pricing/red-zones/${id}`),

  // ============ AIRPORTS ============
  getAirports: (params) => api.get('/api/admin/airports', { params }),
  getAirport: (id) => api.get(`/api/admin/airports/${id}`),
  createAirport: (formData) => api.post('/api/admin/airports', formData),
  updateAirport: (id, formData) => api.put(`/api/admin/airports/${id}`, formData),
  deleteAirport: (id) => api.delete(`/api/admin/airports/${id}`),
  getAirportConnections: (airportId) => api.get(`/api/admin/airports/${airportId}/cities`),
  createAirportConnection: (airportId, data) => api.post(`/api/admin/airports/${airportId}/cities`, data),
  updateAirportConnection: (id, data) => api.put(`/api/admin/airports/connections/${id}`, data),
  deleteAirportConnection: (id) => api.delete(`/api/admin/airports/connections/${id}`),

  // ============ BANKING ============
  getBankDetails: (params) => api.get('/api/admin/banking', { params }),
  getBankDetail: (id) => api.get(`/api/admin/banking/${id}`),
  getProviderBankDetails: (providerId) => api.get(`/api/admin/banking/provider/${providerId}`),
  createBankDetail: (data) => api.post('/api/admin/banking', data),
  updateBankDetail: (id, data) => api.put(`/api/admin/banking/${id}`, data),
  deleteBankDetail: (id) => api.delete(`/api/admin/banking/${id}`),
  verifyBankDetail: (id) => api.put(`/api/admin/banking/${id}/verify`),
  rejectBankDetail: (id, data) => api.put(`/api/admin/banking/${id}/reject`, data),

  // ============ INFORMATION (FAQ/PAGES) ============
  getInformationPages: (params) => api.get('/api/admin/information', { params }),
  getInformationPage: (id) => api.get(`/api/admin/information/${id}`),
  getInformationBySlug: (slug) => api.get(`/api/admin/information/slug/${slug}`),
  createInformationPage: (data) => api.post('/api/admin/information', data),
  updateInformationPage: (id, data) => api.put(`/api/admin/information/${id}`, data),
  deleteInformationPage: (id) => api.delete(`/api/admin/information/${id}`),
  toggleInformationStatus: (id) => api.put(`/api/admin/information/${id}/toggle-status`),

  // ============ ACTIVITY LOGS ============
  getActivityLogs: (params) => api.get('/api/admin/activity', { params }),
  getActivityLog: (id) => api.get(`/api/admin/activity/${id}`),
  createActivityLog: (data) => api.post('/api/admin/activity', data),
  getActivityStatistics: (params) => api.get('/api/admin/activity/statistics/summary', { params }),
  getAdminRecentActivity: (adminId, params) => api.get(`/api/admin/activity/admin/${adminId}/recent`, { params }),
  cleanupActivityLogs: (data) => api.delete('/api/admin/activity/cleanup', { data }),
};

export default adminService;
