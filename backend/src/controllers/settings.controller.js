import { SettingsDetail } from '../models/SettingsDetail.js';
import constants from '../constants/constants.json' assert { type: 'json' };

// Get settings (siempre hay solo un documento)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SettingsDetail.findOne();
    
    // Si no existe, crear uno por defecto
    if (!settings) {
      settings = await SettingsDetail.create({
        app_name: constants.APP_NAME,
        partner_panel_name: constants.PARTNER_PANEL_NAME,
        dispatcher_panel_name: constants.DISPATCHER_PANEL_NAME,
        hotel_panel_name: constants.HOTEL_PANEL_NAME,
      });
    }

    res.json({
      success: true,
      data: {
        settings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    
    let settings = await SettingsDetail.findOne();
    
    if (!settings) {
      settings = await SettingsDetail.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json({
      success: true,
      data: {
        settings,
      },
      message: 'Settings updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get constants
export const getConstants = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        constants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Initialize default settings
export const initializeSettings = async (req, res, next) => {
  try {
    let settings = await SettingsDetail.findOne();
    
    if (settings) {
      return res.json({
        success: true,
        message: 'Settings already initialized',
        data: { settings },
      });
    }

    settings = await SettingsDetail.create({
      app_name: constants.APP_NAME,
      partner_panel_name: constants.PARTNER_PANEL_NAME,
      dispatcher_panel_name: constants.DISPATCHER_PANEL_NAME,
      hotel_panel_name: constants.HOTEL_PANEL_NAME,
      adminCurrencyCode: 'USD',
      adminCurrency: '$',
      adminTimeZone: 'America/New_York',
      push_notification: true,
      default_Search_radious: 100,
      scheduled_request_pre_start_minute: 30,
      provider_timeout: 60,
    });

    res.json({
      success: true,
      message: 'Settings initialized successfully',
      data: { settings },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSettings,
  updateSettings,
  getConstants,
  initializeSettings,
};
