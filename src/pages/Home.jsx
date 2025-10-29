import React, { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { createPageUrl } from "@/utils";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";
import PassengerSection from "../components/landing/PassengerSection";
import DriverSection from "../components/landing/DriverSection";
import BusinessSection from "../components/landing/BusinessSection";
import HotelSection from "../components/landing/HotelSection";
import DispatcherSection from "../components/landing/DispatcherSection";
import WhatsAppSection from "../components/landing/WhatsAppSection";
import Testimonials from "../components/landing/Testimonials";
import CoverageMap from "../components/landing/CoverageMap";
import WhatsAppButton from "../components/appearance/WhatsAppButton";

// Traducciones
const translations = {
  en: {
    hero: {
      badge: "🚀 The Future of Ride-Hailing",
      title: "Your Ride,",
      titleHighlight: "Your Price",
      subtitle: "Negotiate your fare directly with drivers.",
      subtitleHighlight: "Fair for everyone.",
      cta: {
        whatsapp: "Book via WhatsApp",
        download: "Download App"
      },
      features: {
        safe: "Safe & Verified",
        fair: "Fair Pricing",
        available: "24/7 Available"
      }
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Get a ride in 3 simple steps",
      steps: [
        {
          title: "Request a Ride",
          description: "Enter your pickup and destination locations"
        },
        {
          title: "Negotiate Price",
          description: "Drivers make offers, you choose the best one"
        },
        {
          title: "Enjoy Your Ride",
          description: "Travel safely with verified drivers"
        }
      ]
    },
    passenger: {
      badge: "👥 For Passengers",
      title: "Travel Smart, Pay Fair",
      subtitle: "No surge pricing, no hidden fees. Just honest fares negotiated with your driver.",
      benefits: [
        {
          title: "Set Your Price",
          description: "Propose your fare and drivers respond with offers"
        },
        {
          title: "Save Time",
          description: "Get matched with nearby drivers instantly"
        },
        {
          title: "Safe & Secure",
          description: "All drivers are verified with background checks"
        },
        {
          title: "Rate & Review",
          description: "Help maintain quality with our rating system"
        }
      ],
      cta: {
        whatsapp: "Book Now",
        download: "Get the App"
      }
    },
    driver: {
      badge: "🚗 For Drivers",
      title: "Drive & Earn More",
      subtitle: "Keep more of what you earn. No unfair commissions, just transparent earnings.",
      benefits: [
        {
          title: "Higher Earnings",
          description: "Negotiate fares and earn up to 45% more than traditional platforms"
        },
        {
          title: "Flexible Schedule",
          description: "Drive when you want, where you want"
        },
        {
          title: "Direct Communication",
          description: "Chat directly with passengers for better coordination"
        },
        {
          title: "Instant Payments",
          description: "Get paid immediately after each trip"
        }
      ],
      cta: "Become a Driver",
      note: "Start earning today - Sign up takes less than 5 minutes"
    },
    corporate: {
      badge: "💼 For Businesses",
      title: "Corporate Transportation Made Easy",
      subtitle: "Streamline employee transportation with our business solutions.",
      benefits: [
        {
          title: "Centralized Billing",
          description: "One invoice for all company rides"
        },
        {
          title: "Trip Management",
          description: "Track and manage all employee trips in one dashboard"
        },
        {
          title: "Analytics & Reports",
          description: "Detailed reports on transportation spending"
        },
        {
          title: "Priority Support",
          description: "Dedicated account manager for your business"
        }
      ],
      cta: "Get Started"
    },
    hotel: {
      badge: "🏨 For Hotels",
      title: "Enhance Guest Experience",
      subtitle: "Provide reliable transportation for your guests with JoltCab partnership.",
      benefits: [
        {
          title: "Seamless Integration",
          description: "Easy booking for your concierge team"
        },
        {
          title: "Guest Satisfaction",
          description: "Reliable service improves guest reviews"
        },
        {
          title: "Premium Service",
          description: "Verified drivers for your valued guests"
        },
        {
          title: "Commission Program",
          description: "Earn commission on every booking"
        }
      ],
      cta: "Partner With Us"
    },
    dispatcher: {
      badge: "📻 For Dispatchers",
      title: "Manage Rides Efficiently",
      subtitle: "Control your fleet and maximize operations with our dispatcher tools.",
      benefits: [
        {
          title: "Real-Time Dispatch",
          description: "Assign rides to drivers instantly"
        },
        {
          title: "Live Tracking",
          description: "Monitor all active rides on the map"
        },
        {
          title: "Performance Metrics",
          description: "Track driver performance and fleet efficiency"
        },
        {
          title: "Revenue Management",
          description: "Monitor earnings and payouts"
        }
      ],
      cta: "Join as Dispatcher"
    },
    whatsapp: {
      badge: "📱 WhatsApp Booking",
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
      subtitle: "Join thousands of satisfied riders and drivers",
      items: [
        {
          text: "I love being able to negotiate my fare. It's so much better than surge pricing!",
          name: "Sarah Johnson",
          role: "Regular Passenger"
        },
        {
          text: "As a driver, I finally feel in control of my earnings. Best platform I've used.",
          name: "Michael Chen",
          role: "Driver Partner"
        },
        {
          text: "The corporate dashboard makes managing employee rides so easy.",
          name: "David Martinez",
          role: "HR Manager"
        }
      ]
    },
    coverage: {
      title: "Available in Major Cities",
      subtitle: "Expanding to more cities every month",
      cities: [
        { name: "New York", rides: "50K+ rides" },
        { name: "Los Angeles", rides: "45K+ rides" },
        { name: "Chicago", rides: "30K+ rides" },
        { name: "Houston", rides: "25K+ rides" },
        { name: "Miami", rides: "20K+ rides" },
        { name: "Atlanta", rides: "18K+ rides" }
      ]
    }
  },
  es: {
    hero: {
      badge: "🚀 El Futuro del Transporte",
      title: "Tu Viaje,",
      titleHighlight: "Tu Precio",
      subtitle: "Negocia tu tarifa directamente con los conductores.",
      subtitleHighlight: "Justo para todos.",
      cta: {
        whatsapp: "Reservar por WhatsApp",
        download: "Descargar App"
      },
      features: {
        safe: "Seguro y Verificado",
        fair: "Precios Justos",
        available: "Disponible 24/7"
      }
    },
    howItWorks: {
      title: "Cómo Funciona",
      subtitle: "Consigue un viaje en 3 simples pasos",
      steps: [
        {
          title: "Solicita un Viaje",
          description: "Ingresa tu ubicación de recogida y destino"
        },
        {
          title: "Negocia el Precio",
          description: "Los conductores hacen ofertas, tú eliges la mejor"
        },
        {
          title: "Disfruta tu Viaje",
          description: "Viaja seguro con conductores verificados"
        }
      ]
    },
    passenger: {
      badge: "👥 Para Pasajeros",
      title: "Viaja Inteligente, Paga Justo",
      subtitle: "Sin precios dinámicos, sin tarifas ocultas. Solo tarifas honestas negociadas con tu conductor.",
      benefits: [
        {
          title: "Establece tu Precio",
          description: "Propón tu tarifa y los conductores responden con ofertas"
        },
        {
          title: "Ahorra Tiempo",
          description: "Conéctate con conductores cercanos al instante"
        },
        {
          title: "Seguro y Protegido",
          description: "Todos los conductores están verificados"
        },
        {
          title: "Califica y Opina",
          description: "Ayuda a mantener la calidad con nuestro sistema de calificación"
        }
      ],
      cta: {
        whatsapp: "Reservar Ahora",
        download: "Descargar App"
      }
    },
    driver: {
      badge: "🚗 Para Conductores",
      title: "Conduce y Gana Más",
      subtitle: "Conserva más de lo que ganas. Sin comisiones injustas, solo ganancias transparentes.",
      benefits: [
        {
          title: "Mayores Ganancias",
          description: "Negocia tarifas y gana hasta 45% más"
        },
        {
          title: "Horario Flexible",
          description: "Conduce cuando quieras, donde quieras"
        },
        {
          title: "Comunicación Directa",
          description: "Chatea directamente con pasajeros"
        },
        {
          title: "Pagos Instantáneos",
          description: "Recibe el pago inmediatamente después de cada viaje"
        }
      ],
      cta: "Conviértete en Conductor",
      note: "Comienza a ganar hoy - El registro toma menos de 5 minutos"
    },
    corporate: {
      badge: "💼 Para Empresas",
      title: "Transporte Corporativo Fácil",
      subtitle: "Simplifica el transporte de empleados con nuestras soluciones empresariales.",
      benefits: [
        {
          title: "Facturación Centralizada",
          description: "Una sola factura para todos los viajes"
        },
        {
          title: "Gestión de Viajes",
          description: "Rastrea y gestiona todos los viajes en un panel"
        },
        {
          title: "Análisis e Informes",
          description: "Informes detallados del gasto en transporte"
        },
        {
          title: "Soporte Prioritario",
          description: "Gerente de cuenta dedicado"
        }
      ],
      cta: "Comenzar"
    },
    hotel: {
      badge: "🏨 Para Hoteles",
      title: "Mejora la Experiencia del Huésped",
      subtitle: "Proporciona transporte confiable para tus huéspedes.",
      benefits: [
        {
          title: "Integración Perfecta",
          description: "Reserva fácil para tu equipo de conserjería"
        },
        {
          title: "Satisfacción del Huésped",
          description: "Servicio confiable mejora las reseñas"
        },
        {
          title: "Servicio Premium",
          description: "Conductores verificados para huéspedes valiosos"
        },
        {
          title: "Programa de Comisiones",
          description: "Gana comisión en cada reserva"
        }
      ],
      cta: "Asóciate con Nosotros"
    },
    dispatcher: {
      badge: "📻 Para Despachadores",
      title: "Gestiona Viajes Eficientemente",
      subtitle: "Controla tu flota y maximiza operaciones.",
      benefits: [
        {
          title: "Despacho en Tiempo Real",
          description: "Asigna viajes a conductores al instante"
        },
        {
          title: "Seguimiento en Vivo",
          description: "Monitorea todos los viajes activos"
        },
        {
          title: "Métricas de Rendimiento",
          description: "Rastrea el rendimiento de conductores"
        },
        {
          title: "Gestión de Ingresos",
          description: "Monitorea ganancias y pagos"
        }
      ],
      cta: "Únete como Despachador"
    },
    whatsapp: {
      badge: "📱 Reserva por WhatsApp",
      title: "Reserva un Viaje en Segundos",
      subtitle: "No necesitas descargar app. Solo envíanos un mensaje.",
      features: {
        instant: "Cotizaciones Instantáneas",
        instantDesc: "Obtén estimados de tarifa inmediatamente",
        easy: "Súper Fácil",
        easyDesc: "Solo envía tu ubicación y destino",
        support: "Soporte 24/7",
        supportDesc: "Siempre estamos aquí para ayudar"
      },
      cta: "Comenzar en WhatsApp"
    },
    testimonials: {
      title: "Lo Que Dicen Nuestros Usuarios",
      subtitle: "Únete a miles de pasajeros y conductores satisfechos",
      items: [
        {
          text: "Me encanta poder negociar mi tarifa. ¡Es mucho mejor que los precios dinámicos!",
          name: "Sarah Johnson",
          role: "Pasajera Regular"
        },
        {
          text: "Como conductor, finalmente siento control de mis ganancias. La mejor plataforma.",
          name: "Michael Chen",
          role: "Conductor Socio"
        },
        {
          text: "El panel corporativo hace que gestionar viajes sea muy fácil.",
          name: "David Martinez",
          role: "Gerente de RRHH"
        }
      ]
    },
    coverage: {
      title: "Disponible en Ciudades Principales",
      subtitle: "Expandiéndonos a más ciudades cada mes",
      cities: [
        { name: "New York", rides: "50K+ viajes" },
        { name: "Los Angeles", rides: "45K+ viajes" },
        { name: "Chicago", rides: "30K+ viajes" },
        { name: "Houston", rides: "25K+ viajes" },
        { name: "Miami", rides: "20K+ viajes" },
        { name: "Atlanta", rides: "18K+ viajes" }
      ]
    }
  }
};

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await joltcab.auth.me();
      if (user && user.role === 'admin') {
        setShowAdminLink(true);
      }
    } catch (error) {
      // Not logged in or not admin
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-white">
      <WhatsAppButton />
      
      {showAdminLink && (
        <a
          href={createPageUrl("AdminPanel")}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
        >
          🛡️ Admin Panel
        </a>
      )}

      <Hero t={t.hero} />
      
      <div id="how-it-works">
        <HowItWorks t={t.howItWorks} />
      </div>
      
      <div id="services">
        <PassengerSection t={t.passenger} />
        <DriverSection t={t.driver} />
        <BusinessSection t={t.corporate} />
        <HotelSection t={t.hotel} />
        <DispatcherSection t={t.dispatcher} />
        <WhatsAppSection t={t.whatsapp} />
      </div>
      
      <Testimonials t={t.testimonials} />
      
      <div id="coverage">
        <CoverageMap t={t.coverage} />
      </div>
    </div>
  );
}