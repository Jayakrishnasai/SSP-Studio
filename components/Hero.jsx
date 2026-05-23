'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Hero() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6
    }
  }, [])

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="w-full h-full object-cover scale-110"
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=4c0c5b3b5e7b5d6c3b3b3d6e7b5d6c3b3b3d6e7b&profile_id=164"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-r from-ssp-darker/80 via-ssp-darker/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ssp-darker via-ssp-darker/20 to-transparent" />
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-ssp-accent/5 via-transparent to-transparent opacity-60" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-6"
            >
              Premium Creative Studio
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tight"
            >
              <span className="block">Capturing</span>
              <span className="block text-gradient">Stories</span>
              <span className="block text-ssp-white/80 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 font-light">
                Through Precision & Creativity
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-ssp-gray text-base md:text-lg max-w-xl mt-8 leading-relaxed"
            >
              We craft visual narratives that transcend the ordinary — blending
              technical mastery with artistic vision to create cinematic
              masterpieces.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 mt-10"
            >
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 bg-ssp-accent text-ssp-darker font-semibold rounded-full overflow-hidden"
              >
                <span className="relative z-10">View Portfolio</span>
                <div className="absolute inset-0 bg-ssp-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              <motion.a
                href="#booking"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-4 border border-ssp-white/20 text-ssp-white font-semibold rounded-full overflow-hidden"
              >
                <span className="relative z-10">Book a Shoot</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 w-[350px] xl:w-[450px]"
          >
            <img 
              src="/images/Image-1.png" 
              alt="Creative Showcase" 
              className="w-full h-auto rounded-2xl shadow-2xl shadow-black border border-ssp-white/10"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-ssp-gray text-xs tracking-[0.2em] uppercase"
          >
            <span>Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-ssp-accent">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <motion.circle
                cx="8" cy="8" r="2"
                fill="currentColor"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
