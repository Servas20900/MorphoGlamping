import { useCallback, useEffect, useRef, useState } from 'react'
import { siteBrand } from '../data/site'
import type { Locale, SectionKey } from '../config/routes'

type NavProps = {
  locale: Locale
  activeSection: string
  homeHref: string
  homeSectionId: string
  reserveHref: string
  homeLabel: string
  reserveLabel: string
  links: Array<{ key: SectionKey; label: string; href: string }>
  onLanguageChange: (language: Locale) => void
  onNavigate: (href: string) => void
}

const MOBILE_BREAKPOINT = 960

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 3c2.8 2.6 4.4 5.8 4.4 9s-1.6 6.4-4.4 9c-2.8-2.6-4.4-5.8-4.4-9S9.2 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.1 7.2C6.9 8.3 9.2 9 12 9s5.1-.7 6.9-1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.1 16.8C6.9 15.7 9.2 15 12 15s5.1.7 6.9 1.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar({
  locale,
  activeSection,
  homeHref,
  homeSectionId,
  reserveHref,
  homeLabel,
  reserveLabel,
  links,
  onLanguageChange,
  onNavigate,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const navigate = useCallback(
    (href: string) => {
      onNavigate(href)
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
    if (!bar) return undefined

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
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeMenu])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [closeMenu])

  const isActive = (href: string) => activeSection === href.split('#')[1]

  const isActiveById = (sectionId: string) => activeSection === sectionId

  const barLinkClass = (href: string) => {
    const active = isActive(href)
    return [
      'relative flex items-center gap-[.3rem] text-[.82rem] tracking-[.01em] px-3 py-[.45rem] rounded-full whitespace-nowrap no-underline transition-colors duration-200',
      active ? 'text-ink font-semibold bg-accent/[.08]' : 'text-muted hover:text-ink hover:bg-black/[.05]',
    ].join(' ')
  }

  const drawerLinkClassById = (sectionId: string) =>
    [
      'flex items-center min-h-[3rem] rounded-section no-underline text-[.95rem] font-medium transition-colors duration-200',
      isActiveById(sectionId)
        ? 'text-ink font-semibold bg-accent/10 border-l-[3px] border-accent pl-[calc(.85rem-3px)] pr-[.85rem]'
        : 'text-muted hover:text-ink hover:bg-black/[.04] px-[.85rem]',
    ].join(' ')

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
        <div
          ref={barRef}
          className={[
            'pointer-events-auto grid items-center mx-auto backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-[280ms] ease-linear',
            'mt-[calc(.65rem+env(safe-area-inset-top,0px))]',
            /* mobile */
            'max-[960px]:grid-cols-[auto_1fr] max-[960px]:gap-[.65rem] max-[960px]:w-[calc(100%-.75rem)] max-[960px]:px-[.55rem] max-[960px]:py-[.45rem] max-[960px]:rounded-[1.25rem]',
            /* desktop */
            'min-[961px]:grid-cols-[1fr_auto_1fr] min-[961px]:gap-4 min-[961px]:w-[min(calc(100%-1.5rem),1440px)] min-[961px]:py-[.55rem] min-[961px]:pr-[.65rem] min-[961px]:pl-[.75rem] min-[961px]:rounded-full',
            scrolled
              ? 'bg-white border border-black/[.09] shadow-[0_4px_24px_rgba(17,17,17,.07)]'
              : 'bg-white/90 border border-black/[.06] shadow-[0_2px_12px_rgba(17,17,17,.04)]',
          ].join(' ')}
        >
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="min-[961px]:hidden inline-flex flex-col items-center justify-center gap-[.3rem] w-[2.75rem] h-[2.75rem] p-0 border-0 rounded-full bg-transparent text-ink"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="navbar-drawer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="block w-[1.15rem] h-px rounded-full bg-current transition-transform duration-200" style={menuOpen ? { transform: 'translateY(5px) rotate(45deg)' } : undefined} aria-hidden="true" />
            <span className="block w-[1.15rem] h-px rounded-full bg-current transition-[opacity] duration-200" style={menuOpen ? { opacity: 0 } : undefined} aria-hidden="true" />
            <span className="block w-[1.15rem] h-px rounded-full bg-current transition-transform duration-200" style={menuOpen ? { transform: 'translateY(-5px) rotate(-45deg)' } : undefined} aria-hidden="true" />
          </button>

          {/* Brand */}
          <a
            className={[
              'inline-flex items-center gap-[.65rem] min-w-0 no-underline font-heading text-[.92rem] font-semibold tracking-[-0.03em] text-ink transition-opacity duration-200 hover:opacity-[.85]',
              'justify-self-start col-start-1 min-[961px]:col-start-1',
              'max-[960px]:justify-self-end max-[960px]:col-start-2',
            ].join(' ')}
            href={homeHref}
            aria-label={`${siteBrand.name} — volver arriba`}
            aria-current={activeSection === homeSectionId ? 'page' : undefined}
            onClick={(e) => { e.preventDefault(); navigate(homeHref) }}
          >
            <span className={[
              'flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white',
              activeSection === homeSectionId
                ? 'shadow-[0_0_0_3px_rgba(36,93,102,.18)] border border-accent/30'
                : 'border border-accent/20 shadow-[0_2px_12px_rgba(17,17,17,.08)]',
            ].join(' ')}>
              <img
                src={siteBrand.logoSrc}
                alt=""
                className="w-full h-full object-cover"
                width={40}
                height={40}
                decoding="async"
                onError={(e) => { e.currentTarget.src = siteBrand.logoFallback }}
              />
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap max-[600px]:hidden">{siteBrand.name}</span>
          </a>

          {/* Desktop nav — center */}
          <nav
            className="hidden min-[961px]:flex items-center justify-center gap-[.15rem] flex-wrap col-start-2 justify-self-center"
            aria-label="Primary navigation"
          >
            {links.map(({ key, label, href }) => {
              const active = isActive(href)
              return (
                <a
                  key={`bar-${key}`}
                  href={href}
                  className={barLinkClass(href)}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); navigate(href) }}
                >
                  {active && (
                    <span className="w-[.3rem] h-[.3rem] rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                  )}
                  {label}
                </a>
              )
            })}
          </nav>

          {/* Desktop actions — right */}
          <div className="hidden min-[961px]:flex items-center gap-[.45rem] flex-shrink-0 col-start-3 justify-self-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-[.35rem] min-h-[2.5rem] min-w-[2.5rem] px-[.7rem] rounded-full border border-black/[.07] bg-white/50 text-ink text-[.76rem] font-semibold tracking-[.06em]"
              onClick={() => onLanguageChange(locale === 'es' ? 'en' : 'es')}
              aria-label={`Switch language to ${locale === 'es' ? 'English' : 'Español'}`}
            >
              <LanguageIcon />
              <span className="sr-only">{locale.toUpperCase()}</span>
            </button>
            <a
              className={[
                'inline-flex items-center justify-center min-h-[2.5rem] px-[1.1rem] rounded-full bg-ink text-white border border-ink text-[.8rem] whitespace-nowrap no-underline transition-colors duration-[180ms]',
                isActive(reserveHref) ? 'shadow-[0_0_0_2px_rgba(36,93,102,.3)]' : '',
              ].join(' ')}
              href={reserveHref}
              aria-current={isActive(reserveHref) ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); navigate(reserveHref) }}
            >
              {reserveLabel}
            </a>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-[65] bg-[rgba(17,17,17,.35)] backdrop-blur-[4px] transition-opacity duration-[280ms]',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <aside
        id="navbar-drawer"
        className={[
          'fixed top-0 right-0 z-[70] flex flex-col bg-white border-l border-black/[.06] shadow-[-12px_0_48px_rgba(17,17,17,.1)]',
          'w-[min(18.5rem,88vw)] h-screen',
          'px-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]',
          'transition-transform duration-[320ms] ease-[cubic-bezier(.22,1,.36,1)]',
          menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none',
        ].join(' ')}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        <div className="mb-6">
          <p className="m-0 text-[.68rem] tracking-[.22em] uppercase text-muted">Morpho Glamping</p>
          <p className="m-0 mt-[.35rem] font-heading text-[1.35rem] font-semibold tracking-[-0.03em]">Menu</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto" aria-label="Mobile navigation">
          <a
            href={homeHref}
            className={drawerLinkClassById(homeSectionId)}
            onClick={(e) => { e.preventDefault(); navigate(homeHref) }}
          >
            {homeLabel}
          </a>
          {links.map(({ key, label, href }) => {
            const sectionId = href.split('#')[1] ?? ''
            return (
              <a
                key={`drawer-${key}`}
                href={href}
                className={drawerLinkClassById(sectionId)}
                aria-current={isActiveById(sectionId) ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); navigate(href) }}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="grid gap-[.65rem] mt-5 pt-5 border-t border-black/[.07]">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-[.35rem] min-h-[3rem] rounded-full border border-black/[.07] bg-white/50 text-ink text-[.76rem] font-semibold tracking-[.06em]"
            onClick={() => onLanguageChange(locale === 'es' ? 'en' : 'es')}
            aria-label={`Switch language to ${locale === 'es' ? 'English' : 'Español'}`}
          >
            <LanguageIcon />
            <span className="sr-only">{locale.toUpperCase()}</span>
          </button>
          <a
            className="w-full inline-flex items-center justify-center min-h-[3rem] rounded-full bg-ink text-white border border-ink text-[.8rem] no-underline"
            href={reserveHref}
            onClick={(e) => { e.preventDefault(); navigate(reserveHref) }}
          >
            {reserveLabel}
          </a>
        </div>
      </aside>
    </>
  )
}
