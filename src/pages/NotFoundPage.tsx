import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getPreferredLocale } from '../config/routes'

export function NotFoundPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const locale = getPreferredLocale(i18n.language ?? (typeof window !== 'undefined' ? window.navigator.language : 'es'))

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = '404 | Morpho Glamping'
  }, [locale])

  return (
    <main className="app-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <section className="section" style={{ width: 'min(100%, 42rem)' }}>
        <p className="eyebrow">404</p>
        <h1 className="hero-title">{t('notFound.title')}</h1>
        <p className="hero-body">{t('notFound.body')}</p>
        <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
          <a
            className="button button--primary"
            href={`/${locale}`}
            onClick={(event) => {
              event.preventDefault()
              navigate(`/${locale}`)
            }}
          >
            {t('notFound.cta')}
          </a>
        </div>
      </section>
    </main>
  )
}
