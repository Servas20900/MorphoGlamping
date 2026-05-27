export const siteBrand = {
  name: 'Morpho Glamping',
  /** Usa el favicon como marca mientras no exista un logo separado en public/images/ */
  logoSrc: '/favicon.jpeg',
  logoFallback: '/favicon.jpeg',
} as const

export const heroHighlights = [
  { label: 'stats.privacy' },
  { label: 'stats.view' },
  { label: 'stats.quiet' },
] as const

/** Imágenes de la galería — reemplaza src con rutas locales en public/images/ */
export const galleryImages = [
  {
    src: '/images/Glamping01.jpeg',
    alt: 'Exterior del domo glamping Morpho Glamping en Nuevo Arenal, Guanacaste',
  },
  {
    src: '/images/Glamping02.png',
    alt: 'Interior del domo glamping para parejas con cama matrimonial y luz natural',
  },
  {
    src: '/images/Glamping03.jpeg',
    alt: 'Vista al Lago Arenal desde el glamping al amanecer',
  },
  {
    src: '/images/Glamping04.jpeg',
    alt: 'Terraza privada con vistas al Lago Arenal en Nuevo Arenal',
  },
  {
    src: '/images/Glamping05.jpeg',
    alt: 'Mini cocina equipada del glamping con café y vajilla para parejas',
  },
  {
    src: '/images/Glamping06.png',
    alt: 'Baño privado del domo glamping con ducha caliente y diseño cómodo',
  },
  {
    src: '/images/Glamping07.jpeg',
    alt: 'Domo glamping con entrada independiente y estacionamiento privado',
  },
  {
    src: '/images/Glamping08.jpeg',
    alt: 'Vista del alojamiento romántico en Arenal Guanacaste rodeado de naturaleza',
  },
  {
    src: '/images/Glamping09.png',
    alt: 'Área exterior pet friendly del glamping cerca del Lago Arenal',
  },
  {
    src: '/images/Glamping10.png',
    alt: 'Terraza mirador privada con vista al Lago Arenal para parejas',
  },
  {
    src: '/images/Glamping11.png',
    alt: 'Glamping en Nuevo Arenal Costa Rica con ambiente íntimo y tranquilo',
  },
] as const

/** Imagen principal del hero */
export const heroImage = '/images/FotoPrincipal.jpeg'
