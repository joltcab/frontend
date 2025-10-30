import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'user_type',
    required: true,
  },
  user_type: {
    type: String,
    enum: ['user', 'provider', 'admin', 'dispatcher'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  notification_type: {
    type: String,
    enum: ['trip', 'payment', 'promo', 'system', 'chat', 'review'],
    default: 'system',
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  related_type: {
    type: String,
    enum: ['trip', 'payment', 'promo_code', 'support_ticket'],
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  read_at: {
    type: Date,
  },
  is_sent: {
    type: Boolean,
    default: false,
  },
  sent_at: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

notificationSchema.index({ user_id: 1, is_read: 1, created_at: -1 });
notificationSchema.index({ notification_type: 1 });

export const Notification = mongoose.model('notification', notificationSchema);
export default Notification;
