import mongoose from 'mongoose';

const settingsDetailSchema = new mongoose.Schema({
  // Timeouts y Tolerancias
  provider_timeout: { type: Number, default: 60 },
  provider_offline_min: { type: Number, default: 30 },
  
  // Información del País y Moneda
  countryname: { type: String, default: '' },
  adminCurrencyCode: { type: String, default: 'USD' },
  adminCurrency: { type: String, default: '$' },
  adminTimeZone: { type: String, default: 'America/New_York' },
  
  // Notificaciones
  sms_notification: { type: Boolean, default: false },
  email_notification: { type: Boolean, default: false },
  push_notification: { type: Boolean, default: true },
  
  // Referrals
  get_referral_profit_on_card_payment: { type: Boolean, default: false },
  get_referral_profit_on_cash_payment: { type: Boolean, default: false },
  
  // Verificaciones
  userEmailVerification: { type: Boolean, default: false },
  providerEmailVerification: { type: Boolean, default: false },
  userSms: { type: Boolean, default: false },
  providerSms: { type: Boolean, default: false },
  
  // Contacto
  admin_phone: { type: String, default: '' },
  admin_email: { type: String, default: '' },
  contactUsEmail: { type: String, default: '' },
  
  // Twilio
  twilio_call_masking: { type: Boolean, default: false },
  twilio_account_sid: { type: String, default: '' },
  twilio_auth_token: { type: String, default: '' },
  twilio_number: { type: String, default: '' },
  twiml_url: { type: String, default: '' },
  
  // AWS S3
  access_key_id: { type: String, default: '' },
  secret_key_id: { type: String, default: '' },
  aws_bucket_name: { type: String, default: '' },
  is_use_aws_bucket: { type: Boolean, default: false },
  image_base_url: { type: String, default: '' },
  
  // Búsqueda y Viajes
  default_Search_radious: { type: Number, default: 100 },
  scheduled_request_pre_start_minute: { type: Number, default: 30 },
  number_of_try_for_scheduled_request: { type: Number, default: 1 },
  find_nearest_driver_type: { type: Number, default: 1 },
  request_send_to_no_of_providers: { type: Number, default: 2 },
  
  // Stripe
  stripe_secret_key: { type: String, default: '' },
  stripe_publishable_key: { type: String, default: '' },
  
  // SMTP
  smtp_host: { type: String, default: '' },
  smtp_port: { type: String, default: '587' },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  domain: { type: String, default: '' },
  
  // Features
  is_public_demo: { type: Boolean, default: false },
  is_provider_initiate_trip: { type: Boolean, default: false },
  is_show_estimation_in_provider_app: { type: Boolean, default: false },
  is_show_estimation_in_user_app: { type: Boolean, default: false },
  is_tip: { type: Boolean, default: false },
  is_toll: { type: Boolean, default: false },
  is_debug_log: { type: Boolean, default: true },
  
  // Rutas de Usuario/Provider
  userPath: { type: Boolean, default: false },
  providerPath: { type: Boolean, default: false },
  
  // URLs de Apps
  android_client_app_url: { type: String, default: '' },
  android_driver_app_url: { type: String, default: '' },
  ios_client_app_url: { type: String, default: '' },
  ios_driver_app_url: { type: String, default: '' },
  
  // Google Keys
  android_user_app_gcm_key: { type: String, default: '' },
  android_provider_app_gcm_key: { type: String, default: '' },
  android_user_app_google_key: { type: String, default: '' },
  android_provider_app_google_key: { type: String, default: '' },
  ios_user_app_google_key: { type: String, default: '' },
  ios_provider_app_google_key: { type: String, default: '' },
  web_app_google_key: { type: String, default: '' },
  road_api_google_key: { type: String, default: '' },
  google_map_lic_key: { type: String, default: '' },
  is_google_map_lic_key_expired: { type: Number, default: 0 },
  
  // iOS Certificates
  user_passphrase: { type: String, default: '' },
  provider_passphrase: { type: String, default: '' },
  ios_certificate_mode: { type: String, default: '' },
  
  // Versiones de Apps
  android_user_app_version_code: { type: String, default: '' },
  android_user_app_force_update: { type: Boolean, default: false },
  android_provider_app_version_code: { type: String, default: '' },
  android_provider_app_force_update: { type: Boolean, default: false },
  ios_user_app_version_code: { type: String, default: '' },
  ios_user_app_force_update: { type: Boolean, default: false },
  ios_provider_app_version_code: { type: String, default: '' },
  ios_provider_app_force_update: { type: Boolean, default: false },
  
  // Firebase
  firebase_apiKey: { type: String, default: '' },
  firebase_authDomain: { type: String, default: '' },
  firebase_databaseURL: { type: String, default: '' },
  firebase_projectId: { type: String, default: '' },
  firebase_storageBucket: { type: String, default: '' },
  firebase_messagingSenderId: { type: String, default: '' },
  
  // Términos y Políticas
  user_terms_and_condition: { type: String, default: '' },
  provider_terms_and_condition: { type: String, default: '' },
  user_privacy_policy: { type: String, default: '' },
  provider_privacy_policy: { type: String, default: '' },
  
  // Configuración General
  server_url: { type: String, default: '' },
  app_name: { type: String, default: 'JoltCab' },
  partner_panel_name: { type: String, default: 'JoltCab PARTNER PANEL' },
  dispatcher_panel_name: { type: String, default: 'JoltCab DISPATCHER PANEL' },
  hotel_panel_name: { type: String, default: 'JoltCab HOTEL PANEL' },
  timezone_for_display_date: { type: String, default: '' },
  
  // Ubicación
  location: { type: [Number], index: '2d' },
  
  // Firebase Admins (Multi-admin support)
  firebase_admins: [{
    uid: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, default: '' },
    role: { type: String, enum: ['super_admin', 'admin', 'moderator'], default: 'admin' },
    permissions: {
      dashboard: { type: Boolean, default: true },
      users: { type: Boolean, default: true },
      providers: { type: Boolean, default: true },
      trips: { type: Boolean, default: true },
      settings: { type: Boolean, default: false },
      reports: { type: Boolean, default: true },
      payments: { type: Boolean, default: false },
    },
    two_factor_enabled: { type: Boolean, default: false },
    two_factor_secret: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date },
    is_active: { type: Boolean, default: true },
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

// Solo debe haber un documento de settings
settingsDetailSchema.index({}, { unique: true });

export const SettingsDetail = mongoose.model('settings', settingsDetailSchema);
export default SettingsDetail;
