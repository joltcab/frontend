/**
 * Sistema de Traducciones para JoltCab
 * Compatible con Base44 - No requiere archivos JSON estáticos
 */

export const translations = {
  en: {
    app: {
      name: "JoltCab",
      tagline: "Your Ride, Your Price"
    },
    landing: {
      hero: {
        badge: "🚀 The Future of Ride-Hailing",
        title: "Ride-Hailing",
        titleHighlight: "Redefined",
        subtitle: "Say goodbye to surge pricing.",
        subtitleHighlight: "You negotiate the fare directly with drivers.",
        cta: {
          whatsapp: "Book via WhatsApp",
          download: "Download App"
        },
        features: {
          safe: "100% Safe",
          fair: "Fair Prices",
          available: "24/7 Available"
        }
      },
      howItWorks: {
        title: "How It Works",
        subtitle: "Three simple steps to your perfect ride",
        steps: [
          {
            title: "Request Your Ride",
            description: "Enter your pickup and destination. Send your request via app or WhatsApp."
          },
          {
            title: "Negotiate the Fare",
            description: "Drivers send their offers. You choose the best price and driver rating."
          },
          {
            title: "Enjoy Your Trip",
            description: "Travel safely with verified drivers. Rate your experience after."
          }
        ]
      },
      passengers: {
        badge: "For Passengers",
        title: "Your Ride, Your Price",
        subtitle: "Take control of your transportation costs.",
        benefits: [
          {
            title: "Negotiate Your Fare",
            description: "No more surge pricing. Get multiple offers and choose the best one."
          },
          {
            title: "Save Time & Money",
            description: "Compare prices instantly and pick what works for your budget."
          },
          {
            title: "Safe & Verified",
            description: "All drivers are background-checked and rated by passengers."
          },
          {
            title: "Rate Your Experience",
            description: "Your feedback helps maintain quality service for everyone."
          }
        ],
        cta: {
          whatsapp: "Book Now via WhatsApp",
          download: "Download App"
        }
      },
      drivers: {
        badge: "For Drivers",
        title: "Earn More, Drive Happy",
        subtitle: "Set your own prices and maximize your earnings.",
        benefits: [
          {
            title: "Set Your Own Rates",
            description: "You decide what each trip is worth. No platform dictating prices."
          },
          {
            title: "Flexible Schedule",
            description: "Work when you want. Be your own boss completely."
          },
          {
            title: "More Customers",
            description: "Access a growing rider base looking for fair-priced rides."
          },
          {
            title: "Quick Payouts",
            description: "Get paid fast with multiple withdrawal options."
          }
        ],
        cta: "Register as Driver",
        note: "Requirements: Valid license, insurance, and clean background check"
      },
      business: {
        badge: "For Businesses",
        title: "Corporate Transportation Solutions",
        subtitle: "Streamline employee transportation with negotiable rates.",
        benefits: [
          {
            title: "Corporate Accounts",
            description: "Centralized billing and expense management for all rides."
          },
          {
            title: "Detailed Reports",
            description: "Track spending, routes, and usage patterns easily."
          },
          {
            title: "Cost Savings",
            description: "Negotiate bulk rates and save up to 35% on transportation."
          },
          {
            title: "Dedicated Support",
            description: "24/7 account manager for all your business needs."
          }
        ],
        cta: "Register Your Company"
      },
      hotels: {
        badge: "For Hotels",
        title: "Guest Transportation Made Easy",
        subtitle: "Provide reliable transportation with transparent pricing.",
        benefits: [
          {
            title: "Guest Convenience",
            description: "Offer seamless transportation booking to your guests."
          },
          {
            title: "Commission Earnings",
            description: "Earn commission on every ride booked through your hotel."
          },
          {
            title: "Quality Assurance",
            description: "Verified drivers ensure your guests always get quality service."
          },
          {
            title: "Easy Integration",
            description: "Simple API integration with your booking system."
          }
        ],
        cta: "Partner With Us"
      },
      dispatchers: {
        badge: "For Dispatchers",
        title: "Grow Your Dispatch Business",
        subtitle: "Manage more rides with our powerful dispatch tools.",
        benefits: [
          {
            title: "Central Dashboard",
            description: "Manage all rides and drivers from one powerful interface."
          },
          {
            title: "Real-Time Tracking",
            description: "Monitor all active rides and driver locations live."
          },
          {
            title: "Automated Assignments",
            description: "Smart algorithms match the best driver to each ride."
          },
          {
            title: "Earn Commissions",
            description: "Get paid for every ride you dispatch successfully."
          }
        ],
        cta: "Register as Dispatcher"
      },
      whatsapp: {
        badge: "WhatsApp Booking",
        title: "Book a Ride in Seconds",
        subtitle: "No app download needed. Just text us on WhatsApp.",
        features: {
          instant: "Instant Quotes",
          instantDesc: "Get fare estimates immediately",
          easy: "Super Easy",
          easyDesc: "Just send your location and destination",
          support: "24/7 Support",
          supportDesc: "We're always here to help"
        },
        cta: "Start on WhatsApp"
      },
      testimonials: {
        title: "What Our Users Say",
        subtitle: "Real experiences from real people",
        items: [
          {
            name: "Sarah Johnson",
            role: "Regular Passenger",
            text: "I save about $30 per week by negotiating fares. The drivers are professional and the service is reliable.",
            rating: 5
          },
          {
            name: "Michael Rodriguez",
            role: "Driver",
            text: "Finally, a platform that respects drivers! I earn 40% more compared to traditional ride-sharing apps.",
            rating: 5
          },
          {
            name: "Tech Corp Inc.",
            role: "Corporate Client",
            text: "JoltCab helped us reduce transportation costs by 35% while maintaining excellent service quality.",
            rating: 5
          }
        ]
      },
      coverage: {
        title: "Available in Major Cities",
        subtitle: "Expanding to more cities every month",
        cities: [
          { name: "New York", rides: "50K+" },
          { name: "Los Angeles", rides: "45K+" },
          { name: "Chicago", rides: "30K+" },
          { name: "Miami", rides: "25K+" },
          { name: "Houston", rides: "20K+" },
          { name: "Phoenix", rides: "15K+" }
        ]
      }
    },
    button: {
      login: "Login",
      register: "Register",
      logout: "Logout",
      edit: "Edit",
      update: "Update",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      apply: "Apply",
      add: "Add",
      close: "Close",
      select: "Select",
      approve: "Approve",
      decline: "Decline",
      profile: "Profile",
      history: "History",
      detail: "Detail",
      invoice: "Invoice",
      export: "Export",
      forgot_password: "Forgot Your Password",
      add_new: "Add New",
      ride_now: "Ride Now",
      calculate_estimate: "Calculate Estimate",
      banking_detail: "Banking Detail"
    },
    title: {
      user: "User",
      driver: "Driver",
      provider: "Provider",
      trip: "Trip",
      ride: "Ride",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      profile: "Profile",
      name: "Name",
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      country: "Country",
      zipcode: "Zipcode",
      date: "Date",
      time: "Time",
      amount: "Amount",
      payment: "Payment",
      wallet: "Wallet",
      default: "Default",
      image: "Image",
      on: "ON",
      off: "OFF",
      business: "Business"
    },
    unit: {
      km: "km",
      mile: "mile",
      min: "min",
      by_km: "/km",
      by_mile: "/mile",
      by_min: "/min"
    },
    status: {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      active: "Active",
      inactive: "Inactive",
      completed: "Completed",
      cancelled: "Cancelled",
      in_progress: "In Progress"
    },
    menu: {
      dashboard: "Dashboard",
      requests: "Requests",
      scheduled_requests: "Scheduled Requests",
      providers: "Service Providers",
      online_providers: "Online Providers",
      approved_providers: "Approved Providers",
      pending_providers: "Pending Providers",
      users: "Users",
      trips: "Trips",
      payments: "Payments",
      settings: "Settings",
      countries: "Countries",
      cities: "Cities",
      service_types: "Service Types",
      promo_codes: "Promo Codes",
      reviews: "Reviews",
      map_view: "Map View",
      content: "Content",
      blog: "Blog",
      events: "Events",
      pages: "Pages",
      recent_rides: "Recent Rides",
      admin_panel: "Admin Panel",
      mass_notifications: "Mass Notifications",
      email_settings: "Email Settings",
      sms_settings: "SMS Settings"
    },
    success: {
      login: "Login successful",
      registration: "Registration successful",
      password_update: "Password updated successfully",
      profile_update: "Profile updated successfully",
      trip_cancelled: "Trip cancelled successfully",
      trip_created: "Request created successfully",
      card_added: "Card added successfully",
      wallet_credited: "Wallet credited successfully",
      update: "Updated successfully",
      delete: "Deleted successfully",
      driver_approved: "Driver approved successfully",
      driver_declined: "Driver declined successfully",
      notification_sent: "Notification sent successfully"
    },
    error: {
      email_already_registered: "Email already registered",
      phone_already_used: "Phone number already used",
      email_not_registered: "Email not registered",
      invalid_credentials: "Invalid email or password",
      incorrect_password: "Incorrect password",
      not_approved: "Your account is not approved by admin",
      trip_not_found: "Trip not found",
      trip_already_running: "Trip already running",
      driver_not_found: "Driver not found",
      no_drivers_available: "No drivers found around you",
      add_card_first: "Please add a card first",
      payment_failed: "Payment failed",
      invalid_promo_code: "Invalid promo code",
      promo_already_used: "Promo code already used",
      promo_expired: "Promo code expired",
      notification_failed: "Failed to send notification"
    },
    question: {
      already_register: "Already have an account? Login",
      not_register: "Haven't account yet? Register",
      forgot_password: "Forgot your password?"
    },
    message: {
      welcome: "Welcome, Please Register",
      welcome_login: "Welcome, Please Login"
    }
  },
  es: {
    app: {
      name: "JoltCab",
      tagline: "Tu Viaje, Tu Precio"
    },
    landing: {
      hero: {
        badge: "🚀 El Futuro del Transporte",
        title: "Transporte",
        titleHighlight: "Redefinido",
        subtitle: "Dile adiós a los precios dinámicos.",
        subtitleHighlight: "Tú negocias la tarifa directamente con los conductores.",
        cta: {
          whatsapp: "Reservar por WhatsApp",
          download: "Descargar App"
        },
        features: {
          safe: "100% Seguro",
          fair: "Precios Justos",
          available: "24/7 Disponible"
        }
      },
      howItWorks: {
        title: "Cómo Funciona",
        subtitle: "Tres simples pasos para tu viaje perfecto",
        steps: [
          {
            title: "Solicita tu Viaje",
            description: "Ingresa tu ubicación y destino. Envía tu solicitud por app o WhatsApp."
          },
          {
            title: "Negocia la Tarifa",
            description: "Los conductores envían sus ofertas. Tú eliges el mejor precio y calificación."
          },
          {
            title: "Disfruta tu Viaje",
            description: "Viaja seguro con conductores verificados. Califica tu experiencia después."
          }
        ]
      },
      passengers: {
        badge: "Para Pasajeros",
        title: "Tu Viaje, Tu Precio",
        subtitle: "Toma control de tus costos de transporte.",
        benefits: [
          {
            title: "Negocia tu Tarifa",
            description: "No más precios dinámicos. Recibe múltiples ofertas y elige la mejor."
          },
          {
            title: "Ahorra Tiempo y Dinero",
            description: "Compara precios instantáneamente y elige lo que funciona para tu presupuesto."
          },
          {
            title: "Seguro y Verificado",
            description: "Todos los conductores tienen verificación de antecedentes y calificaciones."
          },
          {
            title: "Califica tu Experiencia",
            description: "Tu opinión ayuda a mantener un servicio de calidad para todos."
          }
        ],
        cta: {
          whatsapp: "Reservar por WhatsApp",
          download: "Descargar App"
        }
      },
      drivers: {
        badge: "Para Conductores",
        title: "Gana Más, Maneja Feliz",
        subtitle: "Establece tus propios precios y maximiza tus ganancias.",
        benefits: [
          {
            title: "Fija tus Propias Tarifas",
            description: "Tú decides cuánto vale cada viaje. Sin plataforma dictando precios."
          },
          {
            title: "Horario Flexible",
            description: "Trabaja cuando quieras. Sé tu propio jefe completamente."
          },
          {
            title: "Más Clientes",
            description: "Accede a una base creciente de pasajeros buscando viajes justos."
          },
          {
            title: "Pagos Rápidos",
            description: "Recibe tu dinero rápido con múltiples opciones de retiro."
          }
        ],
        cta: "Registrarse como Conductor",
        note: "Requisitos: Licencia válida, seguro y verificación de antecedentes"
      },
      business: {
        badge: "Para Empresas",
        title: "Soluciones de Transporte Corporativo",
        subtitle: "Optimiza el transporte de empleados con tarifas negociables.",
        benefits: [
          {
            title: "Cuentas Corporativas",
            description: "Facturación centralizada y gestión de gastos para todos los viajes."
          },
          {
            title: "Reportes Detallados",
            description: "Rastrea gastos, rutas y patrones de uso fácilmente."
          },
          {
            title: "Ahorro de Costos",
            description: "Negocia tarifas por volumen y ahorra hasta 35% en transporte."
          },
          {
            title: "Soporte Dedicado",
            description: "Gerente de cuenta 24/7 para todas tus necesidades empresariales."
          }
        ],
        cta: "Registrar tu Empresa"
      },
      hotels: {
        badge: "Para Hoteles",
        title: "Transporte para Huéspedes Simplificado",
        subtitle: "Proporciona transporte confiable con precios transparentes.",
        benefits: [
          {
            title: "Conveniencia para Huéspedes",
            description: "Ofrece reservas de transporte sin complicaciones a tus huéspedes."
          },
          {
            title: "Ganancias por Comisión",
            description: "Gana comisión en cada viaje reservado a través de tu hotel."
          },
          {
            title: "Garantía de Calidad",
            description: "Conductores verificados aseguran que tus huéspedes siempre reciban servicio de calidad."
          },
          {
            title: "Integración Fácil",
            description: "Integración API simple con tu sistema de reservas."
          }
        ],
        cta: "Asóciate con Nosotros"
      },
      dispatchers: {
        badge: "Para Despachadores",
        title: "Haz Crecer tu Negocio de Despacho",
        subtitle: "Gestiona más viajes con nuestras herramientas poderosas.",
        benefits: [
          {
            title: "Panel Central",
            description: "Gestiona todos los viajes y conductores desde una interfaz poderosa."
          },
          {
            title: "Rastreo en Tiempo Real",
            description: "Monitorea todos los viajes activos y ubicaciones de conductores en vivo."
          },
          {
            title: "Asignaciones Automatizadas",
            description: "Algoritmos inteligentes emparejan el mejor conductor para cada viaje."
          },
          {
            title: "Gana Comisiones",
            description: "Recibe pago por cada viaje que despachas exitosamente."
          }
        ],
        cta: "Registrarse como Despachador"
      },
      whatsapp: {
        badge: "Reserva por WhatsApp",
        title: "Reserva un Viaje en Segundos",
        subtitle: "No necesitas descargar app. Solo escríbenos por WhatsApp.",
        features: {
          instant: "Cotizaciones Instantáneas",
          instantDesc: "Recibe estimados de tarifa inmediatamente",
          easy: "Súper Fácil",
          easyDesc: "Solo envía tu ubicación y destino",
          support: "Soporte 24/7",
          supportDesc: "Siempre estamos aquí para ayudar"
        },
        cta: "Comenzar en WhatsApp"
      },
      testimonials: {
        title: "Lo Que Dicen Nuestros Usuarios",
        subtitle: "Experiencias reales de personas reales",
        items: [
          {
            name: "Sarah Johnson",
            role: "Pasajera Regular",
            text: "Ahorro unos $30 por semana negociando tarifas. Los conductores son profesionales y el servicio es confiable.",
            rating: 5
          },
          {
            name: "Michael Rodriguez",
            role: "Conductor",
            text: "¡Finalmente, una plataforma que respeta a los conductores! Gano 40% más comparado con apps tradicionales.",
            rating: 5
          },
          {
            name: "Tech Corp Inc.",
            role: "Cliente Corporativo",
            text: "JoltCab nos ayudó a reducir costos de transporte en 35% manteniendo excelente calidad de servicio.",
            rating: 5
          }
        ]
      },
      coverage: {
        title: "Disponible en Ciudades Principales",
        subtitle: "Expandiéndonos a más ciudades cada mes",
        cities: [
          { name: "Nueva York", rides: "50K+" },
          { name: "Los Ángeles", rides: "45K+" },
          { name: "Chicago", rides: "30K+" },
          { name: "Miami", rides: "25K+" },
          { name: "Houston", rides: "20K+" },
          { name: "Phoenix", rides: "15K+" }
        ]
      }
    },
    button: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      edit: "Editar",
      update: "Actualizar",
      delete: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      submit: "Enviar",
      apply: "Aplicar",
      add: "Agregar",
      close: "Cerrar",
      select: "Seleccionar",
      approve: "Aprobar",
      decline: "Rechazar",
      profile: "Perfil",
      history: "Historial",
      detail: "Detalle",
      invoice: "Factura",
      export: "Exportar",
      forgot_password: "¿Olvidaste tu contraseña?",
      add_new: "Agregar Nuevo",
      ride_now: "Viajar Ahora",
      calculate_estimate: "Calcular Estimado"
    },
    title: {
      user: "Usuario",
      driver: "Conductor",
      provider: "Proveedor",
      trip: "Viaje",
      ride: "Carrera",
      status: "Estado",
      active: "Activo",
      inactive: "Inactivo",
      profile: "Perfil",
      name: "Nombre",
      first_name: "Nombre",
      last_name: "Apellido",
      email: "Correo",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      country: "País",
      date: "Fecha",
      time: "Hora",
      amount: "Monto",
      payment: "Pago",
      wallet: "Billetera"
    },
    unit: {
      km: "km",
      mile: "milla",
      min: "min",
      by_km: "/km",
      by_mile: "/milla",
      by_min: "/min"
    },
    status: {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      active: "Activo",
      inactive: "Inactivo",
      completed: "Completado",
      cancelled: "Cancelado",
      in_progress: "En Progreso"
    },
    menu: {
      dashboard: "Panel de Control",
      requests: "Solicitudes",
      providers: "Proveedores de Servicio",
      users: "Usuarios",
      trips: "Viajes",
      payments: "Pagos",
      settings: "Configuración",
      countries: "Países",
      cities: "Ciudades",
      service_types: "Tipos de Servicio",
      promo_codes: "Códigos Promocionales",
      reviews: "Reseñas",
      map_view: "Vista de Mapa",
      recent_rides: "Viajes Recientes",
      admin_panel: "Panel de Admin",
      mass_notifications: "Notificaciones Masivas",
      email_settings: "Configuración de Email",
      sms_settings: "Configuración de SMS"
    },
    success: {
      login: "Inicio de sesión exitoso",
      registration: "Registro exitoso",
      password_update: "Contraseña actualizada exitosamente",
      profile_update: "Perfil actualizado exitosamente",
      trip_cancelled: "Viaje cancelado exitosamente",
      trip_created: "Solicitud creada exitosamente",
      update: "Actualizado exitosamente",
      delete: "Eliminado exitosamente"
    },
    error: {
      email_already_registered: "Correo ya registrado",
      phone_already_used: "Número de teléfono ya en uso",
      email_not_registered: "Correo no registrado",
      invalid_credentials: "Correo o contraseña inválidos",
      incorrect_password: "Contraseña incorrecta",
      trip_not_found: "Viaje no encontrado",
      driver_not_found: "Conductor no encontrado",
      no_drivers_available: "No hay conductores disponibles",
      payment_failed: "Pago fallido",
      invalid_promo_code: "Código promocional inválido"
    },
    question: {
      already_register: "¿Ya tienes cuenta? Iniciar Sesión",
      not_register: "¿No tienes cuenta? Registrarse",
      forgot_password: "¿Olvidaste tu contraseña?"
    },
    message: {
      welcome: "Bienvenido, Por Favor Regístrate",
      welcome_login: "Bienvenido, Por Favor Inicia Sesión"
    }
  }
};

export function getTranslation(translations, path, variables = {}) {
  const keys = path.split('.');
  let result = translations;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path;
    }
  }
  
  if (typeof result === 'string') {
    return result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  }
  
  return result;
}