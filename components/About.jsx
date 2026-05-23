'use client'
import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'

const stats = [
  { label: 'Projects Completed', end: 500, suffix: '+' },
  { label: 'Happy Clients', end: 200, suffix: '+' },
  { label: 'Years Experience', end: 12, suffix: '' },
]

const About = memo(function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 lg:py-44 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker via-ssp-dark to-ssp-darker" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
            About Us
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            Crafting Visual{' '}
            <span className="text-gradient">Excellence</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src="/images/about_image.png"
                  alt="SSP Studio Setup"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ssp-darker/80 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 glass rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <span className="text-3xl font-bold text-gradient">12+</span>
                  <p className="text-xs text-ssp-gray mt-1">Years</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-ssp-accent tracking-[0.2em] uppercase text-sm mb-4">
              Our Story
            </p>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
              Where Technical Precision Meets{' '}
              <span className="text-gradient">Artistic Vision</span>
            </h3>

            <p className="text-ssp-gray leading-relaxed mb-6">
              At SSP Studio, we believe every frame tells a story. Founded by a
              team of passionate filmmakers and photographers, we have spent over a
              decade perfecting the art of visual storytelling — from intimate
              portraits to large-scale commercial productions.
            </p>

            <p className="text-ssp-gray leading-relaxed mb-10">
              Our mission is simple: to capture moments that move people. We blend
              cutting-edge technology with timeless aesthetic principles, ensuring
              every project we touch becomes a cinematic masterpiece.
            </p>

            <motion.a
              href="#portfolio"
              whileHover={{ x: 10 }}
              className="inline-flex items-center gap-2 text-ssp-accent hover:text-ssp-accent-light transition-colors group"
            >
              <span className="text-sm uppercase tracking-[0.15em]">Explore Our Work</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-8 mt-24"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              <p className="text-ssp-gray text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
})

export default About
