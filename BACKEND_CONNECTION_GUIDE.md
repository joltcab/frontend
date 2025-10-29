# 🔌 JoltCab Backend Connection Guide

## 📋 Tabla de Contenidos
1. [Configuración del Backend](#configuración-del-backend)
2. [Sistema de Autenticación](#sistema-de-autenticación)
3. [Endpoints de la API](#endpoints-de-la-api)
4. [Endpoints para Emergent IA](#endpoints-para-emergent-ia)
5. [Flujo de Autenticación OAuth](#flujo-de-autenticación-oauth)
6. [Credenciales de Acceso](#credenciales-de-acceso)

---

## 🔧 Configuración del Backend

### URL del Backend
```
Production: https://admin.joltcab.com/api/v1
Railway: https://0ei9df5g.up.railway.app/api/v1
```

### Variables de Entorno (.env)
```env
VITE_API_URL=https://admin.joltcab.com/api/v1
VITE_WS_URL=wss://admin.joltcab.com
VITE_ENV=production
```

---

## 🔐 Sistema de Autenticación

### Credenciales de Admin
```
Email: admin@joltcab.com
Password: @Odg4383@
Role: admin
```

### Métodos de Autenticación

#### 1. Login con Email/Password
```javascript
import { joltcab } from '@/lib/joltcab-api';

// Login
const response = await joltcab.auth.login('admin@joltcab.com', '@Odg4383@');

// Obtener usuario actual
const user = await joltcab.auth.me();

// Logout
await joltcab.auth.logout();
```

#### 2. Google OAuth
```javascript
// Iniciar flujo de Google OAuth
const redirectUri = window.location.origin + '/auth/google/callback';
joltcab.auth.googleLogin(redirectUri, 'admin');

// En la página de callback
const code = searchParams.get('code');
const state = searchParams.get('state');
const response = await joltcab.auth.googleCallback(code, state);
```

#### 3. Apple OAuth
```javascript
const redirectUri = window.location.origin + '/auth/apple/callback';
joltcab.auth.appleLogin(redirectUri, 'admin');
```

#### 4. Facebook OAuth
```javascript
const redirectUri = window.location.origin + '/auth/facebook/callback';
joltcab.auth.facebookLogin(redirectUri, 'admin');
```

---

## 📡 Endpoints de la API

### Auth Endpoints
```javascript
// Login
POST /api/v1/auth/login
Body: { email, password }

// Register
POST /api/v1/auth/register
Body: { email, password, name, phone, role }

// Get Current User
GET /api/v1/auth/me
Headers: { Authorization: Bearer <token> }

// Forgot Password
POST /api/v1/auth/forgot-password
Body: { email }

// Reset Password
POST /api/v1/auth/reset-password
Body: { token, password }

// Google OAuth
GET /api/v1/auth/google?redirect_uri=<uri>&role=<role>
POST /api/v1/auth/google/callback
Body: { code, state }

// Apple OAuth
GET /api/v1/auth/apple?redirect_uri=<uri>&role=<role>
POST /api/v1/auth/apple/callback
Body: { code, state }

// Facebook OAuth
GET /api/v1/auth/facebook?redirect_uri=<uri>&role=<role>
POST /api/v1/auth/facebook/callback
Body: { code, state }
```

### User Management
```javascript
// List Users
GET /api/v1/stats/users?page=1&limit=10

// Get User
GET /api/v1/users/:id

// Create User
POST /api/v1/users
Body: { email, password, name, phone, role }

// Update User
PUT /api/v1/users/:id
Body: { name, phone, status }

// Delete User
DELETE /api/v1/users/:id
```

### Admin Management
```javascript
// List Admins
GET /api/v1/admins

// Create Admin
POST /api/v1/admins
Body: { email, password, name, permissions }

// Update Admin
PUT /api/v1/admins/:id
Body: { name, permissions, status }

// Delete Admin
DELETE /api/v1/admins/:id

// Upgrade to Super Admin
POST /api/v1/admins/upgrade-super-admin
Body: { admin_email }

// Sync Admin
POST /api/v1/admins/sync
Body: { admin_email, make_super_admin }
```

### Stats & Dashboard
```javascript
// Dashboard Stats
GET /api/v1/stats/dashboard

// User Stats
GET /api/v1/stats/users?period=week

// Driver Stats
GET /api/v1/stats/drivers

// Ride Stats
GET /api/v1/stats/rides
```

### Trips & Rides
```javascript
// Calculate Fare
POST /api/v1/trips/calculate-fare
Body: { pickup, dropoff, service_type }

// Create Trip
POST /api/v1/trips
Body: { pickup, dropoff, service_type, payment_method }

// Update Trip
PUT /api/v1/trips/:id
Body: { status, driver_id }

// Cancel Trip
POST /api/v1/trips/:id/cancel
Body: { reason }

// List Rides
GET /api/v1/stats/rides?status=completed
```

### Payments & Wallet
```javascript
// Create Payment Intent
POST /api/v1/payments/create-intent
Body: { amount, currency }

// Add Card
POST /api/v1/payments/cards
Body: { card_token, is_default }

// Get Cards
GET /api/v1/payments/cards

// Get Wallet Balance
GET /api/v1/wallet/balance

// Get Wallet History
GET /api/v1/wallet/history?page=1&limit=20

// Add Funds
POST /api/v1/wallet/add-funds
Body: { amount }
```

### Notifications
```javascript
// List Notifications
GET /api/v1/notifications?read=false

// Mark as Read
PUT /api/v1/notifications/:id/read

// Mark All as Read
PUT /api/v1/notifications/read-all
```

### Settings & Configuration
```javascript
// Get Settings
GET /api/v1/settings

// Update Settings
PUT /api/v1/settings
Body: { key: value }

// Initialize Settings
POST /api/v1/settings/initialize

// Get Constants
GET /api/v1/settings/constants

// Get Config Status
GET /api/v1/settings/config-status

// Seed System Config
POST /api/v1/setup/seed-system-config

// Save Configuration
POST /api/v1/setup/configuration
Body: { config_key, config_value, config_category, is_encrypted }

// Get Configurations
GET /api/v1/setup/configurations?category=<category>
```

---

## 🎵 Endpoints para Emergent IA

### Chat con IA (Requiere Autenticación)
```javascript
// Enviar mensaje al chat
POST /api/v1/emergent-ia/chat
Body: { message, context }
Headers: { Authorization: Bearer <token> }

// Obtener historial de chat
GET /api/v1/emergent-ia/chat/history?page=1&limit=50
Headers: { Authorization: Bearer <token> }

// Pedir canción
POST /api/v1/emergent-ia/chat/request-song
Body: { song_title, artist, message }
Headers: { Authorization: Bearer <token> }

// Ejemplo de uso
const response = await joltcab.emergentIA.chat.sendMessage(
  "Quiero escuchar algo de rock",
  { mood: "energetic" }
);

const history = await joltcab.emergentIA.chat.getHistory({ page: 1, limit: 20 });

const songRequest = await joltcab.emergentIA.chat.requestSong({
  song_title: "Bohemian Rhapsody",
  artist: "Queen",
  message: "Por favor toca esta canción"
});
```

### Calendario de Shows
```javascript
// Listar shows
GET /api/v1/emergent-ia/shows?date=2024-01-01&location=Miami

// Obtener show específico
GET /api/v1/emergent-ia/shows/:id

// Shows próximos
GET /api/v1/emergent-ia/shows/upcoming

// Ejemplo de uso
const shows = await joltcab.emergentIA.shows.list({ 
  date: '2024-01-01',
  location: 'Miami' 
});

const upcomingShows = await joltcab.emergentIA.shows.upcoming();
```

### Eventos
```javascript
// Listar eventos
GET /api/v1/emergent-ia/events?category=music&status=active

// Obtener evento específico
GET /api/v1/emergent-ia/events/:id

// Eventos próximos
GET /api/v1/emergent-ia/events/upcoming

// Ejemplo de uso
const events = await joltcab.emergentIA.events.list({ 
  category: 'music',
  status: 'active' 
});

const upcomingEvents = await joltcab.emergentIA.events.upcoming();
```

### LocalNews con IA
```javascript
// Listar noticias locales
GET /api/v1/emergent-ia/local-news?location=Miami&category=entertainment

// Obtener noticia específica
GET /api/v1/emergent-ia/local-news/:id

// Noticias por ubicación
POST /api/v1/emergent-ia/local-news/by-location
Body: { location: "Miami, FL" }

// Ejemplo de uso
const localNews = await joltcab.emergentIA.localNews.list({ 
  location: 'Miami',
  category: 'entertainment' 
});

const newsByLocation = await joltcab.emergentIA.localNews.getByLocation("Miami, FL");
```

### LastNews (Últimas Noticias)
```javascript
// Listar últimas noticias
GET /api/v1/emergent-ia/last-news?category=music&limit=10

// Obtener noticia específica
GET /api/v1/emergent-ia/last-news/:id

// Últimas noticias (más recientes)
GET /api/v1/emergent-ia/last-news/latest?limit=10

// Ejemplo de uso
const lastNews = await joltcab.emergentIA.lastNews.list({ 
  category: 'music',
  limit: 10 
});

const latestNews = await joltcab.emergentIA.lastNews.latest(10);
```

### Notificaciones de Canciones
```javascript
// Listar notificaciones de canciones
GET /api/v1/emergent-ia/notifications/songs?read=false
Headers: { Authorization: Bearer <token> }

// Marcar como leída
PUT /api/v1/emergent-ia/notifications/songs/:id/read
Headers: { Authorization: Bearer <token> }

// Suscribirse a notificaciones
POST /api/v1/emergent-ia/notifications/songs/subscribe
Body: { genres: ["rock", "pop"], artists: ["Queen", "Beatles"] }
Headers: { Authorization: Bearer <token> }

// Ejemplo de uso
const songNotifications = await joltcab.emergentIA.notifications.songs.list({ 
  read: false 
});

await joltcab.emergentIA.notifications.songs.markAsRead(notificationId);

await joltcab.emergentIA.notifications.songs.subscribe({
  genres: ["rock", "pop"],
  artists: ["Queen", "Beatles"]
});
```

### Notificaciones de Noticias
```javascript
// Listar notificaciones de noticias
GET /api/v1/emergent-ia/notifications/news?read=false
Headers: { Authorization: Bearer <token> }

// Marcar como leída
PUT /api/v1/emergent-ia/notifications/news/:id/read
Headers: { Authorization: Bearer <token> }

// Suscribirse a notificaciones
POST /api/v1/emergent-ia/notifications/news/subscribe
Body: { categories: ["music", "events"], locations: ["Miami"] }
Headers: { Authorization: Bearer <token> }

// Ejemplo de uso
const newsNotifications = await joltcab.emergentIA.notifications.news.list({ 
  read: false 
});

await joltcab.emergentIA.notifications.news.markAsRead(notificationId);

await joltcab.emergentIA.notifications.news.subscribe({
  categories: ["music", "events"],
  locations: ["Miami"]
});
```

### Todas las Notificaciones
```javascript
// Obtener todas las notificaciones
GET /api/v1/emergent-ia/notifications?type=all&read=false
Headers: { Authorization: Bearer <token> }

// Marcar todas como leídas
PUT /api/v1/emergent-ia/notifications/read-all
Headers: { Authorization: Bearer <token> }

// Ejemplo de uso
const allNotifications = await joltcab.emergentIA.notifications.getAll({ 
  type: 'all',
  read: false 
});

await joltcab.emergentIA.notifications.markAllAsRead();
```

### Preferencias del Usuario
```javascript
// Obtener preferencias
GET /api/v1/emergent-ia/preferences
Headers: { Authorization: Bearer <token> }

// Actualizar preferencias
PUT /api/v1/emergent-ia/preferences
Body: { 
  favorite_genres: ["rock", "pop"],
  notification_settings: { songs: true, news: true },
  language: "es"
}
Headers: { Authorization: Bearer <token> }

// Ejemplo de uso
const preferences = await joltcab.emergentIA.preferences.get();

await joltcab.emergentIA.preferences.update({
  favorite_genres: ["rock", "pop"],
  notification_settings: { songs: true, news: true },
  language: "es"
});
```

---

## 🔄 Flujo de Autenticación OAuth

### Google OAuth Flow

1. **Iniciar OAuth**
```javascript
// Usuario hace clic en "Sign in with Google"
const redirectUri = window.location.origin + '/auth/google/callback';
joltcab.auth.googleLogin(redirectUri, 'admin');
```

2. **Backend redirige a Google**
```
GET https://admin.joltcab.com/api/v1/auth/google?redirect_uri=<uri>&role=admin
→ Redirige a Google OAuth
```

3. **Google autentica y redirige de vuelta**
```
Google → https://yourapp.com/auth/google/callback?code=<code>&state=<state>
```

4. **Frontend procesa el callback**
```javascript
// En GoogleCallback.jsx
const code = searchParams.get('code');
const state = searchParams.get('state');
const response = await joltcab.auth.googleCallback(code, state);

// Backend devuelve token
// Frontend guarda token y obtiene usuario
const user = await joltcab.auth.me();
```

5. **Verificación y redirección**
```javascript
if (user.role === 'admin') {
  navigate('/AdminPanel');
} else {
  // Acceso denegado
  await joltcab.auth.logout();
}
```

---

## 🔑 Credenciales de Acceso

### Admin Dashboard
```
URL: https://admin.joltcab.com/Admin
Email: admin@joltcab.com
Password: @Odg4383@
```

### Backend Dashboard (Directo)
```
URL: https://admin.joltcab.com/BackendDashboard
Email: admin@joltcab.com
Password: @Odg4383@
```

### API Testing
```bash
# Login
curl -X POST https://admin.joltcab.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@joltcab.com","password":"@Odg4383@"}'

# Get User (con token)
curl -X GET https://admin.joltcab.com/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## 📱 Integración con Apps Móviles

### React Native / Flutter

```javascript
// Configurar API Client
import { joltcab } from './lib/joltcab-api';

// Login
const login = async (email, password) => {
  try {
    const response = await joltcab.auth.login(email, password);
    // Guardar token en AsyncStorage/SecureStore
    await AsyncStorage.setItem('token', response.data.token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Chat con IA
const sendChatMessage = async (message) => {
  try {
    const response = await joltcab.emergentIA.chat.sendMessage(message);
    return response;
  } catch (error) {
    if (error.message.includes('401')) {
      // Redirigir a login
      navigation.navigate('Login');
    }
    throw error;
  }
};

// Obtener shows próximos
const getUpcomingShows = async () => {
  const shows = await joltcab.emergentIA.shows.upcoming();
  return shows;
};

// Suscribirse a notificaciones
const subscribeToNotifications = async (preferences) => {
  await joltcab.emergentIA.notifications.songs.subscribe(preferences);
  await joltcab.emergentIA.notifications.news.subscribe(preferences);
};
```

---

## 🛠️ Testing & Debugging

### Test Endpoints
```javascript
// Test Mapbox
await joltcab.test.mapbox('your_mapbox_token');

// Test Google Maps
await joltcab.test.googleMaps('your_google_maps_key');

// Test Stripe
await joltcab.test.stripe('your_stripe_secret_key');

// Test Twilio
await joltcab.test.twilio('account_sid', 'auth_token');

// Test SMTP
await joltcab.test.smtp('smtp.gmail.com', 587, 'user', 'pass');

// Test All
const results = await joltcab.test.all();
```

### Error Handling
```javascript
try {
  const response = await joltcab.auth.login(email, password);
} catch (error) {
  if (error.message.includes('401')) {
    // Credenciales inválidas
  } else if (error.message.includes('403')) {
    // Acceso denegado
  } else if (error.message.includes('500')) {
    // Error del servidor
  }
}
```

---

## 📚 Recursos Adicionales

- **API Client**: `/src/lib/joltcab-api.js`
- **Admin Login**: `/src/pages/AdminLogin.jsx`
- **Backend Dashboard Login**: `/src/pages/BackendDashboardLogin.jsx`
- **Google Callback**: `/src/pages/GoogleCallback.jsx`
- **Environment Config**: `/.env.example`

---

## 🎯 Funcionalidades Emergent IA

### Resumen de Características

1. **Chat con IA** (Requiere autenticación)
   - Pedir canciones
   - Historial de conversaciones
   - Contexto personalizado

2. **Calendario de Shows**
   - Listado de shows
   - Shows próximos
   - Filtrado por fecha y ubicación

3. **Eventos**
   - Eventos activos
   - Eventos próximos
   - Categorización

4. **LocalNews con IA**
   - Noticias por ubicación
   - Categorización
   - Personalización con IA

5. **LastNews**
   - Últimas noticias
   - Noticias más recientes
   - Filtrado por categoría

6. **Sistema de Notificaciones**
   - Notificaciones de canciones
   - Notificaciones de noticias
   - Suscripciones personalizadas
   - Gestión de lectura

7. **Preferencias de Usuario**
   - Géneros favoritos
   - Configuración de notificaciones
   - Idioma

---

## 🔐 Seguridad

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
```

### Token Management
```javascript
// Guardar token
joltcab.setToken(token);

// Obtener token actual
const token = joltcab.token;

// Limpiar token
joltcab.clearToken();
```

### Verificación de Autenticación
```javascript
const checkAuth = async () => {
  try {
    const user = await joltcab.auth.me();
    return user;
  } catch (error) {
    // No autenticado
    return null;
  }
};
```

---

**Última actualización**: 29 de Octubre, 2025
**Versión**: 1.0.0
**Mantenido por**: iHOSTcast Team
