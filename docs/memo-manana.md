# Memo para mañana

Fecha: 2025-11-01

Objetivos principales
- Verificar UI y lógica de `AdminReferrals` (botón +$10, estados y filtros).
- Probar flujos de registro completos: Driver y Hotel (registro, updateMe, creación de perfiles y documentos).
- Revisar `PaymentMethods` y `AddPaymentMethodDialog` en éxito y error.
- Validar `BankDetailsDialog` con datos faltantes y confirmación de éxito.

Verificaciones rápidas
- Comprobar que no haya referencias activas de `base44` (solo compat o comentarios).
- Revisar `src/lib/api-client.js` para capas de compatibilidad y ajustar si es necesario.
- Confirmar que `joltcab.integrations.Core.UploadFile` funciona o mockear en dev si falta backend.
- Ejecutar `npm run build` para detectar problemas de bundling.

Pruebas recomendadas
- DriverSignUpForm: subir licencias y registro de vehículo; ver redirección a `CompleteVerification`.
- HotelSignUpForm: validar regex de teléfono y notificación opcional; redirección a verificación.
- AdminReferrals: actualizar ganancias (+$10) y refresco de tabla (invalidateQueries).

Limpieza y mantenimiento
- Detener servidor duplicado: usar solo `http://localhost:5001/` y cerrar `5002`.
- Revisar el panel de problemas del IDE (lint/PropTypes) por si aparecen nuevos avisos.
- Preparar pruebas e2e básicas para registros y referidos si el entorno lo permite.

Notas de despliegue
- Confirmar credenciales/entornos en `.env` para JoltCab (auth, entities, functions).
- Documentar cambios en `README.md` si se añaden pasos de prueba.

Enlaces útiles
- Preview: http://localhost:5001/
- Alterno (cerrar si no se usa): http://localhost:5002/