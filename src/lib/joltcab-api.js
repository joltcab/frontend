/**
 * JoltCab API Client
 * Sistema completo de API para JoltCab - Reemplaza completamente Base44
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://admin.joltcab.com/api/v1';

class JoltCabAPI {
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
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('JoltCab API Error:', error);
      throw error;
    }
  }

  // ==================== AUTH ====================
  auth = {
    login: async (email, password) => {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      return response;
    },

    register: async (userData) => {
      return await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    me: async () => {
      const response = await this.request('/auth/me');
      return response.data?.user || response.data || response;
    },

    logout: async () => {
      this.clearToken();
      return { success: true };
    },

    forgotPassword: async (email) => {
      return await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token, password) => {
      return await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
    },

    // Google OAuth
    googleLogin: (redirectUri, role = 'user') => {
      const url = `${this.baseURL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&role=${role}`;
      window.location.href = url;
    },

    googleCallback: async (code, state) => {
      const response = await this.request('/auth/google/callback', {
        method: 'POST',
        body: JSON.stringify({ code, state }),
      });
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      return response;
    },

    // Apple OAuth
    appleLogin: (redirectUri, role = 'user') => {
      const url = `${this.baseURL}/auth/apple?redirect_uri=${encodeURIComponent(redirectUri)}&role=${role}`;
      window.location.href = url;
    },

    appleCallback: async (code, state) => {
      const response = await this.request('/auth/apple/callback', {
        method: 'POST',
        body: JSON.stringify({ code, state }),
      });
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      return response;
    },

    // Facebook OAuth
    facebookLogin: (redirectUri, role = 'user') => {
      const url = `${this.baseURL}/auth/facebook?redirect_uri=${encodeURIComponent(redirectUri)}&role=${role}`;
      window.location.href = url;
    },

    facebookCallback: async (code, state) => {
      const response = await this.request('/auth/facebook/callback', {
        method: 'POST',
        body: JSON.stringify({ code, state }),
      });
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      return response;
    },
  };

  // ==================== ENTITIES ====================
  entities = {
    User: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/stats/users?${query}`);
        return response.data?.users || [];
      },
      filter: async (filters) => {
        const query = new URLSearchParams(filters).toString();
        const response = await this.request(`/stats/users?${query}`);
        return response.data?.users || [];
      },
      get: async (id) => {
        const response = await this.request(`/users/${id}`);
        return response.data?.user || response.data;
      },
      create: async (data) => {
        return await this.request('/users', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: async (id, data) => {
        return await this.request(`/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      delete: async (id) => {
        return await this.request(`/users/${id}`, {
          method: 'DELETE',
        });
      },
    },

    Provider: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/stats/drivers?${query}`);
        return response.data?.drivers || [];
      },
      filter: async (filters) => {
        const query = new URLSearchParams(filters).toString();
        const response = await this.request(`/stats/drivers?${query}`);
        return response.data?.drivers || [];
      },
      get: async (id) => {
        const response = await this.request(`/providers/${id}`);
        return response.data?.provider || response.data;
      },
    },

    DriverProfile: {
      list: async () => {
        const response = await this.request('/stats/drivers');
        return response.data?.drivers || [];
      },
    },

    Trip: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/stats/rides?${query}`);
        return response.data?.rides || [];
      },
      get: async (id) => {
        const response = await this.request(`/trips/${id}`);
        return response.data?.trip || response.data;
      },
    },

    Ride: {
      list: async () => {
        const response = await this.request('/stats/rides');
        return response.data?.rides || [];
      },
    },

    Admin: {
      list: async () => {
        const response = await this.request('/admins');
        return response.data?.admins || [];
      },
      filter: async (filters) => {
        const response = await this.request('/admins');
        return response.data?.admins || [];
      },
      create: async (data) => {
        return await this.request('/admins', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: async (id, data) => {
        return await this.request(`/admins/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      delete: async (id) => {
        return await this.request(`/admins/${id}`, {
          method: 'DELETE',
        });
      },
      upgradeToSuperAdmin: async (admin_email) => {
        return await this.request('/admins/upgrade-super-admin', {
          method: 'POST',
          body: JSON.stringify({ admin_email }),
        });
      },
      sync: async (admin_email, make_super_admin = false) => {
        return await this.request('/admins/sync', {
          method: 'POST',
          body: JSON.stringify({ admin_email, make_super_admin }),
        });
      },
    },

    PromoCode: {
      list: async () => {
        const response = await this.request('/promo-codes');
        return response.data?.promoCodes || [];
      },
      create: async (data) => {
        return await this.request('/promo-codes', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
    },

    Review: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/reviews?${query}`);
        return response.data?.reviews || [];
      },
    },

    SupportTicket: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/support-tickets?${query}`);
        return response.data?.tickets || [];
      },
      create: async (data) => {
        return await this.request('/support-tickets', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
    },

    Role: {
      list: async () => {
        const response = await this.request('/roles');
        return response.data?.roles || [];
      },
      update: async (id, data) => {
        return await this.request(`/roles/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      seed: async () => {
        return await this.request('/roles/seed', {
          method: 'POST',
        });
      },
    },
  };

  // ==================== INVOKE (Compatibilidad Base44) ====================
  invoke = async (entityName, methodName, ...args) => {
    try {
      if (this.entities[entityName] && this.entities[entityName][methodName]) {
        return await this.entities[entityName][methodName](...args);
      }
      console.warn(`Method ${entityName}.${methodName} not found`);
      return null;
    } catch (error) {
      console.error(`Error invoking ${entityName}.${methodName}:`, error);
      return null;
    }
  };

  // ==================== STATS ====================
  stats = {
    dashboard: async () => {
      const response = await this.request('/stats/dashboard');
      return response.data || response;
    },
    users: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await this.request(`/stats/users?${query}`);
      return response.data || response;
    },
    drivers: async () => {
      const response = await this.request('/stats/drivers');
      return response.data || response;
    },
    rides: async () => {
      const response = await this.request('/stats/rides');
      return response.data || response;
    },
  };

  // ==================== TRIPS ====================
  trips = {
    calculateFare: async (data) => {
      return await this.request('/trips/calculate-fare', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    create: async (data) => {
      return await this.request('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id, data) => {
      return await this.request(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    cancel: async (id, reason) => {
      return await this.request(`/trips/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
  };

  // ==================== PAYMENTS ====================
  payments = {
    createIntent: async (amount, currency = 'USD') => {
      return await this.request('/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify({ amount, currency }),
      });
    },
    addCard: async (cardData) => {
      return await this.request('/payments/cards', {
        method: 'POST',
        body: JSON.stringify(cardData),
      });
    },
    getCards: async () => {
      const response = await this.request('/payments/cards');
      return response.data?.cards || [];
    },
  };

  // ==================== WALLET ====================
  wallet = {
    getBalance: async () => {
      const response = await this.request('/wallet/balance');
      return response.data || response;
    },
    getHistory: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await this.request(`/wallet/history?${query}`);
      return response.data?.history || [];
    },
    addFunds: async (amount) => {
      return await this.request('/wallet/add-funds', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    },
  };

  // ==================== SETUP ====================
  setup = {
    seedSystemConfig: async () => {
      return await this.request('/setup/seed-system-config', {
        method: 'POST',
      });
    },
    saveConfiguration: async (config_key, config_value, config_category, is_encrypted = false) => {
      return await this.request('/setup/configuration', {
        method: 'POST',
        body: JSON.stringify({ config_key, config_value, config_category, is_encrypted }),
      });
    },
    getConfigurations: async (category = null) => {
      const query = category ? `?category=${category}` : '';
      const response = await this.request(`/setup/configurations${query}`);
      return response.data?.configurations || [];
    },
  };

  // ==================== SETTINGS ====================
  settings = {
    get: async () => {
      const response = await this.request('/settings');
      return response.data?.settings || null;
    },
    update: async (data) => {
      return await this.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    initialize: async () => {
      return await this.request('/settings/initialize', {
        method: 'POST',
      });
    },
    getConstants: async () => {
      const response = await this.request('/settings/constants');
      return response.data?.constants || {};
    },
    getConfigStatus: async () => {
      const response = await this.request('/settings/config-status');
      return response.data || {};
    },
  };

  // ==================== TEST CONNECTIONS ====================
  test = {
    mapbox: async (access_token) => {
      return await this.request('/test/mapbox', {
        method: 'POST',
        body: JSON.stringify({ access_token }),
      });
    },
    googleMaps: async (api_key) => {
      return await this.request('/test/google-maps', {
        method: 'POST',
        body: JSON.stringify({ api_key }),
      });
    },
    stripe: async (secret_key) => {
      return await this.request('/test/stripe', {
        method: 'POST',
        body: JSON.stringify({ secret_key }),
      });
    },
    twilio: async (account_sid, auth_token) => {
      return await this.request('/test/twilio', {
        method: 'POST',
        body: JSON.stringify({ account_sid, auth_token }),
      });
    },
    smtp: async (smtp_host, smtp_port, smtp_user, smtp_password) => {
      return await this.request('/test/smtp', {
        method: 'POST',
        body: JSON.stringify({ smtp_host, smtp_port, smtp_user, smtp_password }),
      });
    },
    all: async () => {
      const response = await this.request('/test/all');
      return response.data || {};
    },
  };

  // ==================== NOTIFICATIONS ====================
  notifications = {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await this.request(`/notifications?${query}`);
      return response.data?.notifications || [];
    },
    markAsRead: async (id) => {
      return await this.request(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    markAllAsRead: async () => {
      return await this.request('/notifications/read-all', {
        method: 'PUT',
      });
    },
  };

  // Blog API
  blog = {
    list: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await this.request(`/blog?${query}`);
      return response.data?.posts || response.data || [];
    },
    get: async (id) => {
      const response = await this.request(`/blog/${id}`);
      return response.data?.post || response.data;
    },
    create: async (data) => {
      return await this.request('/blog', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id, data) => {
      return await this.request(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id) => {
      return await this.request(`/blog/${id}`, {
        method: 'DELETE',
      });
    },
    publish: async (id) => {
      return await this.request(`/blog/${id}/publish`, {
        method: 'PUT',
      });
    },
    unpublish: async (id) => {
      return await this.request(`/blog/${id}/unpublish`, {
        method: 'PUT',
      });
    },
  };

  // ==================== EMERGENT IA ENDPOINTS ====================
  // Endpoints para las aplicaciones móviles y web de Emergent IA
  emergentIA = {
    // Chat con IA para pedir canciones (requiere autenticación)
    chat: {
      sendMessage: async (message, context = {}) => {
        return await this.request('/emergent-ia/chat', {
          method: 'POST',
          body: JSON.stringify({ message, context }),
        });
      },
      getHistory: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/chat/history?${query}`);
        return response.data?.messages || [];
      },
      requestSong: async (songData) => {
        return await this.request('/emergent-ia/chat/request-song', {
          method: 'POST',
          body: JSON.stringify(songData),
        });
      },
    },

    // Calendario de shows
    shows: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/shows?${query}`);
        return response.data?.shows || [];
      },
      get: async (id) => {
        const response = await this.request(`/emergent-ia/shows/${id}`);
        return response.data?.show || response.data;
      },
      upcoming: async () => {
        const response = await this.request('/emergent-ia/shows/upcoming');
        return response.data?.shows || [];
      },
    },

    // Eventos
    events: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/events?${query}`);
        return response.data?.events || [];
      },
      get: async (id) => {
        const response = await this.request(`/emergent-ia/events/${id}`);
        return response.data?.event || response.data;
      },
      upcoming: async () => {
        const response = await this.request('/emergent-ia/events/upcoming');
        return response.data?.events || [];
      },
    },

    // LocalNews con IA
    localNews: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/local-news?${query}`);
        return response.data?.news || [];
      },
      get: async (id) => {
        const response = await this.request(`/emergent-ia/local-news/${id}`);
        return response.data?.news || response.data;
      },
      getByLocation: async (location) => {
        const response = await this.request('/emergent-ia/local-news/by-location', {
          method: 'POST',
          body: JSON.stringify({ location }),
        });
        return response.data?.news || [];
      },
    },

    // LastNews (últimas noticias)
    lastNews: {
      list: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/last-news?${query}`);
        return response.data?.news || [];
      },
      get: async (id) => {
        const response = await this.request(`/emergent-ia/last-news/${id}`);
        return response.data?.news || response.data;
      },
      latest: async (limit = 10) => {
        const response = await this.request(`/emergent-ia/last-news/latest?limit=${limit}`);
        return response.data?.news || [];
      },
    },

    // Notificaciones
    notifications: {
      // Notificaciones de canciones
      songs: {
        list: async (params = {}) => {
          const query = new URLSearchParams(params).toString();
          const response = await this.request(`/emergent-ia/notifications/songs?${query}`);
          return response.data?.notifications || [];
        },
        markAsRead: async (id) => {
          return await this.request(`/emergent-ia/notifications/songs/${id}/read`, {
            method: 'PUT',
          });
        },
        subscribe: async (preferences) => {
          return await this.request('/emergent-ia/notifications/songs/subscribe', {
            method: 'POST',
            body: JSON.stringify(preferences),
          });
        },
      },
      // Notificaciones de noticias
      news: {
        list: async (params = {}) => {
          const query = new URLSearchParams(params).toString();
          const response = await this.request(`/emergent-ia/notifications/news?${query}`);
          return response.data?.notifications || [];
        },
        markAsRead: async (id) => {
          return await this.request(`/emergent-ia/notifications/news/${id}/read`, {
            method: 'PUT',
          });
        },
        subscribe: async (preferences) => {
          return await this.request('/emergent-ia/notifications/news/subscribe', {
            method: 'POST',
            body: JSON.stringify(preferences),
          });
        },
      },
      // Obtener todas las notificaciones
      getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await this.request(`/emergent-ia/notifications?${query}`);
        return response.data?.notifications || [];
      },
      markAllAsRead: async () => {
        return await this.request('/emergent-ia/notifications/read-all', {
          method: 'PUT',
        });
      },
    },

    // Preferencias del usuario
    preferences: {
      get: async () => {
        const response = await this.request('/emergent-ia/preferences');
        return response.data?.preferences || {};
      },
      update: async (preferences) => {
        return await this.request('/emergent-ia/preferences', {
          method: 'PUT',
          body: JSON.stringify(preferences),
        });
      },
    },
    };

    // ==================== COUNTRIES ====================
    countries = {
  list: async () => {
       const response = await this.request("/countries");
       return response.data || [];
  },
  
  get: async (id) => {
       const response = await this.request(`/countries/${id}`);
       return response.data;
  },
  
  create: async (data) => {
       const response = await this.request("/countries", {
         method: "POST",
         body: JSON.stringify(data),
       });
       return response.data;
  },
  
  update: async (id, data) => {
       const response = await this.request(`/countries/${id}`, {
         method: "PUT",
         body: JSON.stringify(data),
       });
       return response.data;
  },
  
  delete: async (id) => {
       return await this.request(`/countries/${id}`, {
         method: "DELETE",
       });
  },
  
  business: async () => {
       const response = await this.request("/countries/business");
       return response.data || [];
  },
};
}

// Crear instancia global
export const joltcab = new JoltCabAPI();

// Export para compatibilidad con código existente
export const apiClient = joltcab;

// Export default
export default joltcab;

// Alias para compatibilidad con Base44
if (typeof window !== 'undefined') {
  window.joltcab = joltcab;
  window.base44 = joltcab; // Compatibilidad temporal
}
