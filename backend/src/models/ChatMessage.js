import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip',
    required: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'sender_type',
  },
  sender_type: {
    type: String,
    required: true,
    enum: ['user', 'provider', 'admin'],
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiver_type',
  },
  receiver_type: {
    type: String,
    required: true,
    enum: ['user', 'provider', 'admin'],
  },
  message: {
    type: String,
    required: true,
  },
  message_type: {
    type: String,
    enum: ['text', 'image', 'location', 'file'],
    default: 'text',
  },
  attachment_url: {
    type: String,
    default: '',
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  read_at: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

chatMessageSchema.index({ trip_id: 1, created_at: 1 });
chatMessageSchema.index({ sender_id: 1, receiver_id: 1 });
chatMessageSchema.index({ is_read: 1 });

export const ChatMessage = mongoose.model('chat_message', chatMessageSchema);
export default ChatMessage;
