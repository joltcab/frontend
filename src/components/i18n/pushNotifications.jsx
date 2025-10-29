/**
 * Push Notification Events and Templates
 * Multi-language support for JoltCab
 */

export const PushEvents = {
  // Trip Lifecycle
  TRIP_REQUESTED: 'trip.requested',
  TRIP_ACCEPTED: 'trip.accepted',
  TRIP_DRIVER_COMING: 'trip.driver_coming',
  TRIP_DRIVER_ARRIVED: 'trip.driver_arrived',
  TRIP_STARTED: 'trip.started',
  TRIP_ENDED: 'trip.ended',
  TRIP_CANCELLED_BY_DRIVER: 'trip.cancelled_driver',
  TRIP_CANCELLED_BY_USER: 'trip.cancelled_user',
  TRIP_NO_DRIVER_FOUND: 'trip.no_driver',
  
  // Approvals
  DRIVER_APPROVED: 'approval.driver_approved',
  DRIVER_DECLINED: 'approval.driver_declined',
  USER_APPROVED: 'approval.user_approved',
  USER_DECLINED: 'approval.user_declined',
  
  // Security
  SECURITY_LOGIN_OTHER_DEVICE: 'security.login_other_device',
  SECURITY_LOGOUT_FORCED: 'security.logout_forced'
};

export const PushTemplates = {
  [PushEvents.TRIP_REQUESTED]: {
    title: {
      en: "New Ride Request 🚗",
      es: "Nueva Solicitud de Viaje 🚗"
    },
    body: {
      en: "{{distance}} km away • {{estimated_fare}}",
      es: "A {{distance}} km • {{estimated_fare}}"
    },
    priority: "high"
  },
  
  [PushEvents.TRIP_ACCEPTED]: {
    title: {
      en: "Driver Accepted! ✅",
      es: "¡Conductor Aceptado! ✅"
    },
    body: {
      en: "{{driver_name}} is on the way. ETA: {{eta}} min",
      es: "{{driver_name}} está en camino. Llegada: {{eta}} min"
    },
    priority: "high"
  },
  
  [PushEvents.TRIP_DRIVER_ARRIVED]: {
    title: {
      en: "Driver Arrived! 📍",
      es: "¡Conductor Llegó! 📍"
    },
    body: {
      en: "{{driver_name}} is waiting for you",
      es: "{{driver_name}} te está esperando"
    },
    priority: "high"
  },
  
  [PushEvents.TRIP_ENDED]: {
    title: {
      en: "Trip Completed ✅",
      es: "Viaje Completado ✅"
    },
    body: {
      en: "Total: {{amount}}. Please rate your experience",
      es: "Total: {{amount}}. Por favor califica tu experiencia"
    },
    priority: "high"
  },
  
  [PushEvents.DRIVER_APPROVED]: {
    title: {
      en: "Account Approved! 🎉",
      es: "¡Cuenta Aprobada! 🎉"
    },
    body: {
      en: "Congratulations! You can now start accepting rides",
      es: "¡Felicidades! Ya puedes empezar a aceptar viajes"
    },
    priority: "high"
  }
};

/**
 * Replace variables in template
 */
export function replaceVariables(template, variables) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Get push notification template
 */
export function getPushTemplate(event, language = 'en', variables = {}) {
  const template = PushTemplates[event];
  if (!template) {
    console.error(`Push template not found for event: ${event}`);
    return null;
  }
  
  return {
    title: replaceVariables(template.title[language] || template.title.en, variables),
    body: replaceVariables(template.body[language] || template.body.en, variables),
    priority: template.priority,
    data: {
      event,
      ...variables
    }
  };
}