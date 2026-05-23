'use client'
import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { HiCamera, HiFilm, HiBriefcase, HiHeart, HiPhotograph, HiLocationMarker } from 'react-icons/hi'

const services = [
  { icon: HiCamera, title: 'Photography', description: 'Editorial, portrait, and fine art photography with cinematic lighting and composition.' },
  { icon: HiFilm, title: 'Videography', description: 'Cinematic video production from concept to final cut, including color grading.' },
  { icon: HiBriefcase, title: 'Commercial Shoots', description: 'Brand campaigns, product photography, and corporate visual content.' },
  { icon: HiHeart, title: 'Wedding Shoots', description: 'Elegant wedding cinematography and photography that tells your unique love story.' },
  { icon: HiPhotograph, title: 'Product Photography', description: 'High-end product imagery for e-commerce, catalogs, and advertising.' },
  { icon: HiLocationMarker, title: 'Drone Cinematography', description: 'Aerial footage and photography with professional-grade drone equipment.' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const ServiceCard = memo(function ServiceCard({ service }) {
  const Icon = service.icon
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="group relative p-8 glass rounded-2xl glass-hover cursor-default transition-all duration-500"
    >
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-ssp-accent/10 flex items-center justify-center mb-6 group-hover:bg-ssp-accent/20 transition-colors duration-500">
          <Icon className="text-2xl text-ssp-accent" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-ssp-white group-hover:text-ssp-accent transition-colors duration-500">
          {service.title}
        </h3>
        <p className="text-ssp-gray text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ssp-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
})

const Services = memo(function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker via-ssp-dark to-ssp-darker" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
            What We Do
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            Premium{' '}
            <span className="text-gradient">Production</span> Services
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  )
})

export default Services
