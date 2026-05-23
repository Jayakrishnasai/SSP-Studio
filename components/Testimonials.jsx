'use client'
import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Creative Director, Lumina Agency',
    content: 'SSP Studio transformed our brand identity through their incredible visual storytelling. Every frame was meticulously crafted with artistic precision.',
    avatar: 'SM',
    color: 'from-amber-500/20 to-amber-600/10',
  },
  {
    name: 'James Rodriguez',
    role: 'CEO, Horizon Productions',
    content: 'The level of professionalism and creativity at SSP is unmatched. Our commercial shoot exceeded all expectations. Truly world-class talent.',
    avatar: 'JR',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    name: 'Emily Chen',
    role: 'Founder, Vivid Media',
    content: 'Working with SSP was an absolute pleasure. They captured the essence of our brand with such elegance and cinematic flair. Highly recommended.',
    avatar: 'EC',
    color: 'from-rose-500/20 to-rose-600/10',
  },
  {
    name: 'Marcus Thompson',
    role: 'Event Director, Prestige Events',
    content: 'Our wedding footage was nothing short of magical. SSP Studio delivered a cinematic masterpiece that we will treasure forever.',
    avatar: 'MT',
    color: 'from-emerald-500/20 to-emerald-600/10',
  },
  {
    name: 'Aria Patel',
    role: 'Marketing Head, Zenith Brands',
    content: 'From concept to delivery, SSP Studio demonstrated extraordinary attention to detail. Their drone cinematography added a whole new dimension to our campaign.',
    avatar: 'AP',
    color: 'from-violet-500/20 to-violet-600/10',
  },
]

function TestimonialCard({ testimonial, direction }) {
  return (
    <motion.div
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-3xl p-8 md:p-12 text-center"
    >
      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}>
        <span className="text-lg font-bold text-ssp-white">
          {testimonial.avatar}
        </span>
      </div>

      <p className="text-lg md:text-xl text-ssp-gray-light leading-relaxed mb-8 italic">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div>
        <p className="text-ssp-white font-semibold">
          {testimonial.name}
        </p>
        <p className="text-ssp-gray text-sm mt-1">
          {testimonial.role}
        </p>
      </div>
    </motion.div>
  )
}

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const timerRef = useRef(null)
  const intervalRef = useRef(5000)
  const currentRef = useRef(0)

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    if (!isInView) return

    let startTime = performance.now()
    let rafId

    function tick(timestamp) {
      const elapsed = timestamp - startTime
      if (elapsed >= intervalRef.current) {
        setDirection(1)
        setCurrent((prev) => (prev + 1) % testimonials.length)
        startTime = timestamp
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isInView])

  const goTo = useCallback((index) => {
    setDirection(index > currentRef.current ? 1 : -1)
    setCurrent(index)
    currentRef.current = index
  }, [])

  return (
    <section id="testimonials" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker via-ssp-dark to-ssp-darker" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            What Our{' '}
            <span className="text-gradient">Clients</span> Say
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <TestimonialCard
                key={current}
                testimonial={testimonials[current]}
                direction={direction}
              />
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === current
                    ? 'w-8 bg-ssp-accent'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
