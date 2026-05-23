'use client'
import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#booking' },
]

const NavLink = memo(function NavLink({ link, index }) {
  return (
    <motion.a
      key={link.name}
      href={link.href}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="relative text-sm uppercase tracking-[0.15em] text-ssp-gray-light hover:text-ssp-accent transition-colors duration-300 group"
    >
      {link.name}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-ssp-accent transition-all duration-300 group-hover:w-full" />
    </motion.a>
  )
})

const MobileNavLink = memo(function MobileNavLink({ link, index, onClick }) {
  return (
    <motion.a
      key={link.name}
      href={link.href}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      onClick={onClick}
      className="block text-lg text-ssp-gray-light hover:text-ssp-accent transition-colors"
    >
      {link.name}
    </motion.a>
  )
})

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ssp-darker/80 border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={scrolled ? { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <motion.a
            href="#home"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-ssp-accent">SSP</span>
              <span className="text-ssp-white/80">{' '}STUDIO</span>
            </span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <NavLink key={link.name} link={link} index={i} />
            ))}
          </div>

          <button
            onClick={toggleMobile}
            className="lg:hidden text-ssp-white text-2xl p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-ssp-darker/95 border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link, i) => (
                <MobileNavLink key={link.name} link={link} index={i} onClick={closeMobile} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
