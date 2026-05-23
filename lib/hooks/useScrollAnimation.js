'use client'
import { useRef, useState, useEffect, useCallback } from 'react'

export function useScrollPosition() {
  const scrollYRef = useRef(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollYRef.current = window.scrollY
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, scrollYRef }
}

export function useScrollDirection() {
  const [direction, setDirection] = useState('up')
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY
          setDirection(currentY > lastScrollY.current ? 'down' : 'up')
          lastScrollY.current = currentY
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return direction
}
