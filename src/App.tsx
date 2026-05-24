import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from 'framer-motion'
import './App.css'
import { SmoothScroll } from './components/SmoothScroll'
import { Navbar } from './components/Navbar'
import { Reveal } from './components/Reveal'
import { GalleryCarousel } from './components/GalleryCarousel'
import { bookedDateKeys, galleryImages, heroHighlights, heroImage } from './data/site'
import { FAQAccordion } from './components/FAQAccordion'
import { useActiveSection } from './hooks/useActiveSection'
import { buildReservationEmailHref, siteConfig } from './config/siteConfig'

const AvailabilityCalendar = lazy(() =>
  import('./components/AvailabilityCalendar').then((module) => ({
    default: module.AvailabilityCalendar,
  })),
)

type Lang = 'es' | 'en'

const SECTION_IDS = ['home', 'stay', 'gallery', 'experience', 'availability', 'location', 'faq', 'reserve'] as const

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

function AppShell() {
  const { t, i18n } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [selectedDate, setSelectedDate] = useState<Date>(() => getFirstAvailableDate())
  const [consent, setConsent] = useState<boolean>(() => localStorage.getItem('morpho-cookie-consent') === 'accepted')
  const { activeSection, setActiveSectionImmediate } = useActiveSection(SECTION_IDS)
  const lang = (i18n.language?.startsWith('es') ? 'es' : 'en') as Lang

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'es' ? 'es-CR' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(selectedDate),
    [lang, selectedDate],
  )

  const booked = bookedDateKeys.has(dateKey(selectedDate))

  const stayPoints = t('stay.points', { returnObjects: true }) as string[]
  const stayFacts = t('stay.facts', { returnObjects: true }) as string[]
  const experienceCards = t('experience.cards', { returnObjects: true }) as Array<{ title: string; text: string }>
  const locationPoints = t('location.points', { returnObjects: true }) as string[]
  const faqItems = t('faq.items', { returnObjects: true }) as Array<{ question: string; answer: string }>
  const reservationEmailHref = buildReservationEmailHref(t('reserve.emailSubject'))
  const googleMapsEmbedUrl = buildGoogleMapsEmbedUrl(siteConfig.booking.googleMapsUrl)
  const bookingChannels = [
    { key: 'iCal', href: siteConfig.booking.airbnbIcalUrl },
    { key: 'whatsapp', href: siteConfig.contact.whatsappHref },
    { key: 'airbnb', href: siteConfig.booking.airbnbUrl },
  ] as const

  useEffect(() => {
    document.documentElement.lang = lang
    void i18n.changeLanguage(lang)
    localStorage.setItem('morpho-lang', lang)
  }, [i18n, lang])

  const handleLanguageChange = (nextLang: Lang) => {
    document.documentElement.lang = nextLang
    localStorage.setItem('morpho-lang', nextLang)
    void i18n.changeLanguage(nextLang)
  }

  const acceptCookies = () => {
    localStorage.setItem('morpho-cookie-consent', 'accepted')
    setConsent(true)
  }

  const handleNavigate = (sectionId: string) => {
    setActiveSectionImmediate(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <SmoothScroll>
      <div className="app-shell">
        <Navbar
          language={lang}
          onLanguageChange={handleLanguageChange}
          activeSection={activeSection}
          onNavigate={handleNavigate}
        />

        <main>
          <section id="home" className="hero-section">
            <div className="hero-grid">
              <Reveal className="hero-copy">
                <p className="eyebrow">{t('hero.eyebrow')}</p>
                <h1 className="hero-title">{t('hero.title')}</h1>
                <p className="hero-body">{t('hero.body')}</p>

                <div className="hero-actions">
                  <a
                    className="button button--primary"
                    href="#reserve"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigate('reserve')
                    }}
                  >
                    {t('hero.primary')}
                  </a>
                  <a
                    className="button button--ghost"
                    href="#experience"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigate('experience')
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

          <section id="stay" className="section section--stay">
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

          <section id="gallery" className="section section--gallery">
            <Reveal className="section-header section-header--compact">
              <h2 className="section-title">{t('gallery.title')}</h2>
              <p className="section-lead">{t('gallery.body')}</p>
            </Reveal>

            <GalleryCarousel images={galleryImages} />
          </section>

          <section id="experience" className="section section--experience">
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

          <section id="availability" className="section section--availability">
            <Reveal className="section-header">
              <h2 className="section-title">{t('availability.title')}</h2>
              <p className="section-lead">{t('availability.body')}</p>
            </Reveal>

            <div className="availability-layout">
              <div className="availability-panel">
                <Suspense fallback={<div className="availability-calendar__fallback">Loading calendar...</div>}>
                  <AvailabilityCalendar
                    locale={lang}
                    selectedDate={selectedDate}
                    bookedDateKeys={bookedDateKeys}
                    onSelectDate={setSelectedDate}
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

                <div className="availability-pricing">
                  <span>{t('availability.rateLabel')}</span>
                  <strong>{t('availability.rateValue')}</strong>
                  <p>{t('availability.rateHighSeason')}</p>
                  <p className="availability-pricing__note">{t('availability.rateNote')}</p>
                  <p className="availability-pricing__note">{t('availability.minStayNote')}</p>
                </div>

                <ul className="availability-channels">
                  {bookingChannels.map(({ key, href }) => (
                    <li key={key}>
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer">
                          {t(`availability.${key}`)}
                        </a>
                      ) : (
                        t(`availability.${key}`)
                      )}
                    </li>
                  ))}
                </ul>

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

          <section id="location" className="section section--location">
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

          <section id="faq" className="section section--faq">
            <Reveal className="section-header">
              <h2 className="section-title">{t('faq.title')}</h2>
              <p className="section-lead">{t('faq.body')}</p>
            </Reveal>

            <FAQAccordion items={faqItems} />
          </section>

          <section id="reserve" className="section section--reserve">
            <Reveal className="reserve-block">
              <h2 className="section-title">{t('reserve.title')}</h2>
              <p className="section-lead">{t('reserve.body')}</p>

              <div className="reserve-actions">
                <a
                  className="button button--primary"
                  href={reservationEmailHref || '#reserve'}
                >
                  {t('reserve.cta')}
                </a>
                <a
                  className="button button--ghost"
                  href={siteConfig.contact.whatsappHref || '#availability'}
                  target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                  rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
                  onClick={(e) => {
                    if (!siteConfig.contact.whatsappHref) {
                      e.preventDefault()
                      handleNavigate('availability')
                    }
                  }}
                >
                  {t('reserve.whatsappCta')}
                </a>
                <a
                  className="button button--ghost"
                  href={siteConfig.booking.airbnbUrl || '#availability'}
                  target={siteConfig.booking.airbnbUrl ? '_blank' : undefined}
                  rel={siteConfig.booking.airbnbUrl ? 'noreferrer' : undefined}
                  onClick={(e) => {
                    if (!siteConfig.booking.airbnbUrl) {
                      e.preventDefault()
                      handleNavigate('availability')
                    }
                  }}
                >
                  {t('reserve.airbnbCta')}
                </a>
              </div>

              <div className="reserve-contact-links">
                <a href={siteConfig.contact.emailHref || '#reserve'}>{siteConfig.contact.email}</a>
                <a href={siteConfig.contact.phoneHref || '#reserve'}>{siteConfig.contact.phone}</a>
                <a
                  href={siteConfig.contact.whatsappHref || '#reserve'}
                  target={siteConfig.contact.whatsappHref ? '_blank' : undefined}
                  rel={siteConfig.contact.whatsappHref ? 'noreferrer' : undefined}
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

        {!consent ? (
          <div className="cookie-bar" role="dialog" aria-live="polite" aria-label="Cookie consent banner">
            <p>{t('cookies.body')}</p>
            <button type="button" className="button button--primary" onClick={acceptCookies}>
              {t('cookies.accept')}
            </button>
          </div>
        ) : null}
      </div>
    </SmoothScroll>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
