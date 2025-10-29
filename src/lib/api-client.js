/**
 * API Client para JoltCab Backend
 * Reemplaza @base44/sdk
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

class APIClient {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // El backend devuelve { success: true, data: { user: {...}, token: '...' } }
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    // El backend devuelve { success: true, data: { user: {...} } }
    // Retornamos solo el objeto user
    return response.data?.user || response.data || response;
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request('/admin/dashboard/metrics');
  }

  async getIAStats(days = 7) {
    return this.request(`/admin/dashboard/ia-stats?days=${days}`);
  }

  async getVerificationStats() {
    return this.request('/admin/dashboard/verification-stats');
  }

  async getPaymentsStats() {
    return this.request('/admin/dashboard/payments-stats');
  }

  // Trips
  async calculateFare(data) {
    return this.request('/trips/calculate-fare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async estimateFare(data) {
    return this.request('/trips/estimate-fare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async findNearbyDrivers(data) {
    return this.request('/trips/find-nearby-drivers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async assignDriver(data) {
    return this.request('/trips/assign-driver', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelRide(data) {
    return this.request('/trips/cancel-ride', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rateRide(data) {
    return this.request('/trips/rate-ride', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI
  async matchDriver(data) {
    return this.request('/ai/match-driver-advanced', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateDynamicPrice(data) {
    return this.request('/ai/dynamic-pricing-advanced', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async chatWithSupport(data) {
    return this.request('/ai/chatbot', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payments
  async processPayment(data) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createPaymentIntent(data) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processRefund(data) {
    return this.request('/payments/refund', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactionHistory(userId) {
    return this.request(`/payments/transaction-history/${userId}`);
  }

  // Verification
  async uploadDocument(formData) {
    const url = `${this.baseURL}/verification/upload-document`;
    const headers = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  async verifyDocumentAI(documentId) {
    return this.request('/verification/verify-document-ai', {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  async getDocuments(userId) {
    return this.request(`/verification/documents/${userId}`);
  }

  // Maps
  async geocodeAddress(address) {
    return this.request('/maps/geocode-address', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async detectZone(lat, lng) {
    return this.request('/maps/detect-zone', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    });
  }

  async getRoute(waypoints) {
    return this.request('/maps/get-route', {
      method: 'POST',
      body: JSON.stringify({ waypoints }),
    });
  }

  async getDistance(origin, destination) {
    return this.request('/maps/get-distance', {
      method: 'POST',
      body: JSON.stringify({ origin, destination }),
    });
  }

  // Notifications
  async sendNotification(data) {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendEmail(data) {
    return this.request('/notifications/send-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendMassNotification(data) {
    return this.request('/notifications/mass', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendPushNotification(data) {
    return this.request('/notifications/push', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // WhatsApp
  async sendWhatsAppNotification(data) {
    return this.request('/whatsapp/notify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processWhatsAppBooking(data) {
    return this.request('/whatsapp/booking', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async createAdminUser(data) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdminUser(id, data) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Earnings
  async calculateEarnings(data) {
    return this.request('/earnings/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDetailedEarnings(data) {
    return this.request('/earnings/detailed', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // CMS
  async getBlogPosts() {
    return this.request('/cms/blog-posts');
  }

  async createBlogPost(data) {
    return this.request('/cms/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id, data) {
    return this.request(`/cms/blog-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id) {
    return this.request(`/cms/blog-posts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new APIClient();
export default apiClient;

// Compatibility layer for base44.auth.me()
APIClient.prototype.auth = {
  me: async function() {
    const client = apiClient;
    try {
      return await client.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
};


// Extend auth object with login method
apiClient.auth.login = async function(email, password) {
  return await apiClient.login(email, password);
};

// Add logout method
apiClient.auth.logout = async function() {
  return await apiClient.logout();
};

// Compatibility layer for base44.entities
apiClient.entities = {
  Ride: {
    list: async function() {
      try {
        const response = await apiClient.request('/stats/rides');
        return response.data?.rides || [];
      } catch (error) {
        console.error('Error getting rides:', error);
        return [];
      }
    }
  },
  User: {
    filter: async function(filters) {
      try {
        const params = new URLSearchParams();
        if (filters.role) params.append('role', filters.role);
        
        const response = await apiClient.request(`/stats/users?${params.toString()}`);
        return response.data?.users || [];
      } catch (error) {
        console.error('Error getting users:', error);
        return [];
      }
    }
  },
  DriverProfile: {
    list: async function() {
      try {
        const response = await apiClient.request('/stats/drivers');
        return response.data?.drivers || [];
      } catch (error) {
        console.error('Error getting drivers:', error);
        return [];
      }
    }
  },
  Admin: {
    list: async function() {
      try {
        const response = await apiClient.request('/stats/users?role=admin');
        return response.data?.users || [];
      } catch (error) {
        console.error('Error getting admins:', error);
        return [];
      }
    },
    filter: async function(filters) {
      try {
        const response = await apiClient.request('/stats/users?role=admin');
        return response.data?.users || [];
      } catch (error) {
        console.error('Error getting admins:', error);
        return [];
      }
    }
  }
};

// Agregar método invoke para compatibilidad con Base44
if (!apiClient.invoke) {
  apiClient.invoke = async function(entityName, methodName, ...args) {
    try {
      if (apiClient.entities[entityName] && apiClient.entities[entityName][methodName]) {
        return await apiClient.entities[entityName][methodName](...args);
      }
      console.warn(`Method ${entityName}.${methodName} not found`);
      return null;
    } catch (error) {
      console.error(`Error invoking ${entityName}.${methodName}:`, error);
      return null;
    }
  };
}

