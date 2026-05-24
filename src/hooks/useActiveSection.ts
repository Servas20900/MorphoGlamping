import { useCallback, useEffect, useRef, useState } from 'react'

const SCROLL_EVENT = 'morpho-scroll'

export function dispatchScrollUpdate() {
  window.dispatchEvent(new Event(SCROLL_EVENT))
}

function getNavOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim()
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 80
}

function resolveActiveSection(sectionIds: readonly string[]) {
  const navOffset = getNavOffset()
  const probe = navOffset + 32
  const scrollBottom = window.scrollY + window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  const reserveId = sectionIds[sectionIds.length - 1]

  if (reserveId) {
    const reserveEl = document.getElementById(reserveId)
    if (reserveEl) {
      const rect = reserveEl.getBoundingClientRect()
      if (rect.top <= probe + 24) {
        return reserveId
      }
    }
  }

  if (scrollBottom >= docHeight - 64) {
    return reserveId ?? 'home'
  }

  let current = sectionIds[0] ?? 'home'

  for (const id of sectionIds) {
    const element = document.getElementById(id)
    if (!element) {
      continue
    }

    if (element.getBoundingClientRect().top <= probe) {
      current = id
    }
  }

  return current
}

export function useActiveSection(sectionIds: readonly string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'home')
  const ticking = useRef(false)
  const manualLock = useRef<string | null>(null)
  const manualTimer = useRef<number | null>(null)

  const update = useCallback(() => {
    if (manualLock.current) {
      setActiveSection(manualLock.current)
      return
    }

    setActiveSection(resolveActiveSection(sectionIds))
  }, [sectionIds])

  const setActiveSectionImmediate = useCallback(
    (sectionId: string) => {
      if (manualTimer.current !== null) {
        window.clearTimeout(manualTimer.current)
      }

      manualLock.current = sectionId
      setActiveSection(sectionId)

      manualTimer.current = window.setTimeout(() => {
        manualLock.current = null
        manualTimer.current = null
        setActiveSection(resolveActiveSection(sectionIds))
      }, 700)
    },
    [sectionIds],
  )

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) {
        return
      }

      ticking.current = true
      requestAnimationFrame(() => {
        update()
        ticking.current = false
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener(SCROLL_EVENT, onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener(SCROLL_EVENT, onScroll)

      if (manualTimer.current !== null) {
        window.clearTimeout(manualTimer.current)
      }
    }
  }, [update])

  return { activeSection, setActiveSectionImmediate }
}
