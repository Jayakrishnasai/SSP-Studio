'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sampleFrames } from '../lib/utils'

const frames = sampleFrames(5)

const phases = [
  {
    title: 'The Art of Light',
    desc: 'Every frame is sculpted with precision — where natural light meets cinematic mastery.',
  },
  {
    title: 'Motion & Emotion',
    desc: 'We capture not just movement, but the feeling behind every gesture and glance.',
  },
  {
    title: 'Color & Mood',
    desc: 'Rich palettes and tonal contrast combine to create visual poetry in every frame.',
  },
]

function ExperienceFrame({ src, index, total, progress, blur }) {
  const inputRange = [
    Math.max(0, (index - 0.6) / total),
    index / total,
    Math.min(1, (index + 0.6) / total),
  ]
  const opacity = useTransform(progress, inputRange, [0, 1, 0])
  const scale = useTransform(progress, inputRange, [1.1, 1, 1.1])

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.5) contrast(1.15)' }}
      />
    </motion.div>
  )
}

function ExperiencePhase({ title, desc, index, total, progress }) {
  const inputRange = [
    Math.max(0, (index + 0.5) / total - 0.2),
    Math.min(1, (index + 0.5) / total + 0.2),
  ]
  const opacity = useTransform(progress, inputRange, [0, 1])
  const x = useTransform(progress, inputRange, [40, 0])

  return (
    <motion.div className="relative pl-8 border-l border-white/10" style={{ opacity, x }}>
      <div className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-ssp-accent shadow-lg shadow-ssp-accent/50" />
      <p className="text-ssp-accent text-sm tracking-[0.15em] mb-2">
        ˚ {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-ssp-white mb-2">{title}</h3>
      <p className="text-ssp-gray leading-relaxed">{desc}</p>
    </motion.div>
  )
}

export default function StudioExperience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.001,
  })

  const blurAmount = useTransform(smoothProgress, [0, 0.3, 0.5, 0.7, 1], [0, 4, 0, 4, 0])

  return (
    <section ref={ref} className="relative h-[400vh] w-full bg-ssp-darker">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ filter: useTransform(blurAmount, (v) => `blur(${v}px)`) }}
        >
          {frames.map((src, i) => (
            <ExperienceFrame
              key={src}
              src={src}
              index={i}
              total={frames.length}
              progress={smoothProgress}
              blur={blurAmount}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ssp-darker/60 via-transparent to-ssp-darker/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ssp-darker via-transparent to-ssp-darker/40" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              style={{
                opacity: useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
                x: useTransform(smoothProgress, [0, 0.15], [40, 0]),
              }}
            >
              <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
                Studio Experience
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Where Vision Becomes{' '}
                <span className="text-gradient">Reality</span>
              </h2>
              <p className="text-ssp-gray leading-relaxed text-lg">
                Step into our world. Every frame is a testament to our
                relentless pursuit of perfection.
              </p>
            </motion.div>

            <div className="space-y-16">
              {phases.map((phase, i) => (
                <ExperiencePhase
                  key={phase.title}
                  title={phase.title}
                  desc={phase.desc}
                  index={i}
                  total={phases.length}
                  progress={smoothProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
