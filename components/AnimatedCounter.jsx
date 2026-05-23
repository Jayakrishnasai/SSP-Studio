'use client'
import { useEffect, useRef, useState, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useAnimationFrame } from '../lib/utils'

const AnimatedCounter = memo(function AnimatedCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const startTimeRef = useRef(null)
  const startValueRef = useRef(0)

  const callback = (delta) => {
    if (!startTimeRef.current) {
      startTimeRef.current = performance.now()
      startValueRef.current = count
    }
    const elapsed = performance.now() - startTimeRef.current
    const progress = Math.min(elapsed / (duration * 1000), 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(startValueRef.current + (end - startValueRef.current) * eased)
    setCount(current)
    if (progress >= 1) {
      setCount(end)
    }
  }

  useAnimationFrame(callback, isInView)

  useEffect(() => {
    if (!isInView) {
      startTimeRef.current = null
      setCount(0)
    }
  }, [isInView, end])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient"
    >
      {count}{suffix}
    </motion.span>
  )
})

export default AnimatedCounter
