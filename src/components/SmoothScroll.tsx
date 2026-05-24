import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { dispatchScrollUpdate } from '../hooks/useActiveSection'

type SmoothScrollProps = PropsWithChildren

function shouldUseSmoothScroll() {
  if (typeof window === 'undefined') {
    return false
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrowViewport = window.matchMedia('(max-width: 960px)').matches

  return !coarsePointer && !narrowViewport
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || !shouldUseSmoothScroll()) {
      return
    }

    let destroyed = false
    let cleanup: (() => void) | undefined

    const run = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (destroyed) {
        return
      }

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.05,
        lerp: 0.09,
        smoothWheel: true,
        touchMultiplier: 1,
      })

      const raf = (time: number) => {
        lenis.raf(time * 1000)
      }

      const onLenisScroll = () => {
        ScrollTrigger.update()
        dispatchScrollUpdate()
      }

      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
      lenis.on('scroll', onLenisScroll)

      cleanup = () => {
        lenis.off('scroll', onLenisScroll)
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    }

    void run()

    return () => {
      destroyed = true
      cleanup?.()
    }
  }, [reduceMotion])

  return <>{children}</>
}
