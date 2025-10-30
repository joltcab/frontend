import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp;

export const initializeFirebase = () => {
  try {
    // Intentar cargar service account key
    let serviceAccount;
    
    // Opción 1: Desde variable de entorno (JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    // Opción 2: Desde archivo
    else {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
                                  join(__dirname, '../../config/firebase/serviceAccountKey.json');
      
      try {
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      } catch (error) {
        console.warn('⚠️  Firebase service account file not found. Push notifications will be disabled.');
        return null;
      }
    }

    // Inicializar Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('✅ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    return null;
  }
};

// Helper para enviar notificaciones push
export const sendPushNotification = async (deviceToken, notification, data = {}) => {
  if (!firebaseApp) {
    console.warn('Firebase not initialized. Skipping push notification.');
    return null;
  }

  try {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image || undefined,
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'joltcab_notifications',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Push notification error:', error);
    return null;
  }
};

// Helper para enviar a múltiples dispositivos
export const sendMulticastNotification = async (deviceTokens, notification, data = {}) => {
  if (!firebaseApp || !deviceTokens || deviceTokens.length === 0) {
    return null;
  }

  try {
    const message = {
      tokens: deviceTokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Multicast notification sent: ${response.successCount} success, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    console.error('❌ Multicast notification error:', error);
    return null;
  }
};

// Helper para verificar token de Firebase Auth
export const verifyFirebaseToken = async (idToken) => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification error:', error);
    throw error;
  }
};

export const getFirebaseApp = () => firebaseApp;

export default {
  initializeFirebase,
  sendPushNotification,
  sendMulticastNotification,
  verifyFirebaseToken,
  getFirebaseApp,
};
