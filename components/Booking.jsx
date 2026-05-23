'use client'
import { useState, useRef, useCallback, memo } from 'react'
import { motion, useInView } from 'framer-motion'

const shootTypes = ['Photography', 'Videography', 'Commercial', 'Wedding', 'Product', 'Drone', 'Other']

const InputField = memo(function InputField({ label, name, type, value, placeholder, onChange, isInView, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <label className="block text-sm text-ssp-gray-light mb-2 tracking-[0.1em] uppercase">{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ssp-white focus:outline-none focus:border-ssp-accent/50 focus:bg-white/10 transition-all duration-300"
        >
          <option value="" disabled className="bg-ssp-darker">Select type</option>
          {shootTypes.map((t) => (
            <option key={t} value={t} className="bg-ssp-darker">{t}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required
          rows={4}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ssp-white placeholder-ssp-gray/50 focus:outline-none focus:border-ssp-accent/50 focus:bg-white/10 transition-all duration-300 resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ssp-white placeholder-ssp-gray/50 focus:outline-none focus:border-ssp-accent/50 focus:bg-white/10 transition-all duration-300"
        />
      )}
    </motion.div>
  )
})

const Booking = memo(function Booking() {
  const [formData, setFormData] = useState({
    name: '', email: '', shootType: '', date: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', shootType: '', date: '', message: '' })
    }, 3000)
  }, [])

  return (
    <section id="booking" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker via-ssp-dark to-ssp-darker" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">Get in Touch</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            Book Your <span className="text-gradient">Shoot</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-12 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <InputField label="Name" name="name" type="text" value={formData.name} placeholder="Your name" onChange={handleChange} isInView={isInView} delay={0.3} />
              <InputField label="Email" name="email" type="email" value={formData.email} placeholder="your@email.com" onChange={handleChange} isInView={isInView} delay={0.4} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <InputField label="Shoot Type" name="shootType" type="select" value={formData.shootType} onChange={handleChange} isInView={isInView} delay={0.5} />
              <InputField label="Preferred Date" name="date" type="date" value={formData.date} onChange={handleChange} isInView={isInView} delay={0.6} />
            </div>
            <InputField label="Message" name="message" type="textarea" value={formData.message} placeholder="Tell us about your project..." onChange={handleChange} isInView={isInView} delay={0.7} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-ssp-accent text-ssp-darker font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-ssp-accent-light"
              >
                {submitted ? 'Message Sent!' : 'Send Message'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  )
})

export default Booking
