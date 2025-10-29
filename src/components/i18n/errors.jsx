/**
 * Modern Error Handling System for JoltCab
 * Semantic error codes replacing numeric ones
 */

export const ErrorCodes = {
  // Authentication
  AUTH_EMAIL_ALREADY_REGISTERED: 'AUTH_001',
  AUTH_PHONE_ALREADY_USED: 'AUTH_002',
  AUTH_EMAIL_NOT_REGISTERED: 'AUTH_003',
  AUTH_INVALID_CREDENTIALS: 'AUTH_004',
  AUTH_INCORRECT_PASSWORD: 'AUTH_005',
  AUTH_NOT_APPROVED: 'AUTH_006',
  AUTH_INVALID_TOKEN: 'AUTH_007',
  AUTH_TOKEN_EXPIRED: 'AUTH_008',
  
  // Trip
  TRIP_NOT_FOUND: 'TRIP_001',
  TRIP_ALREADY_RUNNING: 'TRIP_002',
  TRIP_ALREADY_CANCELLED: 'TRIP_003',
  TRIP_PAYMENT_PENDING: 'TRIP_004',
  TRIP_CREATE_FAILED: 'TRIP_005',
  TRIP_CANCEL_FAILED: 'TRIP_006',
  
  // Provider/Driver
  PROVIDER_NOT_FOUND: 'PROVIDER_001',
  PROVIDER_NO_AVAILABLE: 'PROVIDER_002',
  PROVIDER_IN_TRIP: 'PROVIDER_003',
  
  // Payment
  PAY_ADD_CARD_FIRST: 'PAY_001',
  PAY_INVALID_TOKEN: 'PAY_002',
  PAY_CARD_NOT_FOUND: 'PAY_003',
  PAY_PAYMENT_FAILED: 'PAY_004',
  
  // Promo
  PROMO_INVALID: 'PROMO_001',
  PROMO_ALREADY_USED: 'PROMO_002',
  PROMO_EXPIRED: 'PROMO_003',
  
  // General
  GEN_DETAIL_NOT_FOUND: 'GEN_001',
  GEN_LOGOUT_FAILED: 'GEN_002'
};

/**
 * Custom Application Error Class
 */
export class AppError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }
}

/**
 * Helper function to create and throw errors
 */
export function throwError(code, message, statusCode = 400, details = null) {
  throw new AppError(code, message, statusCode, details);
}

/**
 * Error handler for backend functions
 */
export function handleError(error) {
  if (error instanceof AppError) {
    return Response.json(error.toJSON(), { status: error.statusCode });
  }
  
  console.error('Unexpected error:', error);
  return Response.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      statusCode: 500
    }
  }, { status: 500 });
}