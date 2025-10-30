import { SystemConfiguration } from '../models/SystemConfiguration.js';

// Seed system config
export const seedSystemConfig = async (req, res, next) => {
  try {
    // Crear configuraciones por defecto si no existen
    const defaultConfigs = [
      { config_key: 'max_vehicle_age', config_value: '15', config_category: 'system' },
      { config_key: 'default_commission_rate', config_value: '15', config_category: 'system' },
      { config_key: 'cancellation_fee', config_value: '5', config_category: 'system' },
      { config_key: 'currency', config_value: 'USD', config_category: 'system' },
      { config_key: 'distance_unit', config_value: 'km', config_category: 'system' },
    ];

    for (const config of defaultConfigs) {
      const existing = await SystemConfiguration.findOne({ config_key: config.config_key });
      if (!existing) {
        await SystemConfiguration.create(config);
      }
    }

    res.json({
      success: true,
      message: 'System configuration seeded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Save configuration
export const saveConfiguration = async (req, res, next) => {
  try {
    const { config_key, config_value, config_category, is_encrypted } = req.body;

    const existing = await SystemConfiguration.findOne({ config_key });

    if (existing) {
      existing.config_value = config_value;
      existing.config_category = config_category || existing.config_category;
      existing.is_encrypted = is_encrypted !== undefined ? is_encrypted : existing.is_encrypted;
      await existing.save();
    } else {
      await SystemConfiguration.create({
        config_key,
        config_value,
        config_category: config_category || 'general',
        is_encrypted: is_encrypted || false,
      });
    }

    res.json({
      success: true,
      message: 'Configuration saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all configurations
export const getConfigurations = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    const query = { is_active: true };
    if (category) {
      query.config_category = category;
    }

    const configs = await SystemConfiguration.find(query);

    // No devolver valores encriptados
    const safeConfigs = configs.map(config => ({
      config_key: config.config_key,
      config_value: config.is_encrypted ? '***' : config.config_value,
      config_category: config.config_category,
      is_encrypted: config.is_encrypted,
      description: config.description,
    }));

    res.json({
      success: true,
      data: {
        configurations: safeConfigs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  seedSystemConfig,
  saveConfiguration,
  getConfigurations,
};
