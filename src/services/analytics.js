let isInitialized = false

const measurementId = 'G-020NMW07V5'

function injectGtagSnippet() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }

  const scriptId = 'morpho-gtag-script'
  const inlineId = 'morpho-gtag-inline'

  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }

  if (!document.getElementById(inlineId)) {
    const inlineScript = document.createElement('script')
    inlineScript.id = inlineId
    inlineScript.textContent = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`
    document.head.appendChild(inlineScript)
  }
}

function hasAnalyticsConsent() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem('morpho_cookie_consent') === 'accepted'
}

export function initGA() {
  if (isInitialized) {
    return
  }

  if (!hasAnalyticsConsent()) {
    return
  }

  injectGtagSnippet()
  isInitialized = true
}

export function trackPageView(path) {
  if (!path) {
    return
  }

  initGA()

  if (!isInitialized || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(category, action, label) {
  if (!category || !action) {
    return
  }

  initGA()

  if (!isInitialized || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    ...(label ? { event_label: label } : {}),
  })
}
