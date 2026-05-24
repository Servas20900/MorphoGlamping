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
    alt: 'Vista general del espacio de glamping',
  },
  {
    src: '/images/Glamping02.png',
    alt: 'Interior del domo con madera cálida y luz del lago',
  },
  {
    src: '/images/Glamping03.jpeg',
    alt: 'Horizonte del Lago Arenal al amanecer',
  },
  {
    src: '/images/Glamping04.png',
    alt: 'Terraza privada con vista al cielo',
  },
  {
    src: '/images/Glamping05.jpeg',
    alt: 'Espacio de comedor minimalista',
  },
  {
    src: '/images/Glamping06.png',
    alt: 'Detalle adicional del alojamiento y su entorno',
  },
  {
    src: '/images/Glamping07.jpeg',
    alt: 'Otra vista del glamping con luz natural',
  },
  {
    src: '/images/Glamping08.jpeg',
    alt: 'Encuadre de la propiedad con ambiente cálido',
  },
  {
    src: '/images/Glamping09.png',
    alt: 'Vista complementaria del espacio exterior',
  },
  {
    src: '/images/Glamping10.jpeg',
    alt: 'Detalle visual de la estancia y su atmósfera',
  },
  {
    src: '/images/Glamping11.png',
    alt: 'Imagen final del conjunto del glamping',
  },
] as const

/** Imagen principal del hero */
export const heroImage = '/images/FotoPrincipal.jpeg'

export const bookedDateKeys = new Set([
  '2026-05-28',
  '2026-05-29',
  '2026-06-03',
  '2026-06-04',
  '2026-06-11',
  '2026-06-12',
  '2026-06-18',
  '2026-06-19',
])
