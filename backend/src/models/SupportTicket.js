import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticket_number: {
    type: String,
    unique: true,
    required: true,
  },
  
  // Ticket Info
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  
  // Classification
  category: {
    type: String,
    enum: [
      'technical_issue',
      'payment_issue',
      'account_issue',
      'driver_complaint',
      'rider_complaint',
      'feature_request',
      'billing',
      'safety_concern',
      'other',
    ],
    default: 'other',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed', 'cancelled'],
    default: 'open',
  },
  
  // Submitter
  submitted_by_type: {
    type: String,
    enum: ['user', 'provider', 'admin', 'guest'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
  },
  guest_email: {
    type: String,
  },
  guest_name: {
    type: String,
  },
  
  // Assignment
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  department: {
    type: String,
    enum: ['support', 'technical', 'billing', 'operations', 'safety', 'general'],
    default: 'general',
  },
  
  // Related Entities
  related_trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trip',
  },
  related_payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment_transaction',
  },
  
  // Messages/Communication
  messages: [{
    sender_type: {
      type: String,
      enum: ['customer', 'admin', 'system'],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.sender_model',
    },
    sender_model: {
      type: String,
      enum: ['user', 'provider', 'admin'],
    },
    message: {
      type: String,
      required: true,
    },
    attachments: [{
      filename: String,
      url: String,
      type: String,
    }],
    is_internal: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Metadata
  tags: [String],
  resolution_notes: {
    type: String,
  },
  satisfaction_rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  satisfaction_comment: {
    type: String,
  },
  
  // Timestamps
  first_response_at: {
    type: Date,
  },
  resolved_at: {
    type: Date,
  },
  closed_at: {
    type: Date,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Índices
supportTicketSchema.index({ ticket_number: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ assigned_to: 1, status: 1 });
supportTicketSchema.index({ user: 1, created_at: -1 });
supportTicketSchema.index({ provider: 1, created_at: -1 });
supportTicketSchema.index({ department: 1, status: 1 });
supportTicketSchema.index({ created_at: -1 });

// Método para generar número de ticket
supportTicketSchema.statics.generateTicketNumber = async function() {
  const count = await this.countDocuments();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `TKT-${timestamp}-${(count + 1).toString().padStart(5, '0')}`;
};

// Método para agregar mensaje
supportTicketSchema.methods.addMessage = function(senderType, sender, senderModel, message, attachments = [], isInternal = false) {
  this.messages.push({
    sender_type: senderType,
    sender,
    sender_model: senderModel,
    message,
    attachments,
    is_internal: isInternal,
  });
  
  // Actualizar first_response_at si es la primera respuesta del admin
  if (senderType === 'admin' && !this.first_response_at) {
    this.first_response_at = new Date();
  }
  
  return this.save();
};

// Método para resolver ticket
supportTicketSchema.methods.resolve = function(resolutionNotes) {
  this.status = 'resolved';
  this.resolution_notes = resolutionNotes;
  this.resolved_at = new Date();
  return this.save();
};

// Método para cerrar ticket
supportTicketSchema.methods.close = function() {
  this.status = 'closed';
  this.closed_at = new Date();
  return this.save();
};

export const SupportTicket = mongoose.model('support_ticket', supportTicketSchema);
export default SupportTicket;
