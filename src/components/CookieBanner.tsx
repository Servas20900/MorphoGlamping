import { useTranslation } from 'react-i18next'

type CookieBannerProps = {
  onAcceptAll: () => void
  onRejectCookies: () => void
}

const btnBase = 'inline-flex items-center justify-center min-h-[2.5rem] px-4 rounded-full text-[.88rem] tracking-[.03em] whitespace-nowrap transition-colors duration-[180ms] cursor-pointer border'

export function CookieBanner({ onAcceptAll, onRejectCookies }: CookieBannerProps) {
  const { t } = useTranslation()

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
      className="fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 w-[min(100%,42rem)] px-4 py-[.9rem] rounded-[1.25rem] border border-black/[.07] bg-white/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(17,17,17,.08)] max-sm:flex-col max-sm:items-stretch max-sm:w-[calc(100%-1rem)] bottom-4 max-sm:bottom-3"
    >
      <p className="m-0 text-[.85rem] text-muted leading-[1.5]">{t('cookies.body')}</p>
      <div className="ml-auto flex flex-wrap gap-2 max-sm:ml-0">
        <button
          type="button"
          className={`${btnBase} border-black/[.07] bg-white/65 text-ink`}
          onClick={onRejectCookies}
        >
          {t('cookies.necessaryOnly')}
        </button>
        <button
          type="button"
          className={`${btnBase} border-black/[.07] bg-white/65 text-ink`}
          onClick={onRejectCookies}
        >
          {t('cookies.reject')}
        </button>
        <button
          type="button"
          className={`${btnBase} border-ink bg-ink text-white`}
          onClick={onAcceptAll}
        >
          {t('cookies.acceptAll')}
        </button>
      </div>
    </div>
  )
}
