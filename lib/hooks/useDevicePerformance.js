'use client'
import { useState, useEffect } from 'react'

const PERFORMANCE_TIERS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

function detectPerformanceTier() {
  if (typeof window === 'undefined') return PERFORMANCE_TIERS.HIGH

  let score = 0

  const memory = navigator.deviceMemory
  if (memory) {
    if (memory <= 4) score -= 2
    else if (memory <= 8) score -= 0
    else score += 1
  }

  const cores = navigator.hardwareConcurrency
  if (cores) {
    if (cores <= 4) score -= 2
    else if (cores <= 6) score -= 0
    else score += 1
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) score -= 2

  const connection = navigator.connection
  if (connection) {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') score -= 2
    else if (connection.effectiveType === '3g') score -= 1
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    score -= 3
  }

  if (score <= -3) return PERFORMANCE_TIERS.LOW
  if (score <= -1) return PERFORMANCE_TIERS.MEDIUM
  return PERFORMANCE_TIERS.HIGH
}

export default function useDevicePerformance() {
  const [tier, setTier] = useState(PERFORMANCE_TIERS.HIGH)

  useEffect(() => {
    setTier(detectPerformanceTier())
  }, [])

  return {
    tier,
    isLowPerformance: tier === PERFORMANCE_TIERS.LOW,
    isMediumPerformance: tier === PERFORMANCE_TIERS.MEDIUM,
    isHighPerformance: tier === PERFORMANCE_TIERS.HIGH,

    frameSkip: tier === PERFORMANCE_TIERS.LOW ? 4 : tier === PERFORMANCE_TIERS.MEDIUM ? 2 : 1,
    particleCount: tier === PERFORMANCE_TIERS.LOW ? 20 : tier === PERFORMANCE_TIERS.MEDIUM ? 40 : 80,
    particleLineDistance: tier === PERFORMANCE_TIERS.LOW ? 0 : tier === PERFORMANCE_TIERS.MEDIUM ? 80 : 120,
    disableBlurEffects: tier === PERFORMANCE_TIERS.LOW,
    disableParticles: tier === PERFORMANCE_TIERS.LOW,
    canvasScale: tier === PERFORMANCE_TIERS.LOW ? 0.5 : tier === PERFORMANCE_TIERS.MEDIUM ? 0.75 : 1,
    useReducedFrames: tier !== PERFORMANCE_TIERS.HIGH,
    optimizedFrameCount: tier === PERFORMANCE_TIERS.LOW ? 60 : tier === PERFORMANCE_TIERS.MEDIUM ? 90 : 120,
  }
}
