import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAnalytics } from '../hooks/useAnalytics.js'
import { useScrollToHash } from '../hooks/useScrollToHash.js'
import { initGA } from '../services/analytics.js'
import { Navbar } from '../components/Navbar'
import { SmoothScroll } from '../components/SmoothScroll'
import { Reveal } from '../components/Reveal'
import { GalleryCarousel } from '../components/GalleryCarousel'
import { bookedDateKeys, galleryImages, heroHighlights, heroImage } from '../data/site'
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

const AvailabilityCalendar = lazy(() =>
  import('../components/AvailabilityCalendar').then((module) => ({
    default: module.AvailabilityCalendar,
  })),
)

type LandingPageProps = {
  locale: Locale
}

const COOKIE_CONSENT_KEY = 'morpho_cookie_consent'

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getFirstAvailableDate(fromDate = new Date()) {
  const candidate = startOfDay(fromDate)

  for (let index = 0; index < 90; index += 1) {
    if (!bookedDateKeys.has(dateKey(candidate))) {
      return new Date(candidate)
    }

    candidate.setDate(candidate.getDate() + 1)
  }

  return new Date(candidate)
}

function buildGoogleMapsEmbedUrl(sourceUrl: string) {
  if (!sourceUrl) {
    return ''
  }

  try {
    const parsedUrl = new URL(sourceUrl)
    const coordinatesMatch = parsedUrl.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)

    if (coordinatesMatch) {
      return `https://www.google.com/maps?q=${coordinatesMatch[1]},${coordinatesMatch[2]}&z=15&output=embed`
    }

    if (parsedUrl.searchParams.get('q')) {
      return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(parsedUrl.searchParams.get('q') ?? '')}`
    }

    if (sourceUrl.includes('output=embed')) {
      return sourceUrl
    }

    return `${sourceUrl}${sourceUrl.includes('?') ? '&' : '?'}output=embed`
  } catch {
    return sourceUrl
  }
}

function readCookieConsent() {
  if (typeof window === 'undefined') {
    return null
  }

  const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY)

  if (storedConsent === 'accepted' || storedConsent === 'rejected') {
    return storedConsent
  }

  return null
}

function setHeadElement(selector: string, attribute: 'content' | 'href', value: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null

  if (!element) {
    element = selector.startsWith('link') ? (document.createElement('link') as HTMLLinkElement) : (document.createElement('meta') as HTMLMetaElement)

    if (selector.startsWith('link')) {
      element.setAttribute('rel', 'canonical')
      document.head.appendChild(element)
    } else if (selector.includes('name=')) {
      const nameMatch = selector.match(/name=["']([^"']+)["']/)
      if (nameMatch) {
        element.setAttribute('name', nameMatch[1])
      }
      document.head.appendChild(element)
    } else if (selector.includes('property=')) {
      const propertyMatch = selector.match(/property=["']([^"']+)["']/)
      if (propertyMatch) {
        element.setAttribute('property', propertyMatch[1])
      }
      document.head.appendChild(element)
    }
  }

  element.setAttribute(attribute, value)
}

export function LandingPage({ locale }: LandingPageProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { trackEvent } = useAnalytics()
  useScrollToHash()

  const [selectedDate, setSelectedDate] = useState<Date>(() => getFirstAvailableDate())
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

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(selectedDate),
    [locale, selectedDate],
  )

  const booked = bookedDateKeys.has(dateKey(selectedDate))

  const stayPoints = t('stay.points', { returnObjects: true }) as string[]
  const stayFacts = t('stay.facts', { returnObjects: true }) as string[]
  const experienceCards = t('experience.cards', { returnObjects: true }) as Array<{ title: string; text: string }>
  const locationPoints = t('location.points', { returnObjects: true }) as string[]
  const faqItems = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>
  const reservationEmailHref = buildReservationEmailHref(t('reserve.emailSubject'))
  const googleMapsEmbedUrl = buildGoogleMapsEmbedUrl(siteConfig.booking.googleMapsUrl)

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
    void i18n.changeLanguage(locale)
    window.localStorage.setItem('morpho-lang', locale)

    const title = t('seo.title')
    const description = t('seo.description')
    const ogTitle = t('seo.ogTitle')
    const ogDescription = t('seo.ogDescription')
    const canonicalUrl = `${window.location.origin}${location.pathname}`
    const ogUrl = `${window.location.origin}${location.pathname}${location.hash}`

    document.title = title
    setHeadElement('meta[name="description"]', 'content', description)
    setHeadElement('meta[property="og:title"]', 'content', ogTitle)
    setHeadElement('meta[property="og:description"]', 'content', ogDescription)
    setHeadElement('meta[property="og:url"]', 'content', ogUrl)
    setHeadElement('link[rel="canonical"]', 'href', canonicalUrl)
  }, [i18n, locale, location.hash, location.pathname, t])

  useEffect(() => {
    if (consent === 'accepted') {
      initGA()
    }
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
    const nextHref = getLocalizedPath(nextLocale, sectionKey)
    navigate(nextHref)
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

  const handleAvailabilityWhatsAppClick = () => {
    trackEvent('conversion', 'click_whatsapp', 'availability')
  }

  const handleFooterWhatsAppClick = () => {
    trackEvent('conversion', 'click_whatsapp', 'footer')
  }

  const handleAirbnbClick = () => {
    trackEvent('conversion', 'click_airbnb')
  }

  const handlePhoneClick = () => {
    trackEvent('conversion', 'click_phone')
  }

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date)
    trackEvent('engagement', 'date_selected', date.toISOString().slice(0, 10))
  }

  const handleSectionJump = (sectionKey: SectionKey) => {
    handleNavigate(getLocalizedPath(locale, sectionKey))
  }

  return (
    <SmoothScroll>
      <div className="app-shell">
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
          <section id={sectionIds.home} className="hero-section">
            <div className="hero-grid">
              <Reveal className="hero-copy">
                <p className="eyebrow">{t('hero.eyebrow')}</p>
                <h1 className="hero-title">{t('hero.title')}</h1>
                <p className="hero-body">{t('hero.body')}</p>

                <div className="hero-actions">
                  <a
                    className="button button--primary"
                    href={reserveHref}
                    onClick={(event) => {
                      event.preventDefault()
                      handleSectionJump('reserve')
                    }}
                  >
                    {t('hero.primary')}
                  </a>
                  <a
                    className="button button--ghost"
                    href={getLocalizedPath(locale, 'experience')}
                    onClick={(event) => {
                      event.preventDefault()
                      handleSectionJump('experience')
                    }}
                  >
                    {t('hero.secondary')}
                  </a>
                </div>

                <ul className="hero-highlights" aria-label="Key stay highlights">
                  {heroHighlights.map((item) => (
                    <li key={item.label}>{t(item.label)}</li>
                  ))}
                </ul>
              </Reveal>

              <div className="hero-media">
                <div className="hero-panel hero-panel--image">
                  <img
                    src={heroImage}
                    alt="Interior cálido del domo con vista al agua"
                    className="hero-image"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="hero-panel__overlay" />
                  <div className="hero-panel__caption">
                    <span>{t('hero.captionTop')}</span>
                    <strong>{t('hero.captionBottom')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id={sectionIds.stay} className="section section--stay">
            <Reveal className="stay-layout">
              <header className="section-header">
                <h2 className="section-title">{t('stay.title')}</h2>
                <p className="section-lead">{t('stay.body')}</p>
              </header>

              <div className="stay-content">
                <ul className="detail-list">
                  {stayPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <ul className="stay-facts-list">
                  {stayFacts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </div>

              <div className="stay-panel">
                <h3>{t('stay.panelTitle')}</h3>
                <p>{t('stay.panelCopy')}</p>
              </div>
            </Reveal>
          </section>

          <section id={sectionIds.gallery} className="section section--gallery">
            <Reveal className="section-header section-header--compact">
              <h2 className="section-title">{t('gallery.title')}</h2>
              <p className="section-lead">{t('gallery.body')}</p>
            </Reveal>

            <GalleryCarousel images={galleryImages} />
          </section>

          <section id={sectionIds.experience} className="section section--experience">
            <Reveal className="section-header">
              <h2 className="section-title">{t('experience.title')}</h2>
              <p className="section-lead">{t('experience.body')}</p>
            </Reveal>

            <div className="experience-grid">
              {experienceCards.map((card) => (
                <article key={card.title} className="experience-card">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id={sectionIds.rates} className="section section--rates">
            <Reveal className="section-header">
              <h2 className="section-title">{t('rates.title')}</h2>
              <p className="section-lead">{t('rates.body')}</p>
            </Reveal>

            <div className="availability-sidebar">
              <div className="availability-pricing">
                <span>{t('availability.rateLabel')}</span>
                <strong>{t('availability.rateValue')}</strong>
                <p>{t('availability.rateHighSeason')}</p>
                <p className="availability-pricing__note">{t('availability.rateNote')}</p>
                <p className="availability-pricing__note">{t('availability.minStayNote')}</p>
              </div>

              <ul className="availability-channels">
                <li>
                  <a
                    href={siteConfig.booking.airbnbIcalUrl || '#'}
                    target={siteConfig.booking.airbnbIcalUrl ? '_blank' : undefined}
                    rel={siteConfig.booking.airbnbIcalUrl ? 'noreferrer' : undefined}
                  >
                    {t('availability.iCal')}
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.contact.whatsappHref || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                    rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                    onClick={(event) => {
                      if (!siteConfig.contact.whatsappHref) {
                        event.preventDefault()
                        handleSectionJump('availability')
                        return
                      }

                      handleAvailabilityWhatsAppClick()
                    }}
                  >
                    {t('availability.whatsapp')}
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.booking.airbnbUrl || getLocalizedPath(locale, 'availability')}
                    target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                    rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                    onClick={(event) => {
                      if (!siteConfig.booking.airbnbUrl) {
                        event.preventDefault()
                        handleSectionJump('availability')
                        return
                      }

                      handleAirbnbClick()
                    }}
                  >
                    {t('availability.airbnb')}
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section id={sectionIds.availability} className="section section--availability">
            <Reveal className="section-header">
              <h2 className="section-title">{t('availability.title')}</h2>
              <p className="section-lead">{t('availability.body')}</p>
            </Reveal>

            <div className="availability-layout">
              <div className="availability-panel">
                <Suspense fallback={<div className="availability-calendar__fallback">Loading calendar...</div>}>
                  <AvailabilityCalendar
                    locale={locale}
                    selectedDate={selectedDate}
                    bookedDateKeys={bookedDateKeys}
                    onSelectDate={handleDateSelection}
                  />
                </Suspense>
              </div>

              <aside className="availability-sidebar">
                <div className="availability-summary">
                  <span className="availability-summary__label">{t('availability.selectedLabel')}</span>
                  <strong>{selectedDateLabel}</strong>
                  <p className={booked ? 'availability-summary__status--booked' : 'availability-summary__status--open'}>
                    {booked ? t('availability.booked') : t('availability.available')}
                  </p>
                </div>

                <ul className="status-list">
                  <li>
                    <span className="status-dot status-dot--available" />
                    {t('availability.available')}
                  </li>
                  <li>
                    <span className="status-dot status-dot--booked" />
                    {t('availability.booked')}
                  </li>
                  <li>
                    <span className="status-dot status-dot--selected" />
                    {t('availability.selected')}
                  </li>
                </ul>
              </aside>
            </div>
          </section>

          <section id={sectionIds.location} className="section section--location">
            <Reveal className="section-header">
              <h2 className="section-title">{t('location.title')}</h2>
              <p className="section-lead">{t('location.body')}</p>
            </Reveal>

            <div className="location-layout">
              {googleMapsEmbedUrl ? (
                <div className="location-map location-map--embed">
                  <iframe
                    className="location-map__iframe"
                    src={googleMapsEmbedUrl}
                    title="Mapa de Google Maps de Morpho Glamping"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="location-map__overlay">
                    <p className="location-map__place">Nuevo Arenal, Costa Rica</p>
                    <span>Google Maps</span>
                  </div>
                </div>
              ) : (
                <div className="location-map" aria-hidden="true">
                  <div className="location-map__pin" />
                  <p className="location-map__place">Nuevo Arenal, Costa Rica</p>
                </div>
              )}

              <ul className="location-points">
                {locationPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </section>

          <section id={sectionIds.faq} className="section section--faq">
            <Reveal className="section-header">
              <h2 className="section-title">{t('faq.title')}</h2>
              <p className="section-lead">{t('faq.body')}</p>
            </Reveal>

            <FAQAccordion items={faqItems} />
          </section>

          <section id={sectionIds.reserve} className="section section--reserve">
            <Reveal className="reserve-block">
              <h2 className="section-title">{t('reserve.title')}</h2>
              <p className="section-lead">{t('reserve.body')}</p>

              <div className="reserve-actions">
                <a className="button button--primary" href={reservationEmailHref || reserveHref}>
                  {t('reserve.cta')}
                </a>
                <a
                  className="button button--ghost"
                  href={siteConfig.contact.whatsappHref || getLocalizedPath(locale, 'availability')}
                  target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                  rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                  onClick={(event) => {
                    if (!siteConfig.contact.whatsappHref) {
                      event.preventDefault()
                      handleSectionJump('availability')
                      return
                    }

                    handleAvailabilityWhatsAppClick()
                  }}
                >
                  {t('reserve.whatsappCta')}
                </a>
                <a
                  className="button button--ghost"
                  href={siteConfig.booking.airbnbUrl || getLocalizedPath(locale, 'availability')}
                  target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                  rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                  onClick={(event) => {
                    if (!siteConfig.booking.airbnbUrl) {
                      event.preventDefault()
                      handleSectionJump('availability')
                      return
                    }

                    handleAirbnbClick()
                  }}
                >
                  {t('reserve.airbnbCta')}
                </a>
              </div>

              <div className="reserve-contact-links">
                <a href={siteConfig.contact.emailHref || reserveHref}>{siteConfig.contact.email}</a>
                <a href={siteConfig.contact.phoneHref || reserveHref} onClick={handlePhoneClick}>
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={siteConfig.contact.whatsappHref || reserveHref}
                  target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                  rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                  onClick={handleFooterWhatsAppClick}
                >
                  WhatsApp
                </a>
                {siteConfig.booking.googleMapsUrl ? (
                  <a href={siteConfig.booking.googleMapsUrl} target="_blank" rel="noreferrer">
                    Google Maps
                  </a>
                ) : null}
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="footer">
          <div>
            <strong>Morpho Glamping</strong>
            <p>Nuevo Arenal, Costa Rica</p>
          </div>
          <p>{t('footer.copy')}</p>
        </footer>

        {consent === null ? <CookieBanner onAcceptAll={acceptCookies} onRejectCookies={rejectCookies} /> : null}
      </div>
    </SmoothScroll>
  )
}
