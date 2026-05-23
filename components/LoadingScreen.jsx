'use client'
import { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MIN_DISPLAY_MS = 800
const MAX_DISPLAY_MS = 4000

const LoadingScreen = memo(function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const readyRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let minPassed = false

    const minTimer = setTimeout(() => {
      minPassed = true
      if (readyRef.current) setIsLoading(false)
    }, MIN_DISPLAY_MS)

    const maxTimer = setTimeout(() => {
      setIsLoading(false)
    }, MAX_DISPLAY_MS)

    const handleReady = () => {
      readyRef.current = true
      if (minPassed) setIsLoading(false)
    }

    window.addEventListener('ssp:framesReady', handleReady)

    timerRef.current = { minTimer, maxTimer }

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
      window.removeEventListener('ssp:framesReady', handleReady)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-ssp-darker flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="text-5xl md:text-7xl font-bold tracking-tight block">
                <span className="text-ssp-accent">SSP</span>
                <span className="text-white/80">{' '}STUDIO</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="h-0.5 bg-gradient-to-r from-transparent via-ssp-accent to-transparent mx-auto"
              style={{ maxWidth: 200 }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-ssp-gray text-sm tracking-[0.2em] uppercase mt-6"
            >
              Cinematic Productions
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export default LoadingScreen
