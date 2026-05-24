export type Locale = 'es' | 'en'

export type SectionKey =
  | 'home'
  | 'stay'
  | 'gallery'
  | 'experience'
  | 'rates'
  | 'availability'
  | 'location'
  | 'faq'
  | 'reserve'

export const SUPPORTED_LOCALES = ['es', 'en'] as const
export const DEFAULT_LOCALE: Locale = 'es'

export const SECTION_IDS: Record<Locale, Record<SectionKey, string>> = {
  es: {
    home: 'inicio',
    stay: 'estadia',
    gallery: 'galeria',
    experience: 'experiencia',
    rates: 'tarifas',
    availability: 'disponibilidad',
    location: 'ubicacion',
    faq: 'faq',
    reserve: 'reservar',
  },
  en: {
    home: 'home',
    stay: 'stay',
    gallery: 'gallery',
    experience: 'experience',
    rates: 'rates',
    availability: 'availability',
    location: 'location',
    faq: 'faq',
    reserve: 'reserve',
  },
} as const

export function getPreferredLocale(language?: string | null): Locale {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function getLocalizedSectionId(locale: Locale, sectionKey: SectionKey) {
  return SECTION_IDS[locale][sectionKey]
}

export function getLocalizedPath(locale: Locale, sectionKey?: SectionKey | null) {
  return sectionKey ? `/${locale}#${getLocalizedSectionId(locale, sectionKey)}` : `/${locale}`
}

export function getSectionKeyFromHash(locale: Locale, hash: string) {
  const normalizedHash = hash.replace(/^#/, '')

  const match = Object.entries(SECTION_IDS[locale]).find(([, localizedId]) => localizedId === normalizedHash)

  return (match?.[0] ?? null) as SectionKey | null
}

export function getSectionKeyFromPath(locale: Locale, pathname: string, hash: string) {
  const pathLocale = pathname === '/en' ? 'en' : 'es'
  const normalizedLocale = pathLocale === 'en' ? 'en' : locale

  return getSectionKeyFromHash(normalizedLocale, hash)
}

export function buildCanonicalUrl(pathname: string) {
  if (typeof window === 'undefined') {
    return pathname
  }

  return `${window.location.origin}${pathname}`
}

export function buildOgUrl(pathname: string, hash = '') {
  if (typeof window === 'undefined') {
    return `${pathname}${hash}`
  }

  return `${window.location.origin}${pathname}${hash}`
}
