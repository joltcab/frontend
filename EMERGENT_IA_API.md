# 🎵 Emergent IA - API Documentation

## 📱 Aplicaciones Móviles y Web

Esta documentación cubre todos los endpoints necesarios para las aplicaciones móviles (iOS/Android) y web de **Emergent IA**.

---

## 🔐 Autenticación

### ⚠️ Importante
El **Chat con IA** requiere autenticación. Los usuarios no autenticados serán redirigidos automáticamente al registro.

### Endpoints de Autenticación

#### Login con Email/Password
```javascript
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}

// Respuesta
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "usuario@example.com",
      "name": "Usuario",
      "role": "user"
    }
  }
}
```

#### Registro de Usuario
```javascript
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "nuevo@example.com",
  "password": "password123",
  "name": "Nuevo Usuario",
  "phone": "+1234567890"
}
```

#### Google OAuth (Recomendado para móvil)
```javascript
// 1. Iniciar flujo OAuth
GET /api/v1/auth/google?redirect_uri=<uri>&role=user

// 2. Callback después de autenticación
POST /api/v1/auth/google/callback
{
  "code": "google_auth_code",
  "state": "random_state"
}
```

#### Obtener Usuario Actual
```javascript
GET /api/v1/auth/me
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "email": "usuario@example.com",
      "name": "Usuario",
      "role": "user"
    }
  }
}
```

---

## 💬 Chat con IA

### 🎤 Pedir Canciones

#### Enviar Mensaje al Chat
```javascript
POST /api/v1/emergent-ia/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Quiero escuchar algo de rock",
  "context": {
    "mood": "energetic",
    "genre_preference": "rock"
  }
}

// Respuesta
{
  "success": true,
  "data": {
    "response": "¡Claro! Te recomiendo estas canciones de rock...",
    "suggestions": [
      {
        "title": "Bohemian Rhapsody",
        "artist": "Queen",
        "genre": "rock"
      }
    ]
  }
}
```

#### Obtener Historial de Chat
```javascript
GET /api/v1/emergent-ia/chat/history?page=1&limit=50
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "message": "Quiero escuchar rock",
        "response": "Te recomiendo...",
        "timestamp": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100
    }
  }
}
```

#### Pedir Canción Específica
```javascript
POST /api/v1/emergent-ia/chat/request-song
Authorization: Bearer <token>
Content-Type: application/json

{
  "song_title": "Bohemian Rhapsody",
  "artist": "Queen",
  "message": "Por favor toca esta canción"
}

// Respuesta
{
  "success": true,
  "data": {
    "request_id": "req_123",
    "status": "pending",
    "message": "Tu solicitud ha sido recibida"
  }
}
```

---

## 📅 Calendario de Shows

#### Listar Shows
```javascript
GET /api/v1/emergent-ia/shows?date=2024-01-01&location=Miami

// Respuesta
{
  "success": true,
  "data": {
    "shows": [
      {
        "id": "show_123",
        "title": "Rock Night",
        "date": "2024-01-15T20:00:00Z",
        "location": "Miami Arena",
        "description": "Una noche de rock inolvidable",
        "artists": ["Queen", "AC/DC"],
        "image_url": "https://...",
        "ticket_url": "https://..."
      }
    ]
  }
}
```

#### Obtener Show Específico
```javascript
GET /api/v1/emergent-ia/shows/show_123

// Respuesta
{
  "success": true,
  "data": {
    "show": {
      "id": "show_123",
      "title": "Rock Night",
      "date": "2024-01-15T20:00:00Z",
      "location": "Miami Arena",
      "description": "Una noche de rock inolvidable",
      "artists": ["Queen", "AC/DC"],
      "lineup": [...],
      "ticket_info": {...}
    }
  }
}
```

#### Shows Próximos
```javascript
GET /api/v1/emergent-ia/shows/upcoming

// Respuesta
{
  "success": true,
  "data": {
    "shows": [
      // Lista de shows próximos ordenados por fecha
    ]
  }
}
```

---

## 🎉 Eventos

#### Listar Eventos
```javascript
GET /api/v1/emergent-ia/events?category=music&status=active

// Respuesta
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_123",
        "title": "Festival de Música",
        "date": "2024-02-01T10:00:00Z",
        "location": "Miami Beach",
        "category": "music",
        "description": "El mejor festival del año",
        "image_url": "https://...",
        "registration_url": "https://..."
      }
    ]
  }
}
```

#### Obtener Evento Específico
```javascript
GET /api/v1/emergent-ia/events/event_123
```

#### Eventos Próximos
```javascript
GET /api/v1/emergent-ia/events/upcoming
```

---

## 📰 LocalNews con IA

#### Listar Noticias Locales
```javascript
GET /api/v1/emergent-ia/local-news?location=Miami&category=entertainment

// Respuesta
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "news_123",
        "title": "Nuevo concierto en Miami",
        "summary": "Queen regresa a Miami...",
        "content": "...",
        "location": "Miami, FL",
        "category": "entertainment",
        "published_at": "2024-01-01T12:00:00Z",
        "image_url": "https://...",
        "source": "Local News AI"
      }
    ]
  }
}
```

#### Obtener Noticia Específica
```javascript
GET /api/v1/emergent-ia/local-news/news_123
```

#### Noticias por Ubicación
```javascript
POST /api/v1/emergent-ia/local-news/by-location
Content-Type: application/json

{
  "location": "Miami, FL"
}

// Respuesta
{
  "success": true,
  "data": {
    "news": [
      // Noticias filtradas por ubicación
    ]
  }
}
```

---

## 📢 LastNews (Últimas Noticias)

#### Listar Últimas Noticias
```javascript
GET /api/v1/emergent-ia/last-news?category=music&limit=10

// Respuesta
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "lastnews_123",
        "title": "Breaking: Nuevo álbum de Queen",
        "summary": "Queen anuncia nuevo álbum...",
        "content": "...",
        "category": "music",
        "published_at": "2024-01-01T12:00:00Z",
        "image_url": "https://...",
        "source": "Music News"
      }
    ]
  }
}
```

#### Obtener Noticia Específica
```javascript
GET /api/v1/emergent-ia/last-news/lastnews_123
```

#### Últimas Noticias (Más Recientes)
```javascript
GET /api/v1/emergent-ia/last-news/latest?limit=10

// Respuesta - Noticias ordenadas por fecha (más recientes primero)
```

---

## 🔔 Sistema de Notificaciones

### Notificaciones de Canciones

#### Listar Notificaciones de Canciones
```javascript
GET /api/v1/emergent-ia/notifications/songs?read=false
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "type": "song_request",
        "title": "Tu canción fue tocada",
        "message": "Bohemian Rhapsody está sonando ahora",
        "song": {
          "title": "Bohemian Rhapsody",
          "artist": "Queen"
        },
        "read": false,
        "created_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### Marcar Notificación como Leída
```javascript
PUT /api/v1/emergent-ia/notifications/songs/notif_123/read
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### Suscribirse a Notificaciones de Canciones
```javascript
POST /api/v1/emergent-ia/notifications/songs/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "genres": ["rock", "pop"],
  "artists": ["Queen", "Beatles"],
  "notify_on_request": true,
  "notify_on_play": true
}

// Respuesta
{
  "success": true,
  "message": "Successfully subscribed to song notifications"
}
```

### Notificaciones de Noticias

#### Listar Notificaciones de Noticias
```javascript
GET /api/v1/emergent-ia/notifications/news?read=false
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_456",
        "type": "news_update",
        "title": "Nueva noticia local",
        "message": "Nuevo concierto anunciado en Miami",
        "news": {
          "id": "news_123",
          "title": "Nuevo concierto en Miami"
        },
        "read": false,
        "created_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### Marcar Notificación como Leída
```javascript
PUT /api/v1/emergent-ia/notifications/news/notif_456/read
Authorization: Bearer <token>
```

#### Suscribirse a Notificaciones de Noticias
```javascript
POST /api/v1/emergent-ia/notifications/news/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "categories": ["music", "events"],
  "locations": ["Miami", "New York"],
  "notify_on_local": true,
  "notify_on_breaking": true
}
```

### Todas las Notificaciones

#### Obtener Todas las Notificaciones
```javascript
GET /api/v1/emergent-ia/notifications?type=all&read=false
Authorization: Bearer <token>

// Respuesta - Combina notificaciones de canciones y noticias
{
  "success": true,
  "data": {
    "notifications": [
      // Notificaciones de canciones y noticias mezcladas
    ]
  }
}
```

#### Marcar Todas como Leídas
```javascript
PUT /api/v1/emergent-ia/notifications/read-all
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## ⚙️ Preferencias del Usuario

#### Obtener Preferencias
```javascript
GET /api/v1/emergent-ia/preferences
Authorization: Bearer <token>

// Respuesta
{
  "success": true,
  "data": {
    "preferences": {
      "favorite_genres": ["rock", "pop"],
      "favorite_artists": ["Queen", "Beatles"],
      "notification_settings": {
        "songs": true,
        "news": true,
        "events": true
      },
      "language": "es",
      "location": "Miami, FL"
    }
  }
}
```

#### Actualizar Preferencias
```javascript
PUT /api/v1/emergent-ia/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "favorite_genres": ["rock", "pop", "jazz"],
  "favorite_artists": ["Queen", "Beatles", "Miles Davis"],
  "notification_settings": {
    "songs": true,
    "news": true,
    "events": false
  },
  "language": "es",
  "location": "Miami, FL"
}

// Respuesta
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

---

## 📱 Integración con React Native

### Ejemplo de Implementación

```javascript
import { joltcab } from './lib/joltcab-api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar token al iniciar la app
const initializeApp = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    joltcab.setToken(token);
  }
};

// Login
const handleLogin = async (email, password) => {
  try {
    const response = await joltcab.auth.login(email, password);
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
const loadUpcomingShows = async () => {
  try {
    const shows = await joltcab.emergentIA.shows.upcoming();
    return shows;
  } catch (error) {
    console.error('Error loading shows:', error);
    return [];
  }
};

// Suscribirse a notificaciones
const setupNotifications = async () => {
  try {
    // Notificaciones de canciones
    await joltcab.emergentIA.notifications.songs.subscribe({
      genres: ['rock', 'pop'],
      artists: ['Queen', 'Beatles'],
      notify_on_request: true,
      notify_on_play: true
    });

    // Notificaciones de noticias
    await joltcab.emergentIA.notifications.news.subscribe({
      categories: ['music', 'events'],
      locations: ['Miami'],
      notify_on_local: true,
      notify_on_breaking: true
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

// Obtener notificaciones no leídas
const loadUnreadNotifications = async () => {
  try {
    const notifications = await joltcab.emergentIA.notifications.getAll({
      read: false
    });
    return notifications;
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};
```

---

## 🌐 Integración con Flutter

### Ejemplo de Implementación

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class EmergentIAAPI {
  static const String baseURL = 'https://admin.joltcab.com/api/v1';
  String? token;

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseURL/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      token = data['data']['token'];
      
      // Guardar token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token!);
      
      return data;
    } else {
      throw Exception('Login failed');
    }
  }

  // Chat con IA
  Future<Map<String, dynamic>> sendChatMessage(String message) async {
    final response = await http.post(
      Uri.parse('$baseURL/emergent-ia/chat'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'message': message}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      // Redirigir a login
      throw Exception('Unauthorized');
    } else {
      throw Exception('Failed to send message');
    }
  }

  // Obtener shows próximos
  Future<List<dynamic>> getUpcomingShows() async {
    final response = await http.get(
      Uri.parse('$baseURL/emergent-ia/shows/upcoming'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['data']['shows'];
    } else {
      throw Exception('Failed to load shows');
    }
  }

  // Suscribirse a notificaciones
  Future<void> subscribeToNotifications() async {
    // Notificaciones de canciones
    await http.post(
      Uri.parse('$baseURL/emergent-ia/notifications/songs/subscribe'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'genres': ['rock', 'pop'],
        'artists': ['Queen', 'Beatles'],
        'notify_on_request': true,
        'notify_on_play': true,
      }),
    );

    // Notificaciones de noticias
    await http.post(
      Uri.parse('$baseURL/emergent-ia/notifications/news/subscribe'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'categories': ['music', 'events'],
        'locations': ['Miami'],
        'notify_on_local': true,
        'notify_on_breaking': true,
      }),
    );
  }
}
```

---

## 🔒 Manejo de Errores

### Códigos de Estado HTTP

- **200**: Success
- **201**: Created
- **400**: Bad Request (datos inválidos)
- **401**: Unauthorized (no autenticado o token inválido)
- **403**: Forbidden (sin permisos)
- **404**: Not Found (recurso no encontrado)
- **500**: Internal Server Error

### Ejemplo de Manejo de Errores

```javascript
try {
  const response = await joltcab.emergentIA.chat.sendMessage(message);
  // Éxito
} catch (error) {
  if (error.message.includes('401')) {
    // Token inválido o expirado - redirigir a login
    navigation.navigate('Login');
  } else if (error.message.includes('403')) {
    // Sin permisos - mostrar mensaje
    Alert.alert('Error', 'No tienes permisos para esta acción');
  } else if (error.message.includes('500')) {
    // Error del servidor
    Alert.alert('Error', 'Error del servidor. Intenta más tarde');
  } else {
    // Otro error
    Alert.alert('Error', error.message);
  }
}
```

---

## 📊 Paginación

La mayoría de los endpoints que devuelven listas soportan paginación:

```javascript
GET /api/v1/emergent-ia/shows?page=1&limit=20

// Respuesta
{
  "success": true,
  "data": {
    "shows": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 🎯 Flujo de Usuario Completo

### 1. Registro/Login
```
Usuario abre app → Pantalla de login/registro → Login con email o Google OAuth
```

### 2. Chat con IA (Requiere autenticación)
```
Usuario intenta acceder al chat → Verificar autenticación → Si no está autenticado, redirigir a login → Si está autenticado, mostrar chat
```

### 3. Navegación
```
- Calendario de Shows (público)
- Eventos (público)
- LocalNews (público)
- LastNews (público)
- Chat con IA (requiere autenticación)
- Notificaciones (requiere autenticación)
```

---

## 🔑 URLs de Acceso

### Producción
```
API: https://admin.joltcab.com/api/v1
WebSocket: wss://admin.joltcab.com
```

### Testing
```
API: https://0ei9df5g.up.railway.app/api/v1
```

---

**Última actualización**: 29 de Octubre, 2025  
**Versión**: 1.0.0  
**Soporte**: iHOSTcast Team
