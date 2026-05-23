import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import '../styles/globals.css'
import Navbar from '../components/Navbar'

const LoadingScreen = dynamic(() => import('../components/LoadingScreen'), { ssr: false })
const ScrollProgress = dynamic(() => import('../components/ScrollProgress'), { ssr: false })
const Particles = dynamic(() => import('../components/Particles'), {
  ssr: false,
  loading: () => null,
})

export default function App({ Component, pageProps }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <>
      <LoadingScreen />
      <div className="noise-overlay" />
      <Particles />
      <ScrollProgress />
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}
