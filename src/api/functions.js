import joltcab from '@/lib/joltcab-api';


export const stripeWebhook = joltcab.functions.stripeWebhook;

export const sendNotification = joltcab.functions.sendNotification;

export const notificationTriggers = joltcab.functions.notificationTriggers;

export const calculateFare = joltcab.functions.calculateFare;

export const findNearbyDrivers = joltcab.functions.findNearbyDrivers;

export const estimateTrip = joltcab.functions.estimateTrip;

export const updateDriverLocation = joltcab.functions.updateDriverLocation;

export const calculateETA = joltcab.functions.calculateETA;

export const assignDriver = joltcab.functions.assignDriver;

export const aiDynamicPricing = joltcab.functions.aiDynamicPricing;

export const aiDriverMatching = joltcab.functions.aiDriverMatching;

export const aiSupportChatbot = joltcab.functions.aiSupportChatbot;

export const whatsappWebhook = joltcab.functions.whatsappWebhook;

export const whatsappBooking = joltcab.functions.whatsappBooking;

export const whatsappNotifications = joltcab.functions.whatsappNotifications;

export const stripePaymentIntent = joltcab.functions.stripePaymentIntent;

export const stripeRefund = joltcab.functions.stripeRefund;

export const walletTransfer = joltcab.functions.walletTransfer;

export const payoutDriver = joltcab.functions.payoutDriver;

export const calculateEarnings = joltcab.functions.calculateEarnings;

export const processPayment = joltcab.functions.processPayment;

export const bankTransfer = joltcab.functions.bankTransfer;

export const trackDriverLocation = joltcab.functions.trackDriverLocation;

export const cancelRide = joltcab.functions.cancelRide;

export const rateRide = joltcab.functions.rateRide;

export const processScheduledRides = joltcab.functions.processScheduledRides;

export const calculateDetailedEarnings = joltcab.functions.calculateDetailedEarnings;

export const realtimeConnection = joltcab.functions.realtimeConnection;

export const realtimeChat = joltcab.functions.realtimeChat;

export const realtimeDashboard = joltcab.functions.realtimeDashboard;

export const pushNotification = joltcab.functions.pushNotification;

export const uploadDocument = joltcab.functions.uploadDocument;

export const verifyDocumentAI = joltcab.functions.verifyDocumentAI;

export const backgroundCheck = joltcab.functions.backgroundCheck;

export const verifySelfieID = joltcab.functions.verifySelfieID;

export const calculateRoute = joltcab.functions.calculateRoute;

export const geocodeAddress = joltcab.functions.geocodeAddress;

export const detectZone = joltcab.functions.detectZone;

export const calculateAdvancedFare = joltcab.functions.calculateAdvancedFare;

export const cronScheduledRides = joltcab.functions.cronScheduledRides;

export const cronCleanupOldData = joltcab.functions.cronCleanupOldData;

export const cronDailyReports = joltcab.functions.cronDailyReports;

export const twilioWebhook = joltcab.functions.twilioWebhook;

export const sendEmail = joltcab.functions.sendEmail;

export const sendTestEmail = joltcab.functions.sendTestEmail;

export const sendVerificationEmail = joltcab.functions.sendVerificationEmail;

export const sendSMS = joltcab.functions.sendSMS;

export const notifyAdmin = joltcab.functions.notifyAdmin;

export const sendMassNotification = joltcab.functions.sendMassNotification;

export const adminLogin = joltcab.functions.adminLogin;

export const adminSocialLogin = joltcab.functions.adminSocialLogin;

export const adminForgotPassword = joltcab.functions.adminForgotPassword;

export const adminResetPassword = joltcab.functions.adminResetPassword;

export const seedSystemConfig = joltcab.functions.seedSystemConfig;

export const seedEmailTemplates = joltcab.functions.seedEmailTemplates;

export const seedSMSTemplates = joltcab.functions.seedSMSTemplates;

export const seedCompleteTestData = joltcab.functions.seedCompleteTestData;

export const changePassword = joltcab.functions.changePassword;

export const exportRideInvoice = joltcab.functions.exportRideInvoice;

export const createTestUsers = joltcab.functions.createTestUsers;

export const registerDriver = joltcab.functions.registerDriver;

export const cronDocumentExpiry = joltcab.functions.cronDocumentExpiry;

export const requestUserAccess = joltcab.functions.requestUserAccess;

export const verifyUserAccess = joltcab.functions.verifyUserAccess;

export const endUserAccess = joltcab.functions.endUserAccess;

export const createGuestPassenger = joltcab.functions.createGuestPassenger;

export const registerDispatcher = joltcab.functions.registerDispatcher;

export const registerHotel = joltcab.functions.registerHotel;

export const registerPartner = joltcab.functions.registerPartner;

export const uploadLogo = joltcab.functions.uploadLogo;

export const uploadIosCertificate = joltcab.functions.uploadIosCertificate;

export const systemConfig = joltcab.functions.config.systemConfig;

export const stripeConfig = joltcab.functions.config.stripeConfig;

export const twilioConfig = joltcab.functions.config.twilioConfig;

export const googleMapsConfig = joltcab.functions.config.googleMapsConfig;

export const emailConfig = joltcab.functions.config.emailConfig;

export const configConstants = joltcab.functions.config.constants;

export const configReadme = joltcab.functions.config["README"];

export const sharedConfig = joltcab.functions._shared.config;

export const seedRoles = joltcab.functions.seedRoles;

export const checkPermission = joltcab.functions.checkPermission;

export const createAdminUser = joltcab.functions.createAdminUser;

export const updateAdminUser = joltcab.functions.updateAdminUser;

export const upgradeToSuperAdmin = joltcab.functions.upgradeToSuperAdmin;

export const syncAdminUser = joltcab.functions.syncAdminUser;

export const listAdminUsers = joltcab.functions.listAdminUsers;

export const deleteAdminUser = joltcab.functions.deleteAdminUser;

export const r2Upload = joltcab.functions.r2Upload;

export const r2Delete = joltcab.functions.r2Delete;

export const r2GetSignedUrl = joltcab.functions.r2GetSignedUrl;

export const userForgotPassword = joltcab.functions.userForgotPassword;

export const userResetPassword = joltcab.functions.userResetPassword;

export const authenticateUser = joltcab.functions.authenticateUser;

export const validateVehicleAge = joltcab.functions.validateVehicleAge;

export const triggerEmergency = joltcab.functions.triggerEmergency;

export const notifyEmergencyContact = joltcab.functions.notifyEmergencyContact;

export const sendTripShareSMS = joltcab.functions.sendTripShareSMS;

export const diagnosticBackend = joltcab.functions.diagnosticBackend;

export const verifyConfigStatus = joltcab.functions.verifyConfigStatus;

