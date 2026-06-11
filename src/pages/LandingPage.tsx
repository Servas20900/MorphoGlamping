import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAnalytics } from '../hooks/useAnalytics.js'
import { useScrollToHash } from '../hooks/useScrollToHash.js'
import { initGA } from '../services/analytics.js'
import { Navbar } from '../components/Navbar'
import { SmoothScroll } from '../components/SmoothScroll'
import { Reveal } from '../components/Reveal'
import { GalleryCarousel } from '../components/GalleryCarousel'
import { galleryImages, heroHighlights, heroImage } from '../data/site'
import { FAQAccordion } from '../components/FAQAccordion'
import { useActiveSection } from '../hooks/useActiveSection'
import { buildReservationEmailHref, siteConfig } from '../config/siteConfig'
import {
  type Locale,
  type SectionKey,
  SECTION_IDS,
  getLocalizedPath,
  getSectionKeyFromHash,
} from '../config/routes'
import { CookieBanner } from '../components/CookieBanner'

type LandingPageProps = {
  locale: Locale
}

const COOKIE_CONSENT_KEY = 'morpho_cookie_consent'

function buildGoogleMapsEmbedUrl(sourceUrl: string) {
  if (!sourceUrl) return ''

  try {
    const parsedUrl = new URL(sourceUrl)
    const searchCoordinatesMatch = parsedUrl.pathname.match(/\/maps\/search\/(-?\d+(?:\.\d+)?),\+?(-?\d+(?:\.\d+)?)/)
    const coordinatesMatch = parsedUrl.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)

    if (searchCoordinatesMatch) return `https://www.google.com/maps?q=${searchCoordinatesMatch[1]},${searchCoordinatesMatch[2]}&z=15&output=embed`
    if (coordinatesMatch) return `https://www.google.com/maps?q=${coordinatesMatch[1]},${coordinatesMatch[2]}&z=15&output=embed`
    if (parsedUrl.searchParams.get('q')) return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(parsedUrl.searchParams.get('q') ?? '')}`
    if (sourceUrl.includes('output=embed')) return sourceUrl
    return `${sourceUrl}${sourceUrl.includes('?') ? '&' : '?'}output=embed`
  } catch {
    return sourceUrl
  }
}

function readCookieConsent() {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY)
  return stored === 'accepted' || stored === 'rejected' ? stored : null
}

function setHeadElement(selector: string, attribute: 'content' | 'href', value: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null

  if (!element) {
    element = selector.startsWith('link') ? (document.createElement('link') as HTMLLinkElement) : (document.createElement('meta') as HTMLMetaElement)

    if (selector.startsWith('link')) {
      const relMatch = selector.match(/rel=["']([^"']+)["']/)
      const hreflangMatch = selector.match(/hreflang=["']([^"']+)["']/)
      if (relMatch) element.setAttribute('rel', relMatch[1])
      if (hreflangMatch) element.setAttribute('hreflang', hreflangMatch[1])
      document.head.appendChild(element)
    } else if (selector.includes('name=')) {
      const nameMatch = selector.match(/name=["']([^"']+)["']/)
      if (nameMatch) element.setAttribute('name', nameMatch[1])
      document.head.appendChild(element)
    } else if (selector.includes('property=')) {
      const propertyMatch = selector.match(/property=["']([^"']+)["']/)
      if (propertyMatch) element.setAttribute('property', propertyMatch[1])
      document.head.appendChild(element)
    }
  }

  element.setAttribute(attribute, value)
}

function setStructuredData(selector: string, value: unknown) {
  let element = document.head.querySelector(selector) as HTMLScriptElement | null

  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.setAttribute('id', 'morpho-seo-schema')
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(value)
}

/* ─── Shared utility classes ─────────────────────────────── */

const sectionBase = 'w-full max-w-page mx-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(2.5rem,5vw,4rem)] scroll-mt-[calc(var(--nav-height)+0.5rem)]'

const sectionTitle = 'm-0 font-heading font-semibold tracking-[-0.055em] leading-[.95] text-ink'

const sectionLead = 'mt-3 text-muted leading-[1.65] text-[clamp(.98rem,1.2vw,1.08rem)]'

const btnPrimary = 'inline-flex items-center justify-center min-h-[2.85rem] px-5 rounded-full bg-ink text-white border border-ink text-[.88rem] tracking-[.03em] no-underline transition-colors duration-[180ms] cursor-pointer'

const btnGhost = 'inline-flex items-center justify-center min-h-[2.85rem] px-5 rounded-full bg-white/65 text-ink border border-black/[.07] text-[.88rem] tracking-[.03em] no-underline transition-colors duration-[180ms] cursor-pointer'

/* ─────────────────────────────────────────────────────────── */

export function LandingPage({ locale }: LandingPageProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { trackEvent } = useAnalytics()
  useScrollToHash()

  const [consent, setConsent] = useState<string | null>(() => readCookieConsent())

  const sectionIds = SECTION_IDS[locale]
  const trackedSections = [
    sectionIds.home,
    sectionIds.stay,
    sectionIds.gallery,
    sectionIds.experience,
    sectionIds.rates,
    sectionIds.availability,
    sectionIds.location,
    sectionIds.faq,
    sectionIds.reserve,
  ] as const

  const stayPoints = t('stay.points', { returnObjects: true }) as string[]
  const stayFacts = t('stay.facts', { returnObjects: true }) as string[]
  const experienceCards = t('experience.cards', { returnObjects: true }) as Array<{ title: string; text: string }>
  const locationPoints = t('location.points', { returnObjects: true }) as string[]
  const faqItems = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>
  const reservationEmailHref = buildReservationEmailHref(t('reserve.emailSubject'))
  const googleMapsEmbedUrl = buildGoogleMapsEmbedUrl(siteConfig.booking.googleMapsUrl)
  const absoluteSiteUrl = 'https://morphoglamping.com'
  const localeUrl = `${absoluteSiteUrl}/${locale}`
  const ogLocale = locale === 'es' ? 'es_CR' : 'en_US'
  const faqSchema = faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  }))
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness',
        '@id': `${absoluteSiteUrl}/#business`,
        name: 'Morpho Glamping',
        url: localeUrl,
        image: `${absoluteSiteUrl}/images/FotoPrincipal.jpeg`,
        description: t('seo.description'),
        priceRange: '$80 USD+',
        petsAllowed: true,
        starRating: { '@type': 'Rating', ratingValue: '4.58', bestRating: '5' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.58', reviewCount: '43', bestRating: '5' },
        address: { '@type': 'PostalAddress', addressLocality: 'Nuevo Arenal', addressRegion: 'Guanacaste', addressCountry: 'CR' },
        areaServed: ['Nuevo Arenal', 'Lago Arenal', 'La Fortuna', 'Arenal Guanacaste'],
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Air conditioning', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Private bathroom', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Private parking', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Pets allowed', value: true },
        ],
        sameAs: [siteConfig.social.instagramUrl, siteConfig.social.tiktokUrl, siteConfig.booking.airbnbUrl],
      },
      { '@type': 'FAQPage', '@id': `${absoluteSiteUrl}/#faq`, mainEntity: faqSchema },
    ],
  }

  const navLinks = [
    { key: 'stay' as SectionKey, label: t('nav.stay'), href: getLocalizedPath(locale, 'stay') },
    { key: 'gallery' as SectionKey, label: t('nav.gallery'), href: getLocalizedPath(locale, 'gallery') },
    { key: 'experience' as SectionKey, label: t('nav.experience'), href: getLocalizedPath(locale, 'experience') },
    { key: 'rates' as SectionKey, label: t('nav.rates'), href: getLocalizedPath(locale, 'rates') },
    { key: 'availability' as SectionKey, label: t('nav.availability'), href: getLocalizedPath(locale, 'availability') },
    { key: 'location' as SectionKey, label: t('nav.location'), href: getLocalizedPath(locale, 'location') },
    { key: 'faq' as SectionKey, label: t('nav.faq'), href: getLocalizedPath(locale, 'faq') },
  ]

  const homeHref = getLocalizedPath(locale)
  const reserveHref = getLocalizedPath(locale, 'reserve')
  const homeSectionId = sectionIds.home

  const { activeSection, setActiveSectionImmediate } = useActiveSection(trackedSections)
  const activeSectionKey = getSectionKeyFromHash(locale, activeSection) ?? 'home'

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem('morpho-lang', locale)
    if (i18n.language !== locale) void i18n.changeLanguage(locale)

    const title = t('seo.title')
    const description = t('seo.description')
    const ogTitle = t('seo.ogTitle')
    const ogDescription = t('seo.ogDescription')
    const canonicalUrl = `${absoluteSiteUrl}${location.pathname}`
    const ogUrl = `${absoluteSiteUrl}${location.pathname}${location.hash}`

    document.title = title
    setHeadElement('meta[name="description"]', 'content', description)
    setHeadElement('meta[name="keywords"]', 'content', 'glamping Costa Rica, Lago Arenal, Nuevo Arenal, Arenal Guanacaste, domo para parejas, vista al lago')
    setHeadElement('meta[name="robots"]', 'content', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
    setHeadElement('meta[property="og:site_name"]', 'content', 'Morpho Glamping')
    setHeadElement('meta[property="og:locale"]', 'content', ogLocale)
    setHeadElement('meta[property="og:type"]', 'content', 'website')
    setHeadElement('meta[property="og:image"]', 'content', `${absoluteSiteUrl}/og-image.svg`)
    setHeadElement('meta[property="og:title"]', 'content', ogTitle)
    setHeadElement('meta[property="og:description"]', 'content', ogDescription)
    setHeadElement('meta[property="og:url"]', 'content', ogUrl)
    setHeadElement('meta[name="twitter:card"]', 'content', 'summary_large_image')
    setHeadElement('meta[name="twitter:title"]', 'content', ogTitle)
    setHeadElement('meta[name="twitter:description"]', 'content', ogDescription)
    setHeadElement('meta[name="twitter:image"]', 'content', `${absoluteSiteUrl}/og-image.svg`)
    setHeadElement('link[rel="canonical"]', 'href', canonicalUrl)
    setHeadElement('link[rel="alternate"][hreflang="es"]', 'href', `${absoluteSiteUrl}/es`)
    setHeadElement('link[rel="alternate"][hreflang="en"]', 'href', `${absoluteSiteUrl}/en`)
    setHeadElement('link[rel="alternate"][hreflang="x-default"]', 'href', `${absoluteSiteUrl}/es`)
    setStructuredData('script#morpho-seo-schema', schema)
  }, [i18n.language, locale, location.hash, location.pathname, t])

  useEffect(() => {
    if (consent === 'accepted') initGA()
  }, [consent])

  const handleNavigate = (href: string) => {
    const nextLocation = new URL(href, window.location.origin)
    const nextSectionKey = getSectionKeyFromHash(locale, nextLocation.hash) ?? (nextLocation.pathname === `/${locale}` ? 'home' : null)

    if (nextSectionKey) {
      trackEvent('navigation', 'nav_click', nextSectionKey)
      setActiveSectionImmediate(sectionIds[nextSectionKey])
    }

    navigate(`${nextLocation.pathname}${nextLocation.hash}`)
  }

  const handleLanguageChange = (nextLocale: Locale) => {
    const sectionKey = activeSectionKey === 'home' ? null : activeSectionKey
    navigate(getLocalizedPath(nextLocale, sectionKey))
  }

  const acceptCookies = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
    initGA()
  }

  const rejectCookies = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    setConsent('rejected')
  }

  const handleAvailabilityWhatsAppClick = () => trackEvent('conversion', 'click_whatsapp', 'availability')
  const handleAirbnbClick = () => trackEvent('conversion', 'click_airbnb')
  const handlePhoneClick = () => trackEvent('conversion', 'click_phone')

  const handleSectionJump = (sectionKey: SectionKey) => handleNavigate(getLocalizedPath(locale, sectionKey))

  return (
    <SmoothScroll>
      <div className="relative min-h-screen">
        <Navbar
          locale={locale}
          activeSection={activeSection}
          homeHref={homeHref}
          homeSectionId={homeSectionId}
          reserveHref={reserveHref}
          homeLabel={t('nav.home')}
          reserveLabel={t('nav.reserveCta')}
          links={navLinks}
          onLanguageChange={handleLanguageChange}
          onNavigate={handleNavigate}
        />

        <main>
          {/* ── Hero ── */}
          <section
            id={sectionIds.home}
            className="w-full max-w-page mx-auto px-[clamp(1rem,3vw,2rem)] min-h-[100svh] pt-[calc(var(--nav-height)+clamp(1rem,3vh,2rem))] pb-[clamp(2rem,4vw,3rem)] scroll-mt-0"
          >
            <div className="grid grid-cols-2 gap-[clamp(1.25rem,2.5vw,2.5rem)] items-center max-[960px]:grid-cols-1">
              <Reveal className="flex flex-col">
                <p className="m-0 mb-[.85rem] uppercase tracking-[.24em] text-[.72rem] text-muted">
                  {t('hero.eyebrow')}
                </p>
                <h1 className={`${sectionTitle} max-w-[10ch] text-[clamp(2.8rem,7vw,5.5rem)] max-[960px]:max-w-full max-[960px]:text-[clamp(2.2rem,9vw,3.4rem)] max-[600px]:text-[clamp(2rem,12vw,2.8rem)]`}>
                  {t('hero.title')}
                </h1>
                <p className={`${sectionLead} max-w-[32rem] mt-5`}>{t('hero.body')}</p>

                <div className="flex gap-3 flex-wrap mt-6 max-[960px]:flex-col max-[960px]:items-stretch">
                  <a
                    className={btnPrimary}
                    href={reserveHref}
                    onClick={(e) => { e.preventDefault(); handleSectionJump('reserve') }}
                  >
                    {t('hero.primary')}
                  </a>
                  <a
                    className={btnGhost}
                    href={getLocalizedPath(locale, 'experience')}
                    onClick={(e) => { e.preventDefault(); handleSectionJump('experience') }}
                  >
                    {t('hero.secondary')}
                  </a>
                </div>

                <ul className="flex flex-wrap gap-2 gap-x-5 mt-7 p-0 list-none" aria-label="Key stay highlights">
                  {heroHighlights.map((item) => (
                    <li key={item.label} className="relative pl-[.85rem] text-[.82rem] text-muted tracking-[.02em]">
                      <span className="absolute left-0 top-[.55em] w-[.3rem] h-[.3rem] rounded-full bg-accent" aria-hidden="true" />
                      {t(item.label)}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <div className="relative max-[960px]:[order:-1]">
                <div className="relative overflow-hidden min-h-[clamp(22rem,58vh,36rem)] border border-black/[.07] bg-surface rounded-card max-[600px]:min-h-[13rem]">
                  <img
                    src={heroImage}
                    alt="Exterior del domo glamping Morpho Glamping en Nuevo Arenal, Costa Rica"
                    className="w-full h-full object-contain object-center"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35 pointer-events-none" />
                  <div className="absolute left-[1.1rem] bottom-[1.1rem] grid gap-1 text-white">
                    <span className="text-[.68rem] tracking-[.2em] uppercase opacity-85">{t('hero.captionTop')}</span>
                    <strong className="font-heading text-[1.05rem] font-semibold">{t('hero.captionBottom')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Stay ── */}
          <section id={sectionIds.stay} className={sectionBase}>
            <Reveal className="grid gap-6">
              <header className="max-w-[38rem] mb-7">
                <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('stay.title')}</h2>
                <p className={`${sectionLead} max-w-[34rem]`}>{t('stay.body')}</p>
              </header>

              <div className="grid grid-cols-2 gap-8 max-[960px]:grid-cols-1 max-[600px]:gap-5">
                <ul className="grid m-0 p-0 list-none">
                  {stayPoints.map((point) => (
                    <li key={point} className="relative pl-4 py-[.7rem] border-b border-black/[.07] text-ink text-[.95rem]">
                      <span className="absolute left-0 top-[1.1rem] w-[.35rem] h-[.35rem] rounded-full bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>

                <ul className="grid m-0 p-0 list-none content-start">
                  {stayFacts.map((fact) => (
                    <li key={fact} className="py-[.55rem] border-b border-black/[.07] text-muted text-[.9rem]">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 border-t-2 border-accent bg-white/55">
                <h3 className="m-0 font-heading text-[clamp(1.2rem,2vw,1.5rem)] tracking-[-0.03em] font-semibold">
                  {t('stay.panelTitle')}
                </h3>
                <p className="mt-2 text-muted text-[.95rem] leading-[1.65] max-w-[42rem]">{t('stay.panelCopy')}</p>
              </div>
            </Reveal>
          </section>

          {/* ── Gallery ── */}
          <section id={sectionIds.gallery} className={sectionBase}>
            <Reveal className="max-w-[38rem] mb-5">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('gallery.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('gallery.body')}</p>
            </Reveal>
            <GalleryCarousel images={galleryImages} />
          </section>

          {/* ── Experience ── */}
          <section id={sectionIds.experience} className={sectionBase}>
            <Reveal className="max-w-[38rem] mb-7">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('experience.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('experience.body')}</p>
            </Reveal>

            <div className="grid grid-cols-3 gap-[.85rem] max-[960px]:grid-cols-1 max-[960px]:gap-[.65rem]">
              {experienceCards.map((card) => (
                <article key={card.title} className="p-[1.1rem_1.15rem] border border-black/[.07] rounded-section bg-white/50">
                  <h3 className="m-0 font-heading text-[1.05rem] tracking-[-0.02em] font-semibold">{card.title}</h3>
                  <p className="mt-[.45rem] text-muted text-[.88rem] leading-[1.6]">{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Rates ── */}
          <section id={sectionIds.rates} className={sectionBase}>
            <Reveal className="max-w-[38rem] mb-7">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('rates.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('rates.body')}</p>
            </Reveal>

            <div className="grid gap-4">
              <div className="p-4 border border-black/[.07] rounded-section bg-white/55">
                <span className="block text-[.68rem] uppercase tracking-[.18em] text-muted">{t('availability.rateLabel')}</span>
                <strong className="block mt-[.35rem] font-heading text-[clamp(1.15rem,2vw,1.45rem)] tracking-[-0.04em]">{t('availability.rateValue')}</strong>
                <p className="mt-[.35rem] text-[.88rem] text-muted">{t('availability.rateHighSeason')}</p>
                <p className="mt-[.35rem] text-[.82rem] text-muted leading-[1.5]">{t('availability.rateNote')}</p>
                <p className="mt-[.35rem] text-[.82rem] text-muted leading-[1.5]">{t('availability.minStayNote')}</p>
              </div>

              <ul className="grid gap-[.35rem] m-0 p-0 list-none">
                <li className="relative pl-3 text-[.85rem] text-muted before:content-['·'] before:absolute before:left-0 before:text-accent">
                  <a
                    href={siteConfig.contact.whatsappHref || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                    rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                    onClick={(e) => {
                      if (!siteConfig.contact.whatsappHref) { e.preventDefault(); handleSectionJump('availability') }
                      else handleAvailabilityWhatsAppClick()
                    }}
                  >
                    {t('availability.whatsapp')}
                  </a>
                </li>
                <li className="relative pl-3 text-[.85rem] text-muted before:content-['·'] before:absolute before:left-0 before:text-accent">
                  <a
                    href={siteConfig.booking.airbnbUrl || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                    rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                    onClick={(e) => {
                      if (!siteConfig.booking.airbnbUrl) { e.preventDefault(); handleSectionJump('availability') }
                      else handleAirbnbClick()
                    }}
                  >
                    {t('availability.airbnb')}
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* ── Availability ── */}
          <section id={sectionIds.availability} className={sectionBase}>
            <Reveal className="max-w-[38rem] mb-7">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('availability.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('availability.body')}</p>
            </Reveal>

            <div className="grid gap-4">
              <div className="p-4 border border-black/[.07] rounded-section bg-white/55">
                <span className="block text-[.68rem] uppercase tracking-[.18em] text-muted">{t('availability.selectedLabel')}</span>
                <strong className="block mt-[.35rem] font-heading text-[clamp(1.15rem,2vw,1.45rem)] tracking-[-0.04em]">{t('availability.rateValue')}</strong>
                <p className="mt-[.3rem] text-[.88rem]">{t('availability.rateNote')}</p>
                <p className="mt-[.3rem] text-[.88rem] text-accent">{t('availability.available')}</p>
              </div>

              <ul className="grid gap-[.35rem] m-0 p-0 list-none">
                <li className="relative pl-3 text-[.85rem] text-muted before:content-['·'] before:absolute before:left-0 before:text-accent">
                  <a
                    href={siteConfig.contact.whatsappHref || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                    rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                    onClick={(e) => {
                      if (!siteConfig.contact.whatsappHref) { e.preventDefault(); handleSectionJump('availability') }
                      else handleAvailabilityWhatsAppClick()
                    }}
                  >
                    {t('availability.whatsapp')}
                  </a>
                </li>
                <li className="relative pl-3 text-[.85rem] text-muted before:content-['·'] before:absolute before:left-0 before:text-accent">
                  <a
                    href={siteConfig.booking.airbnbUrl || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                    rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                    onClick={(e) => {
                      if (!siteConfig.booking.airbnbUrl) { e.preventDefault(); handleSectionJump('availability') }
                      else handleAirbnbClick()
                    }}
                  >
                    {t('availability.airbnb')}
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* ── Location ── */}
          <section id={sectionIds.location} className={sectionBase}>
            <Reveal className="max-w-[38rem] mb-7">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('location.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('location.body')}</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-6 items-start max-[960px]:grid-cols-1">
              {googleMapsEmbedUrl ? (
                <div className="relative block bg-surface rounded-section overflow-hidden aspect-[4/3] border border-black/[.07] max-[960px]:aspect-[16/10]">
                  <iframe
                    className="absolute inset-0 w-full h-full border-0 block"
                    src={googleMapsEmbedUrl}
                    title="Mapa de Google Maps de Morpho Glamping"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute left-[.85rem] right-[.85rem] bottom-[.85rem] z-10 flex items-center justify-between gap-3 px-[.8rem] py-[.65rem] rounded-[.95rem] bg-white/85 backdrop-blur-xl shadow-[0_10px_24px_rgba(17,17,17,.12)] pointer-events-none">
                    <p className="m-0 font-heading text-[1.1rem] tracking-[-0.02em]">Nuevo Arenal, Costa Rica</p>
                    <span className="text-[.68rem] uppercase tracking-[.18em] text-muted">Google Maps</span>
                  </div>
                </div>
              ) : (
                <div className="relative min-h-[18rem] rounded-section border border-black/[.07] bg-surface flex flex-col items-center justify-center gap-2 overflow-hidden" aria-hidden="true">
                  <div className="w-[.65rem] h-[.65rem] rounded-full bg-accent shadow-[0_0_0_8px_rgba(36,93,102,.15)]" />
                  <p className="m-0 font-heading text-[1.1rem] tracking-[-0.02em]">Nuevo Arenal, Costa Rica</p>
                </div>
              )}

              <ul className="grid m-0 p-0 list-none">
                {locationPoints.map((point) => (
                  <li key={point} className="py-[.65rem] border-b border-black/[.07] text-[.92rem] text-ink">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id={sectionIds.faq} className={`${sectionBase} grid gap-5`}>
            <Reveal className="max-w-[38rem]">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('faq.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('faq.body')}</p>
            </Reveal>
            <FAQAccordion items={faqItems} />
          </section>

          {/* ── Reserve ── */}
          <section
            id={sectionIds.reserve}
            className={`${sectionBase} min-h-[42vh] pb-[calc(clamp(2.5rem,5vw,4rem)+env(safe-area-inset-bottom,0px))]`}
          >
            <Reveal className="max-w-[40rem]">
              <h2 className={`${sectionTitle} text-[clamp(2rem,4.5vw,3.2rem)]`}>{t('reserve.title')}</h2>
              <p className={`${sectionLead} max-w-[34rem]`}>{t('reserve.body')}</p>

              {/* CTAs principales */}
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  className={btnPrimary}
                  href={siteConfig.contact.whatsappHref || reserveHref}
                  target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                  rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                  onClick={(e) => {
                    if (!siteConfig.contact.whatsappHref) { e.preventDefault(); handleSectionJump('availability') }
                    else handleAvailabilityWhatsAppClick()
                  }}
                >
                  WhatsApp
                </a>
                <a
                  className={btnGhost}
                  href={siteConfig.booking.airbnbUrl || reserveHref}
                  target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                  rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                  onClick={(e) => {
                    if (!siteConfig.booking.airbnbUrl) { e.preventDefault(); handleSectionJump('availability') }
                    else handleAirbnbClick()
                  }}
                >
                  Airbnb
                </a>
                <a className={btnGhost} href={reservationEmailHref || reserveHref}>
                  {t('reserve.cta')}
                </a>
              </div>

              {/* Contacto secundario */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-6 border-t border-black/[.07]">
                <a href={siteConfig.contact.emailHref || reserveHref} className="text-[.85rem] text-muted hover:text-ink transition-colors duration-150 no-underline">
                  {siteConfig.contact.email}
                </a>
                <a href={siteConfig.contact.phoneHref || reserveHref} onClick={handlePhoneClick} className="text-[.85rem] text-muted hover:text-ink transition-colors duration-150 no-underline">
                  {siteConfig.contact.phone}
                </a>
                <a href={siteConfig.social.instagramUrl} target="_blank" rel="noreferrer" className="text-[.85rem] text-muted hover:text-ink transition-colors duration-150 no-underline">Instagram</a>
                <a href={siteConfig.social.tiktokUrl} target="_blank" rel="noreferrer" className="text-[.85rem] text-muted hover:text-ink transition-colors duration-150 no-underline">TikTok</a>
                {siteConfig.booking.googleMapsUrl ? (
                  <a href={siteConfig.booking.googleMapsUrl} target="_blank" rel="noreferrer" className="text-[.85rem] text-muted hover:text-ink transition-colors duration-150 no-underline">Google Maps</a>
                ) : null}
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="w-full max-w-page mx-auto px-[clamp(1rem,3vw,2rem)] flex justify-between gap-6 pt-6 pb-6 border-t border-black/[.07] mt-2 max-[960px]:flex-col max-[600px]:pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          <div>
            <strong className="block font-heading text-[.95rem]">Morpho Glamping</strong>
            <p className="mt-1 text-muted text-[.85rem]">Nuevo Arenal, Costa Rica</p>
          </div>
          <p className="m-0 text-muted text-[.85rem]">{t('footer.copy')}</p>
        </footer>

        {consent === null ? <CookieBanner onAcceptAll={acceptCookies} onRejectCookies={rejectCookies} /> : null}
      </div>
    </SmoothScroll>
  )
}
