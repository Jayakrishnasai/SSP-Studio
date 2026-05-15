'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { sampleFrames } from '../lib/utils'

const frames = sampleFrames(10)

export default function FloatingGallery() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yOffset = useTransform(scrollYProgress, [0, 1], [120, -120])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92])
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouse = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section ref={ref} className="relative py-32 lg:py-44 overflow-hidden bg-ssp-darker">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-dark via-ssp-darker to-ssp-dark" />

      <motion.div style={{ scale }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
            The Gallery
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            Frames in{' '}
            <span className="text-gradient">Motion</span>
          </h2>
        </motion.div>

        <div className="relative h-[60vh] md:h-[70vh] w-full">
          {frames.map((src, i) => {
            const row = Math.floor(i / 4)
            const col = i % 4
            const isLarge = i === 0 || i === 4 || i === 7
            const baseX = (col - 1.5) * 26
            const baseY = (row - 1) * 22 + 10
            const mouseX = (mouse.x - 0.5) * (isLarge ? 20 : 12)
            const mouseY = (mouse.y - 0.5) * (isLarge ? 16 : 10)

            return (
              <motion.div
                key={src}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: isLarge ? '32%' : '22%',
                  maxWidth: isLarge ? 380 : 260,
                  zIndex: isLarge ? 10 : 5 - i,
                  transform: `translate(-50%, -50%) translate(${baseX}%, ${baseY + 5}%)`,
                }}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  scale: 1.05,
                  zIndex: 20,
                  transition: { duration: 0.4 },
                }}
              >
                <motion.div
                  animate={{
                    x: mouseX + baseX * 0.1,
                    y: mouseY + baseY * 0.05,
                    rotate: (i % 3 - 1) * 2 + mouseX * 0.5,
                    rotateX: mouseY * 3 - 1.5,
                    rotateY: mouseX * 3 - 1.5,
                  }}
                  transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                  className="w-full"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-auto rounded-xl shadow-2xl shadow-black/50"
                    style={{
                      filter: `brightness(${0.75 + (i % 3) * 0.1}) contrast(1.1)`,
                    }}
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-white/5" />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-20 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...frames.slice(0, 6), ...frames.slice(0, 6)].map((src, i) => (
              <div key={`${src}-${i}`} className="flex-shrink-0 w-48 md:w-56">
                <img
                  src={src}
                  alt=""
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ filter: 'brightness(0.8) contrast(1.05)' }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
