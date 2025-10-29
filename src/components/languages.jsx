
// Multi-language system for JoltCab
// Supports: EN (default), ES, FR, PT

export const languages = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  pt: { code: 'pt', name: 'Português', flag: '🇵🇹' },
};

const englishTranslations = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    support: 'Support',
    wallet: 'Wallet',
    notifications: 'Notifications',
    language: 'Language',
  },
  
  header: {
    menu: {
      passengers: 'Passengers',
      drivers: 'Drivers',
      corporate: 'Corporate',
      hotels: 'Hotels',
      dispatcher: 'Dispatcher',
      support: 'Support',
    },
    cta: {
      downloadApp: 'Download App',
      requestWhatsApp: 'Request via WhatsApp',
    },
  },

  hero: {
    badge: '🚕 Smart Transportation',
    title: 'Your Ride, Your Price',
    titleHighlight: 'No Complications',
    subtitle: 'Request a taxi, negotiate your fare, and travel safely.',
    subtitleHighlight: 'You can even do it through WhatsApp.',
    cta: {
      whatsapp: 'Request via WhatsApp',
      download: 'Download App',
    },
    features: {
      safe: '100% Safe',
      fair: 'Fair Prices',
      available: '24/7 Available',
    },
  },

  howItWorks: {
    title: 'How Does JoltCab Work?',
    subtitle: 'Simple, fast, and transparent. It\'s that easy to ride with us.',
    steps: [
      {
        title: 'Request Your Ride',
        description: 'Download the app or message us on WhatsApp. Quick and easy.',
      },
      {
        title: 'Negotiate Your Fare',
        description: 'Propose your price or accept the driver\'s offer. You decide.',
      },
      {
        title: 'Travel Safely',
        description: 'Verified drivers and real-time tracking. Total peace of mind.',
      },
    ],
  },

  passengers: {
    badge: 'For Passengers',
    title: 'Travel Your Way, Pay What\'s Fair',
    subtitle: 'With JoltCab, you\'re in control. Negotiate your fare, choose your driver, and arrive at your destination with total confidence.',
    benefits: [
      {
        title: 'Fair Prices',
        description: 'You propose, the driver accepts. No surprises.',
      },
      {
        title: '24/7 Availability',
        description: 'Request your taxi whenever you need it, day or night.',
      },
      {
        title: 'Safe Rides',
        description: 'Verified drivers and real-time tracking.',
      },
      {
        title: 'Real Ratings',
        description: 'Read reviews from other passengers before you ride.',
      },
    ],
    cta: {
      whatsapp: 'Request via WhatsApp',
      download: 'Download App',
    },
  },

  drivers: {
    badge: 'For Drivers',
    title: 'Drive, Earn, and Grow with JoltCab',
    subtitle: 'Join our driver network and enjoy the freedom to work at your own pace, with better earnings and total transparency.',
    benefits: [
      {
        title: 'Earn More',
        description: 'No abusive commissions. You decide which rides to accept.',
      },
      {
        title: 'Flexible Schedule',
        description: 'Work when you want, without pressure or obligations.',
      },
      {
        title: 'Negotiate Your Fare',
        description: 'Receive offers and accept the ones that work for you.',
      },
      {
        title: 'Fast Payments',
        description: 'Get paid instantly and keep track of your earnings.',
      },
    ],
    cta: 'Register as a Driver',
    note: '* Requirements: valid license, vehicle in good condition, and up-to-date documents.',
  },

  corporate: {
    badge: 'For Companies',
    title: 'Corporate Solutions Tailored to You',
    subtitle: 'Optimize your team\'s transportation with preferential rates, simplified billing, and total expense control.',
    benefits: [
      {
        title: 'Corporate Account',
        description: 'Manage your team\'s transportation from a single dashboard.',
      },
      {
        title: 'Automatic Invoicing',
        description: 'Receive detailed invoices for all your company\'s rides.',
      },
      {
        title: 'Real-Time Reports',
        description: 'Monitor expenses and optimize your transportation budget.',
      },
      {
        title: 'Dedicated Support',
        description: 'An exclusive team to solve your corporate needs.',
      },
    ],
    cta: 'Request Corporate Demo',
  },

  hotels: {
    badge: 'For Hotels',
    title: 'Premium Transportation for Your Guests',
    subtitle: 'Offer exceptional transportation service to your clients and generate additional revenue with our hotel solution.',
    benefits: [
      {
        title: 'Guest Service',
        description: 'Offer quality transportation to your clients from your hotel.',
      },
      {
        title: 'Easy Integration',
        description: 'Connect your reception with our platform hassle-free.',
      },
      {
        title: 'Enhance Experience',
        description: 'Add value to your guests\' stay with reliable transportation.',
      },
      {
        title: 'Attractive Commissions',
        description: 'Generate additional income for every ride you coordinate.',
      },
    ],
    cta: 'Register My Hotel',
  },

  dispatcher: {
    badge: 'For Dispatchers',
    title: 'Coordinate Rides and Generate Income',
    subtitle: 'Become a JoltCab dispatcher and manage the connection between passengers and drivers from your own operations center.',
    benefits: [
      {
        title: 'Control Center',
        description: 'Manage multiple rides simultaneously from a centralized panel.',
      },
      {
        title: 'Smart Assignment',
        description: 'Connect passengers with drivers quickly and efficiently.',
      },
      {
        title: '24/7 Operation',
        description: 'Coordinate services at any time of day or night.',
      },
      {
        title: 'Management Income',
        description: 'Generate earnings for every ride you successfully coordinate.',
      },
    ],
    cta: 'Become a JoltCab Dispatcher',
  },

  whatsApp: {
    badge: '🔥 Featured Service',
    title: 'Request Your Taxi Directly via WhatsApp',
    subtitle: 'Don\'t have the app? No problem. Message us on WhatsApp and request your taxi in seconds. Fast, easy, and hassle-free.',
    features: [
      'Request your taxi without downloading the app',
      'Immediate response 24/7',
      'Negotiate your fare via chat',
      'Receive driver details instantly',
    ],
    cta: 'Open WhatsApp Now',
    phone: '+1 470 748 4747',
  },

  testimonials: {
    title: 'What Our Users Say',
    subtitle: 'Thousands of people trust JoltCab for their daily rides',
    items: [
      {
        name: 'Maria Gonzalez',
        role: 'Frequent User',
        text: 'JoltCab changed the way I travel. I can negotiate the price and I always get home safely. I recommend it 100%!',
      },
      {
        name: 'Carlos Ramirez',
        role: 'JoltCab Driver',
        text: 'As a driver, I value the freedom to accept the rides that work for me. No abusive commissions, I earn much more.',
      },
      {
        name: 'Laura Mendoza',
        role: 'HR Manager',
        text: 'We implemented JoltCab for corporate transportation and the savings have been incredible. Excellent service and clear reports.',
      },
    ],
  },

  coverage: {
    title: 'Coverage Nationwide',
    subtitle: 'We\'re present in major cities. And we keep growing!',
    cities: [
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Phoenix',
      'Philadelphia',
    ],
  },

  footer: {
    tagline: 'Your ride, your price. Smart transportation without complications.',
    services: {
      title: 'Services',
      passengers: 'For Passengers',
      drivers: 'For Drivers',
      corporate: 'For Companies',
      hotels: 'For Hotels',
      dispatcher: 'For Dispatchers',
    },
    legal: {
      title: 'Legal',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      notice: 'Legal Notice',
      faq: 'FAQ',
    },
    contact: {
      title: 'Contact',
      email: 'info@joltcab.com',
      phone: '+1 470 748 4747',
      location: 'Atlanta, Georgia, USA',
    },
    copyright: 'JoltCab. All rights reserved.',
  },
};

export const translations = {
  en: englishTranslations,
  es: {
    common: {
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      finish: 'Finalizar',
      logout: 'Cerrar sesión',
      profile: 'Perfil',
      settings: 'Configuración',
      support: 'Soporte',
      wallet: 'Monedero',
      notifications: 'Notificaciones',
      language: 'Idioma',
    },
    header: {
      menu: {
        passengers: 'Pasajeros',
        drivers: 'Conductores',
        corporate: 'Empresas',
        hotels: 'Hoteles',
        dispatcher: 'Despachador',
        support: 'Soporte',
      },
      cta: {
        downloadApp: 'Descargar App',
        requestWhatsApp: 'Solicitar por WhatsApp',
      },
    },
    hero: {
      badge: '🚕 Transporte Inteligente',
      title: 'Tu Viaje, a Tu Precio',
      titleHighlight: 'Sin Complicaciones',
      subtitle: 'Solicita tu taxi, negocia la tarifa y viaja seguro.',
      subtitleHighlight: 'Incluso puedes hacerlo por WhatsApp.',
      cta: {
        whatsapp: 'Solicitar por WhatsApp',
        download: 'Descargar App',
      },
      features: {
        safe: '100% Seguro',
        fair: 'Precios Justos',
        available: 'Disponible 24/7',
      },
    },
    howItWorks: {
      title: '¿Cómo Funciona JoltCab?',
      subtitle: 'Simple, rápido y transparente. Así de fácil es viajar con nosotros.',
      steps: [
        {
          title: 'Solicita Tu Viaje',
          description: 'Descarga la app o envíanos un mensaje por WhatsApp. Rápido y sencillo.',
        },
        {
          title: 'Negocia Tu Tarifa',
          description: 'Propón tu precio o acepta la oferta del conductor. Tú decides.',
        },
        {
          title: 'Viaja Seguro',
          description: 'Conductores verificados y seguimiento en tiempo real. Total tranquilidad.',
        },
      ],
    },
    passengers: {
      badge: 'Para Pasajeros',
      title: 'Viaja a Tu Manera, Paga lo Justo',
      subtitle: 'Con JoltCab, tienes el control. Negocia tu tarifa, elige tu conductor y llega a tu destino con total confianza.',
      benefits: [
        {
          title: 'Precios Justos',
          description: 'Tú propones, el conductor acepta. Sin sorpresas.',
        },
        {
          title: 'Disponibilidad 24/7',
          description: 'Solicita tu taxi cuando lo necesites, de día o de noche.',
        },
        {
          title: 'Viajes Seguros',
          description: 'Conductores verificados y seguimiento en tiempo real.',
        },
        {
          title: 'Calificaciones Reales',
          description: 'Lee las opiniones de otros pasajeros antes de viajar.',
        },
      ],
      cta: {
        whatsapp: 'Solicitar por WhatsApp',
        download: 'Descargar App',
      },
    },
    drivers: {
      badge: 'Para Conductores',
      title: 'Conduce, Gana y Crece con JoltCab',
      subtitle: 'Únete a nuestra red de conductores y disfruta de la libertad de trabajar a tu propio ritmo, con mejores ganancias y total transparencia.',
      benefits: [
        {
          title: 'Gana Más',
          description: 'Sin comisiones abusivas. Tú decides qué viajes aceptar.',
        },
        {
          title: 'Horario Flexible',
          description: 'Trabaja cuando quieras, sin presiones ni obligaciones.',
        },
        {
          title: 'Negocia Tu Tarifa',
          description: 'Recibe ofertas y acepta las que te convengan.',
        },
        {
          title: 'Pagos Rápidos',
          description: 'Recibe tus pagos al instante y lleva un control de tus ganancias.',
        },
      ],
      cta: 'Regístrate como Conductor',
      note: '* Requisitos: licencia válida, vehículo en buen estado y documentos al día.',
    },
    corporate: {
      badge: 'Para Empresas',
      title: 'Soluciones Corporativas Hechas a Tu Medida',
      subtitle: 'Optimiza el transporte de tu equipo con tarifas preferenciales, facturación simplificada y control total de gastos.',
      benefits: [
        {
          title: 'Cuenta Corporativa',
          description: 'Gestiona el transporte de tu equipo desde un único panel de control.',
        },
        {
          title: 'Facturación Automática',
          description: 'Recibe facturas detalladas de todos los viajes de tu empresa.',
        },
        {
          title: 'Reportes en Tiempo Real',
          description: 'Monitoriza los gastos y optimiza tu presupuesto de transporte.',
        },
        {
          title: 'Soporte Dedicado',
          description: 'Un equipo exclusivo para resolver tus necesidades corporativas.',
        },
      ],
      cta: 'Solicitar Demo Corporativa',
    },
    hotels: {
      badge: 'Para Hoteles',
      title: 'Transporte Premium para Tus Huéspedes',
      subtitle: 'Ofrece un servicio de transporte excepcional a tus clientes y genera ingresos adicionales con nuestra solución para hoteles.',
      benefits: [
        {
          title: 'Servicio al Huésped',
          description: 'Ofrece transporte de calidad a tus clientes desde tu hotel.',
        },
        {
          title: 'Fácil Integración',
          description: 'Conecta tu recepción con nuestra plataforma sin complicaciones.',
        },
        {
          title: 'Mejora la Experiencia',
          description: 'Añade valor a la estancia de tus huéspedes con un transporte fiable.',
        },
        {
          title: 'Comisiones Atractivas',
          description: 'Genera ingresos adicionales por cada viaje que coordines.',
        },
      ],
      cta: 'Registrar Mi Hotel',
    },
    dispatcher: {
      badge: 'Para Despachadores',
      title: 'Coordina Viajes y Genera Ingresos',
      subtitle: 'Conviértete en despachador de JoltCab y gestiona la conexión entre pasajeros y conductores desde tu propio centro de operaciones.',
      benefits: [
        {
          title: 'Centro de Control',
          description: 'Gestiona múltiples viajes simultáneamente desde un panel centralizado.',
        },
        {
          title: 'Asignación Inteligente',
          description: 'Conecta pasajeros con conductores de forma rápida y eficiente.',
        },
        {
          title: 'Operación 24/7',
          description: 'Coordina servicios a cualquier hora del día o de la noche.',
        },
        {
          title: 'Ingresos por Gestión',
          description: 'Genera ganancias por cada viaje que coordines con éxito.',
        },
      ],
      cta: 'Conviértete en Despachador de JoltCab',
    },
    whatsApp: {
      badge: '🔥 Servicio Destacado',
      title: 'Solicita Tu Taxi Directamente por WhatsApp',
      subtitle: '¿No tienes la app? No hay problema. Envíanos un mensaje por WhatsApp y solicita tu taxi en segundos. Rápido, fácil y sin complicaciones.',
      features: [
        'Solicita tu taxi sin descargar la app',
        'Respuesta inmediata 24/7',
        'Negocia tu tarifa por chat',
        'Recibe los detalles del conductor al instante',
      ],
      cta: 'Abrir WhatsApp Ahora',
      phone: '+1 470 748 4747',
    },
    testimonials: {
      title: 'Lo que Dicen Nuestros Usuarios',
      subtitle: 'Miles de personas confían en JoltCab para sus viajes diarios',
      items: [
        {
          name: 'Maria Gonzalez',
          role: 'Usuaria Frecuente',
          text: 'JoltCab cambió mi forma de viajar. Puedo negociar el precio y siempre llego a casa segura. ¡Lo recomiendo al 100%!',
        },
        {
          name: 'Carlos Ramirez',
          role: 'Conductor de JoltCab',
          text: 'Como conductor, valoro la libertad de aceptar los viajes que me convienen. Sin comisiones abusivas, gano mucho más.',
        },
        {
          name: 'Laura Mendoza',
          role: 'Gerente de RRHH',
          text: 'Implementamos JoltCab para el transporte corporativo y los ahorros han sido increíbles. Excelente servicio y reportes claros.',
        },
      ],
    },
    coverage: {
      title: 'Cobertura a Nivel Nacional',
      subtitle: 'Estamos presentes en las principales ciudades. ¡Y seguimos creciendo!',
      cities: [
        'Nueva York',
        'Los Ángeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Filadelfia',
      ],
    },
    footer: {
      tagline: 'Tu viaje, a tu precio. Transporte inteligente sin complicaciones.',
      services: {
        title: 'Servicios',
        passengers: 'Para Pasajeros',
        drivers: 'Para Conductores',
        corporate: 'Para Empresas',
        hotels: 'Para Hoteles',
        dispatcher: 'Para Despachadores',
      },
      legal: {
        title: 'Legal',
        terms: 'Términos y Condiciones',
        privacy: 'Política de Privacidad',
        notice: 'Aviso Legal',
        faq: 'Preguntas Frecuentes',
      },
      contact: {
        title: 'Contacto',
        email: 'info@joltcab.com',
        phone: '+1 470 748 4747',
        location: 'Atlanta, Georgia, USA',
      },
      copyright: 'JoltCab. Todos los derechos reservados.',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      submit: 'Soumettre',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      finish: 'Terminer',
      logout: 'Déconnexion',
      profile: 'Profil',
      settings: 'Paramètres',
      support: 'Support',
      wallet: 'Portefeuille',
      notifications: 'Notifications',
      language: 'Langue',
    },
    header: {
      menu: {
        passengers: 'Passagers',
        drivers: 'Chauffeurs',
        corporate: 'Entreprises',
        hotels: 'Hôtels',
        dispatcher: 'Régulateur',
        support: 'Support',
      },
      cta: {
        downloadApp: 'Télécharger l\'App',
        requestWhatsApp: 'Demander via WhatsApp',
      },
    },
    hero: {
      badge: '🚕 Transport Intelligent',
      title: 'Votre Trajet, Votre Prix',
      titleHighlight: 'Sans Complications',
      subtitle: 'Demandez un taxi, négociez votre tarif et voyagez en toute sécurité.',
      subtitleHighlight: 'Vous pouvez même le faire via WhatsApp.',
      cta: {
        whatsapp: 'Demander via WhatsApp',
        download: 'Télécharger l\'App',
      },
      features: {
        safe: '100% Sûr',
        fair: 'Prix Équitables',
        available: 'Disponible 24/7',
      },
    },
    howItWorks: {
      title: 'Comment Fonctionne JoltCab ?',
      subtitle: 'Simple, rapide et transparent. C\'est si facile de rouler avec nous.',
      steps: [
        {
          title: 'Demandez Votre Trajet',
          description: 'Téléchargez l\'application ou envoyez-nous un message sur WhatsApp. Rapide et facile.',
        },
        {
          title: 'Négociez Votre Tarif',
          description: 'Proposez votre prix ou acceptez l\'offre du chauffeur. Vous décidez.',
        },
        {
          title: 'Voyagez en Toute Sécurité',
          description: 'Chauffeurs vérifiés et suivi en temps réel. Tranquillité d\'esprit totale.',
        },
      ],
    },
    passengers: {
      badge: 'Pour les Passagers',
      title: 'Voyagez à Votre Manière, Payez ce qui est Juste',
      subtitle: 'Avec JoltCab, vous avez le contrôle. Négociez votre tarif, choisissez votre chauffeur et arrivez à destination en toute confiance.',
      benefits: [
        {
          title: 'Prix Équitables',
          description: 'Vous proposez, le chauffeur accepte. Pas de surprises.',
        },
        {
          title: 'Disponibilité 24/7',
          description: 'Demandez votre taxi quand vous en avez besoin, jour et nuit.',
        },
        {
          title: 'Trajets Sûrs',
          description: 'Chauffeurs vérifiés et suivi en temps réel.',
        },
        {
          title: 'Évaluations Réelles',
          description: 'Lisez les avis des autres passagers avant votre trajet.',
        },
      ],
      cta: {
        whatsapp: 'Demander via WhatsApp',
        download: 'Télécharger l\'App',
      },
    },
    drivers: {
      badge: 'Pour les Chauffeurs',
      title: 'Conduisez, Gagnez et Grandissez avec JoltCab',
      subtitle: 'Rejoignez notre réseau de chauffeurs et profitez de la liberté de travailler à votre rythme, avec de meilleurs revenus et une transparence totale.',
      benefits: [
        {
          title: 'Gagnez Plus',
          description: 'Pas de commissions abusives. Vous décidez quels trajets accepter.',
        },
        {
          title: 'Horaire Flexible',
          description: 'Travaillez quand vous voulez, sans pression ni obligations.',
        },
        {
          title: 'Négociez Votre Tarif',
          description: 'Recevez des offres et acceptez celles qui vous conviennent.',
        },
        {
          title: 'Paiements Rapides',
          description: 'Recevez vos paiements instantanément et suivez vos revenus.',
        },
      ],
      cta: 'S\'inscrire comme Chauffeur',
      note: '* Exigences : permis valide, véhicule en bon état et documents à jour.',
    },
    corporate: {
      badge: 'Pour les Entreprises',
      title: 'Solutions Corporatives Sur Mesure',
      subtitle: 'Optimisez le transport de votre équipe avec des tarifs préférentiels, une facturation simplifiée et un contrôle total des dépenses.',
      benefits: [
        {
          title: 'Compte Corporatif',
          description: 'Gérez le transport de votre équipe depuis un tableau de bord unique.',
        },
        {
          title: 'Facturation Automatique',
          description: 'Recevez des factures détaillées pour tous les trajets de votre entreprise.',
        },
        {
          title: 'Rapports en Temps Réel',
          description: 'Surveillez les dépenses et optimisez votre budget de transport.',
        },
        {
          title: 'Support Dédié',
          description: 'Une équipe exclusive pour résoudre vos besoins corporatifs.',
        },
      ],
      cta: 'Demander une Démo Corporative',
    },
    hotels: {
      badge: 'Pour les Hôtels',
      title: 'Transport Premium pour Vos Hôtes',
      subtitle: 'Offrez un service de transport exceptionnel à vos clients et générez des revenus supplémentaires avec notre solution hôtelière.',
      benefits: [
        {
          title: 'Service aux Hôtes',
          description: 'Offrez un transport de qualité à vos clients depuis votre hôtel.',
        },
        {
          title: 'Intégration Facile',
          description: 'Connectez votre réception à notre plateforme sans tracas.',
        },
        {
          title: 'Améliorez l\'Expérience',
          description: 'Ajoutez de la valeur au séjour de vos hôtes avec un transport fiable.',
        },
        {
          title: 'Commissions Attractives',
          description: 'Générez des revenus supplémentaires pour chaque trajet que vous coordonnez.',
        },
      ],
      cta: 'Enregistrer Mon Hôtel',
    },
    dispatcher: {
      badge: 'Pour les Régulateurs',
      title: 'Coordonnez les Trajets et Générez des Revenus',
      subtitle: 'Devenez régulateur JoltCab et gérez la connexion entre passagers et chauffeurs depuis votre propre centre d\'opérations.',
      benefits: [
        {
          title: 'Centre de Contrôle',
          description: 'Gérez plusieurs trajets simultanément depuis un panneau centralisé.',
        },
        {
          title: 'Affectation Intelligente',
          description: 'Connectez rapidement et efficacement passagers et chauffeurs.',
        },
        {
          title: 'Opération 24/7',
          description: 'Coordonnez les services à toute heure du jour ou de la nuit.',
        },
        {
          title: 'Revenus de Gestion',
          description: 'Générez des gains pour chaque trajet que vous coordonnez avec succès.',
        },
      ],
      cta: 'Devenir Régulateur JoltCab',
    },
    whatsApp: {
      badge: '🔥 Service en Vedette',
      title: 'Demandez Votre Taxi Directement via WhatsApp',
      subtitle: 'Vous n\'avez pas l\'application ? Pas de problème. Envoyez-nous un message sur WhatsApp et demandez votre taxi en quelques secondes. Rapide, facile et sans tracas.',
      features: [
        'Demandez votre taxi sans télécharger l\'application',
        'Réponse immédiate 24/7',
        'Négociez votre tarif par chat',
        'Recevez instantanément les détails du chauffeur',
      ],
      cta: 'Ouvrir WhatsApp Maintenant',
      phone: '+1 470 748 4747',
    },
    testimonials: {
      title: 'Ce que disent Nos Utilisateurs',
      subtitle: 'Des milliers de personnes font confiance à JoltCab pour leurs trajets quotidiens',
      items: [
        {
          name: 'Maria Gonzalez',
          role: 'Utilisatrice Fréquente',
          text: 'JoltCab a changé ma façon de voyager. Je peux négocier le prix et je rentre toujours chez moi en toute sécurité. Je le recommande à 100% !',
        },
        {
          name: 'Carlos Ramirez',
          role: 'Chauffeur JoltCab',
          text: 'En tant que chauffeur, j\'apprécie la liberté d\'accepter les trajets qui me conviennent. Pas de commissions abusives, je gagne beaucoup plus.',
        },
        {
          name: 'Laura Mendoza',
          role: 'Responsable RH',
          text: 'Nous avons mis en œuvre JoltCab pour le transport corporatif et les économies ont été incroyables. Excellent service et rapports clairs.',
        },
      ],
    },
    coverage: {
      title: 'Couverture Nationale',
      subtitle: 'Nous sommes présents dans les grandes villes. Et nous continuons de croître !',
      cities: [
        'New York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Philadelphie',
      ],
    },
    footer: {
      tagline: 'Votre trajet, votre prix. Transport intelligent sans complications.',
      services: {
        title: 'Services',
        passengers: 'Pour les Passagers',
        drivers: 'Pour les Chauffeurs',
        corporate: 'Pour les Entreprises',
        hotels: 'Pour les Hôtels',
        dispatcher: 'Pour les Régulateurs',
      },
      legal: {
        title: 'Légal',
        terms: 'Termes et Conditions',
        privacy: 'Politique de Confidentialité',
        notice: 'Mentions Légales',
        faq: 'FAQ',
      },
      contact: {
        title: 'Contact',
        email: 'info@joltcab.com',
        phone: '+1 470 748 4747',
        location: 'Atlanta, Géorgie, USA',
      },
      copyright: 'JoltCab. Tous droits réservés.',
    },
  },
  pt: {
    common: {
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      submit: 'Enviar',
      delete: 'Excluir',
      edit: 'Editar',
      back: 'Voltar',
      next: 'Próximo',
      finish: 'Finalizar',
      logout: 'Sair',
      profile: 'Perfil',
      settings: 'Configurações',
      support: 'Suporte',
      wallet: 'Carteira',
      notifications: 'Notificações',
      language: 'Idioma',
    },
    header: {
      menu: {
        passengers: 'Passageiros',
        drivers: 'Motoristas',
        corporate: 'Empresas',
        hotels: 'Hotéis',
        dispatcher: 'Despachante',
        support: 'Suporte',
      },
      cta: {
        downloadApp: 'Baixar App',
        requestWhatsApp: 'Solicitar via WhatsApp',
      },
    },
    hero: {
      badge: '🚕 Transporte Inteligente',
      title: 'Sua Viagem, Seu Preço',
      titleHighlight: 'Sem Complicações',
      subtitle: 'Solicite um táxi, negocie sua tarifa e viaje com segurança.',
      subtitleHighlight: 'Você pode até fazer isso pelo WhatsApp.',
      cta: {
        whatsapp: 'Solicitar via WhatsApp',
        download: 'Baixar App',
      },
      features: {
        safe: '100% Seguro',
        fair: 'Preços Justos',
        available: 'Disponível 24/7',
      },
    },
    howItWorks: {
      title: 'Como Funciona o JoltCab?',
      subtitle: 'Simples, rápido e transparente. É assim que é fácil viajar conosco.',
      steps: [
        {
          title: 'Solicite Sua Viagem',
          description: 'Baixe o aplicativo ou envie uma mensagem no WhatsApp. Rápido e fácil.',
        },
        {
          title: 'Negocie Sua Tarifa',
          description: 'Proponha seu preço ou aceite a oferta do motorista. Você decide.',
        },
        {
          title: 'Viaje com Segurança',
          description: 'Motoristas verificados e rastreamento em tempo real. Total tranquilidade.',
        },
      ],
    },
    passengers: {
      badge: 'Para Passageiros',
      title: 'Viaje do Seu Jeito, Pague o que é Justo',
      subtitle: 'Com o JoltCab, você está no controle. Negocie sua tarifa, escolha seu motorista e chegue ao seu destino com total confiança.',
      benefits: [
        {
          title: 'Preços Justos',
          description: 'Você propõe, o motorista aceita. Sem surpresas.',
        },
        {
          title: 'Disponibilidade 24/7',
          description: 'Solicite seu táxi sempre que precisar, dia ou noite.',
        },
        {
          title: 'Viagens Seguras',
          description: 'Motoristas verificados e rastreamento em tempo real.',
        },
        {
          title: 'Avaliações Reais',
          description: 'Leia as avaliações de outros passageiros antes de viajar.',
        },
      ],
      cta: {
        whatsapp: 'Solicitar via WhatsApp',
        download: 'Baixar App',
      },
    },
    drivers: {
      badge: 'Para Motoristas',
      title: 'Dirija, Ganhe e Cresça com JoltCab',
      subtitle: 'Junte-se à nossa rede de motoristas e desfrute da liberdade de trabalhar no seu próprio ritmo, com melhores ganhos e total transparência.',
      benefits: [
        {
          title: 'Ganhe Mais',
          description: 'Sem comissões abusivas. Você decide quais viagens aceitar.',
        },
        {
          title: 'Horário Flexível',
          description: 'Trabalhe quando quiser, sem pressão ou obrigações.',
        },
        {
          title: 'Negocie Sua Tarifa',
          description: 'Receba ofertas e aceite as que funcionam para você.',
        },
        {
          title: 'Pagamentos Rápidos',
          description: 'Receba seus pagamentos instantaneamente e acompanhe seus ganhos.',
        },
      ],
      cta: 'Cadastre-se como Motorista',
      note: '* Requisitos: licença válida, veículo em boas condições e documentos em dia.',
    },
    corporate: {
      badge: 'Para Empresas',
      title: 'Soluções Corporativas Feitas Sob Medida para Você',
      subtitle: 'Otimize o transporte da sua equipe com tarifas preferenciais, faturamento simplificado e controle total de despesas.',
      benefits: [
        {
          title: 'Conta Corporativa',
          description: 'Gerencie o transporte da sua equipe a partir de um único painel.',
        },
        {
          title: 'Faturamento Automático',
          description: 'Receba faturas detalhadas para todas as viagens da sua empresa.',
        },
        {
          title: 'Relatórios em Tempo Real',
          description: 'Monitore as despesas e otimize seu orçamento de transporte.',
        },
        {
          title: 'Suporte Dedicado',
          description: 'Uma equipe exclusiva para resolver suas necessidades corporativas.',
        },
      ],
      cta: 'Solicitar Demonstração Corporativa',
    },
    hotels: {
      badge: 'Para Hotéis',
      title: 'Transporte Premium para Seus Hóspedes',
      subtitle: 'Ofereça um serviço de transporte excepcional aos seus clientes e gere receita adicional com nossa solução para hotéis.',
      benefits: [
        {
          title: 'Serviço ao Hóspede',
          description: 'Ofereça transporte de qualidade aos seus clientes do seu hotel.',
        },
        {
          title: 'Fácil Integração',
          description: 'Conecte sua recepção à nossa plataforma sem complicações.',
        },
        {
          title: 'Melhore a Experiência',
          description: 'Agregue valor à estadia de seus hóspedes com transporte confiável.',
        },
        {
          title: 'Comissões Atraentes',
          description: 'Gere receita adicional por cada viagem que você coordenar.',
        },
      ],
      cta: 'Registrar Meu Hotel',
    },
    dispatcher: {
      badge: 'Para Despachantes',
      title: 'Coordene Viagens e Gere Renda',
      subtitle: 'Torne-se um despachante JoltCab e gerencie a conexão entre passageiros e motoristas a partir do seu próprio centro de operações.',
      benefits: [
        {
          title: 'Centro de Controle',
          description: 'Gerencie múltiplas viagens simultaneamente a partir de um painel centralizado.',
        },
        {
          title: 'Atribuição Inteligente',
          description: 'Conecte passageiros com motoristas de forma rápida e eficiente.',
        },
        {
          title: 'Operação 24/7',
          description: 'Coordene serviços a qualquer hora do dia ou da noite.',
        },
        {
          title: 'Renda de Gerenciamento',
          description: 'Gere ganhos por cada viagem que você coordenar com sucesso.',
        },
      ],
      cta: 'Torne-se um Despachante JoltCab',
    },
    whatsApp: {
      badge: '🔥 Serviço em Destaque',
      title: 'Solicite Seu Táxi Diretamente via WhatsApp',
      subtitle: 'Não tem o aplicativo? Sem problemas. Envie-nos uma mensagem no WhatsApp e solicite seu táxi em segundos. Rápido, fácil e sem complicações.',
      features: [
        'Solicite seu táxi sem baixar o aplicativo',
        'Resposta imediata 24/7',
        'Negocie sua tarifa via chat',
        'Receba os detalhes do motorista instantaneamente',
      ],
      cta: 'Abrir WhatsApp Agora',
      phone: '+1 470 748 4747',
    },
    testimonials: {
      title: 'O que Nossos Usuários Dizem',
      subtitle: 'Milhares de pessoas confiam no JoltCab para suas viagens diárias',
      items: [
        {
          name: 'Maria Gonzalez',
          role: 'Usuária Frequente',
          text: 'O JoltCab mudou a forma como viajo. Posso negociar o preço e sempre chego em casa com segurança. Recomendo 100%!',
        },
        {
          name: 'Carlos Ramirez',
          role: 'Motorista JoltCab',
          text: 'Como motorista, valorizo a liberdade de aceitar as viagens que me convêm. Sem comissões abusivas, ganho muito mais.',
        },
        {
          name: 'Laura Mendoza',
          role: 'Gerente de RH',
          text: 'Implementamos o JoltCab para transporte corporativo e a economia foi incrível. Excelente serviço e relatórios claros.',
        },
      ],
    },
    coverage: {
      title: 'Cobertura Nacional',
      subtitle: 'Estamos presentes nas principais cidades. E continuamos crescendo!',
      cities: [
        'Nova York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Filadélfia',
      ],
    },
    footer: {
      tagline: 'Sua viagem, seu preço. Transporte inteligente sem complicações.',
      services: {
        title: 'Serviços',
        passengers: 'Para Passageiros',
        drivers: 'Para Motoristas',
        corporate: 'Para Empresas',
        hotels: 'Para Hotéis',
        dispatcher: 'Para Despachantes',
      },
      legal: {
        title: 'Legal',
        terms: 'Termos e Condições',
        privacy: 'Política de Privacidade',
        notice: 'Aviso Legal',
        faq: 'FAQ',
      },
      contact: {
        title: 'Contato',
        email: 'info@joltcab.com',
        phone: '+1 470 748 4747',
        location: 'Atlanta, Geórgia, EUA',
      },
      copyright: 'JoltCab. Todos os direitos reservados.',
    },
  },
};

export const defaultLanguage = 'en';
