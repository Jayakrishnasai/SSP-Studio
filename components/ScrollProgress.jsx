'use client'
import { memo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ssp-accent via-ssp-gold to-ssp-accent origin-left z-[60]"
      style={{ scaleX, willChange: 'transform' }}
    />
  )
})

export default ScrollProgress
