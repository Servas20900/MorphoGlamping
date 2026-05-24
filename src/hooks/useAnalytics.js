import { useEffect } from 'react'
import { initGA, trackEvent } from '../services/analytics.js'

const CONSENT_KEY = 'morpho_cookie_consent'

function hasAnalyticsConsent() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
}

export function useAnalytics() {
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initGA()
    }
  }, [])

  return {
    trackEvent,
  }
}
