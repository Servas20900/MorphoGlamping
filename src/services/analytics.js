import ReactGA from 'react-ga4'

let isInitialized = false

function getMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? ''
}

export function initGA() {
  if (isInitialized) {
    return
  }

  const measurementId = getMeasurementId()

  if (!measurementId) {
    return
  }

  ReactGA.initialize(measurementId)
  isInitialized = true
}

export function trackPageView(path) {
  if (!isInitialized || !path) {
    return
  }

  ReactGA.send({ hitType: 'pageview', page: path })
}

export function trackEvent(category, action, label) {
  if (!isInitialized || !category || !action) {
    return
  }

  ReactGA.event({
    category,
    action,
    ...(label ? { label } : {}),
  })
}
