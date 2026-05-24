import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { dispatchScrollUpdate } from './useActiveSection'

function resolveTargetId(hash) {
  if (!hash) {
    return ''
  }

  return decodeURIComponent(hash.replace(/^#/, ''))
}

export function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    const targetId = resolveTargetId(location.hash)

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      dispatchScrollUpdate()
      return undefined
    }

    let cancelled = false
    let frameId = 0

    const scrollToTarget = () => {
      if (cancelled) {
        return
      }

      const targetElement = document.getElementById(targetId)

      if (!targetElement) {
        frameId = window.requestAnimationFrame(scrollToTarget)
        return
      }

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      dispatchScrollUpdate()
    }

    frameId = window.requestAnimationFrame(scrollToTarget)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frameId)
    }
  }, [location.hash, location.pathname])
}
