import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/analytics.js'

const seenLocationKeys = new Set<string>()

export function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' && !location.hash) {
      return
    }

    if (seenLocationKeys.has(location.key)) {
      return
    }

    seenLocationKeys.add(location.key)
    trackPageView(`${location.pathname}${location.hash}`)
  }, [location.hash, location.key, location.pathname])

  return null
}
