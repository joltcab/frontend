import api from './api';

const aiService = {
  async calculateDynamicPrice(bookingData) {
    try {
      const response = await api.post('/api/ai/pricing/calculate', {
        city_id: bookingData.city_id || 'default-city',
        service_type_id: bookingData.service_type_id,
        base_price: bookingData.base_price,
        distance: bookingData.distance || 5,
        duration: bookingData.duration || 15,
        pickup_location: bookingData.pickup_location || {
          latitude: 0,
          longitude: 0
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('AI Pricing error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        fallback: {
          base_price: bookingData.base_price,
          multiplier: 1.0,
          final_price: bookingData.base_price
        }
      };
    }
  },

  async chatWithAssistant(roleType, message) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const response = await api.post('/api/ai/assistant/chat', {
        user_id: user._id || user.id,
        user_model: roleType === 'driver' ? 'Driver' : 'User',
        role_type: roleType,
        message
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('AI Assistant error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  async getAssistantHistory(assistantId) {
    try {
      const response = await api.get(`/api/ai/assistant/${assistantId}/history`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get assistant history error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  async optimizeDriverMatching(riderLocation, serviceType, distance, isScheduled = false) {
    try {
      const response = await api.post('/api/ai/matching/optimize', {
        rider_location: riderLocation,
        service_type: serviceType,
        distance,
        is_scheduled: isScheduled
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('AI Matching error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  async getPricingAnalytics(cityId, serviceTypeId, days = 7) {
    try {
      const response = await api.get('/api/ai/pricing/analytics', {
        params: { city_id: cityId, service_type_id: serviceTypeId, days }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Pricing analytics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  async getMonitoringDashboard(hours = 24) {
    try {
      const response = await api.get('/api/ai/monitor/dashboard', {
        params: { hours }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Monitoring dashboard error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  async logMonitorEvent(eventData) {
    try {
      const response = await api.post('/api/ai/monitor/event', eventData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Log monitor event error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default aiService;
