import CamFramesSequence from '../components/CamFramesSequence'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import Testimonials from '../components/Testimonials'
import Booking from '../components/Booking'

export default function Home() {
  return (
    <>
      <CamFramesSequence />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <Booking />
    </>
  )
}
