'use client'
import { useEffect, useRef, memo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { sampleFrames } from '../lib/utils'

const frames = sampleFrames(12)

const IntroFramesShowcase = memo(function IntroFramesShowcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -120])

  return (
    <section ref={ref} className="relative h-[200vh] w-full overflow-hidden bg-ssp-darker">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale: zoom, opacity, willChange: 'transform' }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            {frames.map((src, i) => {
              const xOffset = (i % 4 - 1.5) * 22
              const yOffset = Math.floor(i / 4) * 20 - 20

              return (
                <motion.div
                  key={src}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: `${28 + (i % 3) * 6}%`,
                    maxWidth: 420,
                    transform: `translate(-50%, -50%) translate(${xOffset}%, ${yOffset}%)`,
                    zIndex: i,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: {
                      duration: 2,
                      delay: i * 0.12,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-auto rounded-lg shadow-2xl shadow-ssp-accent/10"
                    style={{ filter: `brightness(${0.7 + (i % 3) * 0.15}) contrast(1.1)` }}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div style={{ y: textY, willChange: 'transform' }} className="relative z-20 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-6"
          >
            Cinematic Experience
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tight"
          >
            <span className="block">Every Frame</span>
            <span className="block text-gradient">Tells A Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="text-ssp-gray text-sm md:text-base mt-8 tracking-[0.15em] uppercase"
          >
            Scroll to explore
          </motion.p>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker/30 via-transparent to-ssp-darker pointer-events-none" />
      </div>
    </section>
  )
})

export default IntroFramesShowcase
