import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { siteBrand } from '../data/site'

type NavProps = {
  language: 'es' | 'en'
  onLanguageChange: (language: 'es' | 'en') => void
  activeSection: string
  onNavigate: (sectionId: string) => void
}

const NAV_LINKS = [
  ['stay', 'stay'],
  ['gallery', 'gallery'],
  ['experience', 'experience'],
  ['availability', 'availability'],
  ['location', 'location'],
  ['faq', 'faq'],
] as const

const MOBILE_BREAKPOINT = 960

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 3c2.8 2.6 4.4 5.8 4.4 9s-1.6 6.4-4.4 9c-2.8-2.6-4.4-5.8-4.4-9S9.2 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.1 7.2C6.9 8.3 9.2 9 12 9s5.1-.7 6.9-1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.1 16.8C6.9 15.7 9.2 15 12 15s5.1.7 6.9 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar({ language, onLanguageChange, activeSection, onNavigate }: NavProps) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const navigate = useCallback(
    (sectionId: string) => {
      onNavigate(sectionId)
      closeMenu()
    },
    [closeMenu, onNavigate],
  )

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const bar = barRef.current
    if (!bar) {
      return undefined
    }

    const syncNavHeight = () => {
      const styles = window.getComputedStyle(bar)
      const marginTop = Number.parseFloat(styles.marginTop) || 0
      document.documentElement.style.setProperty('--nav-height', `${bar.offsetHeight + marginTop + 12}px`)
    }

    syncNavHeight()
    const observer = new ResizeObserver(syncNavHeight)
    observer.observe(bar)
    window.addEventListener('resize', syncNavHeight, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncNavHeight)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeMenu])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu()
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [closeMenu])

  const renderLink = (key: string, sectionId: string, variant: 'bar' | 'drawer' = 'bar') => (
    <a
      key={`${variant}-${key}`}
      href={`#${sectionId}`}
      className={`navbar__link navbar__link--${variant} ${activeSection === sectionId ? 'navbar__link--active' : ''}`}
      aria-current={activeSection === sectionId ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault()
        navigate(sectionId)
      }}
    >
      {t(`nav.${key}`)}
    </a>
  )

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--solid' : ''}`}>
        <div ref={barRef} className="navbar__bar">
          <button
            type="button"
            className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="navbar-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <a
            className={`navbar__brand ${activeSection === 'home' ? 'navbar__brand--active' : ''}`}
            href="#home"
            aria-label={`${siteBrand.name} — volver arriba`}
            aria-current={activeSection === 'home' ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
            }}
          >
            <span className="navbar__logo-wrap">
              <img
                src={siteBrand.logoSrc}
                alt=""
                className="navbar__logo"
                width={40}
                height={40}
                decoding="async"
                onError={(event) => {
                  event.currentTarget.src = siteBrand.logoFallback
                }}
              />
            </span>
            <span className="navbar__brand-text">{siteBrand.name}</span>
          </a>

          <nav className="navbar__nav navbar__nav--desktop" aria-label="Primary navigation">
            {NAV_LINKS.map(([key, sectionId]) => renderLink(key, sectionId, 'bar'))}
          </nav>

          <div className="navbar__actions navbar__actions--desktop">
            <button
              type="button"
              className="navbar__language"
              onClick={() => onLanguageChange(language === 'es' ? 'en' : 'es')}
              aria-label={`Switch language to ${language === 'es' ? 'English' : 'Español'}`}
            >
              <LanguageIcon />
              <span className="visually-hidden">{t(`language.${language}`)}</span>
            </button>
            <a
              className={`button button--primary navbar__cta ${activeSection === 'reserve' ? 'navbar__cta--active' : ''}`}
              href="#reserve"
              aria-current={activeSection === 'reserve' ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault()
                navigate('reserve')
              }}
            >
              {t('nav.reserveCta')}
            </a>
          </div>
        </div>
      </header>

      <div
        className={`navbar__overlay ${menuOpen ? 'navbar__overlay--visible' : ''}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />

      <aside
        id="navbar-drawer"
        className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <div className="navbar__drawer-head">
          <p className="navbar__drawer-eyebrow">Morpho Glamping</p>
          <p className="navbar__drawer-title">{t('nav.menuTitle')}</p>
        </div>

        <nav className="navbar__nav navbar__nav--drawer" aria-label="Mobile navigation">
          <a
            href="#home"
            className={`navbar__link navbar__link--drawer ${activeSection === 'home' ? 'navbar__link--active' : ''}`}
            onClick={(event) => {
              event.preventDefault()
              navigate('home')
            }}
          >
            {t('nav.home')}
          </a>
          {NAV_LINKS.map(([key, sectionId]) => renderLink(key, sectionId, 'drawer'))}
        </nav>

        <div className="navbar__drawer-foot">
          <button
            type="button"
            className="navbar__language navbar__language--drawer"
            onClick={() => onLanguageChange(language === 'es' ? 'en' : 'es')}
            aria-label={`Switch language to ${language === 'es' ? 'English' : 'Español'}`}
          >
            <LanguageIcon />
            <span className="visually-hidden">{t(`language.${language}`)}</span>
          </button>
          <a
            className="button button--primary navbar__cta navbar__cta--drawer"
            href="#reserve"
            onClick={(event) => {
              event.preventDefault()
              navigate('reserve')
            }}
          >
            {t('nav.reserveCta')}
          </a>
        </div>
      </aside>
    </>
  )
}
