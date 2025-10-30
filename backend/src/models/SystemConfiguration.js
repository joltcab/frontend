import mongoose from 'mongoose';

const systemConfigurationSchema = new mongoose.Schema({
  config_key: {
    type: String,
    required: true,
    unique: true,
  },
  config_value: {
    type: String,
    required: true,
  },
  config_category: {
    type: String,
    enum: ['maps', 'payment', 'sms', 'email', 'general', 'system', 'operational', 'pricing'],
    default: 'general',
  },
  is_encrypted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

systemConfigurationSchema.index({ config_key: 1 });
systemConfigurationSchema.index({ config_category: 1 });

export const SystemConfiguration = mongoose.model('system_configuration', systemConfigurationSchema);
export default SystemConfiguration;
