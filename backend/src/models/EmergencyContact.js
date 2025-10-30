import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  country_phone_code: {
    type: String,
    default: '+1',
  },
  relationship: {
    type: String,
    default: '',
  },
  is_primary: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

emergencyContactSchema.index({ user_id: 1 });

export const EmergencyContact = mongoose.model('emergency_contact_detail', emergencyContactSchema);
export default EmergencyContact;
