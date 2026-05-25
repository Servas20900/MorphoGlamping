import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        stay: 'Stay',
        gallery: 'Gallery',
        experience: 'Experience',
        rates: 'Rates',
        availability: 'Availability',
        location: 'Location',
        faq: 'FAQ',
        reserveCta: 'Reserve',
        menuTitle: 'Explore the stay',
        languageSwitch: 'Switch to {{lang}}',
      },
      language: {
        es: 'ES',
        en: 'EN',
      },
      hero: {
        eyebrow: 'Nuevo Arenal · Costa Rica',
        title: 'Glamping Costa Rica en Lago Arenal para parejas',
        body:
          'Morpho Glamping is a private dome designed for couples who want to disconnect between Lago Arenal, Nuevo Arenal and the volcanic route without giving up comfort. Enjoy a terrace with views to the lake, AC, WiFi, private bathroom and a calm, romantic stay in Costa Rica.',
        primary: 'Reserve Stay',
        secondary: 'Explore Experience',
        captionTop: 'Lakefront calm / morning light',
        captionBottom: 'Private dome facing Lago Arenal',
        sideLabel: 'Atmosphere',
        sideCopy:
          'Warm stone, timber, soft light and the blue edge of the lake shape the stay with restraint and clarity.',
        sideBadge: 'Morpho detail',
      },
      stats: {
        privacy: 'Private dome for two',
        view: 'View of Lago Arenal',
        quiet: 'Made for slow mornings',
      },
      stay: {
        title: 'The Stay',
        body:
          'A compact, private retreat built for couples in Nuevo Arenal: calm, tactile and practical, with the essentials already considered for a glamping Costa Rica escape.',
        points: [
          'Private dome for 2 guests',
          'King bed and private bathroom with hot water',
          'Mini equipped kitchen, coffee maker and complimentary coffee',
          'Air conditioning, WiFi and private parking',
        ],
        facts: [
          'Independent entrance and private terrace',
          'Lake Arenal view',
          'Restaurants nearby',
          'WhatsApp support for reservations',
        ],
        panelEyebrow: 'Accommodation details',
        panelTitle: 'Designed for privacy, comfort and long silences.',
        panelCopy:
          'The dome keeps the footprint small and the experience generous: a private terrace, a proper bed, reliable comfort and a direct relationship with the lake.',
      },
      morning: {
        title: 'The Morning',
        body:
          'Wake up with coffee, fog and a lake horizon that changes by the minute. It is a slow-start stay, but never a stripped-down one.',
        cards: [
          {
            title: 'First light',
            text: 'The dome opens to soft daylight and the lake view immediately sets the tone.',
          },
          {
            title: 'Couples rhythm',
            text: 'Breakfast, coffee and a private terrace give the morning a quiet, intimate pace.',
          },
          {
            title: 'Fog and water',
            text: 'The air cools as the mist rolls in, turning the landscape into a calm visual layer.',
          },
        ],
      },
      experience: {
        title: 'The Experience',
        body:
          'The stay is designed around the real rhythm of Nuevo Arenal and Lago Arenal: the lake, local restaurants, nearby tours and unhurried time together.',
        cards: [
          {
            title: 'Lago Arenal',
            text: 'Lakefront views, colder air and the most atmospheric moments of the day happen in front of you.',
          },
          {
            title: 'Nuevo Arenal',
            text: 'Restaurants, groceries, a pharmacy and the town center are close enough to make arrival easy.',
          },
          {
            title: 'Slow days out',
            text: 'Pair the stay with lake activities, volcano routes and local tours without losing the sense of privacy.',
          },
        ],
      },
      gallery: {
        title: 'The Space',
        body:
          'A tighter, more architectural selection of the dome, the terrace and the surrounding atmosphere in Arenal, Guanacaste.',
      },
      rates: {
        title: 'Rates',
        body:
          'Clear pricing, booking channels and the minimum stay rules at a glance.',
      },
      availability: {
        title: 'Availability',
        body:
          'Select a stay date, check the current state and continue through the preferred booking channel with no friction.',
        selectedLabel: 'Selected date',
        available: 'Available',
        booked: 'Booked',
        selected: 'Selected',
        iCal: 'iCal sync for Airbnb',
        whatsapp: 'Reserve by WhatsApp',
        airbnb: 'Book on Airbnb',
        rateLabel: 'From',
        rateValue: 'From $80 USD per night',
        rateHighSeason: 'High season: $90–$100 USD',
        rateNote: 'Rates vary by season. Contact us for exact pricing on your dates.',
        minStayNote: 'Minimum stay: 1 night in low season, 2 nights in high season.',
      },
      location: {
        title: 'Location',
        body:
          'Morpho Glamping sits in Nuevo Arenal, Guanacaste, close to Lago Arenal and the town center, with just enough distance to feel quiet, private and easy to reach from La Fortuna.',
        points: [
          '~600–750 m from Lago Arenal',
          '~250 m from Nuevo Arenal town center',
          'Restaurants nearby',
          'Private parking included',
          'Independent entrance',
        ],
      },
      reviews: {
        title: 'Reviews',
        body: 'What couples value most is the calm, the cleanliness and how the place feels considered rather than styled.',
        items: [
          {
            quote:
              'The view of the lake in the morning was unforgettable. Everything felt private, clean and very thoughtfully arranged.',
            author: 'Couple guest',
            detail: 'Lake view, privacy and comfort',
            stars: 5,
          },
          {
            quote:
              'We loved the quiet terrace, the coffee setup and how easy it was to coordinate the stay by WhatsApp.',
            author: 'Returning guest',
            detail: 'Terrace, coffee and quick communication',
            stars: 5,
          },
          {
            quote:
              'Perfect for a slow escape near Nuevo Arenal. Close to restaurants, but still calm and intimate.',
            author: 'Weekend stay',
            detail: 'Location, access and atmosphere',
            stars: 5,
          },
        ],
      },
      faq: {
        title: 'FAQ',
        body: 'Clear answers for planning a smooth, quiet stay.',
        items: [
          {
            question: 'What are the check-in and check-out times?',
            answer: 'Check-in: 3:00 pm. Check-out: 11:00 am. Special times can be arranged via WhatsApp.',
          },
          {
            question: 'How do I get the keys?',
            answer:
              'Key handover is coordinated via WhatsApp. We have a secure lockbox on-site for off-hours arrivals.',
          },
          {
            question: 'Are pets allowed?',
            answer: 'Pets are not allowed at this time, to maintain the space in perfect condition for all guests.',
          },
          {
            question: 'Are there restaurants nearby?',
            answer:
              'Yes. 500 m from Nuevo Arenal town center you will find restaurants, local eateries, a supermarket and pharmacy.',
          },
          {
            question: 'How do I pay?',
            answer: 'SINPE Móvil, bank transfer, or cash. We coordinate this via WhatsApp upon booking.',
          },
          {
            question: 'Is parking safe?',
            answer: 'Yes. Parking is private, secure, and included in the rate.',
          },
          {
            question: 'Is there WiFi?',
            answer: 'Yes, high-speed WiFi is included.',
          },
          {
            question: 'Can I book just one night?',
            answer: 'In low season yes, minimum 1 night. In high season the minimum is 2 nights.',
          },
          {
            question: 'Does the glamping have a kitchen?',
            answer: 'Yes, there is a mini equipped kitchen with refrigerator, basic utensils and ventilation fan.',
          },
          {
            question: 'Is it close to Lago Arenal?',
            answer:
              'Yes. The dome is oriented to the lakefront and keeps Lago Arenal visually present throughout the stay.',
          },
          {
            question: 'How does the reservation work?',
            answer:
              'Choose your dates in the calendar, check availability, and continue via WhatsApp or Airbnb depending on your preferred channel.',
          },
        ],
      },
      reserve: {
        title: 'Reserve the quiet',
        body:
          'Use the calendar, then continue through WhatsApp or Airbnb. We keep the booking path simple and human for guests searching glamping in Arenal and Lago Arenal.',
        points: ['WhatsApp booking', 'Airbnb support', 'iCal sync'],
        cta: 'Request reservation',
        whatsappCta: 'Reserve by WhatsApp',
        airbnbCta: 'Book on Airbnb',
        backToTop: 'Back to top',
        emailSubject: 'Morpho Glamping reservation enquiry',
      },
      footer: {
        copy: 'Editorial landing page concept for Morpho Glamping in Nuevo Arenal, Costa Rica.',
      },
      seo: {
        title: 'Glamping Costa Rica en Lago Arenal | Morpho Glamping',
        description:
          'Domo para parejas en Nuevo Arenal, Guanacaste. Vistas al Lago Arenal, AC, WiFi, baño privado y terraza privada. Reserva directo.',
        ogTitle: 'Glamping Costa Rica en Lago Arenal | Morpho Glamping',
        ogDescription:
          'Domo para parejas en Nuevo Arenal, Guanacaste. Vistas al Lago Arenal, AC, WiFi, baño privado y terraza privada. Reserva directo.',
      },
      notFound: {
        title: 'Page not found',
        body: 'The page you are looking for does not exist. Return to the Morpho Glamping landing page to continue.',
        cta: 'Go to the landing page',
      },
      cookies: {
        body:
          'We use essential cookies and privacy-friendly analytics to improve the booking experience and site performance.',
        acceptAll: 'Accept all',
        necessaryOnly: 'Only necessary',
        reject: 'Reject',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        stay: 'Estancia',
        gallery: 'Galería',
        experience: 'Experiencia',
        rates: 'Tarifas',
        availability: 'Disponibilidad',
        location: 'Ubicación',
        faq: 'FAQ',
        reserveCta: 'Reservar',
        menuTitle: 'Explorá la estadía',
        languageSwitch: 'Cambiar a {{lang}}',
      },
      language: {
        es: 'ES',
        en: 'EN',
      },
      hero: {
        eyebrow: 'Nuevo Arenal · Costa Rica',
        title: 'Glamping Costa Rica en Lago Arenal para parejas',
        body:
          'Morpho Glamping es un domo privado para parejas en Nuevo Arenal, pensado para desconectarse entre el Lago Arenal, la neblina y el paisaje sin renunciar al confort. Con terraza privada, vistas al lago, AC, WiFi y baño privado, es una escapada romántica auténtica en Costa Rica.',
        primary: 'Reservar estancia',
        secondary: 'Explorar experiencia',
        captionTop: 'Calma frente al lago / luz de la mañana',
        captionBottom: 'Domo privado frente al Lago Arenal',
        sideLabel: 'Atmósfera',
        sideCopy:
          'Piedra cálida, madera, luz suave y el borde azul del lago definen la estancia con contención y claridad.',
        sideBadge: 'Detalle Morpho',
      },
      stats: {
        privacy: 'Domo privado para dos',
        view: 'Vista al Lago Arenal',
        quiet: 'Diseñado para mañanas lentas',
      },
      stay: {
        title: 'La estancia',
        body:
          'Un refugio compacto y privado para parejas en Nuevo Arenal: sereno, táctil y práctico, con lo esencial resuelto desde el inicio para una experiencia de glamping Costa Rica.',
        points: [
          'Domo privado para 2 personas',
          'Cama matrimonial y baño privado con agua caliente',
          'Mini cocina equipada, cafetera y café incluido',
          'Aire acondicionado, WiFi y parqueo privado',
        ],
        facts: [
          'Entrada independiente y terraza privada',
          'Vista al Lago Arenal',
          'Restaurantes cercanos',
          'Soporte por WhatsApp para la reserva',
        ],
        panelEyebrow: 'Detalles del alojamiento',
        panelTitle: 'Diseñado para privacidad, comodidad y silencios largos.',
        panelCopy:
          'El domo reduce la huella y amplía la experiencia: terraza privada, cama real, confort confiable y una relación directa con el lago.',
      },
      morning: {
        title: 'La mañana',
        body:
          'Despertá con café, neblina y un horizonte de lago que cambia minuto a minuto. Es una estadía de ritmo lento, pero nunca improvisada.',
        cards: [
          {
            title: 'Primera luz',
            text: 'El domo abre a la luz suave y la vista al lago marca el tono desde el primer instante.',
          },
          {
            title: 'Ritmo de pareja',
            text: 'Desayuno, café y terraza privada convierten la mañana en un momento íntimo y tranquilo.',
          },
          {
            title: 'Niebla y agua',
            text: 'El aire se enfría y la bruma baja, transformando el paisaje en una capa visual serena.',
          },
        ],
      },
      experience: {
        title: 'La experiencia',
        body:
          'La estadía está pensada alrededor del ritmo real de Nuevo Arenal y del Lago Arenal: el lago, los restaurantes cercanos, los tours y el tiempo compartido.',
        cards: [
          {
            title: 'Lago Arenal',
            text: 'La vista al agua, el aire frío y los momentos más atmosféricos del día pasan frente a vos.',
          },
          {
            title: 'Nuevo Arenal',
            text: 'Restaurantes, supermercado, farmacia y centro del pueblo están cerca y facilitan la llegada.',
          },
          {
            title: 'Días sin prisa',
            text: 'Combiná la estadía con actividades de lago, rutas volcánicas y tours locales sin perder privacidad.',
          },
        ],
      },
      gallery: {
        title: 'El espacio',
        body:
          'Una selección más arquitectónica del domo, la terraza y la atmósfera que lo rodea en Arenal, Guanacaste.',
      },
      rates: {
        title: 'Tarifas',
        body:
          'Precios claros, canales de reserva y reglas de estadía mínima de un vistazo.',
      },
      availability: {
        title: 'Disponibilidad',
        body:
          'Seleccioná una fecha, revisá el estado y continuá por el canal de reserva preferido sin fricción.',
        selectedLabel: 'Fecha seleccionada',
        available: 'Disponible',
        booked: 'Reservado',
        selected: 'Seleccionado',
        iCal: 'Sincronización iCal para Airbnb',
        whatsapp: 'Reservar por WhatsApp',
        airbnb: 'Reservar en Airbnb',
        rateLabel: 'Desde',
        rateValue: 'Desde $80 USD por noche',
        rateHighSeason: 'Temporada alta: $90–$100 USD',
        rateNote: 'Las tarifas varían según la temporada. Consultanos el precio exacto para tus fechas.',
        minStayNote: 'Estadía mínima: 1 noche en temporada baja, 2 noches en temporada alta.',
      },
      location: {
        title: 'Ubicación',
        body:
          'Morpho Glamping está en Nuevo Arenal, Guanacaste, muy cerca del Lago Arenal y del centro del pueblo, con la distancia justa para sentirse silencioso, privado y bien conectado con La Fortuna.',
        points: [
          '~600–750 m del Lago Arenal',
          '~250 m del centro de Nuevo Arenal',
          'Restaurantes cercanos',
          'Parqueo privado incluido',
          'Entrada independiente',
        ],
      },
      reviews: {
        title: 'Reseñas',
        body: 'Lo que más valoran las parejas es la calma, la limpieza y la sensación de que todo está realmente pensado.',
        items: [
          {
            quote:
              'La vista al lago en la mañana fue inolvidable. Todo se sintió privado, limpio y muy bien resuelto.',
            author: 'Pareja huésped',
            detail: 'Vista al lago, privacidad y confort',
            stars: 5,
          },
          {
            quote:
              'Nos encantó la terraza tranquila, el café incluido y lo fácil que fue coordinar la estadía por WhatsApp.',
            author: 'Huésped recurrente',
            detail: 'Terraza, café y comunicación rápida',
            stars: 5,
          },
          {
            quote:
              'Perfecto para una escapada lenta cerca de Nuevo Arenal. Cercano a restaurantes, pero igual íntimo y sereno.',
            author: 'Escapada de fin de semana',
            detail: 'Ubicación, acceso y atmósfera',
            stars: 5,
          },
        ],
      },
      faq: {
        title: 'Preguntas frecuentes',
        body: 'Respuestas claras para planear una estadía fluida y tranquila.',
        items: [
          {
            question: '¿A qué hora es el check-in y check-out?',
            answer: 'Check-in: 3:00 pm. Check-out: 11:00 am. Podemos coordinar horarios especiales por WhatsApp.',
          },
          {
            question: '¿Cómo recibo las llaves?',
            answer:
              'Coordinamos la entrega de llaves por WhatsApp. Contamos con caja de seguridad en el sitio para llegadas fuera de horario.',
          },
          {
            question: '¿Aceptan mascotas?',
            answer:
              'Por el momento no admitimos mascotas para mantener el espacio impecable para todos los huéspedes.',
          },
          {
            question: '¿Hay restaurantes cerca?',
            answer:
              'Sí. A 500 m del centro de Nuevo Arenal encontrarás restaurantes, sodas, supermercado y farmacia.',
          },
          {
            question: '¿Cómo se paga?',
            answer: 'SINPE Móvil, transferencia bancaria o efectivo. Lo coordinamos por WhatsApp al confirmar.',
          },
          {
            question: '¿Es seguro el parqueo?',
            answer: 'Sí. El estacionamiento es privado y seguro, incluido en la tarifa.',
          },
          {
            question: '¿Hay WiFi?',
            answer: 'Sí, WiFi de alta velocidad incluido.',
          },
          {
            question: '¿Puedo reservar solo una noche?',
            answer:
              'En temporada baja sí, mínimo 1 noche. En temporada alta el mínimo es 2 noches.',
          },
          {
            question: '¿El glamping tiene cocina?',
            answer:
              'Sí, hay una mini cocina equipada con refrigerador, utensilios básicos y extractor.',
          },
          {
            question: '¿Está cerca del Lago Arenal?',
            answer:
              'Sí. El domo está orientado hacia la franja del lago y mantiene la presencia visual del Lago Arenal durante toda la estadía.',
          },
          {
            question: '¿Cómo funciona la reserva?',
            answer:
              'Elegís las fechas en el calendario, revisás disponibilidad y continuás por WhatsApp o Airbnb según el canal que prefieras.',
          },
        ],
      },
      reserve: {
        title: 'Reservá el silencio',
        body:
          'Usá el calendario y continuá por WhatsApp o Airbnb. Mantenemos el camino de reserva simple y humano para quienes buscan glamping en Arenal y Lago Arenal.',
        points: ['Reserva por WhatsApp', 'Soporte Airbnb', 'Sincronización iCal'],
        cta: 'Solicitar reserva',
        whatsappCta: 'Reservar por WhatsApp',
        airbnbCta: 'Reservar en Airbnb',
        backToTop: 'Volver arriba',
        emailSubject: 'Consulta de reserva Morpho Glamping',
      },
      footer: {
        copy: 'Concepto de landing editorial para Morpho Glamping en Nuevo Arenal, Costa Rica.',
      },
      seo: {
        title: 'Glamping Costa Rica en Lago Arenal | Morpho Glamping',
        description:
          'Domo para parejas en Nuevo Arenal, Guanacaste. Vistas al Lago Arenal, AC, WiFi, baño privado y terraza privada. Reservá directo.',
        ogTitle: 'Glamping Costa Rica en Lago Arenal | Morpho Glamping',
        ogDescription:
          'Domo para parejas en Nuevo Arenal, Guanacaste. Vistas al Lago Arenal, AC, WiFi, baño privado y terraza privada. Reservá directo.',
      },
      notFound: {
        title: 'Página no encontrada',
        body: 'La página que buscás no existe. Volvé a la landing de Morpho Glamping para continuar.',
        cta: 'Ir a la landing',
      },
      cookies: {
        body:
          'Usamos cookies esenciales y analítica respetuosa con la privacidad para mejorar la experiencia de reserva y el rendimiento del sitio.',
        acceptAll: 'Aceptar todo',
        necessaryOnly: 'Solo necesarias',
        reject: 'Rechazar',
      },
    },
  },
} as const

const savedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('morpho-lang') : null

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage === 'es' || savedLanguage === 'en' ? savedLanguage : 'es',
  fallbackLng: 'es',
  supportedLngs: ['es', 'en'],
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
