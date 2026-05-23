'use client'
import { useRef, memo } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { sampleFrames } from '../lib/utils'

const frames = sampleFrames(8)

const steps = [
  { label: 'Concept', desc: 'Every great frame begins with a vision. We craft narratives that resonate.' },
  { label: 'Capture', desc: 'Precision meets artistry. Each shot is meticulously composed and lit.' },
  { label: 'Process', desc: 'Raw footage transforms through expert color grading and post-production.' },
  { label: 'Deliver', desc: 'The final cut — a cinematic masterpiece ready for the world to see.' },
]

const TimelineFrame = memo(function TimelineFrame({ src, index, total, progress }) {
  const inputRange = [
    Math.max(0, (index - 0.5) / total),
    index / total,
    Math.min(1, (index + 0.5) / total),
  ]
  const isCenter = index >= 2 && index <= 5

  const opacity = useTransform(progress, inputRange, [0, 1, 0])
  const scale = useTransform(progress, inputRange, [0.85, 1, 0.85])
  const x = useTransform(progress, inputRange, isCenter ? [60, 0, -60] : [-60, 0, 60])
  const rotateY = useTransform(progress, inputRange, [15, 0, -15])

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale, x, rotateY }}>
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-ssp-accent/20"
        style={{ filter: 'brightness(0.85) contrast(1.1)' }}
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    </motion.div>
  )
})

const TimelineStep = memo(function TimelineStep({ label, desc, index, total, progress }) {
  const inputRange = [
    Math.max(0, (index - 0.25) / total),
    Math.min(1, (index + 0.25) / total),
  ]
  const opacity = useTransform(progress, inputRange, [0.2, 1])
  const x = useTransform(progress, inputRange, [30, 0])

  return (
    <motion.div className="relative pl-8 border-l border-white/10" style={{ opacity, x }}>
      <div className="absolute left-0 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-ssp-accent shadow-lg shadow-ssp-accent/50" />
      <p className="text-ssp-accent text-sm tracking-[0.2em] uppercase mb-2">0{index + 1}</p>
      <h3 className="text-xl md:text-2xl font-bold text-ssp-white mb-2">{label}</h3>
      <p className="text-ssp-gray leading-relaxed">{desc}</p>
    </motion.div>
  )
})

const CameraTimeline = memo(function CameraTimeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001,
  })

  const glowIntensity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <section ref={ref} className="relative h-[500vh] w-full bg-ssp-darker">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: glowIntensity }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmax] h-[60vmax] rounded-full bg-ssp-accent/5 blur-[120px]" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[4/3] w-full max-w-lg mx-auto lg:mx-0">
            {frames.map((src, i) => (
              <TimelineFrame
                key={src}
                src={src}
                index={i}
                total={frames.length}
                progress={smoothProgress}
              />
            ))}
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <TimelineStep
                key={step.label}
                label={step.label}
                desc={step.desc}
                index={i}
                total={steps.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default CameraTimeline
