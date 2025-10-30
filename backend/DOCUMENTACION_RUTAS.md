# Documentación de Rutas - JoltCab Backend Original

## 📋 Resumen de Estructura

El backend original tiene una arquitectura MVC compleja con múltiples tipos de rutas:

### Categorías de Rutas

1. **Rutas Públicas** (`/app/routes/`) - 25 archivos
2. **Rutas Admin** (`/app/admin_routes/`) - 44 archivos  
3. **Rutas Usuario** (`/app/user_routes/`) - 5 archivos
4. **Rutas Provider** (`/app/provider_routes/`) - 3 archivos
5. **Rutas Corporate** (`/app/corporate_routes/`) - 2 archivos

---

## 🔐 1. Autenticación y Usuarios

### Admin Auth (`/app/admin_routes/auth.js`)
- Login/Logout de administradores
- Gestión de sesiones
- Autenticación con Google
- Sistema de 2FA

### User Routes (`/app/routes/users.js`)
- Registro de usuarios
- Login/Logout
- Perfil de usuario
- Verificación de teléfono/email

### Provider Routes (`/app/routes/providers.js`)
- Registro de conductores
- Login/Logout de conductores
- Gestión de documentos
- Actualización de ubicación

---

## 🚗 2. Gestión de Viajes (Trips)

### User Trips (`/app/user_routes/trip.js`)
- Solicitar viaje
- Cancelar viaje
- Ver historial de viajes
- Calificar conductor

### Provider Trips (`/app/provider_routes/trip.js`)
- Aceptar/Rechazar viajes
- Iniciar/Finalizar viaje
- Actualizar estado del viaje
- Ver historial de viajes

### Admin Trips (`/app/admin_routes/request.js`)
- Ver todos los viajes
- Gestionar viajes
- Reportes de viajes
- Estadísticas

### Trip Routes (`/app/routes/trip.js`)
- Lógica principal de viajes
- Cálculo de tarifas
- Asignación de conductores
- Tracking en tiempo real

### Scheduled Trips (`/app/routes/scheduledtrip.js`)
- Programar viajes futuros
- Gestionar viajes programados

---

## 💳 3. Pagos y Billetera

### User Payments (`/app/user_routes/payments.js`)
- Agregar métodos de pago
- Procesar pagos
- Historial de pagos

### Provider Payments (`/app/provider_routes/payments.js`)
- Ver ganancias
- Solicitar retiros
- Historial de pagos

### Admin Payments (`/app/admin_routes/payment_transaction.js`)
- Ver todas las transacciones
- Gestionar pagos pendientes
- Reportes financieros

### Wallet (`/app/routes/wallet_history.js`)
- Agregar fondos a billetera
- Historial de billetera
- Transacciones

### Bank Details (`/app/routes/bank_detail.js`)
- Gestionar cuentas bancarias
- Información de pago

### Cards (`/app/routes/card.js`)
- Agregar/Eliminar tarjetas
- Gestionar métodos de pago

---

## 📊 4. Ganancias y Reportes

### Provider Earnings
- `/app/routes/provider_earning.js` - Ganancias de conductores
- `/app/admin_routes/provider_earning.js` - Admin view
- `/app/admin_routes/provider_daily_earning.js` - Diarias
- `/app/admin_routes/provider_weekly_earning.js` - Semanales

### Trip Earnings
- `/app/admin_routes/trip_earning.js` - Por viaje
- `/app/admin_routes/daily_earning.js` - Diarias
- `/app/admin_routes/weekly_earning.js` - Semanales

### Partner Earnings
- `/app/admin_routes/partner_earning.js`
- `/app/admin_routes/admin_partner_weekly_earning.js`

### Reports (`/app/routes/reports.js`)
- Reportes generales
- Estadísticas
- Exportación de datos

### Analytics (`/app/routes/provider_analytics.js`)
- Análisis de conductores
- Métricas de rendimiento

---

## 🌍 5. Geografía y Configuración

### Country (`/app/routes/country.js`)
- Gestionar países
- Configuración por país

### City (`/app/routes/city.js`)
- Gestionar ciudades
- Configuración por ciudad

### City Types (`/app/routes/citytype.js`)
- Tipos de servicio por ciudad

### City Service Types (`/app/admin_routes/city_service_types.js`)
- Configuración de servicios

---

## 🚕 6. Tipos de Servicio

### Service Types (`/app/admin_routes/service_type.js`)
- Crear/Editar tipos de servicio
- Configurar precios
- Gestionar imágenes

---

## 👥 7. Gestión de Usuarios (Admin)

### Admin Users (`/app/admin_routes/user.js`)
- Ver todos los usuarios
- Editar usuarios
- Bloquear/Desbloquear
- Estadísticas de usuarios

### Admin Providers (`/app/admin_routes/provider.js`)
- Ver todos los conductores
- Aprobar/Rechazar conductores
- Gestionar documentos
- Estadísticas de conductores

---

## 🏢 8. Corporativos y Partners

### Corporate (`/app/admin_routes/corporate.js`)
- Gestionar cuentas corporativas
- Configuración de empresas

### Corporate Routes (`/app/corporate_routes/corporate.js`)
- Panel corporativo
- Gestión de empleados

### Partners (`/app/admin_routes/partner.js`)
- Gestionar partners
- Configuración de comisiones

### Partner Payments (`/app/admin_routes/partner_payments.js`)
- Pagos a partners
- Historial

---

## 🏨 9. Hoteles y Dispatchers

### Hotels (`/app/admin_routes/hotel.js`)
- Gestionar hoteles
- Configuración de servicios

### Dispatchers (`/app/admin_routes/dispatcher.js`)
- Gestionar dispatchers
- Asignación de viajes

---

## 📄 10. Documentos

### User Documents (`/app/routes/userdocument.js`)
- Subir documentos de usuario
- Verificación

### Provider Documents (`/app/routes/providerdocument.js`)
- Subir documentos de conductor
- Verificación de licencias

### Admin Documents (`/app/admin_routes/documents.js`)
- Gestionar todos los documentos
- Aprobar/Rechazar

---

## 🎟️ 11. Promociones

### Promo Codes (`/app/admin_routes/promo_code.js`)
- Crear códigos promocionales
- Gestionar descuentos
- Estadísticas de uso

---

## ⭐ 12. Reseñas

### Reviews (`/app/admin_routes/reviews.js`)
- Ver todas las reseñas
- Gestionar reseñas
- Estadísticas

---

## 📱 13. Notificaciones

### Notifications (`/app/routes/notifications.js`)
- Enviar notificaciones push
- Historial de notificaciones

### Admin Notifications (`/app/admin_routes/notifications.js`)
- Notificaciones masivas
- Configuración de notificaciones

### Mass Notifications (`/app/admin_routes/send_mass_notification.js`)
- Envío masivo

### Mass SMS (`/app/admin_routes/send_mass_sms.js`)
- SMS masivos

---

## 🤖 14. Integraciones Modernas

### AI Routes (`/app/routes/ai.js`)
- Chat con IA para solicitar canciones
- Precios dinámicos con IA
- Asignación inteligente de conductores
- Soporte automatizado

### WhatsApp (`/app/routes/whatsapp.js`)
- Integración con WhatsApp
- Notificaciones por WhatsApp
- Chat de soporte

### Referrals (`/app/routes/referrals.js`)
- Sistema de referidos
- Bonos por referidos

### Support (`/app/routes/support.js`)
- Tickets de soporte
- Chat de ayuda

---

## ⚙️ 15. Configuración

### Settings (`/app/admin_routes/settings.js`)
- Configuración general
- Parámetros de la app
- Integración con Firebase

### Settings PG (`/app/routes/settings-pg.js`)
- Configuración con PostgreSQL
- Nuevas configuraciones

### Information (`/app/routes/information.js`)
- Información de la app
- Términos y condiciones
- Política de privacidad

### Admin Information (`/app/admin_routes/information.js`)
- Gestionar información

---

## 📧 16. Comunicaciones

### Email Details (`/app/admin_routes/email_detail.js`)
- Configuración de emails
- Templates de email

### SMS Details (`/app/admin_routes/sms_detail.js`)
- Configuración de SMS
- Proveedores de SMS

---

## 🗺️ 17. Mapas y Ubicación

### Map View (`/app/admin_routes/map_view.js`)
- Vista de mapa en tiempo real
- Tracking de conductores

---

## 📅 18. Programación

### Schedule (`/app/admin_routes/schedule.js`)
- Gestionar horarios
- Disponibilidad de conductores

---

## 🔄 19. Tareas Programadas

### Cron (`/app/routes/cron.js`)
- Tareas automáticas
- Limpieza de datos
- Reportes automáticos

---

## 👤 20. Perfil y Contactos

### Emergency Contacts (`/app/routes/emergency_contact_detail.js`)
- Contactos de emergencia
- Configuración de seguridad

### Profile (`/app/admin_routes/profile.js`)
- Perfil de administrador
- Configuración personal

---

## 📝 21. Blog

### Admin Blog (`/app/admin_routes/blog.js`)
- Gestionar posts
- Crear contenido

### User Blog (`/app/user_routes/blog.js`)
- Ver posts
- Comentarios

---

## 🎨 22. Diseño Nuevo

### New Design (`/app/user_routes/new_design.js`)
- Nuevas vistas de usuario
- UI moderna

---

## 🏦 23. Transacciones

### Transaction History (`/app/admin_routes/transaction_history.js`)
- Historial completo
- Reportes financieros

### Wallet History (`/app/admin_routes/wallet_history.js`)
- Historial de billetera
- Movimientos

---

## 🎯 24. Dashboard

### Dashboard (`/app/admin_routes/dashboard.js`)
- Panel principal
- Estadísticas generales
- Métricas en tiempo real

---

## 🌐 25. Idiomas

### Languages (`/app/admin_routes/languages.js`)
- Gestionar idiomas
- Traducciones
- Configuración regional

---

## 📊 Estadísticas Totales

- **Total de archivos de rutas**: ~79 archivos
- **Endpoints estimados**: 300+ endpoints
- **Modelos de base de datos**: 49 modelos
- **Controladores**: 80+ controladores

---

## 🔄 Prioridades para Migración API REST

### Fase 1 - Funcionalidades Públicas (Web)
1. ✅ Autenticación básica (registro/login)
2. ✅ Calendario de shows
3. ✅ Eventos
4. ✅ Noticias (LastNews, LocalNews)
5. ✅ Chat con IA (requiere auth)
6. ✅ Blog público

### Fase 2 - Panel de Usuario
1. Perfil de usuario
2. Historial de viajes
3. Métodos de pago
4. Billetera
5. Notificaciones

### Fase 3 - Panel de Conductor
1. Perfil de conductor
2. Documentos
3. Viajes activos
4. Ganancias
5. Historial

### Fase 4 - Panel Admin
1. Dashboard
2. Gestión de usuarios
3. Gestión de conductores
4. Configuración
5. Reportes

---

## 🚀 Siguiente Paso

Crear API REST moderna que coexista con el sistema actual, permitiendo migración gradual sin interrumpir el servicio.
