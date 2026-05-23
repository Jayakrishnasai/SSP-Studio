import { useCallback, useEffect, useRef } from 'react'

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function rafThrottle(fn) {
  let rafId = null
  return function (...args) {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      fn(...args)
      rafId = null
    })
  }
}

const TOTAL_FRAMES = 279

export const FRAME_COUNT = TOTAL_FRAMES
export const OPTIMIZED_FRAME_COUNT = 120

function pad(i) {
  return String(i).padStart(3, '0')
}

export function framePath(i) {
  return `/CamFrames/frame_${pad(i)}_delay-0.055s.png`
}

export function sampleFrames(count = 28) {
  const step = Math.max(1, Math.floor(TOTAL_FRAMES / count))
  return Array.from({ length: count }, (_, idx) => {
    const i = Math.min(idx * step, TOTAL_FRAMES - 1)
    return framePath(i)
  })
}

export function frameRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, idx) => framePath(start + idx))
}

export function getOptimizedFrameIndices(targetCount) {
  const step = Math.max(1, Math.floor(TOTAL_FRAMES / targetCount))
  return Array.from({ length: targetCount }, (_, idx) => {
    return Math.min(idx * step, TOTAL_FRAMES - 1)
  })
}

export function isLowPerformanceDevice() {
  if (typeof window === 'undefined') return false
  const memory = navigator.deviceMemory
  if (memory && memory <= 4) return true
  const cores = navigator.hardwareConcurrency
  if (cores && cores <= 4) return true
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function useIsomorphicLayoutEffect(effect, deps) {
  const isClient = typeof window !== 'undefined'
  useEffect(() => {
    if (!isClient) return
    return effect()
  }, deps)
}

export function useAnimationFrame(callback, active = true) {
  const rafRef = useRef(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) return
    let startTime = performance.now()
    function tick(timestamp) {
      callbackRef.current(timestamp - startTime)
      startTime = timestamp
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [active])
}

export function useIntersectionObserver(options = {}) {
  const ref = useRef(null)
  const isIntersectingRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting
      },
      { threshold: 0, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isIntersectingRef }
}

export const isMobile = typeof window !== 'undefined'
  ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  : false

export const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false
