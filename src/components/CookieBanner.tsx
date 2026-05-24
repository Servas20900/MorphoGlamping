import { useTranslation } from 'react-i18next'

type CookieBannerProps = {
  onAcceptAll: () => void
  onRejectCookies: () => void
}

export function CookieBanner({ onAcceptAll, onRejectCookies }: CookieBannerProps) {
  const { t } = useTranslation()

  return (
    <div className="cookie-bar" role="dialog" aria-live="polite" aria-label="Cookie consent banner">
      <p>{t('cookies.body')}</p>
      <div className="cookie-bar__actions">
        <button type="button" className="button button--ghost cookie-bar__button" onClick={onRejectCookies}>
          {t('cookies.necessaryOnly')}
        </button>
        <button type="button" className="button button--ghost cookie-bar__button" onClick={onRejectCookies}>
          {t('cookies.reject')}
        </button>
        <button type="button" className="button button--primary cookie-bar__button" onClick={onAcceptAll}>
          {t('cookies.acceptAll')}
        </button>
      </div>
    </div>
  )
}
