'use client'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const categories = ['All', 'Photography', 'Videography', 'Commercial', 'Wedding', 'Drone']

const portfolioItems = [
  { id: 1, category: 'Photography', title: 'Urban Elegance', color: 'from-amber-900/60 to-amber-700/20', aspect: 'aspect-[3/4]', image: '/images/urban_elegance.png' },
  { id: 2, category: 'Videography', title: 'Ocean Dreams', color: 'from-blue-900/60 to-blue-700/20', aspect: 'aspect-[16/9]', image: '/images/ocean_dreams.png' },
  { id: 3, category: 'Commercial', title: 'Brand Identity', color: 'from-emerald-900/60 to-emerald-700/20', aspect: 'aspect-[4/3]', image: '/images/brand_identity.png' },
  { id: 4, category: 'Wedding', title: 'Eternal Vows', color: 'from-rose-900/60 to-rose-700/20', aspect: 'aspect-[3/4]', image: '/images/eternal_vows.png' },
  { id: 5, category: 'Drone', title: 'Aerial Perspectives', color: 'from-sky-900/60 to-sky-700/20', aspect: 'aspect-[16/9]', image: '/images/aerial_perspectives.png' },
  { id: 6, category: 'Photography', title: 'Golden Hour', color: 'from-orange-900/60 to-orange-700/20', aspect: 'aspect-[4/3]', image: '/images/golden_hour.png' },
  { id: 7, category: 'Commercial', title: 'Product Vision', color: 'from-violet-900/60 to-violet-700/20', aspect: 'aspect-[3/4]', image: '/images/product_vision.png' },
  { id: 8, category: 'Wedding', title: 'First Dance', color: 'from-pink-900/60 to-pink-700/20', aspect: 'aspect-[16/9]', image: '/images/first_dance.png' },
  { id: 9, category: 'Videography', title: 'City Nights', color: 'from-indigo-900/60 to-indigo-700/20', aspect: 'aspect-[4/3]', image: '/images/city_nights.png' },
]

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const filtered = filter === 'All'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === filter)

  return (
    <section id="portfolio" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-ssp-darker via-ssp-dark to-ssp-darker" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm mb-4">
            Our Work
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">
            Featured{' '}
            <span className="text-gradient">Portfolio</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
                filter === cat
                  ? 'bg-ssp-accent text-ssp-darker font-semibold'
                  : 'glass text-ssp-gray-light hover:text-ssp-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`${item.aspect} glass rounded-2xl overflow-hidden cursor-pointer group`}
                onClick={() => setSelected(item)}
              >
                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-ssp-darker/90 via-ssp-darker/20 to-transparent`} />
                  
                  <div className="absolute bottom-0 left-0 p-6 z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-semibold text-xl mb-1">{item.title}</h3>
                    <p className="text-ssp-accent text-sm font-medium tracking-wider uppercase">{item.category}</p>
                  </div>

                  <div className="absolute inset-0 bg-ssp-darker/0 group-hover:bg-ssp-darker/40 transition-all duration-500" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <div className="w-14 h-14 rounded-full bg-ssp-accent/90 flex items-center justify-center transform group-hover:scale-100 scale-50 transition-transform duration-500 shadow-lg">
                      <svg className="w-6 h-6 text-ssp-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[60] bg-ssp-darker/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <div className="aspect-video w-full rounded-2xl overflow-hidden relative">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ssp-darker/90 via-ssp-darker/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">{selected.title}</h3>
                  <p className="text-ssp-accent tracking-[0.2em] uppercase font-medium">{selected.category}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
