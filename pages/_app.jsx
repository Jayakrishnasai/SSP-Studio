import { useEffect } from 'react'
import Lenis from 'lenis'
import '../styles/globals.css'
import LoadingScreen from '../components/LoadingScreen'
import Navbar from '../components/Navbar'
import ScrollProgress from '../components/ScrollProgress'
import Particles from '../components/Particles'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

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
